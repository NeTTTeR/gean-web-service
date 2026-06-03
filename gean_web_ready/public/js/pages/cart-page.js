(async function () {
  'use strict';

  const layout = document.getElementById('cartLayout');
  let products  = [];

  /* ── Helpers ──────────────────────────────────────── */
  function fmt(satang) { return window.GeanCart.formatPrice(satang); }

  function itemRowHtml(item, product) {
    const linePrice = product ? product.priceSatang * item.quantity : 0;
    const thumb = product?.images?.[0]
      ? `background-image:url('${product.images[0]}');background-size:cover;background-position:center;`
      : '';
    return `
      <div class="cart-item-row" data-product-id="${item.productId}">
        <div class="item-info">
          <div class="item-thumb" style="${thumb}"></div>
          <div>
            <div class="item-name">${product?.nameEn ?? item.productId}</div>
            <div class="item-variant">${product?.variantLabel ?? ''}</div>
          </div>
        </div>
        <div class="item-unit-price">${product ? fmt(product.priceSatang) : '—'}</div>
        <div class="qty-control">
          <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
        <button class="item-remove" data-action="remove" aria-label="Remove item">×</button>
      </div>`;
  }

  function summaryHtml(total, itemCount) {
    return `
      <div class="summary-card">
        <div class="summary-title">Order Summary</div>
        <div class="summary-row"><span>Subtotal (${itemCount} item${itemCount !== 1 ? 's' : ''})</span><span id="subtotalVal">${fmt(total)}</span></div>
        <div class="summary-row"><span>Shipping</span><span class="summary-free">Free</span></div>
        <div class="summary-row total"><span>Total</span><span id="totalVal">${fmt(total)}</span></div>
        <a href="/contact" class="btn-checkout"><span>Order via LINE →</span></a>
        <a href="/shop" class="continue-link">← Continue Shopping</a>
        <div class="trust-row">
          <div class="trust-item"><span class="trust-label">Secure</span><span class="trust-sub">Safe checkout</span></div>
          <div class="trust-item"><span class="trust-label">Free Ship</span><span class="trust-sub">All orders</span></div>
          <div class="trust-item"><span class="trust-label">1–3 Days</span><span class="trust-sub">Delivery</span></div>
        </div>
      </div>`;
  }

  function emptyStateHtml() {
    return `
      <div class="cart-items-card">
        <div class="empty-state">
          <div class="empty-icon">○</div>
          <div class="empty-title">Your cart is empty</div>
          <div class="empty-desc">Looks like you haven't added anything yet.</div>
          <a href="/shop" class="btn-shop-link"><span>Go to Shop</span></a>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-title">Order Summary</div>
        <div class="summary-row total"><span>Total</span><span>฿0.00</span></div>
        <button class="btn-checkout" disabled style="opacity:0.35;cursor:not-allowed;"><span>Order via LINE</span></button>
      </div>`;
  }

  /* ── Render ───────────────────────────────────────── */
  function renderCart() {
    const cart  = window.GeanCart.getCart();
    const items = cart.items;

    if (!items.length) {
      layout.innerHTML = emptyStateHtml();
      return;
    }

    const total     = window.GeanCart.computeTotal(products);
    const itemCount = window.GeanCart.getTotalCount();

    const rowsHtml = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return itemRowHtml(item, product);
    }).join('');

    layout.innerHTML = `
      <div class="cart-items-card">
        <div class="cart-items-head">
          <span>Product</span><span>Unit Price</span><span>Quantity</span><span></span>
        </div>
        ${rowsHtml}
      </div>
      ${summaryHtml(total, itemCount)}`;

    /* Bind qty/remove events */
    layout.querySelectorAll('.cart-item-row').forEach(function (row) {
      const productId = row.dataset.productId;
      row.querySelectorAll('.qty-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const delta = btn.dataset.action === 'inc' ? 1 : -1;
          window.GeanCart.changeQty(productId, delta);
          renderCart();
        });
      });
      const removeBtn = row.querySelector('[data-action="remove"]');
      if (removeBtn) {
        removeBtn.addEventListener('click', function () {
          window.GeanCart.removeItem(productId);
          renderCart();
        });
      }
    });
  }

  /* ── Init ─────────────────────────────────────────── */
  try {
    products = await window.GeanAPI.getProducts();
  } catch (err) {
    console.error('CartPage: failed to load products', err);
  }

  renderCart();

  /* Re-render on external cart changes */
  document.addEventListener('cart:updated', function () {
    /* Avoid double render from this page's own updates (already handled in renderCart) */
  });
})();
