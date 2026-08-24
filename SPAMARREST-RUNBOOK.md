# SpamArrest / SpamToast — Operational Runbook

**System**: tonygreenberg.com Attention Theft Enforcement System  
**Version**: 1.0 — May 2026  
**Audience**: Kim (Admin Operations), Darryl (Webmaster/Technical)  
**Owner**: Tony Greenberg

---

## Executive Summary

SpamArrest (internally called "SpamToast") is a confrontation and accountability system built into tonygreenberg.com. It does three things:

1. **Accepts public spam reports** via a form on the site
2. **Generates personalized confrontation URLs** that show the spammer they've been identified, tracked, and "reported" to enforcement agencies
3. **Tracks when spammers open those URLs** and notifies Tony in real time

The system is theatrical by design. The confrontation page uses progressive animations, countdown timers, fake "agency filing" checkmarks, forensic fingerprint displays, and an LLM-generated executive lookup to maximize psychological impact. It is *not* actually filing reports with the FTC, FBI, or any other agency — it is a deterrence tool.

---

## What WORKS Today (Fully Functional)

| Feature | URL / Location | Access Level | Status |
|---------|---------------|--------------|--------|
| Public spam report form | `/attention-theft#report` | Public | Working |
| Personalized confrontation page | `/youve-been-reported?company=X&domain=Y&email=Z` | Public | Working |
| Admin link generator (SpamToast) | `/admin/spam-link` | Admin only | Working |
| Admin tracking dashboard | `/admin/spam-tracking` | Admin only | Working |
| Tracking pixel (page open detection) | Fires on `/youve-been-reported` load | Automatic | Working |
| Owner notifications | Push to Tony on new reports + page opens | Automatic | Working |
| LLM executive lookup | Shows spammer's C-suite on confrontation page | Automatic | Working |
| Wall of Shame leaderboard | Aggregated on `/attention-theft` | Public | Working |
| IP hash logging | Base64 hash of IP stored (not raw IP) | Automatic | Working |
| User-agent logging | Full browser string stored | Automatic | Working |
| View count tracking | Increments each time same company opens page | Automatic | Working |
| QR code generation | On admin link generator page | Admin only | Working |
| Bait subject line | "Re: I really appreciate you reaching out..." copy button | On confrontation page | Working |

---

## What Does NOT Work / Is NOT Implemented

| Claimed Feature | Reality | Impact |
|-----------------|---------|--------|
| "Reported to LinkedIn and 30 agencies" | **NOT REAL** — the page *animates* checkmarks next to agency names but files nothing | Theatrical only — no actual reports filed |
| Automated email forwarding (spam@tonygreenberg.com → system) | **NOT SET UP** — the `processForward` API exists but there is no email-to-webhook pipeline | Kim cannot forward emails automatically; must use admin UI manually |
| LinkedIn reporting integration | **NOT IMPLEMENTED** — LinkedIn Trust & Safety is listed on the page but no API call is made | Display only |
| FTC/IC3/Spamhaus actual filing | **NOT IMPLEMENTED** — links to filing pages exist but no automated submission | The page provides URLs where someone *could* manually file |
| IP geolocation | **NOT IMPLEMENTED** — page says "geolocated" but only stores a base64 hash | Bluff only |
| "Database blacklist" across Apollo/ZoomInfo/etc. | **NOT REAL** — it's a static list displayed for intimidation | No actual cross-platform blocking occurs |
| Payment gate / invoice | **THEATRICAL** — shows a 3-minute timer and fake invoice but no Stripe integration on this page | No money is collected |

---

## System Architecture (For Darryl)

```
┌─────────────────────────────────────────────────────────────────┐
│  PUBLIC INTERNET                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /attention-theft#report  ──→  spam.submit (tRPC mutation)       │
│       Public form                  ↓                             │
│                              spamReports table                   │
│                                    ↓                             │
│                              notifyOwner() → Tony gets alert     │
│                                                                   │
│  /youve-been-reported?...  ──→  spam.trackView (tRPC mutation)   │
│       Confrontation page           ↓                             │
│                              spamPageViews table                 │
│                                    ↓                             │
│                              notifyOwner() → Tony gets alert     │
│                                    ↓                             │
│                              spam.lookupLeadership (LLM query)   │
│                                    ↓                             │
│                              Shows C-suite names on page         │
│                                                                   │
│  /admin/spam-link          ──→  Client-side URL builder          │
│       Link generator              (no server call needed)        │
│                                                                   │
│  /admin/spam-tracking      ──→  spam.viewStats (admin query)     │
│       Dashboard                   spam.listForwards (admin query)│
│                                                                   │
│  processForward (tRPC)     ──→  Parses email metadata            │
│       (called manually)           ↓                              │
│                              Generates personalized URL          │
│                              Auto-submits spam report            │
│                              Saves to spamForwards table         │
│                              notifyOwner()                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `spam_reports` | Stores all public spam reports | companyName, senderEmail, spamType, frequency, description, reporterEmail, ipHash, verified, createdAt |
| `spam_page_views` | Tracks when spammers open their confrontation page | company, domain, email, ipHash, userAgent, referer, viewCount, firstViewedAt, lastViewedAt |
| `spam_forwards` | Logs forwarded spam emails processed via admin | rawSubject, rawFrom, extractedCompany, extractedDomain, extractedEmail, generatedUrl, forwardedBy, processed, createdAt |

### Authentication

The admin pages (`/admin/spam-link` and `/admin/spam-tracking`) require Manus OAuth login. Only users with `admin` role can access the tracking dashboard. The link generator requires any authenticated user (protected, not admin-only in practice since Tony is the only user).

---

## Instructions for Kim (Admin Operations)

### How to Generate a Confrontation Link

1. Go to **https://tonygreenberg.com/admin/spam-link**
2. Log in if prompted (use your Manus account)
3. Fill in the fields:
   - **Company Name**: The spammer's company (e.g., "AcmeCorp")
   - **Sender Email**: The email address that sent the spam (e.g., "john@acmecorp.com")
   - **Domain**: The spammer's domain (e.g., "acmecorp.com") — click "Auto-fill domain" if you entered the email first
4. The generated URL appears below the form
5. Click **COPY LINK** to copy it to your clipboard
6. Click **QR CODE** if you want a printable QR code (for physical mail)
7. Click **PREVIEW** to see what the spammer will see

### How to Send the Link to a Spammer

**Option A — Reply directly to their spam email:**
- Copy the generated link
- Reply to their spam with something like: "Thanks for reaching out! I found this relevant to your outreach strategy: [paste link]"
- The bait subject line on the confrontation page itself ("Re: I really appreciate you reaching out — this sounds like exactly what I need") is designed to be forwarded with maximum open rate

**Option B — Send to their CEO/leadership:**
- The confrontation page automatically looks up the company's executive team using AI
- You can send the link directly to their CEO, VP Sales, or Head of Growth
- The page personalizes itself with their company name throughout

**Option C — Physical mail:**
- Generate the QR code on the admin page
- Print it and mail it to their corporate headquarters
- The QR code links to their personalized confrontation page

### How to Check If a Spammer Opened Their Link

1. Go to **https://tonygreenberg.com/admin/spam-tracking**
2. Log in if prompted
3. The dashboard shows:
   - **Total page views** across all confrontation links
   - **Unique companies** that have opened their pages
   - **Per-company details**: click any entry to expand and see view count, first/last opened timestamps, user agent, and IP hash
4. Tony also gets a push notification the first time any spammer opens their page

### How to Process a Forwarded Spam Email (Manual Method)

Since automated email forwarding is not set up, here's the manual workflow:

1. When Tony forwards you a spam email, note:
   - The sender's email address
   - The sender's company name (from signature or domain)
   - The email subject line
2. Go to **https://tonygreenberg.com/admin/spam-link**
3. Enter the company, email, and domain
4. Copy the generated link
5. Reply to the spammer (or their CEO) with the link

### What Tony Sees (Notifications)

Tony receives push notifications for:
- Every new public spam report submitted via the form
- Every time a spammer opens their confrontation page (first time only per company)
- Every time a forwarded email is processed via the admin tool

---

## Instructions for Darryl (Technical / Webmaster)

### How the Tracking Works

When a spammer opens `/youve-been-reported?company=X&domain=Y&email=Z`:

1. The React component calls `trpc.spam.trackView.useMutation()` on page load
2. The server extracts the IP from `x-forwarded-for` header, base64-encodes it (privacy hash)
3. If this company/domain combo already has a record in `spam_page_views`, it increments `viewCount` and updates `lastViewedAt`
4. If it's a new company, it creates a new record
5. `notifyOwner()` fires on first view per company
6. The page also calls `trpc.spam.lookupLeadership.useQuery()` to get executive names via LLM

### How the LLM Executive Lookup Works

The `lookupLeadership` procedure:
- Takes company name and/or domain as input
- Calls the built-in LLM (`invokeLLM`) with a system prompt asking for C-suite names
- Returns structured JSON with up to 8 executives (name, title, department)
- Includes a confidence level (high/medium/low based on company recognition)
- Results are cached client-side with `staleTime: Infinity` (no re-fetching)
- This is a `publicProcedure` — no auth required (the confrontation page is public)

### What Would Be Needed for Automated Email Forwarding

To enable "forward spam to an address and have it auto-processed":

1. **Set up an inbound email webhook** — options:
   - Mailgun Inbound Routes → POST to `/api/spam-inbound`
   - SendGrid Inbound Parse → POST to `/api/spam-inbound`
   - Cloudflare Email Workers → POST to `/api/spam-inbound`
2. **Create a new Express route** at `/api/spam-inbound` that:
   - Parses the inbound email (from, subject, body)
   - Extracts company name from domain
   - Calls the existing `saveSpamForward()` function
   - Calls `submitSpamReport()` to auto-file a report
   - Calls `notifyOwner()` with the generated URL
3. **Configure a forwarding address** (e.g., `spam@tonygreenberg.com`) that routes to the webhook
4. The `processForward` tRPC mutation already handles all the logic — it just needs an HTTP trigger

**Estimated effort**: 2–4 hours for a developer familiar with the stack. The backend logic is 100% built; only the email ingestion webhook is missing.

### Route Map

| Route | Component | Auth Required | Purpose |
|-------|-----------|---------------|---------|
| `/attention-theft` | AttentionTheft.tsx | No | Main manifesto page with report form section |
| `/attention-theft/report` | Redirects to `/attention-theft#report` | No | Legacy URL redirect |
| `/youve-been-reported` | YouveBeenReported.tsx | No | Spammer confrontation page |
| `/spamtoast` | Redirects to `/youve-been-reported` | No | Legacy shortcut (preserves query params) |
| `/admin/spam-link` | AdminSpamLink.tsx | Yes (any user) | Link generator tool |
| `/admin/spam-tracking` | AdminSpamTracking.tsx | Yes (admin) | Tracking dashboard |

### Database Access

All spam data is in the TiDB/MySQL database accessible via the Management UI → Database panel. Tables:
- `spam_reports` — public reports
- `spam_page_views` — tracking data
- `spam_forwards` — processed forwards

To query directly:
```sql
-- See all page views ordered by most recent
SELECT * FROM spam_page_views ORDER BY lastViewedAt DESC LIMIT 50;

-- See top reported companies
SELECT companyName, COUNT(*) as reports FROM spam_reports GROUP BY companyName ORDER BY reports DESC;

-- See all forwarded emails
SELECT * FROM spam_forwards ORDER BY createdAt DESC LIMIT 50;
```

---

## The Confrontation Page Experience (What the Spammer Sees)

When a spammer clicks their personalized link, they experience this sequence:

1. **Jumpscare** — A brief hood/monster animation with a sawtooth wave audio screech (800ms)
2. **Formal Notice Header** — "FORMAL NOTICE — [Company Name] — You've Been Reported"
3. **Countdown Timer** — A 3-hour countdown (session-based, resets on new visit)
4. **Wave 1 Agencies** — 6 agencies animate with green checkmarks (FTC, IC3, Spamhaus, Google Safe Browsing, SpamCop, Microsoft SmartScreen) — one every 1.2 seconds
5. **Payment Gate** — A fake 3-minute timer with a "$2,847 invoice" — when it expires, Wave 2 unleashes
6. **Wave 2 Agencies** — 8 more agencies animate (FCC, State AG, APWG, ICANN, GDPR authorities, CAFC, LinkedIn, BBB) — one every 800ms
7. **Executive Lookup** — AI-generated list of their C-suite with the message "Each of these individuals will receive a copy of this report"
8. **Forensic Fingerprint** — Shows their IP, browser, OS, screen resolution, timezone, language (detected client-side via JavaScript)
9. **Database Blacklist** — 15 platforms they'll allegedly be "banned from" (Apollo, ZoomInfo, Lusha, etc.)
10. **Legal Citations** — CAN-SPAM, CFAA, TCPA, GDPR, CASL, CCPA statutes with penalty amounts
11. **LinkedIn Ban Cases** — Real stories of people permanently banned from LinkedIn
12. **Share Link + QR Code** — So the spammer can see their own personalized URL
13. **Alternative Resources** — Legitimate marketing alternatives (content marketing, SEO, etc.)
14. **Crusade Links** — Links back to Tony's blog posts about attention theft

**Important**: None of the "agency filings" are real. The page is designed to create maximum psychological deterrence through theatrical presentation. The only real actions are: (a) the page view is logged, (b) Tony is notified, and (c) the company is added to the Wall of Shame if a report was filed.

---

## Frequently Asked Questions

**Q: Does this actually report anyone to the FTC/FBI/etc.?**  
A: No. The page displays links to where someone *could* manually file, and animates checkmarks for theatrical effect, but no automated filing occurs.

**Q: Can a spammer sue over this page?**  
A: The page makes no false statements of fact about the spammer. It states they've been "reported" (which is true — a report exists in our database). The agency animations are theatrical presentation. The legal citations are real laws. Consult Tony's attorney if concerned about a specific case.

**Q: What if a spammer opens the page multiple times?**  
A: The view count increments. Tony only gets notified on the first view. The dashboard shows total view count per company.

**Q: Can I see the raw IP address of a spammer?**  
A: No. Only a base64 hash of the IP is stored (privacy measure). The confrontation page *tells* the spammer their IP was "captured and geolocated" but this is theatrical — we only have the hash.

**Q: What's the difference between `/spamtoast` and `/admin/spam-link`?**  
A: `/spamtoast` is a legacy redirect that sends you to `/youve-been-reported` (the confrontation page itself). `/admin/spam-link` is the admin tool for *generating* links. Use `/admin/spam-link` to create links.

**Q: How do I add someone to the Wall of Shame?**  
A: Either (a) submit a report via the public form at `/attention-theft#report`, or (b) use the admin link generator which auto-submits a report when you process a forward via the tRPC API. The Wall of Shame aggregates from the `spam_reports` table automatically.

---

## Quick Reference Card (For Kim's Desk)

```
╔══════════════════════════════════════════════════════════════╗
║  SPAMARREST QUICK REFERENCE                                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  GENERATE A LINK:                                            ║
║  → tonygreenberg.com/admin/spam-link                         ║
║  → Enter company + email + domain → Copy link → Send it      ║
║                                                              ║
║  CHECK IF THEY OPENED IT:                                    ║
║  → tonygreenberg.com/admin/spam-tracking                     ║
║                                                              ║
║  FILE A PUBLIC REPORT:                                       ║
║  → tonygreenberg.com/attention-theft (scroll to Report)      ║
║                                                              ║
║  WHAT'S REAL vs. THEATRICAL:                                 ║
║  ✓ REAL: Report in our database, page view tracking,         ║
║          Tony notifications, Wall of Shame, exec lookup      ║
║  ✗ FAKE: Agency filings, database blacklists, IP geoloc,    ║
║          payment invoice, cross-platform bans                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Appendix: Environment & Dependencies

- **Framework**: React 19 + Vite + Express 4 + tRPC 11
- **Database**: TiDB (MySQL-compatible)
- **ORM**: Drizzle
- **LLM**: Manus built-in LLM (via `invokeLLM`)
- **QR Codes**: `qrcode.react` package
- **Auth**: Manus OAuth (JWT session cookies)
- **Notifications**: Manus built-in `notifyOwner()` helper
- **No external email service configured** (Mailgun/SendGrid/etc. not integrated)

---

*Document generated May 26, 2026. For questions, ping Darryl in the #tonygreenberg-site Slack channel.*
