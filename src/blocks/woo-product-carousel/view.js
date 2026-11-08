/**
 * Front end carousel behavior for the BW Product Carousel block.
 *
 * The track is a horizontally scrollable list, so every slide stays reachable
 * without JavaScript. When JavaScript is available the controls are revealed
 * and scroll position, dots, and arrows are kept in sync.
 */
import { initKbWooCarousel } from '../../shared/kbwoo-carousel';

const SELECTORS = {
  slideSelector: '.bw-woo-product-carousel__slide',
  viewportSelector: '.bw-woo-product-carousel__viewport',
  prevSelector: '.bw-woo-product-carousel__arrow--prev',
  nextSelector: '.bw-woo-product-carousel__arrow--next',
  dotsSelector: '.bw-woo-product-carousel__dots',
  dotSelector: '.bw-woo-product-carousel__dot',
  dotClass: 'bw-woo-product-carousel__dot',
  columnsProperty: '--bw-woo-product-carousel-columns',
  jsClass: 'bw-woo-product-carousel--js',
};

document
  .querySelectorAll('.wp-block-kriti-blocks-woo-product-carousel')
  .forEach(function (root) {
    initKbWooCarousel(root, SELECTORS);
  });
