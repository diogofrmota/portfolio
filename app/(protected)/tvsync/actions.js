'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../../../auth';
import { ensureAppUser, getDatabase } from '../../../lib/database';
import { searchTvsyncDiscovery, validateMedia } from '../../../lib/tvsync';

async function getUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error('You must be signed in.');
  return ensureAppUser(session.user);
}

export async function searchMedia(query) {
  await getUser();
  return searchTvsyncDiscovery(query);
}

export async function toggleLibraryItem(input) {
  const user = await getUser();
  const media = validateMedia(input);
  const sql = getDatabase();
  const existing = await sql`
    select id from tvsync_library
    where user_id = ${user.user_id} and tmdb_id = ${media.id} and media_type = ${media.mediaType}
  `;
  if (existing.length) {
    await sql`delete from tvsync_library where id = ${existing[0].id} and user_id = ${user.user_id}`;
    revalidatePath('/tvsync');
    return { saved: false };
  }
  const rows = await sql`
    insert into tvsync_library (
      user_id, tmdb_id, media_type, title, poster_path, backdrop_path,
      release_year, overview, vote_average, watch_status
    ) values (
      ${user.user_id}, ${media.id}, ${media.mediaType}, ${media.title}, ${media.posterPath},
      ${media.backdropPath}, ${media.year}, ${media.overview}, ${media.voteAverage}, 'planned'
    )
    on conflict (user_id, tmdb_id, media_type) do update set updated_at = now()
    returning watch_status, favorite, date_added
  `;
  revalidatePath('/tvsync');
  return { saved: true, item: { ...media, watchStatus: rows[0].watch_status, favorite: rows[0].favorite, dateAdded: rows[0].date_added.toISOString() } };
}

export async function updateLibraryItem(input) {
  const user = await getUser();
  const id = Number(input?.id);
  const mediaType = input?.mediaType;
  const allowedStatuses = mediaType === 'movie' ? ['planned', 'completed'] : ['planned', 'watching', 'completed', 'paused', 'dropped'];
  if (!Number.isInteger(id) || !['movie', 'tv'].includes(mediaType) || !allowedStatuses.includes(input?.watchStatus)) throw new Error('Invalid library update.');
  const sql = getDatabase();
  const rows = await sql`
    update tvsync_library set
      watch_status = ${input.watchStatus},
      favorite = ${Boolean(input.favorite)},
      updated_at = now()
    where user_id = ${user.user_id} and tmdb_id = ${id} and media_type = ${mediaType}
    returning tmdb_id
  `;
  if (!rows.length) throw new Error('That title is not in your library.');
  revalidatePath('/tvsync');
  return { updated: true };
}

export async function saveMediaRating(input) {
  const user = await getUser();
  const tmdbId = Number(input?.id);
  const mediaType = input?.mediaType;
  const rating = Number(input?.rating);
  const review = String(input?.review || '').trim().slice(0, 1000);
  if (!Number.isInteger(tmdbId) || tmdbId <= 0 || !['movie', 'tv'].includes(mediaType) || !Number.isFinite(rating) || rating < 0 || rating > 10) throw new Error('Choose a rating from 0 to 10.');
  const roundedRating = Math.round(rating * 10) / 10;
  const sql = getDatabase();
  await sql`
    insert into tvsync_ratings (user_id, tmdb_id, media_type, rating, review)
    values (${user.user_id}, ${tmdbId}, ${mediaType}, ${roundedRating}, ${review})
    on conflict (user_id, tmdb_id, media_type) do update set
      rating = excluded.rating,
      review = excluded.review,
      updated_at = now()
  `;
  revalidatePath(`/tvsync/${mediaType === 'movie' ? 'movie' : 'tv'}/${tmdbId}`);
  return { rating: roundedRating, review };
}

export async function toggleEpisodeProgress(input) {
  const user = await getUser();
  const showId = Number(input?.showId);
  const seasonNumber = Number(input?.seasonNumber);
  const episodeNumber = Number(input?.episodeNumber);
  const watched = Boolean(input?.watched);
  if (!Number.isInteger(showId) || showId <= 0 || !Number.isInteger(seasonNumber) || seasonNumber < 0 || !Number.isInteger(episodeNumber) || episodeNumber <= 0) throw new Error('Invalid episode.');
  const sql = getDatabase();
  await sql`
    insert into tvsync_episode_progress (user_id, tmdb_show_id, season_number, episode_number, watched, watched_at)
    values (${user.user_id}, ${showId}, ${seasonNumber}, ${episodeNumber}, ${watched}, ${watched ? new Date().toISOString() : null})
    on conflict (user_id, tmdb_show_id, season_number, episode_number) do update set
      watched = excluded.watched,
      watched_at = excluded.watched_at,
      updated_at = now()
  `;
  revalidatePath(`/tvsync/tv/${showId}`);
  revalidatePath(`/tvsync/tv/${showId}/season/${seasonNumber}`);
  return { watched };
}
