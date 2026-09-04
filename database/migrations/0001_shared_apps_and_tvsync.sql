create extension if not exists pgcrypto;

create table if not exists app_users (
  user_id text primary key,
  email text not null,
  name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_users_user_id_not_blank check (length(trim(user_id)) > 0),
  constraint app_users_email_not_blank check (length(trim(email)) > 0)
);

create index if not exists app_users_email_lower_idx on app_users (lower(email));

create table if not exists tvsync_library (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references app_users(user_id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  title text not null,
  poster_path text,
  backdrop_path text,
  release_year text not null default '',
  overview text not null default '',
  vote_average numeric(3, 1),
  watch_status text not null default 'planned',
  favorite boolean not null default false,
  date_added timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tvsync_library_tmdb_id_positive check (tmdb_id > 0),
  constraint tvsync_library_media_type_check check (media_type in ('movie', 'tv')),
  constraint tvsync_library_status_check check (
    (media_type = 'movie' and watch_status in ('planned', 'completed')) or
    (media_type = 'tv' and watch_status in ('planned', 'watching', 'completed', 'paused', 'dropped'))
  ),
  constraint tvsync_library_user_media_unique unique (user_id, tmdb_id, media_type)
);

create index if not exists tvsync_library_user_idx on tvsync_library (user_id);
create index if not exists tvsync_library_user_status_idx on tvsync_library (user_id, watch_status);
create index if not exists tvsync_library_user_added_idx on tvsync_library (user_id, date_added desc);

create table if not exists tvsync_episode_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references app_users(user_id) on delete cascade,
  tmdb_show_id integer not null,
  season_number integer not null,
  episode_number integer not null,
  watched boolean not null default true,
  watched_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint tvsync_episode_show_positive check (tmdb_show_id > 0),
  constraint tvsync_episode_season_non_negative check (season_number >= 0),
  constraint tvsync_episode_number_positive check (episode_number > 0),
  constraint tvsync_episode_user_episode_unique unique (user_id, tmdb_show_id, season_number, episode_number)
);

create index if not exists tvsync_episode_user_show_idx on tvsync_episode_progress (user_id, tmdb_show_id);
