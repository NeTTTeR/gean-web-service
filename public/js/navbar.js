/* Navbar: active link, mobile menu, cart badge */
(function () {
  'use strict';

  /* Active link ─────────────────────────────────────── */
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-nav-panel a:not(.btn-nav-cta)').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });

  /* Mobile menu ──────────────────────────────────────── */
  const toggle   = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const backdrop  = document.getElementById('mobileNavBackdrop');

  function closeMenu()  { if (mobileNav) mobileNav.classList.remove('open'); }
  function toggleMenu() { if (mobileNav) mobileNav.classList.toggle('open'); }

  if (toggle)   toggle.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-panel a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* Cart badge ────────────────────────────────────────── */
  function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = window.GeanCart ? window.GeanCart.getTotalCount() : 0;
    badge.textContent = count;
    if (count > 0) {
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  updateBadge();
  document.addEventListener('cart:updated', updateBadge);
})();
