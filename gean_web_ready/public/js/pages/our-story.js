(function () {
  'use strict';

  /* Smooth scroll hero CTA → #story */
  const scrollBtn = document.getElementById('storyScrollBtn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('story');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();
