import { getDatabase, ensureAppUser } from './database';

const TMDB_BASE_URL = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3';

function normalizeTmdbItem(item) {
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  if (!Number.isInteger(item.id) || !['movie', 'tv'].includes(mediaType)) return null;
  const date = mediaType === 'movie' ? item.release_date : item.first_air_date;
  return {
    id: item.id,
    mediaType,
    title: item.title || item.name || 'Untitled',
    year: typeof date === 'string' ? date.slice(0, 4) : '',
    overview: typeof item.overview === 'string' ? item.overview : '',
    voteAverage: Number.isFinite(item.vote_average) ? Math.round(item.vote_average * 10) / 10 : null,
    posterPath: typeof item.poster_path === 'string' ? item.poster_path : null,
    backdropPath: typeof item.backdrop_path === 'string' ? item.backdrop_path : null,
  };
}

async function fetchTmdb(path, parameters = {}) {
  if (!process.env.TMDB_API_KEY) return null;
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  url.searchParams.set('language', 'en-US');
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  const response = await fetch(url, { next: { revalidate: path.startsWith('/search') ? 0 : 3600 } });
  if (!response.ok) throw new Error(`TMDB request failed (${response.status}).`);
  return response.json();
}

export async function getTvsyncDiscovery() {
  try {
    const payload = await fetchTmdb('/trending/all/week');
    const items = payload?.results?.map(normalizeTmdbItem).filter(Boolean).slice(0, 18);
    return items?.length ? items : [];
  } catch {
    return [];
  }
}

export async function searchTvsyncDiscovery(query) {
  const cleanQuery = String(query || '').trim().slice(0, 80);
  if (cleanQuery.length < 2) return [];
  try {
    const payload = await fetchTmdb('/search/multi', { query: cleanQuery, include_adult: 'false', page: '1' });
    if (!payload) return [];
    return payload.results?.map(normalizeTmdbItem).filter(Boolean).slice(0, 20) || [];
  } catch {
    return [];
  }
}

export async function getTvsyncMediaDetails(mediaType, id) {
  const safeType = mediaType === 'tv' ? 'tv' : 'movie';
  const safeId = Number(id);
  if (!Number.isInteger(safeId) || safeId <= 0) return null;
  try {
    const payload = await fetchTmdb(`/${safeType}/${safeId}`, { append_to_response: 'credits,videos' });
    if (payload) {
      const normalized = normalizeTmdbItem({ ...payload, media_type: safeType });
      if (!normalized) return null;
      const trailer = payload.videos?.results?.find((video) => video.site === 'YouTube' && video.type === 'Trailer');
      return {
        ...normalized,
        genres: Array.isArray(payload.genres) ? payload.genres.map((genre) => genre.name).filter(Boolean) : [],
        runtime: safeType === 'movie' ? payload.runtime : payload.episode_run_time?.[0] || null,
        status: payload.status || '',
        tagline: payload.tagline || '',
        trailerUrl: trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        cast: Array.isArray(payload.credits?.cast) ? payload.credits.cast.slice(0, 8).map((person) => ({ id: person.id, name: person.name, character: person.character || '', profilePath: person.profile_path || null })) : [],
        crew: Array.isArray(payload.credits?.crew) ? payload.credits.crew.filter((person) => person.job === 'Director').slice(0, 4).map((person) => ({ id: person.id, name: person.name, job: person.job })) : [],
        seasons: safeType === 'tv' && Array.isArray(payload.seasons) ? payload.seasons.filter((season) => season.season_number > 0).map((season) => ({ id: season.id, number: season.season_number, name: season.name, episodeCount: season.episode_count, airDate: season.air_date || '', posterPath: season.poster_path || null })) : [],
      };
    }
  } catch {
    // The caller renders a not-found state when the catalogue is unavailable.
  }
  return null;
}

export async function getTvsyncSeason(showId, seasonNumber) {
  const safeShowId = Number(showId);
  const safeSeason = Number(seasonNumber);
  if (!Number.isInteger(safeShowId) || safeShowId <= 0 || !Number.isInteger(safeSeason) || safeSeason < 0) return null;
  try {
    const payload = await fetchTmdb(`/tv/${safeShowId}/season/${safeSeason}`);
    if (!payload) return null;
    return {
      id: payload.id,
      name: payload.name || `Season ${safeSeason}`,
      overview: payload.overview || '',
      airDate: payload.air_date || '',
      posterPath: payload.poster_path || null,
      seasonNumber: safeSeason,
      episodes: Array.isArray(payload.episodes) ? payload.episodes.map((episode) => ({ id: episode.id, number: episode.episode_number, name: episode.name || `Episode ${episode.episode_number}`, overview: episode.overview || '', airDate: episode.air_date || '', stillPath: episode.still_path || null })) : [],
    };
  } catch {
    return null;
  }
}

export async function getTvsyncLibrary(user) {
  const appUser = await ensureAppUser(user);
  const sql = getDatabase();
  const rows = await sql`
    select tmdb_id, media_type, title, poster_path, backdrop_path, release_year,
      overview, vote_average, watch_status, favorite, date_added
    from tvsync_library
    where user_id = ${appUser.user_id}
    order by date_added desc
  `;
  return rows.map((row) => ({
    id: row.tmdb_id,
    mediaType: row.media_type,
    title: row.title,
    posterPath: row.poster_path,
    backdropPath: row.backdrop_path,
    year: row.release_year,
    overview: row.overview,
    voteAverage: row.vote_average === null ? null : Number(row.vote_average),
    watchStatus: row.watch_status,
    favorite: row.favorite,
    dateAdded: row.date_added.toISOString(),
  }));
}

export async function getTvsyncMediaState(user, tmdbId, mediaType) {
  const appUser = await ensureAppUser(user);
  const sql = getDatabase();
  const [libraryRows, ratingRows, progressRows] = await Promise.all([
    sql`select watch_status, favorite from tvsync_library where user_id = ${appUser.user_id} and tmdb_id = ${tmdbId} and media_type = ${mediaType}`,
    sql`select rating, review from tvsync_ratings where user_id = ${appUser.user_id} and tmdb_id = ${tmdbId} and media_type = ${mediaType}`,
    mediaType === 'tv' ? sql`select season_number, episode_number, watched from tvsync_episode_progress where user_id = ${appUser.user_id} and tmdb_show_id = ${tmdbId} and watched = true` : Promise.resolve([]),
  ]);
  return {
    library: libraryRows[0] ? { watchStatus: libraryRows[0].watch_status, favorite: libraryRows[0].favorite } : null,
    rating: ratingRows[0] ? { rating: Number(ratingRows[0].rating), review: ratingRows[0].review } : null,
    watchedEpisodes: progressRows.map((row) => `${row.season_number}:${row.episode_number}`),
  };
}

export function validateMedia(input) {
  const mediaType = input?.mediaType;
  const id = Number(input?.id);
  if (!Number.isInteger(id) || id <= 0 || !['movie', 'tv'].includes(mediaType)) throw new Error('Invalid media item.');
  return {
    id,
    mediaType,
    title: String(input.title || 'Untitled').trim().slice(0, 200),
    posterPath: typeof input.posterPath === 'string' && /^\/[\w./-]+$/.test(input.posterPath) ? input.posterPath : null,
    backdropPath: typeof input.backdropPath === 'string' && /^\/[\w./-]+$/.test(input.backdropPath) ? input.backdropPath : null,
    year: String(input.year || '').replace(/[^0-9]/g, '').slice(0, 4),
    overview: String(input.overview || '').trim().slice(0, 2000),
    voteAverage: Number.isFinite(Number(input.voteAverage)) ? Math.max(0, Math.min(10, Number(input.voteAverage))) : null,
  };
}
