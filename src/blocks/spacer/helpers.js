/**
 * Build the inline styles for the spacer.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the spacer element.
 */
export const getSpacerStyles = (attributes) => {
  const { spacerHeight } = attributes;

  return {
    height: `${spacerHeight || 50}px`,
  };
};
