import Link from 'next/link';

export const metadata = { title: 'Fithub' };

export default function Fithub() {
  return (
    <>
      <p>Fithub (WIP)</p>
      <p>track fitness like GitHub</p>
      <p>coming soon</p>
      <Link href="/apps">[back to apps]</Link>
    </>
  );
}
