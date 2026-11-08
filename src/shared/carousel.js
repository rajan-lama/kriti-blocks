/**
 * Shared front end carousel behavior.
 *
 * The track is a horizontally scrollable list, so every slide stays reachable
 * without JavaScript. When JavaScript is available the controls are revealed
 * and scroll position, dots, and arrows are kept in sync.
 */

const REDUCED_MOTION = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

/**
 * Initializes a carousel instance.
 *
 * @param {HTMLElement} root    Carousel root element.
 * @param {Object}      options Selector and class configuration.
 * @return {void}
 */
export function initCarousel(root, options) {
  const {
    slideSelector,
    viewportSelector,
    prevSelector,
    nextSelector,
    dotSelector,
    jsClass,
  } = options;

  const viewport = root.querySelector(viewportSelector);
  const slides = Array.from(root.querySelectorAll(slideSelector));

  if (!viewport || slides.length < 2) {
    return;
  }

  const columns = parseInt(root.dataset.columns, 10) || 1;
  const pageCount = Math.ceil(slides.length / columns);

  if (pageCount < 2) {
    return;
  }

  const prev = root.querySelector(prevSelector);
  const next = root.querySelector(nextSelector);
  const dots = Array.from(root.querySelectorAll(dotSelector));
  const autoplay = root.dataset.autoplay === 'true' && !REDUCED_MOTION;
  const interval = parseInt(root.dataset.interval, 10) || 5000;

  let page = 0;
  let timer = null;

  root.classList.add(jsClass);

  function slideForPage(target) {
    return slides[Math.min(target * columns, slides.length - 1)];
  }

  function setPage(target) {
    page = Math.max(0, Math.min(target, pageCount - 1));

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

  function syncControls() {
    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === page);

      if (index === page) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    if (prev) {
      prev.disabled = page === 0;
    }

    if (next) {
      next.disabled = page === pageCount - 1;
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

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      stop();
      setPage(index);
      start();
    });
  });

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

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  syncControls();
  start();
}

/**
 * Slides visible at the current viewport. Breakpoints are 1024px (tablet) and
 * 600px (mobile). Defaults are 2 on tablet and 1 on mobile, to match the CSS.
 *
 * @param {HTMLElement} root Carousel root with data-columns attributes.
 * @return {number} Slides per page.
 */
export function visibleColumns(root) {
  const desktop = parseInt(root.dataset.columns, 10) || 1;
  const tablet = parseInt(root.dataset.columnsTablet, 10) || 2;
  const mobile = parseInt(root.dataset.columnsMobile, 10) || 1;

  if (window.matchMedia('(max-width: 600px)').matches) {
    return mobile;
  }
  if (window.matchMedia('(max-width: 1024px)').matches) {
    return tablet;
  }
  return desktop;
}

/**
 * Makes the number of dots match the number of pages at this viewport.
 *
 * @param {HTMLElement} list  Element that holds the dot buttons.
 * @param {number}      pages Page count.
 * @return {void}
 */
export function syncDots(list, pages) {
  if (!list || !list.firstElementChild) {
    return;
  }
  while (list.children.length > pages) {
    list.lastElementChild.remove();
  }
  while (list.children.length < pages) {
    const copy = list.firstElementChild.cloneNode(true);
    copy.classList.remove('is-active');
    copy.removeAttribute('aria-current');
    copy.setAttribute(
      'aria-label',
      (copy.getAttribute('aria-label') || '').replace(
        /\d+/,
        String(list.children.length + 1),
      ),
    );
    list.appendChild(copy);
  }
}
