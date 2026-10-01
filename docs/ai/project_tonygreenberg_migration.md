# TonyGreenberg.com migration history

> Manus → Next.js/Sanity/Netlify. Why the stack is what it is, who signs off, and what's still pending. Condensed from ramprate-ui's notes (2026-07-23 to 2026-08-22) plus this repo's TODO.

**Why the move:** the old site ran on Manus (a closed AI-app platform): broken formatting and
images, billing lockouts despite credits, lost context, high cost, and no real files or git
history. Every response was proxied through Manus (`x-manus-proxy-mode`, `x-powered-by: Express`,
`cache-control: no-store`, a 300 req/min rate limit that throttled crawlers too), and images were
served through a dynamic `/api/img/` proxy. That proxy is now dead, which is why this repo has the
zero-Manus rule and why images are rescued into Sanity.

**Stack decision:** "Tony's AI" pitched a 10-vendor stack (Builder.io, Vercel, Cloudinary, Algolia,
Plausible, ...). The accepted counter-proposal reused what already ran RampRate's site: GitHub +
Netlify, Sanity, and Claude Code/Cursor working on real repo files. Supabase was added in v2
(2026-08-22) for auth and publish approval only, and is still not provisioned (Phase 2).

**People:** Tony Greenberg (owner), Darryl Dsouza and Kimberly Dofredo (testers/sign-off). The
final sign-off from those three gates DNS cutover (Phase 14).

**Plan shape:** inventory → foundation → rebuild content → QA gate (visual diff, link check,
perf/a11y, 301 map) → cutover with Manus kept live through an overlap window → handoff (Studio
walkthrough, request → Claude Code → preview → review → merge → live).

**Deployments:** DNS for `tonygreenberg.com`/`www` still points at Manus (`cname.manus.space`). The
zone has `flow.tonygreenberg.com` → `jolly-travesseiro-c2faf8.netlify.app`. **That Netlify site is
an older deploy, not this repo's current app** (checked 2026-09-29: it returns 404 for
`/the-philosophy` and `/peptide-watch`, which this repo has had for weeks), so it's not this repo's
production URL. This repo's own Netlify site URL isn't recorded yet. Add it here when known.

**Current status:** see `NEXTJS-MIGRATION-TODO.md`, which is the source of truth for what's done.

## `_legacy-manus-app/` is older than the live site (found 2026-09-29)

The live homepage has a "Recent Updates" band (its `data-loc` points at `client/src/pages/Blog.tsx:1158`)
that exists nowhere in `_legacy-manus-app/` or any git branch, and two live essays
(`the-tollbooth-and-the-alternative`, `what-quest-could-fix`) aren't in `blogData.json` or Sanity.
So when matching style or content, check the **live page** too, not just the legacy folder. The live
site is a client-rendered app: `curl` only returns an empty shell, so render it in a real browser
(Playwright with system Chrome worked) to read its text and computed styles.
