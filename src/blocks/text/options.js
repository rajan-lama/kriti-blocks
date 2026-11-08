import {
  TEXT_SHADOWS,
  getFontFamily,
  joinClasses,
  num,
  oneOf,
} from '../../shared/kbsb-options';

export const MAX_WIDTH_UNITS = ['px', '%', 'em', 'ch'];

/**
 * Extra inline styles for the options added after the first release.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object, empty at the defaults.
 */
export const getTextExtras = (attributes) => {
  const style = {};

  const family = getFontFamily(
    attributes.fontFamily,
    attributes.fontFamilyCustom,
  );
  if (family) {
    style.fontFamily = family;
  }

  const shadow = TEXT_SHADOWS[attributes.textShadow];
  if (shadow) {
    style.textShadow = shadow;
  }

  const columns = num(attributes.columns, 1, 4);
  if (columns !== undefined && columns >= 2) {
    style.columnCount = Math.round(columns);
    const gap = num(attributes.columnGap, 0, 120);
    if (gap !== undefined) {
      style.columnGap = `${gap}px`;
    }
  }

  const unit = oneOf(attributes.maxWidthUnit, MAX_WIDTH_UNITS) || 'px';
  const max = num(attributes.maxWidth, 1, unit === '%' ? 100 : 2000);
  if (max !== undefined) {
    style.maxWidth = `${max}${unit}`;
    if (attributes.textAlign === 'center') {
      style.marginLeft = 'auto';
      style.marginRight = 'auto';
    } else if (attributes.textAlign === 'right') {
      style.marginLeft = 'auto';
    }
  }

  return style;
};

/**
 * Merge the extras into the existing class name and style.
 *
 * @param {Object} attributes Block attributes.
 * @param {string} classes    Existing class string from getTextClasses().
 * @param {Object} base       Existing styles from getTextStyles().
 * @return {{className: (string|undefined), style: Object}} Props for the element.
 */
export const getTextProps = (attributes, classes, base) => ({
  className: joinClasses(attributes.extraClass, classes),
  style: { ...base, ...getTextExtras(attributes) },
});
