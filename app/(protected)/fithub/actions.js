'use server';

import { auth } from '../../../auth';
import { normalizeFithubState, saveFithubUserState } from '../../../lib/fithub';

export async function saveFithubState(data) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error('You must be signed in.');
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid Fithub state.');
  await saveFithubUserState(session.user, normalizeFithubState(data));
  return { saved: true };
}
