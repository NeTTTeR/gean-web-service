/* Cart state module — read/write localStorage, emit events, no DOM */
window.GeanCart = (function () {
  'use strict';

  const KEY     = 'gean_cart';
  const MAX_QTY = 99;

  function now() { return new Date().toISOString(); }

  function defaultCart() { return { items: [], updatedAt: now() }; }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultCart();
      return JSON.parse(raw) ?? defaultCart();
    } catch { return defaultCart(); }
  }

  function save(cart) {
    cart.updatedAt = now();
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
  }

  /* ── Public API ─────────────────────────────────────── */
  function getCart()      { return load(); }
  function getTotalCount(){ return load().items.reduce((s, i) => s + i.quantity, 0); }

  function addItem(productId, quantity = 1) {
    const cart = load();
    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = Math.min(item.quantity + quantity, MAX_QTY);
    } else {
      cart.items.push({ productId, quantity: Math.min(quantity, MAX_QTY), addedAt: now() });
    }
    save(cart);
  }

  function changeQty(productId, delta) {
    const cart = load();
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return;
    const newQty = Math.min(Math.max(item.quantity + delta, 0), MAX_QTY);
    if (newQty === 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      item.quantity = newQty;
    }
    save(cart);
  }

  function removeItem(productId) {
    const cart = load();
    cart.items = cart.items.filter(i => i.productId !== productId);
    save(cart);
  }

  function computeTotal(products) {
    return load().items.reduce((sum, item) => {
      const p = products.find(x => x.id === item.productId);
      return sum + (p?.priceSatang ?? 0) * item.quantity;
    }, 0);
  }

  function clearCart() { save(defaultCart()); }

  function formatPrice(satang) {
    return '฿' + (satang / 100).toFixed(2);
  }

  return { getCart, getTotalCount, addItem, changeQty, removeItem, computeTotal, clearCart, formatPrice };
})();
