import { joinClasses, num, oneOf, safeColor } from '../../shared/kbsb-options';

export const SHAPES = {
  star: 'M12 2l2.9 6.26L21.5 9.27l-4.75 4.42L18.18 20 12 16.5 5.82 20l1.43-6.31L2.5 9.27l6.6-1.01L12 2z',
  heart:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  circle: 'M12 2a10 10 0 100 20 10 10 0 000-20z',
  bolt: 'M7 2v11h3v9l7-12h-4l4-8z',
};
export const LABEL_POSITIONS = ['before', 'below'];

/**
 * Path for the chosen icon shape, defaulting to the star.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} SVG path data.
 */
export const getShapePath = (attributes) =>
  Object.prototype.hasOwnProperty.call(SHAPES, attributes.iconShape)
    ? SHAPES[attributes.iconShape]
    : SHAPES.star;

/**
 * Fill percentage helper input: rounds the value to the nearest half star
 * when the option is on.
 *
 * @param {Object} attributes Block attributes.
 * @return {number} Value used to fill the stars.
 */
export const getFillValue = (attributes) => {
  const value = Number(attributes.ratingValue) || 0;
  return attributes.roundHalf === true ? Math.round(value * 2) / 2 : value;
};

/**
 * Extra classes and CSS variables for the options added after the first
 * release. Everything is optional and adds nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Additions for the wrapper.
 */
export const getRatingExtras = (attributes) => {
  const classes = [];
  const style = {};

  const position = oneOf(attributes.labelPosition, LABEL_POSITIONS);
  if (position) {
    classes.push(`bw-rating--label-${position}`);
  }

  const size = num(attributes.customSize, 10, 96);
  if (size !== undefined) {
    style['--bw-rating-size'] = `${size}px`;
  }
  const gap = num(attributes.starGap, 0, 24);
  if (gap !== undefined) {
    style['--kb-rating-gap'] = `${gap}px`;
  }
  const valueColor = safeColor(attributes.valueColor);
  if (valueColor) {
    style['--kb-rating-value'] = valueColor;
  }
  const labelColor = safeColor(attributes.labelColor);
  if (labelColor) {
    style['--kb-rating-label'] = labelColor;
  }

  return { classes, style };
};

/**
 * Merge the extras into the wrapper class name and style.
 *
 * @param {Object}           attributes Block attributes.
 * @param {string|undefined} baseClass  Class from getRatingClassName().
 * @param {Object}           baseStyle  Style from getRatingStyles().
 * @return {{className: (string|undefined), style: Object}} Props for the wrapper.
 */
export const getRatingProps = (attributes, baseClass, baseStyle) => {
  const extras = getRatingExtras(attributes);
  return {
    className: joinClasses(baseClass, ...extras.classes),
    style: { ...baseStyle, ...extras.style },
  };
};

/**
 * Schema.org AggregateRating microdata, or null when the option is off or
 * the item name and review count are missing.
 *
 * @param {Object} attributes Block attributes.
 * @return {{name: string, count: number}|null} Data for the markup.
 */
export const getSchema = (attributes) => {
  // With voting on, the saved numbers would not match the live average.
  if (attributes.schemaMarkup !== true || attributes.allowVoting === true) {
    return null;
  }
  const name = String(attributes.schemaName || '')
    .trim()
    .slice(0, 150);
  const count = num(attributes.ratingCount, 1, 100000000);
  if (!name || count === undefined) {
    return null;
  }
  return { name, count: Math.round(count) };
};

/**
 * The id that ties a block to its stored votes, or undefined when voting is
 * off or the id is not in the expected format.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Vote id.
 */
export const getVoteId = (attributes) =>
  attributes.allowVoting === true &&
  /^[a-z0-9]{6,40}$/.test(String(attributes.voteId || ''))
    ? attributes.voteId
    : undefined;
