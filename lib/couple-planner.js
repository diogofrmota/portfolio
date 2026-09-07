import { randomBytes, randomUUID } from 'node:crypto';
import { ensureAppUser, getDatabase } from './database';

const plannerSections = ['calendar', 'tasks', 'dates', 'trips', 'recipes', 'entertainment'];

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function normalizeCouplePlannerData(data) {
  const source = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  return Object.fromEntries(plannerSections.map((section) => {
    const seenIds = new Set();
    const items = Array.isArray(source[section]) ? source[section].slice(0, 1000).flatMap((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
      const id = text(item.id, 100);
      const title = text(item.title, 80);
      if (!id || !title || seenIds.has(id)) return [];
      seenIds.add(id);
      return [{
        id,
        title,
        detail: text(item.detail, 180),
        ...(isValidDate(item.date) ? { date: item.date } : {}),
        ...(text(item.tag, 30) ? { tag: text(item.tag, 30) } : {}),
        ...(section === 'calendar' ? { color: /^#[0-9a-f]{6}$/i.test(item.color) ? item.color : '#e63b2e' } : {}),
        ...(section === 'tasks' ? { done: Boolean(item.done) } : {}),
      }];
    }) : [];
    return [section, items];
  }));
}

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
    const spaceId = randomUUID();
    const created = await sql.transaction([
      sql`select pg_advisory_xact_lock(hashtextextended(${appUser.user_id}, 0))`,
      sql`
        insert into couple_planner_spaces (id, owner_user_id)
        select ${spaceId}, ${appUser.user_id}
        where not exists (select 1 from couple_planner_members where user_id = ${appUser.user_id})
        returning id, name
      `,
      sql`
        insert into couple_planner_members (space_id, user_id, role)
        select ${spaceId}, ${appUser.user_id}, 'owner'
        where exists (select 1 from couple_planner_spaces where id = ${spaceId} and owner_user_id = ${appUser.user_id})
      `,
      sql`
        insert into couple_planner_data (space_id)
        select ${spaceId}
        where exists (select 1 from couple_planner_members where space_id = ${spaceId} and user_id = ${appUser.user_id})
      `,
    ]);
    if (created[1].length) {
      memberships = [{ ...created[1][0], role: 'owner' }];
    } else {
      memberships = await sql`
        select s.id, s.name, m.role
        from couple_planner_members m
        join couple_planner_spaces s on s.id = m.space_id
        where m.user_id = ${appUser.user_id}
        limit 1
      `;
    }
  }
  const space = memberships[0];
  const [dataRows, countRows, inviteRows] = await Promise.all([
    sql`select data from couple_planner_data where space_id = ${space.id}`,
    sql`select count(*)::integer as count from couple_planner_members where space_id = ${space.id}`,
    sql`select code, expires_at from couple_planner_invites where space_id = ${space.id} and used_at is null and expires_at > now() order by created_at desc limit 1`,
  ]);
  return { id: space.id, name: space.name, role: space.role, data: normalizeCouplePlannerData(dataRows[0]?.data), memberCount: countRows[0].count, invite: inviteRows[0] ? { code: inviteRows[0].code, expiresAt: inviteRows[0].expires_at.toISOString() } : null };
}

export async function saveCoupleWorkspaceData(user, workspaceId, data) {
  const appUser = await ensureAppUser(user);
  if (typeof workspaceId !== 'string' || !/^[0-9a-f-]{36}$/i.test(workspaceId)) {
    throw new Error('Invalid shared space.');
  }
  const sql = getDatabase();
  const rows = await sql`
    update couple_planner_data d
    set data = ${JSON.stringify(normalizeCouplePlannerData(data))}::jsonb, updated_at = now()
    from couple_planner_members m
    where d.space_id = ${workspaceId}
      and m.space_id = d.space_id
      and m.user_id = ${appUser.user_id}
    returning d.space_id
  `;
  if (!rows.length) throw new Error('You no longer have access to this shared space.');
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
  const results = await sql.transaction([
    sql`select pg_advisory_xact_lock(hashtextextended(${workspace.id}::text, 0))`,
    sql`update couple_planner_invites set expires_at = now() where space_id = ${workspace.id} and used_at is null`,
    sql`
      insert into couple_planner_invites (code, space_id, created_by, expires_at)
      select ${code}, ${workspace.id}, ${appUser.user_id}, now() + interval '7 days'
      where (select count(*) from couple_planner_members where space_id = ${workspace.id}) < 2
      returning code, expires_at
    `,
  ]);
  const rows = results[2];
  if (!rows.length) throw new Error('This shared space already has two members.');
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
  const oldSpaceId = current[0]?.space_id || null;
  const results = await sql.transaction([
    sql`select pg_advisory_xact_lock(hashtextextended(${invites[0].space_id}::text, 0))`,
    sql`
      update couple_planner_invites
      set used_by = ${appUser.user_id}, used_at = now()
      where code = ${code} and used_at is null and expires_at > now()
        and (select count(*) from couple_planner_members where space_id = couple_planner_invites.space_id) < 2
      returning space_id
    `,
    sql`
      delete from couple_planner_members
      where user_id = ${appUser.user_id} and ${oldSpaceId}::uuid is not null
        and exists (select 1 from couple_planner_invites where code = ${code} and used_by = ${appUser.user_id})
    `,
    sql`
      insert into couple_planner_members (space_id, user_id, role)
      select ${invites[0].space_id}, ${appUser.user_id}, 'member'
      where exists (select 1 from couple_planner_invites where code = ${code} and used_by = ${appUser.user_id})
    `,
    sql`
      delete from couple_planner_spaces
      where id = ${oldSpaceId}::uuid and owner_user_id = ${appUser.user_id}
        and exists (select 1 from couple_planner_invites where code = ${code} and used_by = ${appUser.user_id})
    `,
  ]);
  if (!results[1].length) throw new Error('That invite was already used or the shared space is full.');
  return { joined: true };
}
