(async function () {
  'use strict';

  /* Smooth scroll for hero CTA */
  const heroBtn = document.getElementById('heroDiscoverBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('product');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* Load featured product from API */
  try {
    const products = await window.GeanAPI.getProducts();
    const featured = products.find(p => p.inStock && !p.comingSoon) ?? products[0];
    if (!featured) return;

    /* Update price */
    const priceEl = document.getElementById('featuredPrice');
    if (priceEl) priceEl.textContent = window.GeanCart.formatPrice(featured.priceSatang);

    /* Update read-more link */
    const readMore = document.getElementById('homeReadMore');
    if (readMore) readMore.href = `/product-detail?id=${featured.id}`;

    /* Add to cart button */
    const cartBtn = document.getElementById('homeAddToCart');
    if (cartBtn) {
      cartBtn.addEventListener('click', function () {
        window.GeanCart.addItem(featured.id);
        const span = cartBtn.querySelector('span');
        span.textContent = 'Added!';
        setTimeout(function () { span.textContent = 'Add to Cart'; }, 1500);
      });
    }
  } catch (err) {
    console.error('Home: failed to load product', err);
  }
})();
