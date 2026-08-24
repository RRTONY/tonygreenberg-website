-- Publish-approval workflow + FauxTony chat logging (NEXTJS-MIGRATION-TODO.md,
-- Phase 2 / Phase 10 / Phase 11). Run this against the real Supabase project
-- once it exists: `supabase db push` (with the CLI linked to the project) or
-- paste into the SQL editor at supabase.com/dashboard.

create table if not exists change_requests (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('content', 'code')),
  summary text not null,
  requested_by text not null,
  preview_url text,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  approved_by uuid references auth.users (id),
  approved_at timestamptz
);

alter table change_requests enable row level security;

-- Any authenticated user can read/act on change requests. Scope this to a
-- specific approver role/allowlist once more than one non-approver account
-- exists in this project — fine for the initial single-approver setup.
create policy "authenticated users can read change requests"
  on change_requests for select
  to authenticated
  using (true);

create policy "authenticated users can insert change requests"
  on change_requests for insert
  to authenticated
  with check (true);

create policy "authenticated users can update change requests"
  on change_requests for update
  to authenticated
  using (true);

create table if not exists chat_conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chat_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;

-- Deliberately no policies for `anon`/`authenticated` on either chat table:
-- RLS enabled + zero policies means nobody using the anon/authenticated
-- roles can read or write these rows. Only the service-role key (which
-- bypasses RLS entirely, see src/lib/supabase/service-role.ts) can log
-- conversations. This is the "service-role write only, no public read"
-- requirement from Phase 2 — do not add a public policy here.

create index if not exists chat_messages_conversation_id_idx
  on chat_messages (conversation_id);
