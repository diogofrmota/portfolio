import Link from 'next/link';

export const metadata = { title: 'TVSync' };

export default function TVSync() {
  return (
    <>
      <p>TVSync</p>
      <p>movie and tv show tracker</p>
      <p>coming soon</p>
      <Link href="/apps">[back to apps]</Link>
    </>
  );
}
