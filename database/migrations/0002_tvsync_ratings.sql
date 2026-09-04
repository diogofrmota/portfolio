create table if not exists tvsync_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references app_users(user_id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null,
  rating numeric(3, 1) not null,
  review text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tvsync_ratings_tmdb_id_positive check (tmdb_id > 0),
  constraint tvsync_ratings_media_type_check check (media_type in ('movie', 'tv')),
  constraint tvsync_ratings_value_check check (rating >= 0 and rating <= 10),
  constraint tvsync_ratings_review_length check (length(review) <= 1000),
  constraint tvsync_ratings_user_media_unique unique (user_id, tmdb_id, media_type)
);

create index if not exists tvsync_ratings_user_idx on tvsync_ratings (user_id);
create index if not exists tvsync_ratings_media_idx on tvsync_ratings (tmdb_id, media_type);
