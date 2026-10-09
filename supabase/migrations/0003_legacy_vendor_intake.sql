-- Archive of the old site's supplier intake forms (2026-10-09, owner asked).
-- Run once in the Supabase dashboard (after 0001 and 0002): SQL Editor > New
-- query > paste this file > Run. Then copy the rows in with
-- scripts/import-legacy-vendor-intake.ts (it reads the private backup of the
-- old Manus database; see docs/ai/project_legacy_database.md).
--
-- Kept whole and read-only: each row is one legacy `vendor_intake` record as
-- it was (all ~70 columns in `data`), because new applications go to
-- RampRate's own pipeline (src/app/supplier-intake/actions.ts), not here.
-- Row-level security is on with no public policies: only the service-role
-- key and the dashboard can read it.
create table if not exists public.legacy_vendor_intake (
  legacy_id integer primary key,
  legal_entity_name text,
  email text,
  stage text,
  submitted_at timestamptz,
  data jsonb not null,
  imported_at timestamptz not null default now()
);
alter table public.legacy_vendor_intake enable row level security;
