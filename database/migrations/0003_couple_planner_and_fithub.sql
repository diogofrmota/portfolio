create table if not exists couple_planner_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our shared space',
  owner_user_id text not null references app_users(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists couple_planner_members (
  space_id uuid not null references couple_planner_spaces(id) on delete cascade,
  user_id text not null references app_users(user_id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id),
  constraint couple_planner_one_space_per_user unique (user_id),
  constraint couple_planner_member_role_check check (role in ('owner', 'member'))
);

create index if not exists couple_planner_members_space_idx on couple_planner_members (space_id);

create table if not exists couple_planner_data (
  space_id uuid primary key references couple_planner_spaces(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists couple_planner_invites (
  code text primary key,
  space_id uuid not null references couple_planner_spaces(id) on delete cascade,
  created_by text not null references app_users(user_id) on delete cascade,
  expires_at timestamptz not null,
  used_by text references app_users(user_id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint couple_planner_invite_code_check check (code ~ '^[A-Z0-9]{6}$')
);

create index if not exists couple_planner_invites_space_idx on couple_planner_invites (space_id, created_at desc);

create table if not exists fithub_state (
  user_id text primary key references app_users(user_id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
