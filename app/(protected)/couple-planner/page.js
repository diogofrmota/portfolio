import Link from 'next/link';

export const metadata = { title: 'Couple Planner' };

export default function CouplePlanner() {
  return (
    <>
      <p>Couple Planner</p>
      <p>shared agenda for couples</p>
      <p>coming soon</p>
      <Link href="/apps">[back to apps]</Link>
    </>
  );
}
