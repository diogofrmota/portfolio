'use server';

import { signIn } from '../auth';

const appPaths = new Set(['/tvsync', '/couple-planner', '/fithub']);

export async function continueWithGoogle(formData) {
  const requestedPath = formData.get('callbackUrl');
  const redirectTo = appPaths.has(requestedPath) ? requestedPath : '/apps';

  await signIn('google', { redirectTo });
}
