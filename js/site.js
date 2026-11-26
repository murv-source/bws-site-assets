/*
 * Code Author: Murv Berry, Happy Path Marketing
 * Website: happypathmarketing.com
 * Email: murv@happypathmarketing.com
 * Phone: (702) 789-7783
 *
 * OWNERSHIP NOTICE:
 * This digital asset is the property of the client of Happy Path Marketing.
 * No modifications, distributions, or alterations may be made to this code
 * without the express written consent of the Client.
 *
 * Copyright © Happy Path Marketing. All rights reserved.
 */
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

/* Keyword H1s. Added Nov 2026, wording approved by Big Wolf (Website H1 Wording Approval).
   The small hero label becomes the page's one H1 (its search phrase) and the big headline
   becomes a div with the same look. Page files are being updated to the same markup; once a
   page is re-pasted it already has h1.hero-pill and this block leaves it alone.
   /payroll-health is left out on purpose until the Supplemental Health split is settled. */
(function() {
  var LABELS = {
    'homepage': 'Business Cost Recovery & Savings',
    'about': 'About Big Wolf Solutions',
    'agents': 'Become a Big Wolf Sales Agent',
    'bookkeeping': 'Small Business Bookkeeping Services',
    'business-data-monetization': 'Business Data Monetization',
    'business-in-a-box': 'Business in a Box: All-in-One Solutions',
    'commercial-insurance': 'Commercial Business Insurance',
    'merchant-services': 'Merchant Services & Credit Card Processing',
    'personal-insurance': 'Personal & Farm Insurance',
    'r-d-tax-credits': 'R&D Tax Credit Services',
    'referral-partner': 'Referral Partner Program',
    'settlement-recovery': 'Class Action Settlement Recovery for Businesses',
    'supplemental-health': 'Supplemental Employee Health Plans',
    'testimonials': 'Big Wolf Solutions Client Reviews',
    'unclaimed-property': 'Unclaimed Property Recovery for Businesses',
    'blog': 'Big Wolf Solutions Blog'
  };
  var SCHEDULE_H1 = 'Book a Free Business Savings Review';

  function slug() {
    var p = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    return p === '' ? 'homepage' : p;
  }

  function swapTag(el, tag) {
    var n = document.createElement(tag);
    for (var i = 0; i < el.attributes.length; i++) n.setAttribute(el.attributes[i].name, el.attributes[i].value);
    while (el.firstChild) n.appendChild(el.firstChild);
    el.parentNode.replaceChild(n, el);
    return n;
  }

  function run() {
    var key = slug();
    if (key === 'schedule') {
      if (document.querySelector('h1')) return;
      var lead = document.querySelector('#booking .lead');
      if (!lead) return;
      var t = document.createElement('h1');
      t.className = 'schedule-title';
      t.textContent = SCHEDULE_H1;
      lead.parentNode.insertBefore(t, lead);
      return;
    }
    var label = LABELS[key];
    if (!label || document.querySelector('h1.hero-pill')) return;
    var pill = document.querySelector('.hero-pill');
    if (!pill) return;
    var scope = pill.parentNode;
    var headline = scope.querySelector('h1');
    if (headline) swapTag(headline, 'div').classList.add('hero-headline');
    var h1 = swapTag(pill, 'h1');
    var dot = h1.querySelector('.hero-pill-dot');
    h1.textContent = '';
    if (dot) { h1.appendChild(dot); h1.appendChild(document.createTextNode(' ')); }
    h1.appendChild(document.createTextNode(label));
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', run) : run();
})();
