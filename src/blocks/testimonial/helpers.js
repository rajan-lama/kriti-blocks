/**
 * Build the inline styles for the testimonial wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the testimonial element.
 */
export const getTestimonialStyles = (attributes) => {
  const { testimonialAlign } = attributes;

  const styles = {};

  if (testimonialAlign) {
    styles.textAlign = testimonialAlign;
  }

  return styles;
};
