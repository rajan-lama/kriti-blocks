/**
 * Build the inline styles for the quote.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the blockquote element.
 */
export const getQuoteStyles = (attributes) => {
  const { quoteAlign, quoteSize, borderColor } = attributes;

  const styles = {};

  if (quoteAlign) {
    styles.textAlign = quoteAlign;
  }

  if (quoteSize === 'small') {
    styles.fontSize = '1.1em';
  } else if (quoteSize === 'large') {
    styles.fontSize = '1.6em';
  }

  if (borderColor) {
    styles.borderLeftColor = borderColor;
  }

  return styles;
};
