# Technical Brief for Darryl (Webmaster)

**From:** Tony Greenberg  
**Re:** Domain visibility, CMS workflow, GitHub sync, and token optimization  
**Date:** May 26, 2026  
**Priority:** High

---

## 1. Problem: manus.space Domains Are Still Publicly Visible

### Current State

The site is deployed to four domains:

| Domain | Intended Purpose | Current Status |
|--------|-----------------|----------------|
| `tonygreenberg.com` | **Production (public)** | Correct |
| `www.tonygreenberg.com` | Production redirect | Correct |
| `tonygreenberg.manus.space` | CMS/staging only | **Problem: still publicly accessible** |
| `tonygreenb-gxhndhxp.manus.space` | Internal dev | **Problem: still publicly accessible** |

### What's Been Done (Server-Side)

A 301 redirect has been implemented in the Express server (`server/_core/index.ts`) that redirects any request to a `.manus.space` domain to `https://tonygreenberg.com`. This works when the server handles the request.

### What Still Needs to Happen (Infrastructure Level)

The Manus platform's CDN/edge layer may be serving the manus.space domains **before** the request reaches the Express server (e.g., via a static cache or edge function). Darryl needs to:

1. **Remove or disable** `tonygreenberg.manus.space` and `tonygreenb-gxhndhxp.manus.space` from the Manus project's domain settings (Settings → Domains in the Management UI), OR
2. **Confirm** that the 301 redirect is being respected at the edge level and not cached/bypassed
3. **Verify** that search engines are not indexing the manus.space URLs (check Google Search Console for any indexed manus.space pages and submit removal requests)

### Why This Matters

- Duplicate content across domains hurts SEO
- Tony uses manus.space as a **private CMS/staging environment** — it should never be public
- The canonical domain is exclusively `tonygreenberg.com`

---

## 2. Architecture Request: Cheaper Editing Workflow

### Current Workflow (Expensive)

```
Tony writes/edits in Manus AI chat → Manus rebuilds/redeploys → Published to tonygreenberg.com
```

**Problem:** Every edit (even a typo fix) costs AI tokens because the full agent loop runs.

### Desired Workflow (Token-Efficient)

```
Option A: Direct GitHub editing
Tony edits files in GitHub → Auto-deploys to tonygreenberg.com

Option B: Headless CMS (Sanity, etc.)
Tony edits content in Sanity Studio → Webhook triggers rebuild → Deploys to tonygreenberg.com

Option C: Manus Visual Editor (already available)
Tony uses the Visual Editor in the Management UI Preview panel → Makes CSS/text changes directly → Saves as new checkpoint
```

### Recommendation

**Phase 1 (Immediate):** Use the Manus Visual Editor for simple text/color/spacing changes. It's already available in the Management UI → Preview panel. Select any element, edit text inline, adjust colors/padding visually. No tokens consumed.

**Phase 2 (Short-term):** Set up GitHub-based editing:
- The project is already synced to GitHub (remote: `user_github`)
- Tony can edit `client/src/data/blogData.json` or any `.tsx` file directly in GitHub
- On push to `main`, Manus auto-deploys
- This costs zero AI tokens for content edits

**Phase 3 (If needed):** Sanity CMS integration:
- Sanity IS compatible with vibe coding (it has an AI-assisted content studio)
- Would require migrating blog content from `blogData.json` to Sanity's structured content
- Adds complexity but gives Tony a proper editorial interface
- Estimated effort: 8-12 hours of development

### Sanity CMS Compatibility Note

Sanity Studio v3 supports AI-assisted editing ("Sanity AI Assist") which is essentially vibe coding for content. Tony could dictate or describe changes and Sanity would structure them. However, the current architecture (static JSON + React components) is simpler and already works with GitHub direct editing.

---

## 3. GitHub Sync — Current State

### What's Working

| Component | Status |
|-----------|--------|
| Git remote `user_github` | Configured and authenticated |
| Auto-sync on checkpoint | Working (pushes to `main`) |
| Pull from GitHub | Working (on checkpoint save) |
| Conflict detection | Working (aborts on conflict) |

### What Tony Wants

Tony should be able to:
1. Log into GitHub
2. Edit files directly (blog posts, images, text content)
3. Push to `main`
4. Site auto-deploys without opening Manus

### What Darryl Needs to Verify

1. **GitHub Actions or Manus webhook:** Confirm that pushes to `main` from GitHub (not from Manus) trigger a redeploy. If not, set up a GitHub Action that hits the Manus deploy webhook.
2. **Branch protection:** Ensure `main` is not protected in a way that blocks Tony's direct edits.
3. **File structure documentation:** Provide Tony with a cheat sheet:
   - Blog posts: `client/src/data/blogData.json`
   - Standalone articles: `client/src/pages/AkbarEssay.tsx`, etc.
   - Images: Upload to S3 via `manus-upload-file --webdev`, reference via `/api/img/filename`
   - Styles: `client/src/index.css`

---

## 4. Token Optimization Summary

| Action | Token Cost | Alternative |
|--------|-----------|-------------|
| Full article rewrite via Manus | High ($$$) | Use for creative/structural work only |
| Typo/text fix | Medium ($$) | Edit in GitHub directly (free) |
| Color/spacing change | Medium ($$) | Use Visual Editor (free) |
| Image swap | Medium ($$) | Upload to S3, edit path in GitHub (free) |
| New blog post | High ($$$) | Draft in Manus, future edits in GitHub |
| SEO/meta changes | Low ($) | Edit in GitHub directly (free) |

### Rule of Thumb

- **Use Manus** for: New articles, structural redesigns, new features, complex debugging
- **Use GitHub** for: Text edits, image swaps, metadata updates, blog post additions
- **Use Visual Editor** for: Quick CSS tweaks, color changes, spacing adjustments

---

## 5. Action Items for Darryl

- [ ] Remove or privatize `tonygreenberg.manus.space` and `tonygreenb-gxhndhxp.manus.space` from public access (Settings → Domains)
- [ ] Verify GitHub → Manus auto-deploy pipeline works when Tony pushes directly to `main`
- [ ] Submit Google Search Console removal requests for any indexed manus.space URLs
- [ ] Provide Tony with GitHub editing cheat sheet (file locations, image upload process)
- [ ] Test the 301 redirect from manus.space → tonygreenberg.com in multiple browsers
- [ ] Confirm the Visual Editor is accessible and working for Tony in the Management UI
- [ ] Document the S3 image upload process for non-Manus workflows

---

## 6. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CONTENT SOURCES                        │
├──────────────┬──────────────────┬────────────────────────┤
│ Manus AI     │ GitHub Direct    │ Visual Editor          │
│ (creative)   │ (text/content)   │ (CSS/layout)           │
│ $$$ tokens   │ FREE             │ FREE                   │
└──────┬───────┴────────┬─────────┴───────────┬────────────┘
       │                │                     │
       ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│                    GitHub (main branch)                   │
└──────────────────────────┬──────────────────────────────┘
                           │ auto-deploy
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Manus Build & Deploy Pipeline                │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              tonygreenberg.com (PRODUCTION)               │
│              ← ONLY public-facing domain                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│    tonygreenberg.manus.space (PRIVATE - CMS only)        │
│    → 301 redirect to tonygreenberg.com                   │
│    → Should be removed from public DNS entirely          │
└─────────────────────────────────────────────────────────┘
```

---

**End of brief. Questions → tony@tonygreenberg.com**
