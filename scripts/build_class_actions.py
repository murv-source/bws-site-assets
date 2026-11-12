#!/usr/bin/env python3
"""
Build the Big Wolf class action pages from data. Maintained by Happy Path Marketing.

  python3 scripts/build_class_actions.py            # uses today's date
  python3 scripts/build_class_actions.py 2026-12-01 # or a given date

Reads:   data/class-actions.json            (every case on the FRS list)
         data/class-action-pages/<slug>.json (copy for each case page)
Writes:  class-action-settlements.html       (hub; only the marked blocks are replaced)
         class-actions/<slug>.html           (one static page per case page JSON)

Status rules (unless a case has status_override):
  open    -> deadline is today or later           (shown on hub)
  confirm -> no deadline listed                   (shown on hub as "Ask us")
  closed  -> deadline has passed                  (hidden from hub)
Only US cases with a business audience are shown on the hub.
Everything is written into the HTML (not built by JavaScript) so Google and AI
search tools can read it.
"""
import datetime as dt
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://bigwolfsolutions.net"
HUB_SLUG = "class-action-settlements"
TODAY = dt.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else dt.date.today()

e = lambda s: html.escape(str(s), quote=True)


def fmt_date(iso):
    d = dt.date.fromisoformat(iso)
    return f"{d.strftime('%b')} {d.day}, {d.year}"


def status_of(c):
    if c.get("status_override"):
        return c["status_override"]
    if not c.get("deadline"):
        return "confirm"
    return "open" if dt.date.fromisoformat(c["deadline"]) >= TODAY else "closed"


def replace_block(text, name, new):
    pat = re.compile(rf"(<!-- {name}:START -->)(.*?)(<!-- {name}:END -->)", re.S)
    if not pat.search(text):
        sys.exit(f"Marker {name} not found")
    return pat.sub(lambda m: m.group(1) + "\n" + new + "\n" + m.group(3), text)


def faq_from_html(text):
    """FAQ schema is built from the page's own <details> FAQ so the two never drift."""
    block = re.search(r'<div class="faq"[^>]*>(.*?)</div>\s*</div>\s*</section>', text, re.S)
    items = re.findall(r"<summary>(.*?)</summary>\s*(.*?)</details>", block.group(1), re.S) if block else []
    out = []
    for q, a in items:
        a_txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", a)).strip()
        out.append({"@type": "Question", "name": html.unescape(re.sub(r"<[^>]+>", "", q)).strip(),
                    "acceptedAnswer": {"@type": "Answer", "text": html.unescape(a_txt)}})
    return out


def jsonld(obj):
    return '<script type="application/ld+json">\n' + json.dumps(obj, indent=1, ensure_ascii=False).replace("</", "<\\/") + "\n</script>"


data = json.loads((ROOT / "data/class-actions.json").read_text())
industries = data["industries"]
cases = data["cases"]
for c in cases:
    c["_status"] = status_of(c)

page_files = sorted((ROOT / "data/class-action-pages").glob("*.json"))
pages = [json.loads(p.read_text()) for p in page_files]
page_by_case = {p["case_name"]: p for p in pages}

# ── HUB ────────────────────────────────────────────────────────────────
hub_path = ROOT / f"{HUB_SLUG}.html"
hub = hub_path.read_text()
shown = [c for c in cases if c["region"] == "US" and c.get("audience") == "business" and c["_status"] in ("open", "confirm")]
shown.sort(key=lambda c: (list(industries).index(c["industry"]), c["name"].lower()))

rows = []
for key, label in industries.items():
    group = [c for c in shown if c["industry"] == key]
    if not group:
        continue
    rows.append(f'      <tbody data-industry="{key}">\n        <tr class="ca-group"><th colspan="4" scope="colgroup">{e(label)}</th></tr>')
    for c in group:
        pg = page_by_case.get(c["name"])
        name = f'<a href="/{pg["slug"]}">{e(c["name"])}</a>' if pg else e(c["name"])
        if c["_status"] == "open":
            st = f'<span class="ca-st open">Open</span> Deadline {fmt_date(c["deadline"])}'
        else:
            st = '<span class="ca-st confirm">Ask us</span> Status varies'
        action = f'<a href="/{pg["slug"]}">Details</a>' if pg else '<a href="#check">Check eligibility</a>'
        rows.append(f'        <tr id="{e(c["slug"])}"><td>{name}</td><td>{e(c["class_type"])}</td><td>{st}</td><td>{action}</td></tr>')
    rows.append("      </tbody>")
hub = replace_block(hub, "CASES", "\n".join(rows))
hub = replace_block(hub, "CASECOUNT", f'<span id="ca-count">{len(shown)}</span>')
hub = replace_block(hub, "UPDATED", fmt_date(data["last_synced"]))
opts = "\n".join(f'          <option value="{k}">{e(v)}</option>' for k, v in industries.items()
                 if any(c["industry"] == k for c in shown))
hub = replace_block(hub, "INDUSTRY_OPTIONS", opts)

hub_schema = [
    {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq_from_html(hub)},
    {"@context": "https://schema.org", "@type": "ItemList",
     "name": "Class action settlements businesses may be able to claim",
     "numberOfItems": len(shown),
     "itemListElement": [
         {"@type": "ListItem", "position": i + 1, "name": c["name"],
          "url": f'{SITE}/{page_by_case[c["name"]]["slug"]}' if c["name"] in page_by_case else f"{SITE}/{HUB_SLUG}#{c['slug']}"}
         for i, c in enumerate(shown)]},
]
hub = replace_block(hub, "SCHEMA", "\n".join(jsonld(s) for s in hub_schema))
hub_path.write_text(hub)

# ── CASE PAGES ─────────────────────────────────────────────────────────
tpl = (ROOT / "class-actions/_template.html").read_text()
case_by_name = {c["name"]: c for c in cases}
for p in pages:
    c = case_by_name[p["case_name"]]
    st = c["_status"]
    if st == "open":
        status_line = f"Open. Claim deadline {fmt_date(c['deadline'])}"
    elif st == "closed":
        status_line = "Closed. The claim deadline has passed"
    else:
        status_line = p.get("status_text", "Filing deadline not yet announced")
    facts = [("Who can claim", p["who"]), ("Covered period", p["period"]), ("Settlement fund", p["fund"]),
             ("Status", status_line), ("Companies sued", p["defendants"])]
    facts_html = "\n".join(f"          <div class=\"ca-fact\"><dt>{e(k)}</dt><dd>{e(v)}</dd></div>" for k, v in facts if v)
    body = []
    for s in p["sections"]:
        body.append(f"        <h2>{e(s['heading'])}</h2>")
        body += [f"        <p>{e(x)}</p>" for x in s.get("paragraphs", [])]
        if s.get("list"):
            body.append("        <ul>" + "".join(f"<li>{e(x)}</li>" for x in s["list"]) + "</ul>")
    faq_html = "\n".join(f"        <details>\n          <summary>{e(f['q'])}</summary>\n          <p>{e(f['a'])}</p>\n        </details>" for f in p["faqs"])
    related = [x for x in shown if x["industry"] == c["industry"] and x["name"] != c["name"]][:4]
    rel_html = "\n".join(
        f'          <li><a href="/{page_by_case[x["name"]]["slug"]}">{e(x["name"])}</a></li>' if x["name"] in page_by_case
        else f'          <li><a href="/{HUB_SLUG}#{x["slug"]}">{e(x["name"])}</a></li>' for x in related)
    src_html = "\n".join(f'          <li><a href="{e(s["url"])}" rel="nofollow noopener" target="_blank">{e(s["title"])}</a></li>' for s in p.get("sources", []))
    url = f"{SITE}/{p['slug']}"
    schema = [
        {"@context": "https://schema.org", "@type": "Article", "headline": p["h1"], "description": p["answer"],
         "dateModified": p["updated"], "mainEntityOfPage": url,
         "author": {"@type": "Organization", "name": "Big Wolf Solutions", "url": SITE},
         "publisher": {"@type": "Organization", "name": "Big Wolf Solutions", "url": SITE}},
        {"@context": "https://schema.org", "@type": "FAQPage",
         "mainEntity": [{"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in p["faqs"]]},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Class Action Settlements", "item": f"{SITE}/{HUB_SLUG}"},
            {"@type": "ListItem", "position": 3, "name": p["breadcrumb"], "item": url}]},
    ]
    out = tpl
    for k, v in {"H1": e(p["h1"]), "EYEBROW": e(industries[c["industry"]]), "ANSWER": e(p["answer"]),
                 "UPDATED": fmt_date(p["updated"]), "BREADCRUMB": e(p["breadcrumb"]), "FACTS": facts_html,
                 "BODY": "\n".join(body), "FAQ": faq_html, "RELATED": rel_html, "SOURCES": src_html,
                 "STATUS_CLASS": st, "SCHEMA": "\n".join(jsonld(s) for s in schema)}.items():
        out = out.replace("{{" + k + "}}", v)
    if "{{" in out:
        sys.exit(f"Unfilled placeholder in {p['slug']}: " + re.search(r"\{\{\w+\}\}", out).group(0))
    (ROOT / f"class-actions/{p['slug']}.html").write_text(out)

print(f"Hub: {len(shown)} cases shown ({sum(c['_status']=='open' for c in shown)} open, "
      f"{sum(c['_status']=='confirm' for c in shown)} ask-us). Case pages: {len(pages)}. Date: {TODAY}")
