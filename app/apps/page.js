import { auth } from '../../auth';
import AppsClient from './apps-client';

export const metadata = { title: 'Apps' };

export default async function Apps() {
  const session = await auth();

  return (
    <main>
      <div className="content">
        <AppsClient isAuthenticated={Boolean(session)} />
      </div>
    </main>
  );
}
