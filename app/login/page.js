import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import { continueWithGoogle } from '../auth-actions';

export const metadata = { title: 'Login' };

export default async function Login({ searchParams }) {
  if (await auth()) redirect('/apps');
  const { error, mode } = await searchParams;
  const isRegistering = mode === 'register';

  return (
    <main><div className="content">
      <p>{isRegistering ? 'create an account' : 'login'}</p>
      <p>{isRegistering ? 'register once to access all apps' : 'one account for all apps'}</p>
      {error && <p>login failed. please try again.</p>}
      <form action={continueWithGoogle}>
        <input type="hidden" name="callbackUrl" value="/apps" />
        <button className="google-button" type="submit">
          <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.26-.16-1.86H9v3.52h4.84a4.14 4.14 0 0 1-1.8 2.72v2.28h2.92c1.71-1.57 2.68-3.9 2.68-6.66Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.28c-.8.54-1.84.86-3.04.86-2.35 0-4.34-1.59-5.05-3.72H.93v2.35A9 9 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.95 10.68A5.42 5.42 0 0 1 3.67 9c0-.58.1-1.14.28-1.68V4.97H.93A9 9 0 0 0 0 9c0 1.45.35 2.82.93 4.03l3.02-2.35Z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .93 4.97l3.02 2.35C4.66 5.18 6.65 3.58 9 3.58Z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>
      <p className="auth-register-copy">
        {isRegistering ? 'already registered? ' : 'not registered? '}
        <Link href={isRegistering ? '/login' : '/login?mode=register'}>
          {isRegistering ? 'login' : 'register'}
        </Link>
      </p>
      <Link href="/">[back to home]</Link>
    </div></main>
  );
}
