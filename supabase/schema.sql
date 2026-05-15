create table if not exists public.pinfolio_accounts (
  user_id text primary key,
  username text not null unique,
  password_hash text not null,
  salt text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pinfolio_sessions (
  token text primary key,
  user_id text not null references public.pinfolio_accounts(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);

create index if not exists pinfolio_sessions_user_id_idx
  on public.pinfolio_sessions (user_id);

create index if not exists pinfolio_accounts_username_idx
  on public.pinfolio_accounts (username);
