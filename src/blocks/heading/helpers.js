/**
 * Build the inline styles for the heading.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the heading element.
 */
export const getHeadingStyles = (attributes) => {
  const {
    headingColor,
    fontSize,
    fontWeight,
    textAlign,
    textTransform,
    letterSpacing,
    lineHeight,
  } = attributes;

  const styles = {};

  if (headingColor) {
    styles.color = headingColor;
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
