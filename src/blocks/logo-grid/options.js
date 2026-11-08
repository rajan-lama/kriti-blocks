import {
  getLinkProps,
  joinClasses,
  num,
  oneOf,
} from '../../shared/kbsb-options';

export const ALIGNS = ['left', 'right'];

/**
 * Extra classes and CSS variables for the options added after the first
 * release. Everything is optional and adds nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Additions for the wrapper.
 */
export const getLogoExtras = (attributes) => {
  const classes = [];
  const style = {};

  const tablet = num(attributes.colsTablet, 1, 6);
  const mobile = num(attributes.colsMobile, 1, 4);
  if (tablet !== undefined) {
    style['--kb-lg-t'] = Math.round(tablet);
  }
  if (mobile !== undefined) {
    style['--kb-lg-m'] = Math.round(mobile);
  }
  if (tablet !== undefined || mobile !== undefined) {
    classes.push('kb-lg--rc');
  }

  const height = num(attributes.logoHeight, 16, 200);
  if (height !== undefined) {
    style['--kb-lg-h'] = `${Math.round(height)}px`;
  }
  const gap = num(attributes.logoGap, 0, 100);
  if (gap !== undefined) {
    style['--kb-lg-gap'] = `${Math.round(gap)}px`;
  }
  const opacity = num(attributes.logoOpacity, 10, 100);
  if (opacity !== undefined) {
    style['--kb-lg-op'] = opacity / 100;
  }

  if (attributes.carouselMode === true) {
    classes.push('kb-lg--strip');
  }

  const align = oneOf(attributes.logoAlign, ALIGNS);
  if (align) {
    classes.push(`kb-lg--${align}`);
  }

  return { classes, style };
};

/**
 * Wrapper props merged with the existing class list.
 *
 * @param {Object} attributes Block attributes.
 * @param {string} baseClass  Existing class list.
 * @return {Object} Props for the wrapper element.
 */
export const getLogoProps = (attributes, baseClass) => {
  const extras = getLogoExtras(attributes);
  const props = { className: joinClasses(baseClass, ...extras.classes) };
  if (Object.keys(extras.style).length) {
    props.style = extras.style;
  }
  return props;
};

/**
 * Link props for a logo, or null when it has no safe URL.
 *
 * @param {Object} item Logo item.
 * @return {Object|null} Props for the anchor.
 */
export const getLogoLink = (item) =>
  getLinkProps({
    url: item && item.link,
    newTab: item && item.newTab === true,
    nofollow: item && item.nofollow === true,
  });
