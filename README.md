# bws-site-assets

Source of truth for the Big Wolf Solutions website (bigwolfsolutions.com), built on GoHighLevel.

Maintained by Happy Path Marketing.

## How the site is put together

| Piece | Lives in | How it reaches the live site |
|---|---|---|
| Nav, footer, styles, scripts | `partials/`, `css/`, `js/` | Loaded **live** from this repo via jsDelivr. Push to `main` and every page updates (a GitHub Action purges the CDN cache automatically). |
| Page content | One `.html` file per page (root of repo) | **Pasted** into that page's custom code block in GHL. Kept in the page HTML (not loaded by JavaScript) so search engines and AI search tools can read it. |

## Workflow rules

1. **Edit here first.** Every change goes into this repo, then gets copied to GHL.
2. **Paste the whole file.** Replace the entire GHL code block with the full file, never hand-edit a few lines in GHL.
3. **Never edit page code directly in GHL.** The repo would fall out of date and the next paste would wipe the change.
4. **Check in incognito** after every paste.

To copy a file: open it on GitHub, click the **Copy raw file** icon (top right of the code view), paste over the whole GHL code block, save.

## Page → file map

The file name matches the page's URL slug. The `<title>` on line 6 of each file matches the live page's browser tab.

| Live page | File to paste |
|---|---|
| `/` (home) | `homepage.html` |
| `/about` | `about.html` |
| `/testimonials` | `testimonials.html` |
| `/schedule` | `schedule.html` |
| `/business-in-a-box` | `business-in-a-box.html` |
| `/r-d-tax-credits` | `r-d-tax-credits.html` |
| `/settlement-recovery` | `settlement-recovery.html` |
| `/unclaimed-property` | `unclaimed-property.html` |
| `/merchant-services` | `merchant-services.html` |
| `/supplemental-health` | `supplemental-health.html` |
| `/payroll-health` | `payroll-health.html` |
| `/bookkeeping` | `bookkeeping.html` |
| `/commercial-insurance` | `commercial-insurance.html` |
| `/personal-insurance` | `personal-insurance.html` |
| `/referral-partner` | `referral-partner.html` |
| `/agents` | `agents.html` |
| `/cce` | `cce.html` |

Not pasted anywhere: `partials/`, `css/`, `js/` (load automatically) and `.github/` (automation).

When adding a new page: create `<slug>.html` here, add a row to this table, then create the GHL page with the same slug. If it should appear in the menu, add it to `partials/header.html` (desktop and mobile lists).

## History

Copied from `jaredcordell/bws-site-assets` in Nov 2026 with full commit history. All CDN references now point to `murv-source/bws-site-assets`. GHL pages are switched over by pasting each file fresh from this repo.

Full GHL setup details (head code, header/footer placeholders, gotchas): [`partials/GHL-SETUP.md`](partials/GHL-SETUP.md)
