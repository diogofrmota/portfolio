import { ensureAppUser, getDatabase } from './database';

export async function getFithubState(user) {
  const appUser = await ensureAppUser(user);
  const sql = getDatabase();
  const rows = await sql`select data from fithub_state where user_id = ${appUser.user_id}`;
  return { data: rows[0]?.data || {}, hasSavedState: Boolean(rows.length) };
}

export async function saveFithubUserState(user, data) {
  const appUser = await ensureAppUser(user);
  const sql = getDatabase();
  await sql`
    insert into fithub_state (user_id, data) values (${appUser.user_id}, ${JSON.stringify(data)}::jsonb)
    on conflict (user_id) do update set data = excluded.data, updated_at = now()
  `;
}
