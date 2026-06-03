(async function () {
  'use strict';

  const featuredSlot = document.getElementById('featuredArticle');
  const grid         = document.getElementById('articleGrid');
  const countEl      = document.getElementById('articleCount');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const loadMoreBtn  = document.getElementById('loadMoreBtn');
  const loadCountEl  = document.getElementById('loadCount');

  const GRID_COUNT = window.GeanAPI.GRID_ARTICLE_COUNT; // 2
  let gridArticles = [];
  let shown        = 0;

  /* ── Render helpers ───────────────────────────────── */
  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return iso; }
  }

  const catColors = {
    Skincare:    'background:linear-gradient(150deg,#D8EEE7 0%,#B8D4CA 50%,#9DBDB2 100%)',
    Wellness:    'background:linear-gradient(150deg,#F5EDE4 0%,#E8D0B8 100%)',
    Ingredients: 'background:linear-gradient(150deg,#D8EEE7 0%,#9DBDB2 100%)',
    Lifestyle:   'background:linear-gradient(150deg,#F5EDE4 0%,rgba(207,171,141,0.5) 100%)',
    Science:     'background:linear-gradient(150deg,#EFF7F1 0%,#C8E8DC 100%)',
  };

  function catStyle(cat) { return catColors[cat] || catColors.Skincare; }

  function featuredHtml(a) {
    return `
      <div class="featured-article">
        <div class="featured-img" style="${catStyle(a.category)}">
          <span class="featured-cat">${a.category}</span>
        </div>
        <div class="featured-info">
          <div class="featured-meta">${fmtDate(a.publishedAt)} · Featured</div>
          <h2 class="featured-title">${a.titleEn}</h2>
          <p class="featured-excerpt">${a.excerptEn}</p>
          <a href="/article-detail?id=${a.id}" class="featured-cta">Read Full Article →</a>
          <div class="featured-time">${a.readTimeMinutes} min read</div>
        </div>
      </div>`;
  }

  function articleCardHtml(a) {
    return `
      <div class="article-card">
        <div class="article-img-wrap">
          <a href="/article-detail?id=${a.id}">
            <div class="article-img" style="${catStyle(a.category)}">
              <span class="art-cat">${a.category}</span>
            </div>
          </a>
        </div>
        <div class="article-body">
          <div class="article-date">${fmtDate(a.publishedAt)}</div>
          <div class="article-title">${a.titleEn}</div>
          <p class="article-excerpt">${a.excerptEn}</p>
        </div>
        <div class="article-footer-row">
          <a href="/article-detail?id=${a.id}" class="read-more">Read More →</a>
          <span class="read-time">${a.readTimeMinutes} min</span>
        </div>
      </div>`;
  }

  function renderGrid() {
    const slice = gridArticles.slice(0, shown);
    grid.innerHTML = slice.length
      ? slice.map(articleCardHtml).join('')
      : '<p class="article-empty">No articles yet. Check back soon.</p>';

    const remaining = gridArticles.length - shown;
    if (remaining > 0) {
      loadMoreWrap.style.display = 'block';
      loadCountEl.textContent = `Showing ${shown + (featuredSlot.innerHTML ? 1 : 0)} of ${gridArticles.length + (featuredSlot.innerHTML ? 1 : 0)} articles`;
    } else {
      loadMoreWrap.style.display = 'none';
    }
  }

  /* ── Load More ────────────────────────────────────── */
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      shown = gridArticles.length; // show all
      renderGrid();
    });
  }

  /* ── Init ─────────────────────────────────────────── */
  try {
    const all = await window.GeanAPI.getArticles();

    if (!all.length) {
      if (grid) grid.innerHTML = '<p class="article-empty">No articles yet. Check back soon.</p>';
      return;
    }

    const featured    = all.find(a => a.featured) ?? all[0];
    const nonFeatured = all.filter(a => a.id !== featured.id);

    /* Featured */
    if (featuredSlot && featured) featuredSlot.innerHTML = featuredHtml(featured);

    /* Grid */
    gridArticles = nonFeatured;
    shown        = Math.min(GRID_COUNT, gridArticles.length);

    /* Count label */
    if (countEl) countEl.textContent = `${all.length} article${all.length !== 1 ? 's' : ''}`;

    renderGrid();
  } catch (err) {
    console.error('Article: failed to load', err);
    if (grid) grid.innerHTML = '<p class="article-empty">Unable to load articles. Please try again later.</p>';
  }
})();
