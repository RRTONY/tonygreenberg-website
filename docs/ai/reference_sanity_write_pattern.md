# Writing to Sanity from code

> Reads go through sanityFetch(); writes go through the server-only write client, as drafts. Scripts build their own client.

- **Reads** (pages): `sanityFetch()` in `src/lib/sanity/client.ts`. It tags queries so the Sanity
  webhook (`src/app/api/revalidate/`) revalidates the right pages. Don't call `client.fetch()`
  directly from a page (CONTRIBUTING.md rule 9). A GROQ field that isn't selected in
  `src/lib/sanity/queries.ts` won't appear in results.
- **Writes from app code:** `src/lib/sanity/write-client.ts` (`import "server-only"`,
  `SANITY_API_TOKEN` with **Editor** role, `perspective: "raw"`). Never import it from a Client
  Component. The MCP server's helpers in `src/lib/admin/sanity-content.ts` (`patchDraft`,
  `createDraft`, `listPendingDrafts`, `publishDraft`) always write to `drafts.<id>` and only
  publish through `publish_changes`.
- **Scripts (`scripts/`):** standalone Node scripts can't import `write-client.ts` (the
  `server-only` import throws outside Next). They construct their own short-lived client. See the
  comment at the top of `scripts/migrate-blog-posts.ts`, and run them with `tsx` (`pnpm
  migrate:blog --dry-run` first).
- **Targeted patches** to array items use bracket paths, e.g.
  `body[_key=="<blockKey>"].markDefs[_key=="<linkKey>"].href`. Dry-run first
  (`patch.serialize()`) before `.commit()` on a published document.
- **Only `post`, `author` and `category` reach the site today.** `siteSettings`, `pageSeo`, `page`
  and `redirect` exist as schemas but no route reads them (checked 2026-09-29).
