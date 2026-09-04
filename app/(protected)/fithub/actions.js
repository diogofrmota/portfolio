'use server';

import { auth } from '../../../auth';
import { saveFithubUserState } from '../../../lib/fithub';

export async function saveFithubState(data) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error('You must be signed in.');
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid Fithub state.');
  await saveFithubUserState(session.user, {
    completed: Array.isArray(data.completed) ? data.completed.slice(0, 20) : [],
    activity: Array.isArray(data.activity) ? data.activity.slice(-400) : [],
    workouts: Array.isArray(data.workouts) ? data.workouts.slice(0, 100) : [],
  });
  return { saved: true };
}
