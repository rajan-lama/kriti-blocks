import {
  TEXT_SHADOWS,
  getFontFamily,
  joinClasses,
  num,
  oneOf,
  safeColor,
} from '../../shared/kbsb-options';

export const DECORATIONS = ['underline', 'line-through'];
export const DECORATION_STYLES = ['solid', 'dotted', 'dashed', 'wavy'];
export const BAR_ALIGNS = ['left', 'center', 'right'];

/**
 * Extra classes and inline styles for the heading options added after the
 * first release. Everything is optional and adds nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Additions for the element.
 */
export const getHeadingExtras = (attributes) => {
  const classes = [];
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

  const decoration = oneOf(attributes.textDecoration, DECORATIONS);
  if (decoration) {
    style.textDecorationLine = decoration;
    const decorationStyle = oneOf(
      attributes.decorationStyle,
      DECORATION_STYLES,
    );
    if (decorationStyle) {
      style.textDecorationStyle = decorationStyle;
    }
    const decorationColor = safeColor(attributes.decorationColor);
    if (decorationColor) {
      style.textDecorationColor = decorationColor;
    }
  }

  const from = safeColor(attributes.gradientFrom);
  const to = safeColor(attributes.gradientTo);
  if (from && to) {
    classes.push('kb-h--gradient');
    style['--kb-h-g1'] = from;
    style['--kb-h-g2'] = to;
    const angle = num(attributes.gradientAngle, 0, 360);
    if (angle !== undefined) {
      style['--kb-h-gangle'] = `${angle}deg`;
    }
  }

  const highlight = safeColor(attributes.highlightColor);
  if (highlight && !decoration) {
    classes.push('kb-h--hl');
    style['--kb-h-hl'] = highlight;
  }

  if (attributes.accentBar === true) {
    classes.push('kb-h--bar');
    const barAlign = oneOf(attributes.barAlign, BAR_ALIGNS);
    if (barAlign && barAlign !== 'left') {
      classes.push(`kb-h--bar-${barAlign}`);
    }
    const barColor = safeColor(attributes.barColor);
    if (barColor) {
      style['--kb-h-bar-color'] = barColor;
    }
    const barWidth = num(attributes.barWidth, 10, 400);
    if (barWidth !== undefined) {
      style['--kb-h-bar-w'] = `${barWidth}px`;
    }
    const barHeight = num(attributes.barHeight, 1, 20);
    if (barHeight !== undefined) {
      style['--kb-h-bar-h'] = `${barHeight}px`;
    }
  }

  return { classes, style };
};

/**
 * Merge the extras into the existing class name and style.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} base       Existing styles from getHeadingStyles().
 * @return {{className: (string|undefined), style: Object}} Props for the element.
 */
export const getHeadingProps = (attributes, base) => {
  const extras = getHeadingExtras(attributes);
  return {
    className: joinClasses(attributes.extraClass, ...extras.classes),
    style: { ...base, ...extras.style },
  };
};
