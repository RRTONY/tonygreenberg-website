// Copies the old site's 8 supplier intake forms into Supabase's
// legacy_vendor_intake table (create it first: supabase/migrations/0003).
// Reads the private backup of the old Manus database, which lives outside
// the repo (it has personal data); see docs/ai/project_legacy_database.md.
//
//   node --env-file=.env.local --import tsx scripts/import-legacy-vendor-intake.ts \
//     ~/Desktop/tonyg-site-backups/legacy-db-export-2026-10-09/vendor_intake.json
//
// Safe to run twice: rows are upserted on legacy_id.
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

type LegacyRow = Record<string, unknown> & {
  id: number;
  legal_entity_name?: string | null;
  email?: string | null;
  stage?: string | null;
  createdAt?: string | null;
};

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Pass the path to vendor_intake.json from the legacy backup.");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");

  const { rows } = JSON.parse(await readFile(file, "utf8")) as { rows: LegacyRow[] };
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error, count } = await supabase.from("legacy_vendor_intake").upsert(
    rows.map((r) => ({
      legacy_id: r.id,
      legal_entity_name: r.legal_entity_name ?? null,
      email: r.email ?? null,
      stage: r.stage ?? null,
      submitted_at: r.createdAt ?? null,
      data: r,
    })),
    { onConflict: "legacy_id", count: "exact" },
  );
  if (error) throw new Error(error.message);
  console.log(`Copied ${count ?? rows.length} supplier forms into legacy_vendor_intake.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
