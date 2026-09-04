'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '../../../auth';
import { createCoupleWorkspaceInvite, joinCoupleWorkspace, saveCoupleWorkspaceData } from '../../../lib/couple-planner';

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error('You must be signed in.');
  return session.user;
}

export async function saveCouplePlannerData(data) {
  const user = await requireUser();
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid planner data.');
  const allowed = ['calendar', 'tasks', 'dates', 'trips', 'recipes', 'entertainment'];
  const clean = Object.fromEntries(allowed.map((key) => [key, Array.isArray(data[key]) ? data[key].slice(0, 1000) : []]));
  await saveCoupleWorkspaceData(user, clean);
  return { saved: true };
}

export async function createPartnerInvite() {
  const invite = await createCoupleWorkspaceInvite(await requireUser());
  revalidatePath('/couple-planner');
  return invite;
}

export async function joinPartnerSpace(code) {
  const result = await joinCoupleWorkspace(await requireUser(), code);
  revalidatePath('/couple-planner');
  return result;
}
