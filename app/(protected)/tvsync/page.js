import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { getTvsyncDiscovery, getTvsyncLibrary } from '../../../lib/tvsync';
import TVSyncDashboard from './tvsync-dashboard';

export const metadata = {
  title: 'TVSync',
  description: 'Discover, save, and track movies and TV shows.',
};

export default async function TVSync() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/tvsync');
  const [discovery, library] = await Promise.all([
    getTvsyncDiscovery(),
    getTvsyncLibrary(session.user),
  ]);

  return <TVSyncDashboard discovery={discovery} initialLibrary={library} userName={session.user.name || 'You'} tmdbConfigured={Boolean(process.env.TMDB_API_KEY)} />;
}
