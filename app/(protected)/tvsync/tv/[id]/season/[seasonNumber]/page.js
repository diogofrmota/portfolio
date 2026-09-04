import { notFound, redirect } from 'next/navigation';
import { auth } from '../../../../../../../auth';
import { getTvsyncMediaDetails, getTvsyncMediaState, getTvsyncSeason } from '../../../../../../../lib/tvsync';
import SeasonDetail from '../../../../season-detail';

export default async function SeasonDetailPage({ params }) {
  const { id, seasonNumber } = await params;
  const showId = Number(id);
  const season = Number(seasonNumber);
  if (!Number.isInteger(showId) || showId <= 0 || !Number.isInteger(season) || season < 0) notFound();
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/tvsync/tv/${showId}/season/${season}`);
  const [show, seasonDetails, personal] = await Promise.all([
    getTvsyncMediaDetails('tv', showId),
    getTvsyncSeason(showId, season),
    getTvsyncMediaState(session.user, showId, 'tv'),
  ]);
  if (!show || !seasonDetails) notFound();
  return <SeasonDetail show={show} season={seasonDetails} initialWatched={personal.watchedEpisodes} />;
}
