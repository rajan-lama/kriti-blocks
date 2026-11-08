/**
 * Build the inline styles for the stat wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the stat element.
 */
export const getStatStyles = (attributes) => {
  const { statAlign } = attributes;

  const styles = {};

  if (statAlign) {
    styles.textAlign = statAlign;
  }

  return styles;
};
