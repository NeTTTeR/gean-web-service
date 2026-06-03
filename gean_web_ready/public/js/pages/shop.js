(async function () {
  'use strict';

  const grid      = document.getElementById('productGrid');
  const countEl   = document.getElementById('productCount');
  const sortSel   = document.getElementById('sortSelect');
  const filterDiv = document.getElementById('filterPills');

  let allProducts = [];
  let activeFilter = 'all';
  let activeSort   = 'featured';

  /* ── Render helpers ───────────────────────────────── */
  function cardHtml(p) {
    if (p.comingSoon) {
      return `<div class="product-card coming-soon">
        <div class="card-img-wrap"><div class="card-img" style="background:linear-gradient(150deg,#F5EDE4 0%,#E8D5C0 100%);">
          <span class="card-badge">Coming Soon</span></div></div>
        <div class="card-body">
          <div class="card-eyebrow">${p.category}</div>
          <div class="card-name">${p.nameEn}</div>
          <div class="card-variant">${p.variantLabel}</div>
          <div class="card-footer"><span class="card-price">—</span></div>
        </div></div>`;
    }
    const price = window.GeanCart.formatPrice(p.priceSatang);
    const imgStyle = p.images && p.images[0]
      ? `background-image:url('${p.images[0]}');background-size:cover;background-position:center;`
      : '';
    return `<div class="product-card" data-id="${p.id}">
      <div class="card-img-wrap">
        <a href="/product-detail?id=${p.id}">
          <div class="card-img" style="${imgStyle}">
            <div class="card-logo-mark"><img src="/asset/image/LOGO_GEAN.png" alt="GEAN"></div>
            ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
          </div>
        </a>
      </div>
      <div class="card-body">
        <div class="card-eyebrow">${p.category}</div>
        <div class="card-name">${p.nameEn}</div>
        <div class="card-variant">${p.variantLabel}</div>
        <div class="card-footer">
          <span class="card-price">${price}</span>
          <button class="btn-card" data-product-id="${p.id}"><span>Add to Cart</span></button>
        </div>
      </div></div>`;
  }

  function sortedFiltered() {
    let list = allProducts.slice();
    if (activeFilter !== 'all') {
      if (activeFilter === 'new') list = list.filter(p => p.badge === 'New');
      else list = list.filter(p => p.category === activeFilter);
    }
    if (activeSort === 'price-asc')  list.sort((a,b) => a.priceSatang - b.priceSatang);
    if (activeSort === 'price-desc') list.sort((a,b) => b.priceSatang - a.priceSatang);
    if (activeSort === 'newest')     list.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }

  function render() {
    const list = sortedFiltered();
    if (!list.length) {
      grid.innerHTML = '<p class="shop-empty">No products available at this time.</p>';
      return;
    }
    grid.innerHTML = list.map(cardHtml).join('');

    /* Add-to-cart listeners */
    grid.querySelectorAll('.btn-card[data-product-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.GeanCart.addItem(btn.dataset.productId);
        const span = btn.querySelector('span');
        span.textContent = 'Added!';
        setTimeout(function () { span.textContent = 'Add to Cart'; }, 1500);
      });
    });
  }

  /* ── Init ─────────────────────────────────────────── */
  try {
    allProducts = await window.GeanAPI.getProducts();
    const active = allProducts.filter(p => !p.comingSoon).length;
    if (countEl) countEl.textContent = `${active} Product${active !== 1 ? 's' : ''} Available`;
    render();
  } catch (err) {
    console.error('Shop: failed to load products', err);
    if (grid) grid.innerHTML = '<p class="shop-empty">Unable to load products. Please try again later.</p>';
  }

  /* ── Filter pills ─────────────────────────────────── */
  if (filterDiv) {
    filterDiv.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      filterDiv.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  }

  /* ── Sort select ──────────────────────────────────── */
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      activeSort = sortSel.value;
      render();
    });
  }
})();
