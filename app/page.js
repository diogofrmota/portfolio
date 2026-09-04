import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div className="content">
        <p>diogo mota</p>
        <p>
          devops engineer @{' '}
          <a href="https://www.richemont.com/" target="_blank" rel="noreferrer">
            Richemont
          </a>
        </p>
        <p>currently based in Lisbon, PT</p>
        <Link href="/apps">[check apps]</Link>
      </div>
    </main>
  );
}
