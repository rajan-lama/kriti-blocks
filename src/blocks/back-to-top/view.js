/**
 * Front end behavior for the Back To Top block.
 * Without JavaScript the button stays hidden, so there is no dead control.
 */
(function () {
  const REDUCED_MOTION = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const RING_LENGTH = 138.23;

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function scrollToTop(duration) {
    const start = window.scrollY;
    const began = window.performance.now();

    function step(now) {
      const t = Math.min(1, (now - began) / duration);

      window.scrollTo(0, Math.round(start * (1 - ease(t))));

      if (t < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function initBackToTop(root) {
    const button = root.querySelector('.bw-btt__button');

    if (!button) {
      return;
    }

    const showAfter = parseInt(root.dataset.showAfter, 10) || 0;
    const smooth = root.dataset.smooth !== 'false' && !REDUCED_MOTION;
    const duration = parseInt(root.dataset.duration, 10) || 0;
    const ringBar =
      root.dataset.progress === 'true'
        ? root.querySelector('.bw-btt__ring-bar')
        : null;

    let visible = false;

    root.classList.add('bw-btt--js');

    function onScroll() {
      const shouldShow = window.scrollY > showAfter;

      if (shouldShow !== visible) {
        visible = shouldShow;
        root.classList.toggle('bw-btt--visible', shouldShow);
      }

      if (ringBar) {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const ratio =
          scrollable > 0
            ? Math.min(1, Math.max(0, window.scrollY / scrollable))
            : 0;

        ringBar.style.strokeDashoffset = String(RING_LENGTH * (1 - ratio));
      }
    }

    button.addEventListener('click', function () {
      if (smooth && duration > 0) {
        scrollToTop(duration);
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document
    .querySelectorAll('.wp-block-kriti-blocks-back-to-top')
    .forEach(initBackToTop);
})();
