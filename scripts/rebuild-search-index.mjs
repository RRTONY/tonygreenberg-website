/**
 * Trigger search index rebuild via the local dev server's tRPC endpoint.
 * Usage: node scripts/rebuild-search-index.mjs
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

async function main() {
  console.log("[Rebuild] Triggering search index rebuild...");

  // We need to call the rebuildSearchIndex function directly since
  // the tRPC endpoint requires admin auth. Let's import and call directly.
  const { rebuildSearchIndex } = await import("../server/search-indexer.ts");
  const result = await rebuildSearchIndex();

  console.log(`[Rebuild] Indexed: ${result.indexed} entries`);
  if (result.errors.length > 0) {
    console.log(`[Rebuild] Errors:`);
    result.errors.forEach((e) => console.log(`  - ${e}`));
  }
  console.log("[Rebuild] Done!");
  process.exit(0);
}

main().catch((e) => {
  console.error("[Rebuild] Fatal error:", e);
  process.exit(1);
});
