# Cleanup and Route Audit

## Scope

The final cleanup review covered application routes, route handlers, maintenance scripts, dependencies, unused exports, and retired service infrastructure.

## Findings

| Area                                | Result                                                                                           | Decision                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Next.js page modules                | 141 `page.tsx` files                                                                             | Retained because the live-site inventory and production build confirm the public route surface. |
| Route handlers                      | 3 active handlers                                                                                | Retained for search, newsletter submissions, and managed visitor state.                         |
| Redirects                           | Legacy aliases are centralized in `next.config.ts`                                               | Retained to prevent broken inbound links while preserving canonical public routes.              |
| Maintenance scripts                 | `import-managed-content.ts` and `markdown-to-portable-text.ts` only                              | Retained because they support the managed editorial-content migration.                          |
| Retired CMS and auth infrastructure | Sanity studio/configuration, Supabase clients, revalidation endpoint, and migration-only scripts | Removed.                                                                                        |
| Static dead-code analysis           | No unused dependencies or production files; one test-only server shim                            | The shim remains because Vitest aliases `server-only` to it.                                    |

## Verification

The final static analysis reports only `src/test/server-only.ts`, which is intentionally loaded through `vitest.config.mts`. The package peer graph is clean, and the complete quality command passes formatting, linting, type checks, tests, and the production build.
