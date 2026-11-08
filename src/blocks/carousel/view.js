/**
 * Front end behavior for the BW Carousel when it shows more than one slide
 * at a time. The default one-slide carousel is driven by Bootstrap instead.
 *
 * The track scrolls horizontally, so every slide stays reachable without
 * JavaScript. With JavaScript the arrows and dots are revealed and kept in sync.
 */
import { initCarousel, visibleColumns, syncDots } from '../../shared/carousel';

const SELECTORS = {
  slideSelector: '.kb-carousel__slide',
  viewportSelector: '.kb-carousel__viewport',
  prevSelector: '.kb-carousel__arrow--prev',
  nextSelector: '.kb-carousel__arrow--next',
  dotSelector: '.kb-carousel__dot',
  jsClass: 'kb-carousel--js',
};

document.querySelectorAll('.kb-carousel--multi').forEach(function (root) {
  const slides = root.querySelectorAll(SELECTORS.slideSelector).length;
  const columns = visibleColumns(root);

  root.dataset.columns = String(columns);
  syncDots(
    root.querySelector('.kb-carousel__dots'),
    Math.ceil(slides / columns),
  );

  initCarousel(root, SELECTORS);
});
