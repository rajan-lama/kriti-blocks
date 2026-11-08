/**
 * Build the inline styles for the image wrapper (figure).
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the figure element.
 */
export const getFigureStyles = (attributes) => {
  const { imageAlign } = attributes;

  const styles = {};

  if (imageAlign === 'left') {
    styles.marginRight = 'auto';
  } else if (imageAlign === 'right') {
    styles.marginLeft = 'auto';
  } else if (imageAlign === 'center') {
    styles.marginLeft = 'auto';
    styles.marginRight = 'auto';
  }

  return styles;
};

/**
 * Build the inline styles for the image element.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the img element.
 */
export const getImageStyles = (attributes) => {
  const { imageWidth, imageHeight, objectFit, borderRadius } = attributes;

  const styles = {};

  if (imageWidth) {
    styles.width = `${imageWidth}px`;
  }

  if (imageHeight) {
    styles.height = `${imageHeight}px`;
  }

  if (objectFit) {
    styles.objectFit = objectFit;
  }

  if (borderRadius) {
    styles.borderRadius = `${borderRadius}px`;
  }

  return styles;
};
