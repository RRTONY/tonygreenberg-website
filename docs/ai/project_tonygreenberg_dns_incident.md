# DNS incident: apex pointed at Netlify too early (2026-08-26)

> tonygreenberg.com's apex A record briefly pointed at Netlify's load balancer with no Netlify site claiming the domain, so visitors got "Site not found". It was propagation lag from an already-reverted change.

**What happened:** apex `A` → `75.2.60.5` (Netlify's shared IP) while no Netlify site had the domain
added, so Netlify's generic "Site not found" page was served. `www` was still correctly on
`cname.manus.space`. Cutover wasn't approved yet (it's gated on Tony/Darryl/Kimberly's sign-off).

**Resolution:** the zone was already fixed. The apex uses an `ALIAS` → `cname.manus.space`, same as
`www`. Cloudflare (1.1.1.1) already resolved it to Manus. Google (8.8.8.8) still served the stale
`A` record (TTL 14400s) until it expired. No further change was needed. Nameservers:
`ns1/ns2.dns-parking.com`. The zone also has `flow` → a Netlify preview and a `legacy` A record.

**How to apply:** never assume "the migration is done" for this domain. Check apex and `www`
separately with `dig`, against more than one resolver (`@1.1.1.1`, `@8.8.8.8`), and compare with
the record's TTL before deciding the zone is wrong. DNS changes are outside the repo and need
explicit sign-off.
