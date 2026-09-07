import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { getFithubState } from '../../../lib/fithub';
import FithubDashboard from './fithub-dashboard';

export const metadata = {
  title: 'Fithub',
  description: 'Build consistency, one workout at a time.',
};

export default async function Fithub() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/fithub');
  const today = new Date().toISOString().slice(0, 10);
  const state = await getFithubState(session.user);

  return <FithubDashboard today={today} initialState={state.data} />;
}
