import { notFound, redirect } from 'next/navigation';
import { auth } from '../../../../../auth';
import { getTvsyncMediaDetails, getTvsyncMediaState } from '../../../../../lib/tvsync';
import MediaDetail from '../../media-detail';

export default async function TvDetailPage({ params }) {
  const { id } = await params;
  const showId = Number(id);
  if (!Number.isInteger(showId) || showId <= 0) notFound();
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/tvsync/tv/${showId}`);
  const [media, personal] = await Promise.all([
    getTvsyncMediaDetails('tv', showId),
    getTvsyncMediaState(session.user, showId, 'tv'),
  ]);
  if (!media) notFound();
  return <MediaDetail media={media} initialPersonal={personal} />;
}
