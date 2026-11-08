import {
  joinClasses,
  num,
  oneOf,
  safeColor,
  safeUrl,
} from '../../shared/kbsb-options';

export const BORDER_SIDES = ['left', 'right', 'top', 'bottom', 'none'];

/**
 * Extra classes and styles for the options added after the first release.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object, quoteStyle: Object, citeStyle: Object}} Additions.
 */
export const getQuoteExtras = (attributes) => {
  const classes = [];
  const style = {};
  const quoteStyle = {};
  const citeStyle = {};

  const side = oneOf(attributes.borderSide, BORDER_SIDES);
  if (side && side !== 'left') {
    classes.push(`kb-q--border-${side}`);
    const color = safeColor(attributes.borderColor);
    if (color) {
      style['--kb-q-bc'] = color;
    }
  }

  const width = num(attributes.borderWidth, 1, 24);
  if (width !== undefined) {
    style['--kb-q-bw'] = `${width}px`;
  }

  if (attributes.showQuoteIcon === true) {
    classes.push('kb-q--icon');
    const iconColor = safeColor(attributes.quoteIconColor);
    if (iconColor) {
      style['--kb-q-ic'] = iconColor;
    }
  }

  const quoteColor = safeColor(attributes.quoteColor);
  if (quoteColor) {
    quoteStyle.color = quoteColor;
  }

  const citeColor = safeColor(attributes.citationColor);
  if (citeColor) {
    citeStyle.color = citeColor;
  }
  if (attributes.citationStyle === 'normal') {
    citeStyle.fontStyle = 'normal';
  }

  return { classes, style, quoteStyle, citeStyle };
};

/**
 * Merge the extras into the existing class name and style.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} base       Existing styles from getQuoteStyles().
 * @return {{className: (string|undefined), style: Object}} Props for the blockquote.
 */
export const getQuoteProps = (attributes, base) => {
  const extras = getQuoteExtras(attributes);
  return {
    className: joinClasses(attributes.extraClass, ...extras.classes),
    style: { ...base, ...extras.style },
  };
};

/**
 * Whether the quote shows an author image.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} A safe image URL or an empty string.
 */
export const getAuthorImage = (attributes) => safeUrl(attributes.authorImage);

/**
 * Props for the quote text and citation, empty at the defaults.
 *
 * @param {Object} attributes Block attributes.
 * @return {{quote: Object, cite: Object}} Props.
 */
export const getTextProps = (attributes) => {
  const { quoteStyle, citeStyle } = getQuoteExtras(attributes);
  return {
    quote: Object.keys(quoteStyle).length ? { style: quoteStyle } : {},
    cite: Object.keys(citeStyle).length ? { style: citeStyle } : {},
  };
};
