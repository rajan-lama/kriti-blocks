/**
 * Front end behavior for the BW Sticky Section block.
 * Marks the section as stuck (shadow, background, smaller padding) and can
 * hide it while the visitor scrolls down.
 */
(function () {
  function initSticky(root) {
    const classes = root.classList;
    const hasEffects =
      classes.contains('bw-sticky--stuck-bg') ||
      classes.contains('bw-sticky--shrink') ||
      classes.contains('bw-sticky--smart');

    if (root.dataset.shadow !== 'true' && !hasEffects) {
      return;
    }

    const offset = parseInt(root.dataset.offset, 10) || 0;
    const toBottom = classes.contains('bw-sticky--bottom');
    const smart = classes.contains('bw-sticky--smart');

    let stuck = false;
    let ticking = false;
    let lastY = window.scrollY || 0;

    function update() {
      const rect = root.getBoundingClientRect();
      const isStuck = toBottom
        ? rect.bottom >= window.innerHeight - offset - 0.5
        : rect.top <= offset + 0.5;

      if (isStuck !== stuck) {
        stuck = isStuck;
        root.classList.toggle('is-stuck', isStuck);
      }

      if (smart) {
        const y = window.scrollY || 0;
        const delta = y - lastY;

        if (!stuck || delta < -4) {
          root.classList.remove('is-hidden');
        } else if (delta > 4) {
          root.classList.add('is-hidden');
        }

        lastY = y;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    update();
  }

  document
    .querySelectorAll('.wp-block-kriti-blocks-sticky-section')
    .forEach(initSticky);
})();
