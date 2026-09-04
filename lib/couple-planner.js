import { randomBytes } from 'node:crypto';
import { ensureAppUser, getDatabase } from './database';

export async function getCouplePlannerWorkspace(user) {
  const appUser = await ensureAppUser(user);
  const sql = getDatabase();
  let memberships = await sql`
    select s.id, s.name, m.role
    from couple_planner_members m
    join couple_planner_spaces s on s.id = m.space_id
    where m.user_id = ${appUser.user_id}
    limit 1
  `;
  if (!memberships.length) {
    const spaces = await sql`insert into couple_planner_spaces (owner_user_id) values (${appUser.user_id}) returning id, name`;
    await sql`insert into couple_planner_members (space_id, user_id, role) values (${spaces[0].id}, ${appUser.user_id}, 'owner')`;
    await sql`insert into couple_planner_data (space_id) values (${spaces[0].id})`;
    memberships = [{ ...spaces[0], role: 'owner' }];
  }
  const space = memberships[0];
  const [dataRows, countRows, inviteRows] = await Promise.all([
    sql`select data from couple_planner_data where space_id = ${space.id}`,
    sql`select count(*)::integer as count from couple_planner_members where space_id = ${space.id}`,
    sql`select code, expires_at from couple_planner_invites where space_id = ${space.id} and used_at is null and expires_at > now() order by created_at desc limit 1`,
  ]);
  return { id: space.id, name: space.name, role: space.role, data: dataRows[0]?.data || {}, memberCount: countRows[0].count, invite: inviteRows[0] ? { code: inviteRows[0].code, expiresAt: inviteRows[0].expires_at.toISOString() } : null };
}

export async function saveCoupleWorkspaceData(user, data) {
  const workspace = await getCouplePlannerWorkspace(user);
  const sql = getDatabase();
  await sql`update couple_planner_data set data = ${JSON.stringify(data)}::jsonb, updated_at = now() where space_id = ${workspace.id}`;
}

export async function createCoupleWorkspaceInvite(user) {
  const appUser = await ensureAppUser(user);
  const workspace = await getCouplePlannerWorkspace(user);
  if (workspace.role !== 'owner') throw new Error('Only the workspace owner can create an invite.');
  if (workspace.memberCount >= 2) throw new Error('This shared space already has two members.');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('');
  const sql = getDatabase();
  await sql`update couple_planner_invites set expires_at = now() where space_id = ${workspace.id} and used_at is null`;
  const rows = await sql`insert into couple_planner_invites (code, space_id, created_by, expires_at) values (${code}, ${workspace.id}, ${appUser.user_id}, now() + interval '7 days') returning code, expires_at`;
  return { code: rows[0].code, expiresAt: rows[0].expires_at.toISOString() };
}

export async function joinCoupleWorkspace(user, rawCode) {
  const appUser = await ensureAppUser(user);
  const code = String(rawCode || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{6}$/.test(code)) throw new Error('Enter a valid six-character invite code.');
  const sql = getDatabase();
  const invites = await sql`select code, space_id from couple_planner_invites where code = ${code} and used_at is null and expires_at > now() limit 1`;
  if (!invites.length) throw new Error('That invite is invalid or expired.');
  const targetCount = await sql`select count(*)::integer as count from couple_planner_members where space_id = ${invites[0].space_id}`;
  if (targetCount[0].count >= 2) throw new Error('That shared space already has two members.');
  const current = await sql`select m.space_id, m.role, (select count(*)::integer from couple_planner_members x where x.space_id = m.space_id) as member_count from couple_planner_members m where m.user_id = ${appUser.user_id}`;
  if (current[0]?.space_id === invites[0].space_id) return { joined: true };
  if (current[0]?.member_count > 1) throw new Error('Leave your current shared space before joining another one.');
  if (current[0]) {
    await sql`delete from couple_planner_members where user_id = ${appUser.user_id}`;
    if (current[0].role === 'owner') await sql`delete from couple_planner_spaces where id = ${current[0].space_id}`;
  }
  await sql`insert into couple_planner_members (space_id, user_id, role) values (${invites[0].space_id}, ${appUser.user_id}, 'member')`;
  await sql`update couple_planner_invites set used_by = ${appUser.user_id}, used_at = now() where code = ${code} and used_at is null`;
  return { joined: true };
}
