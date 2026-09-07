'use server';

import { signIn } from '../auth';

function safeAppPath(value) {
  const path = typeof value === 'string' ? value : '';
  return path === '/fithub' || path === '/couple-planner' || path === '/tvsync' || path.startsWith('/tvsync/') ? path : '/apps';
}

export async function continueWithGoogle(formData) {
  await signIn('google', { redirectTo: safeAppPath(formData.get('callbackUrl')) });
}
