/**
 * Front end slider behavior for the BW Testimonial Slider block.
 * Without JavaScript every testimonial is shown stacked vertically, which
 * keeps the content readable and avoids hiding slides from users.
 *
 * Optional data attributes (all missing on sliders saved by older versions,
 * which then behave exactly as before):
 *   data-per-view  2 or 3 slides visible at once from 768px wide.
 *   data-loop      "false" stops at the first and last slide.
 *   data-pause     "false" keeps autoplay running while the pointer is over
 *                  the slider (focus still pauses it).
 * A "bw-ts--fade" class on the wrapper cross-fades instead of sliding.
 */
(function () {
  const REDUCED_MOTION = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const WIDE = window.matchMedia('(min-width: 768px)');
  const SWIPE_DISTANCE = 40;

  function initSlider(root) {
    const slides = Array.from(root.querySelectorAll('.bw-ts__slide'));
    const track = root.querySelector('.bw-ts__track');

    if (slides.length < 2 || !track) {
      return;
    }

    const viewport = root.querySelector('.bw-ts__viewport');
    const prev = root.querySelector('.bw-ts__arrow--prev');
    const next = root.querySelector('.bw-ts__arrow--next');
    const dots = Array.from(root.querySelectorAll('.bw-ts__dot'));
    const autoplay = root.dataset.autoplay === 'true' && !REDUCED_MOTION;
    const interval = parseInt(root.dataset.interval, 10) || 5000;
    const fade = root.classList.contains('bw-ts--fade');
    const loop = root.dataset.loop !== 'false';
    const pauseOnHover = root.dataset.pause !== 'false';
    const configuredPerView = Math.min(
      3,
      Math.max(1, parseInt(root.dataset.perView, 10) || 1),
    );

    let perView = 1;
    let index = 0;
    let timer = null;

    root.classList.add('bw-ts--js');

    function lastIndex() {
      return Math.max(0, slides.length - perView);
    }

    function go(target) {
      const last = lastIndex();

      if (loop) {
        index = ((target % (last + 1)) + last + 1) % (last + 1);
      } else {
        index = Math.min(last, Math.max(0, target));
      }

      if (!fade) {
        track.style.transform = 'translateX(-' + (index * 100) / perView + '%)';
      }

      slides.forEach((slide, i) => {
        const active = i >= index && i < index + perView;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');

        if (active) {
          slide.removeAttribute('inert');
        } else {
          slide.setAttribute('inert', '');
        }
      });

      dots.forEach((dot, i) => {
        dot.hidden = i > last;
        dot.classList.toggle('is-active', i === index);

        if (i === index) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });

      if (prev) {
        prev.disabled = !loop && index === 0;
      }
      if (next) {
        next.disabled = !loop && index === last;
      }
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (!autoplay) {
        return;
      }

      stop();
      timer = window.setInterval(function () {
        if (!loop && index >= lastIndex()) {
          stop();
          return;
        }
        go(index + 1);
      }, interval);
    }

    function applyPerView() {
      perView = fade || !WIDE.matches ? 1 : configuredPerView;
      root.style.setProperty('--kb-ts-per', String(perView));
      go(index);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        stop();
        go(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        stop();
        go(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stop();
        go(i);
        start();
      });
    });

    if (pauseOnHover) {
      root.addEventListener('mouseenter', stop);
    }
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Swipe on touch screens.
    let touchStartX = null;
    (viewport || root).addEventListener(
      'touchstart',
      function (event) {
        touchStartX = event.touches[0].clientX;
      },
      { passive: true },
    );
    (viewport || root).addEventListener('touchend', function (event) {
      if (touchStartX === null) {
        return;
      }
      const distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) >= SWIPE_DISTANCE) {
        stop();
        go(distance < 0 ? index + 1 : index - 1);
        start();
      }
    });

    if (WIDE.addEventListener) {
      WIDE.addEventListener('change', applyPerView);
    }

    applyPerView();
    start();
  }

  document
    .querySelectorAll('.wp-block-kriti-blocks-testimonial-slider')
    .forEach(initSlider);
})();
