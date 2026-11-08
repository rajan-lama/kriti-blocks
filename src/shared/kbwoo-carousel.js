/**
 * Front end carousel for the WooCommerce product carousel.
 *
 * Extends the shared carousel with per-device columns (read from the CSS
 * custom property so JS and layout always agree), looping, and an optional
 * pause on hover. The track is a horizontally scrollable list, so every slide
 * stays reachable without JavaScript.
 */
import { __, sprintf } from '@wordpress/i18n';

const REDUCED_MOTION =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

/**
 * Reads the number of visible columns for the current viewport.
 *
 * @param {HTMLElement} root     Carousel root element.
 * @param {string}      property CSS custom property that holds the columns.
 * @return {number} Columns, at least 1.
 */
export function getColumns(root, property) {
  let value = NaN;

  if (typeof window !== 'undefined' && window.getComputedStyle) {
    value = parseInt(
      window.getComputedStyle(root).getPropertyValue(property),
      10,
    );
  }

  if (!value) {
    value = parseInt(root.dataset.columns, 10);
  }

  return value > 0 ? value : 1;
}

/**
 * Initializes a carousel instance.
 *
 * @param {HTMLElement} root    Carousel root element.
 * @param {Object}      options Selector and class configuration.
 * @return {void}
 */
export function initKbWooCarousel(root, options) {
  const {
    slideSelector,
    viewportSelector,
    prevSelector,
    nextSelector,
    dotSelector,
    dotsSelector,
    columnsProperty,
    jsClass,
    dotClass,
  } = options;

  const viewport = root.querySelector(viewportSelector);
  const slides = Array.from(root.querySelectorAll(slideSelector));

  if (!viewport || slides.length < 2) {
    return;
  }

  const prev = root.querySelector(prevSelector);
  const next = root.querySelector(nextSelector);
  const dotsList = root.querySelector(dotsSelector);
  const autoplay = root.dataset.autoplay === 'true' && !REDUCED_MOTION;
  const interval = parseInt(root.dataset.interval, 10) || 5000;
  const loop = root.dataset.loop === 'true';
  const pauseOnHover = root.dataset.pauseHover !== 'false';

  let columns = getColumns(root, columnsProperty);
  let pageCount = Math.ceil(slides.length / columns);
  let page = 0;
  let timer = null;
  let dots = [];

  root.classList.add(jsClass);

  function slideForPage(target) {
    return slides[Math.min(target * columns, slides.length - 1)];
  }

  function buildDots() {
    if (!dotsList) {
      return;
    }

    dotsList.textContent = '';
    dots = [];

    if (pageCount < 2) {
      dotsList.hidden = true;
      return;
    }

    dotsList.hidden = false;

    for (let index = 0; index < pageCount; index++) {
      const item = document.createElement('li');
      const dot = document.createElement('button');

      dot.type = 'button';
      dot.className = dotClass;
      dot.setAttribute(
        'aria-label',
        /* translators: %d: page number. */
        sprintf(__('Go to page %d', 'kriti-blocks'), index + 1),
      );
      dot.addEventListener('click', function () {
        stop();
        setPage(index);
        start();
      });

      item.appendChild(dot);
      dotsList.appendChild(item);
      dots.push(dot);
    }
  }

  function syncControls() {
    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === page);

      if (index === page) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    const single = pageCount < 2;

    if (prev) {
      prev.hidden = single;
      prev.disabled = !loop && page === 0;
    }

    if (next) {
      next.hidden = single;
      next.disabled = !loop && page === pageCount - 1;
    }
  }

  function setPage(target) {
    if (loop) {
      page = (target + pageCount) % pageCount;
    } else {
      page = Math.max(0, Math.min(target, pageCount - 1));
    }

    viewport.scrollTo({
      left: slideForPage(page).offsetLeft,
      behavior: REDUCED_MOTION ? 'auto' : 'smooth',
    });

    syncControls();
  }

  function currentPage() {
    const middle = viewport.scrollLeft + viewport.clientWidth / 2;
    let nearest = 0;

    slides.forEach(function (slide, index) {
      if (slide.offsetLeft <= middle) {
        nearest = index;
      }
    });

    return Math.min(Math.floor(nearest / columns), pageCount - 1);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    if (!autoplay || pageCount < 2) {
      return;
    }

    stop();
    timer = window.setInterval(function () {
      setPage(page === pageCount - 1 ? 0 : page + 1);
    }, interval);
  }

  if (prev) {
    prev.addEventListener('click', function () {
      stop();
      setPage(page - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      stop();
      setPage(page + 1);
      start();
    });
  }

  let frame = null;

  viewport.addEventListener('scroll', function () {
    if (frame) {
      return;
    }

    frame = window.requestAnimationFrame(function () {
      frame = null;
      page = currentPage();
      syncControls();
    });
  });

  let resizeFrame = null;

  window.addEventListener('resize', function () {
    if (resizeFrame) {
      return;
    }

    resizeFrame = window.requestAnimationFrame(function () {
      resizeFrame = null;

      const nextColumns = getColumns(root, columnsProperty);

      if (nextColumns === columns) {
        return;
      }

      columns = nextColumns;
      pageCount = Math.ceil(slides.length / columns);
      page = Math.min(currentPage(), pageCount - 1);
      buildDots();
      syncControls();
      start();
    });
  });

  if (pauseOnHover) {
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }

  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  buildDots();
  syncControls();
  start();
}
