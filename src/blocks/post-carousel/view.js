/**
 * Front end carousel behavior for the BW Post Carousel block.
 *
 * The track is a horizontally scrollable list, so every slide stays reachable
 * without JavaScript. When JavaScript is available the controls are revealed
 * and scroll position, dots, and arrows are kept in sync.
 */
import { initCarousel } from '../../shared/carousel';

const SELECTORS = {
  slideSelector: '.bw-post-carousel__slide',
  viewportSelector: '.bw-post-carousel__viewport',
  prevSelector: '.bw-post-carousel__arrow--prev',
  nextSelector: '.bw-post-carousel__arrow--next',
  dotSelector: '.bw-post-carousel__dot',
  jsClass: 'bw-post-carousel--js',
};

/**
 * Slides visible at the current viewport. The breakpoints match style.scss,
 * and the defaults (2 on tablet, 1 on mobile) match the CSS fallbacks.
 *
 * @param {HTMLElement} root Carousel root.
 * @return {number} Slides per page.
 */
function visibleColumns(root) {
  const desktop = parseInt(root.dataset.columns, 10) || 1;
  let tablet = 2;
  let mobile = 1;

  if (root.dataset.columnsTablet) {
    tablet = parseInt(root.dataset.columnsTablet, 10) || tablet;
  }

  if (root.dataset.columnsMobile) {
    mobile = parseInt(root.dataset.columnsMobile, 10) || mobile;
  }

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
 * @param {HTMLElement} root  Carousel root.
 * @param {number}      pages Page count.
 * @return {void}
 */
function syncDots(root, pages) {
  const list = root.querySelector('.bw-post-carousel__dots');

  if (!list || !list.firstElementChild) {
    return;
  }

  while (list.children.length > pages) {
    list.lastElementChild.remove();
  }

  while (list.children.length < pages) {
    const copy = list.firstElementChild.cloneNode(true);
    const dot = copy.querySelector('button');

    if (dot) {
      dot.classList.remove('is-active');
      dot.removeAttribute('aria-current');
      dot.setAttribute(
        'aria-label',
        (dot.getAttribute('aria-label') || '').replace(
          /\d+/,
          String(list.children.length + 1),
        ),
      );
    }

    list.appendChild(copy);
  }
}

document
  .querySelectorAll('.wp-block-kriti-blocks-post-carousel')
  .forEach(function (root) {
    const slides = root.querySelectorAll(SELECTORS.slideSelector).length;
    const columns = visibleColumns(root);

    root.dataset.columns = String(columns);
    syncDots(root, Math.ceil(slides / columns));

    initCarousel(root, SELECTORS);
  });
