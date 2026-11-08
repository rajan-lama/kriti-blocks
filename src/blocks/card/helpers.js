/**
 * Build the inline styles for the card wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the card element.
 */
export const getCardStyles = (attributes) => {
  const { cardAlign, borderRadius, hasShadow } = attributes;

  const styles = {};

  if (cardAlign) {
    styles.textAlign = cardAlign;
  }

  if (borderRadius) {
    styles.borderRadius = `${borderRadius}px`;
  }

  if (hasShadow) {
    styles.boxShadow = '0 4px 14px rgba( 0, 0, 0, 0.12 )';
  }

  return styles;
};
