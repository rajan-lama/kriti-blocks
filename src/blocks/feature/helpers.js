/**
 * Build the inline styles for the feature wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the feature element.
 */
export const getFeatureStyles = (attributes) => {
  const { iconColor, iconBackground, iconSize } = attributes;

  const styles = {};

  if (iconColor) {
    styles['--bw-feature-icon-color'] = iconColor;
  }

  if (iconBackground) {
    styles['--bw-feature-icon-bg'] = iconBackground;
  }

  if (iconSize) {
    styles['--bw-feature-icon-size'] = `${iconSize}px`;
  }

  return styles;
};

/**
 * Build the modifier class names for the feature wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Space separated class names.
 */
export const getFeatureClassName = (attributes) => {
  const { iconPosition, iconShape, contentAlign } = attributes;

  return [
    `bw-feature--icon-${iconPosition || 'top'}`,
    `bw-feature--shape-${iconShape || 'rounded'}`,
    `bw-feature--align-${contentAlign || 'left'}`,
  ].join(' ');
};
