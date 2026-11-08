import {
  getLinkProps,
  joinClasses,
  num,
  safeColor,
} from '../../shared/kbsb-options';

/**
 * Extra classes and CSS variables for the options added after the first
 * release. Everything is optional and adds nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Additions for the wrapper.
 */
export const getListExtras = (attributes) => {
  const classes = [];
  const style = {};

  const size = num(attributes.markerSize, 10, 64);
  if (size !== undefined) {
    style['--kb-list-marker'] = `${size}px`;
  }

  const gap = num(attributes.itemGap, 0, 80);
  if (gap !== undefined) {
    style['--kb-list-gap'] = `${gap}px`;
  }

  const columns = num(attributes.columns, 1, 3);
  if (columns !== undefined && columns >= 2) {
    classes.push('kb-list--cols');
    style['--kb-list-cols'] = Math.round(columns);
  }

  if (attributes.dividers === true) {
    classes.push('kb-list--divided');
    const color = safeColor(attributes.dividerColor);
    if (color) {
      style['--kb-list-div'] = color;
    }
  }

  return { classes, style };
};

/**
 * Merge the extras into the wrapper class name and style.
 *
 * @param {Object}           attributes Block attributes.
 * @param {string|undefined} baseClass  Class from getListClassName().
 * @param {Object}           baseStyle  Style from getListStyles().
 * @return {{className: (string|undefined), style: Object}} Props for the wrapper.
 */
export const getListProps = (attributes, baseClass, baseStyle) => {
  const extras = getListExtras(attributes);
  return {
    className: joinClasses(baseClass, ...extras.classes),
    style: { ...baseStyle, ...extras.style },
  };
};

/**
 * Number shown by the first numbered marker, as the index offset.
 *
 * @param {Object} attributes Block attributes.
 * @return {number} 0 for the default of 1.
 */
export const getIndexOffset = (attributes) => {
  const start = num(attributes.numberStart, 0, 9999);
  return start === undefined ? 0 : Math.round(start) - 1;
};

/**
 * Link props for an item, or null when it has no safe URL.
 *
 * @param {Object} item List item.
 * @return {Object|null} Props for the anchor.
 */
export const getItemLink = (item) =>
  getLinkProps({ url: item && item.url, newTab: item && item.newTab });
