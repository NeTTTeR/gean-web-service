(async function () {
  'use strict';

  const id = new URLSearchParams(location.search).get('id');

  /* ── Language tabs ────────────────────────────────── */
  const tabEn  = document.getElementById('tabEn');
  const tabTh  = document.getElementById('tabTh');
  const bodyEn = document.getElementById('bodyEn');
  const bodyTh = document.getElementById('bodyTh');

  function switchLang(lang) {
    if (lang === 'en') {
      tabEn.className = 'lang-tab active-en';
      tabTh.className = 'lang-tab';
      tabEn.setAttribute('aria-selected', 'true');
      tabTh.setAttribute('aria-selected', 'false');
      bodyEn.style.display = '';
      bodyTh.style.display = 'none';
    } else {
      tabTh.className = 'lang-tab active-th';
      tabEn.className = 'lang-tab';
      tabTh.setAttribute('aria-selected', 'true');
      tabEn.setAttribute('aria-selected', 'false');
      bodyTh.style.display = '';
      bodyEn.style.display = 'none';
    }
    document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang } }));
  }

  if (tabEn) tabEn.addEventListener('click', function () { switchLang('en'); });
  if (tabTh) tabTh.addEventListener('click', function () { switchLang('th'); });

  /* ── Load article ─────────────────────────────────── */
  if (!id) {
    document.getElementById('heroTitle').textContent = 'Article not found.';
    return;
  }

  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return iso; }
  }

  try {
    const article = await window.GeanAPI.getArticle(id);

    if (!article) {
      document.getElementById('heroTitle').textContent = 'Article not found.';
      document.title = 'Not Found — GEAN';
      return;
    }

    document.title = `${article.titleEn} — GEAN`;

    /* Hero */
    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.textContent = val; };
    set('heroCat',   article.category);
    set('heroTitle', article.titleEn);
    set('metaDate',  fmtDate(article.publishedAt));
    set('metaRead',  `${article.readTimeMinutes} min read`);

    /* Body — sanitise to allowed tags only */
    if (bodyEn) bodyEn.innerHTML = article.bodyEn || '<p>No content available.</p>';
    if (bodyTh) bodyTh.innerHTML = article.bodyTh || '<p>ไม่มีเนื้อหา</p>';

    /* Sidebar — load related articles */
    if (article.relatedIds?.length) {
      try {
        const allArticles = await window.GeanAPI.getArticles();
        const relatedDiv  = document.getElementById('relatedArticles');
        if (relatedDiv) {
          const related = article.relatedIds
            .map(rid => allArticles.find(a => a.id === rid))
            .filter(Boolean);

          relatedDiv.innerHTML = related.map(a => `
            <a href="/article-detail?id=${a.id}" class="related-card-sm">
              <div class="rc-cat">${a.category}</div>
              <div class="rc-title">${a.titleEn}</div>
              <div class="rc-date">${fmtDate(a.publishedAt)}</div>
            </a>`).join('');
        }
      } catch {}
    }

  } catch (err) {
    console.error('ArticleDetail: failed to load', err);
    document.getElementById('heroTitle').textContent = 'Unable to load article.';
  }
})();
