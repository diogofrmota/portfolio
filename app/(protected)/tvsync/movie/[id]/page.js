import { notFound, redirect } from 'next/navigation';
import { auth } from '../../../../../auth';
import { getTvsyncMediaDetails, getTvsyncMediaState } from '../../../../../lib/tvsync';
import MediaDetail from '../../media-detail';

export default async function MovieDetailPage({ params }) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId) || movieId <= 0) notFound();
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/tvsync/movie/${movieId}`);
  const [media, personal] = await Promise.all([
    getTvsyncMediaDetails('movie', movieId),
    getTvsyncMediaState(session.user, movieId, 'movie'),
  ]);
  if (!media) notFound();
  return <MediaDetail media={media} initialPersonal={personal} />;
}
