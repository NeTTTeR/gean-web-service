(async function () {
  'use strict';

  const id = new URLSearchParams(location.search).get('id') || 'gean-hand-cream-30ml';

  /* ── Gallery view map ─────────────────────────────── */
  const viewMap = {
    product:   { bg: 'linear-gradient(150deg,#D8EEE7 0%,#B8D4CA 50%,#9DBDB2 100%)', tube: true },
    texture:   { bg: 'linear-gradient(150deg,#F5EDE4 0%,#E8D0B8 100%)',              tube: false },
    detail:    { bg: 'linear-gradient(150deg,#EFF7F1 0%,#C8E8DC 100%)',              tube: false },
    lifestyle: { bg: 'linear-gradient(150deg,#F8FAF9 0%,#D8EAE4 100%)',              tube: false },
  };

  const mainView   = document.getElementById('mainView');
  const mainTube   = document.getElementById('mainTube');
  const thumbsDiv  = document.getElementById('galleryThumbs');

  if (thumbsDiv) {
    thumbsDiv.addEventListener('click', function (e) {
      const thumb = e.target.closest('.thumb');
      if (!thumb) return;
      thumbsDiv.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const cfg = viewMap[thumb.dataset.view] || viewMap.product;
      if (mainView) mainView.style.background = cfg.bg;
      if (mainTube) mainTube.style.opacity = cfg.tube ? '1' : '0';
    });
  }

  /* ── Tab switching ────────────────────────────────── */
  const tabNav = document.querySelector('.tab-nav');
  if (tabNav) {
    tabNav.addEventListener('click', function (e) {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const pane = document.getElementById('tab-' + btn.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  }

  /* ── Load product data ────────────────────────────── */
  try {
    const products = await window.GeanAPI.getProducts();
    const product  = products.find(p => p.id === id);

    if (!product) {
      document.title = 'Product Not Found — GEAN';
      return;
    }

    document.title = `${product.nameEn} — GEAN`;

    /* Update static elements */
    const set = (elId, val) => { const el = document.getElementById(elId); if (el && val !== undefined) el.textContent = val; };
    set('prodTitle',    product.nameEn);
    set('prodSubtitle', product.nameTh + ' · ' + product.variantLabel);
    set('prodPrice',    window.GeanCart.formatPrice(product.priceSatang));
    set('prodUnit',     '/ ' + product.variantLabel.split('·')[1]?.trim() || '');
    set('prodEyebrow',  product.category + ' · Office Essential');
    set('prodDescEn',   product.descriptionEn);
    set('prodDescTh',   product.descriptionTh);

    /* Stock status */
    const stockRow = document.getElementById('prodStock');
    if (stockRow) {
      if (!product.inStock) {
        stockRow.innerHTML = '<span style="color:#ef4444;font-size:11px;letter-spacing:0.06em;">Out of stock</span>';
      }
    }

    /* Ingredients tab */
    const ingList = document.getElementById('ingredientList');
    if (ingList && product.ingredients?.length) {
      ingList.innerHTML = product.ingredients.map(ing => `
        <li class="ingredient-item">
          <span class="ing-dot"></span>
          <div><div class="ing-name">${ing.nameEn}</div><div class="ing-desc">${ing.descriptionEn}</div></div>
        </li>`).join('');
    }

    /* Gallery images */
    if (product.images?.length && mainView) {
      mainView.style.backgroundImage = `url('${product.images[0]}')`;
      mainView.style.backgroundSize  = 'cover';
      mainView.style.backgroundPosition = 'center';
      if (mainTube) mainTube.style.display = 'none';
    }

    /* Add to cart */
    const cartBtn = document.getElementById('addToCartBtn');
    if (cartBtn) {
      if (!product.inStock || product.comingSoon) {
        cartBtn.disabled = true;
        cartBtn.style.opacity = '0.4';
        cartBtn.querySelector('span').textContent = 'Unavailable';
      } else {
        cartBtn.addEventListener('click', function () {
          window.GeanCart.addItem(product.id);
          const span = cartBtn.querySelector('span');
          span.textContent = 'Added to Cart!';
          setTimeout(function () { span.textContent = 'Add to Cart'; }, 1800);
        });
      }
    }

    /* Related products grid */
    const relGrid = document.getElementById('relatedGrid');
    if (relGrid) {
      const others = products.filter(p => p.id !== id).slice(0, 3);
      relGrid.innerHTML = others.map(p => {
        if (p.comingSoon) {
          return `<div class="related-card muted">
            <div class="related-img" style="background:linear-gradient(150deg,#F5EDE4,#E8D0B8);"><div class="mini-tube" style="background:#F5EDE4;"></div></div>
            <div class="related-body"><div class="related-eyebrow">Coming Soon</div><div class="related-name">${p.nameEn}</div><div class="related-price">—</div></div></div>`;
        }
        return `<a href="/product-detail?id=${p.id}" class="related-card">
          <div class="related-img" style="background:linear-gradient(150deg,#D8EEE7,#9DBDB2);"><div class="mini-tube"></div></div>
          <div class="related-body"><div class="related-eyebrow">${p.category}</div><div class="related-name">${p.nameEn}</div><div class="related-price">${window.GeanCart.formatPrice(p.priceSatang)} · ${p.variantLabel.split('·')[1]?.trim()}</div></div></a>`;
      }).join('');
    }

  } catch (err) {
    console.error('ProductDetail: failed to load product', err);
  }
})();
