import { auth } from '../../../auth';
import CouplePlannerDashboard from './couple-planner-dashboard';

export const metadata = {
  title: 'Couple Planner',
  description: 'One shared place for plans, tasks, dates, trips, recipes, and entertainment.',
};

export default async function CouplePlanner() {
  const session = await auth();
  const now = new Date();

  return (
    <CouplePlannerDashboard
      userName={session?.user?.name || session?.user?.email?.split('@')[0] || 'You'}
      today={now.toISOString().slice(0, 10)}
    />
  );
}
