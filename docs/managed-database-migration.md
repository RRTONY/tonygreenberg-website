# Managed-Database Migration Design

## Purpose

The production target removes **Sanity** and **Supabase** as application runtime dependencies. The managed project database becomes the source of truth for application-owned records, while managed object storage holds media bytes and the database stores their keys and public paths. The prior services are not used as a runtime fallback.

## Scope and Source Data

The repository’s Git history contains the authoritative legacy blog data in `client/src/data/blogData.json` at commit `3ca12cbf2f80d9c862a47e7cd4571cd60b159f0c`. A one-time, idempotent importer will read that versioned source, convert its Markdown body with the existing conversion utility, and insert only actual legacy records. Application logic such as assessments, scoring, and encyclopedia modules remains in typed source files, consistent with the repository’s existing content boundary.

| Data domain                          | New managed database representation                                                              | Storage and access boundary                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Authors and categories               | `content_authors` and `content_categories`                                                       | Server-only queries, foreign-key relationships to posts.                                                                          |
| Blog posts and SEO metadata          | `content_posts` with JSON body, JSON tags, published/update timestamps, and media metadata       | Server Components and route handlers query server-side only.                                                                      |
| Editorial media                      | URL/key, alt text, dimensions, and attribution fields on content records                         | Actual bytes live in managed object storage; database never stores file bytes.                                                    |
| Newsletter submissions               | `newsletter_subscriptions` with normalized email, source, consent timestamp, and delivery status | Public route validates input, server records the submission, and an optional provider call happens only when securely configured. |
| Internal approvals and conversations | Deferred until the associated authenticated workflow is explicitly defined                       | No Supabase compatibility layer or unauthenticated endpoint is retained.                                                          |

## Authentication Decision

The current Next.js repository contains an internal password login shell that depends entirely on Supabase. It has no working managed-database authentication implementation, no configured credential-reset/email delivery path, and no evidence that public visitor authentication is required for the core site. It will therefore be removed rather than replaced with an insecure password flow.

Google sign-in is **not** added at this stage. It is not part of the established public experience, and a production OAuth flow requires a confirmed identity-provider choice, authorized redirect URLs, and credentials supplied through managed environment settings. If a future internal approval console needs sign-in, its identity model and access roles will be designed separately before implementation.

## Migration and Availability Strategy

The importer is designed to be repeatable and does not overwrite existing rows by default. Database data is created through a generated Drizzle migration applied to the managed database, then the importer runs against the historic repository source. Content-dependent pages will degrade to legitimate empty states only until the import has completed; they will never crash because an external CMS project ID is missing.

The active site will continue to use the existing external media URLs only where that legacy record contains an accessible licensed image. New media is stored in managed object storage and referenced by database metadata. Any missing artwork remains visibly tracked as missing rather than fabricated.

## Quality Gate

The project’s `pnpm ci` command is the mandatory local, continuous-integration, and deployment gate. It runs formatting verification, ESLint, strict TypeScript validation, Vitest tests, and a production Next.js build in sequence. A non-zero result prevents the GitHub Actions job and configured deployment build from succeeding.
