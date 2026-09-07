'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../../../auth';
import { createCoupleWorkspaceInvite, joinCoupleWorkspace, saveCoupleWorkspaceData } from '../../../lib/couple-planner';

const expectedPlannerErrors = new Set([
  'Only the workspace owner can create an invite.',
  'This shared space already has two members.',
  'Enter a valid six-character invite code.',
  'That invite is invalid or expired.',
  'Leave your current shared space before joining another one.',
  'That invite was already used or the shared space is full.',
]);

function safePlannerError(error, fallback) {
  if (error instanceof Error && expectedPlannerErrors.has(error.message)) return error.message;
  console.error(fallback, error);
  return fallback;
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error('You must be signed in.');
  return session.user;
}

export async function saveCouplePlannerData(workspaceId, data) {
  const user = await requireUser();
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'Invalid planner data.' };
  try {
    await saveCoupleWorkspaceData(user, workspaceId, data);
    return { ok: true };
  } catch (error) {
    console.error('Unable to save Couple Planner data:', error);
    return { ok: false, error: 'Could not save your latest changes.' };
  }
}

export async function createPartnerInvite() {
  try {
    const user = await requireUser();
    const invite = await createCoupleWorkspaceInvite(user);
    revalidatePath('/couple-planner');
    return { ok: true, invite };
  } catch (error) {
    return { ok: false, error: safePlannerError(error, 'Could not create an invite.') };
  }
}

export async function joinPartnerSpace(code) {
  try {
    const user = await requireUser();
    await joinCoupleWorkspace(user, code);
    revalidatePath('/couple-planner');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: safePlannerError(error, 'Could not join that shared space.') };
  }
}
