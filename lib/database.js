import { neon } from '@neondatabase/serverless';

let database;

export function getDatabase() {
  if (!database) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
    database = neon(process.env.DATABASE_URL);
  }
  return database;
}

export async function ensureAppUser(user) {
  if (!user?.id || !user?.email) throw new Error('An authenticated user is required.');
  const sql = getDatabase();
  const rows = await sql`
    insert into app_users (user_id, email, name, avatar_url)
    values (${user.id}, ${user.email.toLowerCase()}, ${user.name || ''}, ${user.image || null})
    on conflict (user_id) do update set
      email = excluded.email,
      name = excluded.name,
      avatar_url = excluded.avatar_url,
      updated_at = now()
    returning user_id, email, name, avatar_url
  `;
  return rows[0];
}
