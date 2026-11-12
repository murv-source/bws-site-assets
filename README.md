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

The file name matches the page's URL slug. Page files don't carry their own `<title>` or meta description: each GHL page's SEO settings own the title, description and canonical, so the live page has exactly one of each. Exception: `cce.html` keeps its own title and description because the /cce page has no GHL SEO settings filled in.

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
| `/business-data-monetization` | `business-data-monetization.html` |
| `/class-action-settlements` | `class-action-settlements.html` (generated, see Class action settlements below) |
| `/page-not-found` (set as the domain's 404 page in GHL) | `404.html` (carries its own `noindex`; don't add a second robots tag in GHL) |

### Blog

Blog pages live in `blog/`. Their SEO title, description and canonical are set in each GHL page's SEO settings, not in the file.

| Live page | File to paste |
|---|---|
| `/blog` | `blog/index.html` (to add a post card, edit the `POSTS` list) |
| `/blog/rd-credit-eligibility` | `blog/rd-credit-eligibility.html` |
| `/blog/reading-your-statement` | `blog/reading-your-statement.html` |
| `/blog/unclaimed-settlement-funds` | `blog/unclaimed-settlement-funds.html` |
| `/blog/health-insurance-2026` | `blog/health-insurance-2026.html` |
| `/blog/rd-tax-credit-misconceptions` (GHL page: `/7-rd-tax-credit-misconceptions-that-keep-businesses-from-claiming`) | `blog/rd-tax-credit-misconceptions.html` |
| `/blog/up-what-and-why` (GHL page: `/7-rd-tax-credit-misconceptions-that-keep-businesses-from-claiming-555678`) | `blog/up-what-and-why.html` |
| `/blog/benefits-payroll-taxes` (GHL page: `/same-employees-same-paychecks-a-different-strategy-how-benefits-and-payroll-taxes-connect`) | `blog/benefits-payroll-taxes.html` |

Post files don't carry their own `<title>` or meta description, and the script doesn't set `document.title`. GHL's SEO settings own those, so there's exactly one of each on the live page. The BlogPosting schema reads its description from that SEO meta. To write a new post, copy any post file and edit only the `POST` and `CONTENT` blocks.

### Class action settlements

Hub: `/class-action-settlements` lists every active business case from the FRS list (frsco.com/class-actions). Case pages answer "can my business claim?" for the cases worth ranking for. **These files are generated. Edit the data, then run the build; never hand-edit the generated HTML.**

| Live page | File to paste | GHL SEO title | GHL SEO description |
|---|---|---|---|
| `/class-action-settlements` | `class-action-settlements.html` | Class Action Settlements for Businesses \| Big Wolf Solutions | Search active class action settlements your business may be able to claim: card fees, food, construction, health plans and more. Free eligibility check. |
| `/emv-chip-settlement` | `class-actions/emv-chip-settlement.html` | EMV Chip Settlement for Merchants \| Big Wolf Solutions | The $231.7M EMV chip settlement pays merchants that absorbed fraud liability shift chargebacks from 2015 to 2017. See who qualifies and get a free claim review. |
| `/deere-repair-settlement` | `class-actions/deere-repair-settlement.html` | John Deere Repair Settlement: File by Dec 31 \| Big Wolf | The $99M John Deere repair settlement pays farms and businesses that bought dealer repairs on large Deere ag equipment from 2018 to 2026. Claim deadline Dec 31. |

These files carry their own JSON-LD schema (FAQPage + ItemList on the hub; Article + FAQPage + BreadcrumbList on case pages). Title, description and canonical come from GHL SEO settings like every other page.

**Files**
- `data/class-actions.json`: every FRS case. Fields: `name`, `slug`, `industry` (key from `industries`), `region` (US/Canada/Australia), `audience` (business/consumer), `class_type` (shown as "Who can claim"), `deadline` (YYYY-MM-DD or null), `status_override` (null, `open`, `confirm` or `closed`), `page` (live case page slug), `planned_page` (slug reserved for a future case page), `needs_review`, plus `last_synced`.
- `data/class-action-pages/<slug>.json`: the copy for one case page (h1, answer-first summary, key facts, sections, FAQs, sources). Write it in our own words; never copy FRS or news text.
- `class-actions/_template.html`: case page layout.
- `scripts/build_class_actions.py`: builds the hub table, filter options, count and schema, and every case page.

**Status rules** (unless `status_override` is set): deadline today or later = `open`; no deadline listed = `confirm` (shown as "Ask us"); deadline passed = `closed` (hidden from the hub). The hub shows only US cases with a business audience. A case with its own page is never deleted: when it closes, the page shows Closed and stays live.

**Monthly update** (a scheduled task does steps 1 to 4 on the 1st of each month and leaves a branch plus a FUPS task for Murv):
1. Compare the FRS list to `data/class-actions.json`; add, update deadlines, set `last_synced`.
2. `python3 scripts/build_class_actions.py`
3. For a new case page: add `data/class-action-pages/<slug>.json`, set the case's `page` to the slug, rebuild.
4. Commit on a branch for review.
5. After merging: paste the changed files into GHL. For a new case page, create the GHL page with the same slug, fill its SEO title/description/canonical, add a row to the table above, add it to the sitemap and `llms.txt`.

Planned first-wave case pages (see `planned_page` in the data): Apple Pay merchant fees, Google and Facebook advertising, FedEx and UPS tariffs, Smartphone AI, Construction Equipment Rental, Multiplan, Invisalign. RealPage was dropped: its class is renters, not businesses.

### Policies (GHL website "Policies-Disclosures")

These pages use their own standalone layout (no shared header/footer). Title, description and canonical are set in GHL SEO settings.

| Live page | File to paste |
|---|---|
| `/privacy-policy` | `policies/privacy-policy.html` |
| `/terms-of-service` | `policies/terms-of-service.html` |
| `/sms-program` | `policies/sms-program.html` |

The published phone number is (844) 443-0482 (confirmed by Nick, Nov 2026). No street address appears anywhere on the site: Big Wolf is a service-area business serving clients nationwide.

Not pasted anywhere: `partials/`, `css/`, `js/` (load automatically) and `.github/` (automation).

When adding a new page: create `<slug>.html` here, add a row to this table, then create the GHL page with the same slug. If it should appear in the menu, add it to `partials/header.html` (desktop and mobile lists).

## History

Copied from `jaredcordell/bws-site-assets` in Nov 2026 with full commit history. All CDN references now point to `murv-source/bws-site-assets`. GHL pages are switched over by pasting each file fresh from this repo.

Full GHL setup details (head code, header/footer placeholders, gotchas): [`partials/GHL-SETUP.md`](partials/GHL-SETUP.md)
