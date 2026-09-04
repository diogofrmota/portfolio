import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signIn } from '../../auth';

export const metadata = { title: 'Login' };

export default async function Login({ searchParams }) {
  if (await auth()) redirect('/apps');
  const { error } = await searchParams;

  return (
    <main><div className="content">
      <p>login</p>
      <p>one account for all apps</p>
      {error && <p>login failed. please try again.</p>}
      <form action={async () => {
        'use server';
        await signIn('google', { redirectTo: '/apps' });
      }}>
        <button type="submit">[continue with Google]</button>
      </form>
      <Link href="/">[back to home]</Link>
    </div></main>
  );
}
