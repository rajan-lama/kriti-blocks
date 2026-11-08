/**
 * Build the inline styles for the pricing column wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the pricing column element.
 */
export const getPricingColumnStyles = (attributes) => {
  const { planAlign } = attributes;

  const styles = {};

  if (planAlign) {
    styles.textAlign = planAlign;
  }

  return styles;
};

/**
 * Convert the plain-text feature list into an array of items.
 *
 * @param {string} features Newline separated feature list.
 * @return {string[]} Array of non-empty feature items.
 */
export const getFeatureItems = (features) =>
  String(features || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
