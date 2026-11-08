/**
 * Build the inline styles for the text block.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the text element.
 */
export const getTextStyles = (attributes) => {
  const {
    contentColor,
    fontSize,
    fontWeight,
    textAlign,
    textTransform,
    letterSpacing,
    lineHeight,
  } = attributes;

  const styles = {};

  if (contentColor) {
    styles.color = contentColor;
  }

  if (fontSize) {
    styles.fontSize = `${fontSize}px`;
  }

  if (fontWeight) {
    styles.fontWeight = fontWeight;
  }

  if (textAlign) {
    styles.textAlign = textAlign;
  }

  if (textTransform && textTransform !== 'default') {
    styles.textTransform = textTransform;
  }

  if (letterSpacing && letterSpacing !== 'normal') {
    styles.letterSpacing = letterSpacing;
  }

  if (lineHeight) {
    styles.lineHeight = lineHeight;
  }

  return styles;
};

/**
 * Build the class list for the text block.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Class string for the text element.
 */
export const getTextClasses = (attributes) => {
  const { dropCap } = attributes;
  const classes = [];

  if (dropCap) {
    classes.push('has-drop-cap');
  }

  return classes.join(' ');
};
