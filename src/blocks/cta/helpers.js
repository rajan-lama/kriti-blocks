/**
 * Build the inline styles for the CTA wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the CTA element.
 */
export const getCtaStyles = (attributes) => {
  const { ctaAlign, ctaBackground, ctaTextColor } = attributes;

  const styles = {
    textAlign: ctaAlign || 'center',
    backgroundColor: ctaBackground || '#4f46e5',
    color: ctaTextColor || '#ffffff',
  };

  return styles;
};
