import { redirect } from 'next/navigation';
import { auth, signOut } from '../../auth';

export default async function ProtectedLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <main><div className="content">
      {children}
      <p>signed in as {session.user.email}</p>
      <form action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}>
        <button type="submit">[sign out]</button>
      </form>
    </div></main>
  );
}
