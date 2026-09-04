import Link from 'next/link';

export const metadata = { title: 'Apps' };

export default function Apps() {
  return (
    <main>
      <div className="content">
        <p><Link href="/tvsync">[TVSync]</Link><br />movie and tv show tracker</p>
        <p><Link href="/couple-planner">[Couple Planner]</Link><br />shared agenda for couples</p>
        <p><Link href="/fithub">[Fithub]</Link> (WIP)<br />track fitness like GitHub</p>
        <Link href="/login">[login]</Link>
        <Link href="/">[back to home]</Link>
      </div>
    </main>
  );
}
