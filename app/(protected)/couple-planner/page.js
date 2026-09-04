import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { getCouplePlannerWorkspace } from '../../../lib/couple-planner';
import CouplePlannerDashboard from './couple-planner-dashboard';

export const metadata = {
  title: 'Couple Planner',
  description: 'One shared place for plans, tasks, dates, trips, recipes, and entertainment.',
};

export default async function CouplePlanner() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/couple-planner');
  const now = new Date();
  const workspace = await getCouplePlannerWorkspace(session.user);

  return (
    <CouplePlannerDashboard
      userName={session?.user?.name || session?.user?.email?.split('@')[0] || 'You'}
      today={now.toISOString().slice(0, 10)}
      initialData={workspace.data}
      hasSavedData={Object.keys(workspace.data).length > 0}
      workspace={{ role: workspace.role, memberCount: workspace.memberCount, invite: workspace.invite }}
    />
  );
}
