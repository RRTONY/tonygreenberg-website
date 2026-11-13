# legacy.tonygreenberg.com blank site + domain cutover (2026-11-13)

> The old WordPress site, kept as a backup at legacy.tonygreenberg.com on Hostinger, showed blank
> pages because its parent theme (Foxiz, paid) was missing. Fixed by switching to the free Astra
> theme. On the same day the main domain moved from Hostinger to Netlify, which caused a redirect to
> legacy and a certificate warning in some browsers.

## Setup (as of 2026-11-13)

| Name | DNS record (Hostinger, `ns1/ns2.dns-parking.com`) | Serves |
|---|---|---|
| `tonygreenberg.com` | ALIAS → `apex-loadbalancer.netlify.com` (75.2.60.5, 99.83.231.61) | New Next.js site on Netlify, primary domain |
| `www` | CNAME → `tonygreenberg-website.netlify.app` | Netlify, redirects to the apex |
| `legacy` | ALIAS → `legacy.tonygreenberg.com.cdn.hstgr.net` | Old WordPress backup on Hostinger, folder `public_html` |
| `dev` | A → 156.67.75.198 | Hostinger, folder `public_html/dev` |
| `flow` | CNAME → `jolly-travesseiro-c2faf8.netlify.app` | Separate Netlify project |
| MX / SPF / DKIM / DMARC / Resend | unchanged | Titan email + Resend; never touch |

Owner decision: **keep legacy.tonygreenberg.com as a backup site**, don't delete it.

## Root cause of "tonygreenberg.com is down"

On 2026-11-04 the domain was already on Netlify ([project_go_live_record](project_go_live_record.md):
apex A → 75.2.60.5, `www` → `tonygreenberg-website.netlify.app`). **Some time after that, `@` and
`www` were changed back to Hostinger's CDN** (`tonygreenberg.com.cdn.hstgr.net`), most likely by
accepting hPanel's "connect domain / domain not pointing to Hostinger" fix or while setting up the
`legacy` subdomain. Hostinger issued itself a tonygreenberg.com certificate at **2026-11-13 15:51
UTC**, which dates when traffic reached Hostinger (that's when the main domain went down).
Visitors then hit the WordPress install, which (a) redirects to `legacy.tonygreenberg.com` because
that's its site address, and (b) rendered **blank pages** because its Foxiz parent theme was
missing. Net effect: the main site looked down. DNS was pointed back to Netlify on 2026-11-13
(before 17:14 UTC), Netlify re-verified the domain ("Netlify DNS propagating…"), and the main site
has served normally since (verified 17:14, 17:39 and 17:43 UTC). Browsers that cached the Hostinger
address during that window keep failing (wrong site, or `ERR_CERT_DATE_INVALID` if their clock was
behind the 15:51 UTC certificate) until their DNS cache clears.

**Prevention:** never let hPanel "fix" or "connect" tonygreenberg.com; the apex and `www` records
must stay on Netlify. Re-check with `dig` after any Hostinger change.

## Timeline

1. **Before (bad state, from some time after 2026-11-04 until 2026-11-13):** `@` and `www` pointed to Hostinger (`tonygreenberg.com.cdn.hstgr.net`,
   `www.tonygreenberg.com.cdn.hstgr.net`). The WordPress site's address is
   `https://legacy.tonygreenberg.com`, so WordPress redirected visitors on tonygreenberg.com to legacy.
   That was the "tonygreenberg.com redirects to legacy" report.
2. **DNS switched** to Netlify for `@` and `www` (TTL 300 on the old records, so it spread fast).
   Netlify showed "Netlify DNS propagating…" for a while, which is normal. Checked 17:14–17:39 UTC
   against 8.8.8.8, 1.1.1.1 and 9.9.9.9: all resolve to Netlify, with no redirect to legacy.
3. **Legacy site blank:** every front-end URL returned `200` with a **0-byte body**, while
   `/wp-login.php`, `/wp-admin`, `/wp-json/` and the sitemaps worked. wp-admin → Themes showed:
   *"The parent theme is missing. Please install the 'foxiz' parent theme."* The active theme was
   **Foxiz child** (Theme-Ruby, ThemeForest), and the `wp-content/themes/foxiz` folder was gone. Its
   plugins (Foxiz Core, Elementor) were also absent. Most likely they were lost when the site was
   moved onto the `legacy` subdomain.
4. **Fix:** owner chose a free theme, so **Astra** was installed and activated. Content is plain
   HTML (no Foxiz/Elementor shortcodes, only a stray `[mc` and `[li_` in text), so nothing was lost
   except the design.
5. **Verified 17:39 UTC:** homepage 200, 186 KB, title "Tony Greenberg – The Technologist's Guide to
   Trust, Tech, Life and Society", Astra assets loading; **all 114 sitemap URLs (88 posts + 26 pages)
   return 200 with content.** WordPress 7.1.4.
6. **Certificate warning:** a laptop showed `NET::ERR_CERT_DATE_INVALID` on
   https://tonygreenberg.com. Both server certificates were valid at 17:40 UTC:
   - Netlify: Let's Encrypt YE1, valid 2026-10-23 → 2027-01-21 (covers apex + www)
   - Hostinger (old target): Let's Encrypt YE2, **issued 2026-11-13 15:51 UTC** → 2027-02-11

   The server isn't at fault. Most likely causes, in order: (a) that computer's clock or date is wrong;
   (b) that computer still had the old Hostinger address cached and reached a certificate issued only
   minutes earlier, while its clock was behind. Fix on that computer: set date/time to automatic,
   flush DNS (`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`), restart the browser,
   and test in a private window or on phone data.

## Full check (2026-11-13, ~17:50 UTC)

- Main site: **533/533 sitemap URLs return 200** (`/find-your-spirit` timed out once in a 12-way
  parallel sweep, then 200 in ~1 s on three retries). http→https and www→apex redirects correct.
  PRI pages 307 to psychedelicreadiness.com as intended (PR #49); `/pri-research` 200.
- Legacy: **114/114 URLs 200 with content**, theme Astra.
- Certificates valid: apex/www to 2027-01-21 (Netlify), legacy to 2027-01-09, flow to 2026-12-28,
  dev to 2027-02-11 (issued 2026-11-13 15:54 UTC, same window as the apex Hostinger cert).
- Email DNS intact: MX Titan 10/20, SPF, DMARC `p=none`, Titan + Resend DKIM, `send` CNAME.
- `dev.tonygreenberg.com` 301s (WordPress, LiteSpeed) to legacy.tonygreenberg.com: the `dev` folder
  is inside the WordPress `public_html`, so WordPress answers it. Harmless; delete the `dev`
  subdomain and record if it's not used.

## Still open / to do in Hostinger or WordPress

- [ ] Legacy WordPress: **Settings → Reading → "Discourage search engines"** (74 of its 88 posts
      duplicate posts on tonygreenberg.com, so it shouldn't compete in Google).
- [ ] Legacy WordPress: reassign the menu to Astra's **Primary Menu** location (Appearance → Menus).
- [ ] Legacy WordPress: delete the broken **Foxiz** and **Foxiz child** themes.
- [ ] Hostinger still has tonygreenberg.com set up as a website (it issued itself a new certificate
      on 2026-11-13). It's harmless while DNS points to Netlify, but **never accept hPanel's
      "domain not pointing to Hostinger / fix DNS" prompt**: it would move the site back to WordPress.
- [ ] 14 legacy posts don't exist on tonygreenberg.com under the same `/blog/<slug>` (for example
      `elixir`, `6-act-of-speech`, `fitness-fraud-dmn8-gym-trap`,
      `forever-chemicals-in-my-blood-what-i-learned-testing-for-pfas-and-microplastics`). Decide
      whether to port them. They stay readable on legacy meanwhile.

## How to check this again

```bash
dig +short @8.8.8.8 tonygreenberg.com; dig +short @1.1.1.1 legacy.tonygreenberg.com
curl -s -o /dev/null -w '%{http_code} %{size_download}\n' https://legacy.tonygreenberg.com/   # 0 bytes = theme broken again
echo | openssl s_client -servername tonygreenberg.com -connect tonygreenberg.com:443 2>/dev/null | openssl x509 -noout -dates
```

A `200` with an empty body on WordPress means a fatal PHP error with errors hidden; check
wp-admin → Themes first, then hPanel's error logs. See also
[project_tonygreenberg_dns_incident](project_tonygreenberg_dns_incident.md) for checking DNS across
resolvers.
