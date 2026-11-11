(function() {
  function forceFullWidth() {
    var root = document.getElementById('bws-home-root');
    if (!root) return;
    var el = root.parentElement;
    while (el && el !== document.body) {
      el.style.setProperty('width','100%','important');
      el.style.setProperty('max-width','100%','important');
      el.style.setProperty('padding-left','0','important');
      el.style.setProperty('padding-right','0','important');
      el.style.setProperty('margin-left','0','important');
      el.style.setProperty('margin-right','0','important');
      el = el.parentElement;
    }
    if (document.body) {
      document.body.style.setProperty('width','100%','important');
      document.body.style.setProperty('max-width','100%','important');
      document.body.style.setProperty('margin','0','important');
      document.body.style.setProperty('padding','0','important');
    }
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', forceFullWidth) : forceFullWidth();
  window.addEventListener('load', function() { setTimeout(forceFullWidth, 250); });
})();

(function() {
  var nav = document.getElementById('bwsNav');
  if (nav) window.addEventListener('scroll', function() { nav.classList.toggle('scrolled', window.scrollY > 20); }, { passive: true });
})();

(function() {
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function() { menu.classList.toggle('open'); });
  document.addEventListener('click', function(e) { if (!toggle.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('open'); });
  menu.querySelectorAll('a[href]').forEach(function(link) {
    link.addEventListener('click', function() { menu.classList.remove('open'); });
  });
})();

(function() {
  var triggers = document.querySelectorAll('[data-modal-target]');
  if (!triggers.length) return;
  function openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('bio-modal-locked');
  }
  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('bio-modal-locked');
  }
  triggers.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var modal = document.getElementById(btn.getAttribute('data-modal-target'));
      if (modal) openModal(modal);
    });
  });
  document.querySelectorAll('.bio-modal [data-modal-close]').forEach(function(el) {
    el.addEventListener('click', function() { closeModal(el.closest('.bio-modal')); });
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') document.querySelectorAll('.bio-modal.is-open').forEach(closeModal);
  });
})();

(function() {
  var cta = document.querySelector('.floating-cta');
  var footer = document.querySelector('footer');
  if (!cta || !footer || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) { cta.classList.toggle('is-hidden', entry.isIntersecting); });
  });
  observer.observe(footer);
})();

/* Sitewide Organization schema (JSON-LD). Added Nov 11, 2026. Service-area business, US-wide, no street address. */
(function() {
  if (document.getElementById('bws-org-schema')) return;
  var base = 'https://bigwolfsolutions.net/';
  var services = [
    ['R&D Tax Credits', 'r-d-tax-credits'],
    ['Settlement Recovery', 'settlement-recovery'],
    ['Unclaimed Property Recovery', 'unclaimed-property'],
    ['Business Data Monetization', 'business-data-monetization'],
    ['Merchant Services', 'merchant-services'],
    ['Supplemental Health', 'supplemental-health'],
    ['Payroll & Health', 'payroll-health'],
    ['Bookkeeping', 'bookkeeping'],
    ['Business in a Box', 'business-in-a-box'],
    ['Commercial Insurance', 'commercial-insurance'],
    ['Personal & Farm Insurance', 'personal-insurance']
  ];
  var data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': base + '#organization',
    'name': 'Big Wolf Solutions',
    'url': base,
    'logo': 'https://assets.cdn.filesafe.space/1ZMpwJ9nYwk9qTFScUtS/media/69cec3ab75502063bb5a706a.png',
    'image': 'https://assets.cdn.filesafe.space/1ZMpwJ9nYwk9qTFScUtS/media/69cec3ab75502063bb5a706a.png',
    'description': 'Big Wolf Solutions helps US businesses recover hidden revenue and cut costs: R&D tax credits, settlement recovery, unclaimed property recovery, merchant processing savings and employee benefits funded by payroll tax savings.',
    'telephone': '+1-844-443-0482',
    'email': 'nick@bigwolfsolutions.com',
    'areaServed': { '@type': 'Country', 'name': 'United States' },
    'founder': [
      { '@type': 'Person', 'name': 'Nick Yocca', 'jobTitle': 'Co-Founder & President' },
      { '@type': 'Person', 'name': 'Ali Yocca', 'jobTitle': 'Co-Founder' }
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Services',
      'itemListElement': services.map(function(s) {
        return { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': s[0], 'url': base + s[1] } };
      })
    }
  };
  var el = document.createElement('script');
  el.type = 'application/ld+json';
  el.id = 'bws-org-schema';
  el.text = JSON.stringify(data);
  (document.head || document.documentElement).appendChild(el);
})();
