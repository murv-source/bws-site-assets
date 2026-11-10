# GHL shared header/footer setup

The nav and footer live in **one place** now:

- `partials/header.html` — nav + mobile menu
- `partials/footer.html` — founder block, footer, floating CTA, and the `site.js` include

Edit those once, push, purge the CDN, and every GHL page updates. To add a menu item you only touch `partials/header.html` (and the mobile-menu list in the same file).

---

## Per-page setup in GHL (3 pieces)

### 1. Head code — once per page (Page Settings → Custom Code → Header, or a code block in the head)
Loads the fonts + stylesheet so there's no flash of unstyled content.

```html
<link rel="icon" href="https://assets.cdn.filesafe.space/1ZMpwJ9nYwk9qTFScUtS/media/69cec39bfe4f1c0b67c6dd8c.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/murv-source/bws-site-assets@main/css/styles.css">
```

### 2. Header placeholder — a Custom HTML/Code element at the very TOP of the page
```html
<div id="bws-header"></div>
```

### 3. Footer placeholder + loader — a Custom HTML/Code element at the very BOTTOM of the page
```html
<div id="bws-footer"></div>
<script>
(function () {
  var BASE = 'https://cdn.jsdelivr.net/gh/murv-source/bws-site-assets@main/partials/';
  function runScripts(host) {
    host.querySelectorAll('script').forEach(function (old) {
      var s = document.createElement('script');
      for (var i = 0; i < old.attributes.length; i++) s.setAttribute(old.attributes[i].name, old.attributes[i].value);
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
  }
  function inject(id, file) {
    var host = document.getElementById(id);
    if (!host) return Promise.resolve();
    return fetch(BASE + file).then(function (r) { return r.text(); }).then(function (html) {
      host.innerHTML = html;
      runScripts(host);
    });
  }
  // Header first, so site.js (loaded inside footer.html) finds the nav elements.
  inject('bws-header', 'header.html').then(function () { return inject('bws-footer', 'footer.html'); });
})();
</script>
```

Your page's body sections go **between** #2 and #3.

---

## Notes / gotchas

- **Order matters.** The loader injects the header first, then the footer. `site.js` ships inside `footer.html`, and the loader re-creates `<script>` tags so it actually executes (browsers do NOT run scripts set via `innerHTML`). Because it runs after both are injected, the hamburger toggle, sticky-nav shadow, and floating-CTA all wire up correctly.
- **Use jsDelivr, not raw.githubusercontent.com.** jsDelivr sends CORS headers and is a real CDN. (Already the pattern here.)
- **Purge after every edit.** jsDelivr caches `@main` up to ~12h. After pushing a change to a partial:
  `https://purge.jsdelivr.net/gh/murv-source/bws-site-assets@main/partials/header.html`
- **Full-width breakout.** `site.js` has a helper that forces full width by walking up from `#bws-home-root`. The injected partials don't include that wrapper. If your pages rely on breaking out of GHL's centered container, put `id="bws-home-root"` on the section/row that wraps your page body so the helper still works.
- **Links** use root-relative paths (`/merchant-services`, etc.), which match your GHL page slugs.
