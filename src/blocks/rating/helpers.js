/**
 * Clamp a number between a minimum and maximum.
 *
 * @param {number} value Value to clamp.
 * @param {number} min   Minimum value.
 * @param {number} max   Maximum value.
 * @return {number} Clamped value.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Get the rating value formatted for display.
 *
 * @param {number} value Rating value.
 * @return {number} Display value with a single decimal place.
 */
export const getDisplayValue = (value) => {
  const numericValue = Number(value) || 0;
  return Number(numericValue.toFixed(1));
};

/**
 * Get the fill percentage for a single star.
 *
 * @param {number} value Rating value.
 * @param {number} index Zero-based star index.
 * @return {number} Fill percentage between 0 and 100.
 */
export const getStarFillPercent = (value, index) => {
  const numericValue = Number(value) || 0;
  return clamp((numericValue - index) * 100, 0, 100);
};

/**
 * Build the inline styles for the rating wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the rating element.
 */
export const getRatingStyles = (attributes) => {
  const { starColor, emptyStarColor } = attributes;

  return {
    '--bw-rating-color': starColor || '#f59e0b',
    '--bw-rating-empty': emptyStarColor || '#e5e7eb',
  };
};

/**
 * Build the class name for the rating wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Class name string.
 */
export const getRatingClassName = (attributes) => {
  const { starSize, extraClass } = attributes;

  return (
    ['bw-rating', `bw-rating--${starSize || 'medium'}`, extraClass]
      .filter(Boolean)
      .join(' ') || undefined
  );
};
