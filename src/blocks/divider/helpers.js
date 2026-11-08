/**
 * Build the inline styles for the divider line.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the divider element.
 */
export const getDividerStyles = (attributes) => {
  const {
    dividerStyle,
    dividerColor,
    dividerWeight,
    dividerWidth,
    dividerAlign,
  } = attributes;

  const weight = dividerWeight || 2;

  const styles = {
    width: `${dividerWidth || 100}%`,
  };

  if (dividerAlign === 'left') {
    styles.marginRight = 'auto';
  } else if (dividerAlign === 'right') {
    styles.marginLeft = 'auto';
  } else {
    styles.marginLeft = 'auto';
    styles.marginRight = 'auto';
  }

  if (dividerStyle === 'gradient') {
    styles.height = `${weight}px`;
    styles.background = `linear-gradient( to right, rgba( 0, 0, 0, 0 ), ${dividerColor}, rgba( 0, 0, 0, 0 ) )`;
  } else {
    styles.border = 'none';
    styles.borderTop = `${weight}px ${dividerStyle} ${dividerColor}`;
  }

  return styles;
};
