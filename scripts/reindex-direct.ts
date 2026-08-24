/**
 * Direct search index rebuild — bypasses HTTP/auth, runs the indexer directly.
 * Run with: npx tsx scripts/reindex-direct.ts
 */
import "dotenv/config";
import { rebuildSearchIndex } from "../server/search-indexer";

async function main() {
  console.log("[Reindex] Starting full search index rebuild...");
  const result = await rebuildSearchIndex();
  console.log(`[Reindex] Complete. Indexed: ${result.indexed} entries.`);
  if (result.errors.length > 0) {
    console.error("[Reindex] Errors encountered:");
    result.errors.forEach((e) => console.error("  -", e));
  } else {
    console.log("[Reindex] No errors.");
  }
  process.exit(0);
}

main().catch((e) => {
  console.error("[Reindex] Fatal error:", e);
  process.exit(1);
});
