/* global API client + localStorage cache layer */
window.GeanAPI = (function () {
  'use strict';

  const STORAGE_KEYS = {
    CART:     'gean_cart',
    PRODUCTS: 'gean_products',
    ARTICLES: 'gean_articles',
    ARTICLE:  (id) => `gean_article_${id}`,
  };

  const CACHE_TTL_MS       = 60 * 60 * 1000; // 1 hour
  const GRID_ARTICLE_COUNT = 2;
  const MAX_CART_QTY       = 99;
  const API_BASE           = '/api';

  /* ── localStorage helpers ───────────────────────────── */
  function readLS(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  function writeLS(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }

  function isFresh(cachedAt) {
    if (!cachedAt) return false;
    return Date.now() - Date.parse(cachedAt) < CACHE_TTL_MS;
  }

  /* ── Products ───────────────────────────────────────── */
  async function getProducts() {
    const cached = readLS(STORAGE_KEYS.PRODUCTS);
    if (cached && isFresh(cached.cachedAt)) return cached.items;

    try {
      const res  = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      writeLS(STORAGE_KEYS.PRODUCTS, { items: data.items, cachedAt: new Date().toISOString() });
      return data.items;
    } catch {
      return cached?.items ?? [];
    }
  }

  async function getProduct(id) {
    const products = await getProducts();
    return products.find(p => p.id === id) ?? null;
  }

  /* ── Articles ───────────────────────────────────────── */
  async function getArticles() {
    const cached = readLS(STORAGE_KEYS.ARTICLES);
    if (cached && isFresh(cached.cachedAt)) return cached.items;

    try {
      const res  = await fetch(`${API_BASE}/articles`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      writeLS(STORAGE_KEYS.ARTICLES, { items: data.items, cachedAt: new Date().toISOString() });
      return data.items;
    } catch {
      return cached?.items ?? [];
    }
  }

  async function getArticle(id) {
    const key    = STORAGE_KEYS.ARTICLE(id);
    const cached = readLS(key);
    if (cached && isFresh(cached.cachedAt)) return cached;

    try {
      const res = await fetch(`${API_BASE}/articles/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('fetch failed');
      const data   = await res.json();
      const detail = { ...data, cachedAt: new Date().toISOString() };
      writeLS(key, detail);
      return detail;
    } catch {
      return cached ?? null;
    }
  }

  return { getProducts, getProduct, getArticles, getArticle, STORAGE_KEYS, CACHE_TTL_MS, GRID_ARTICLE_COUNT, MAX_CART_QTY };
})();
