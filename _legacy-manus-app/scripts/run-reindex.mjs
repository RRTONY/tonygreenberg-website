/**
 * Directly runs the search indexer to rebuild the full-text search index.
 * Run with: node scripts/run-reindex.mjs
 */
import { createRequire } from "module";
import { register } from "tsx/esm/api";

register();

const { rebuildSearchIndex } = await import("../server/search-indexer.ts");

console.log("[Reindex] Starting full search index rebuild...");
const result = await rebuildSearchIndex();
console.log(`[Reindex] Complete. Indexed: ${result.indexed}`);
if (result.errors.length > 0) {
  console.error("[Reindex] Errors:", result.errors);
} else {
  console.log("[Reindex] No errors.");
}
process.exit(0);
