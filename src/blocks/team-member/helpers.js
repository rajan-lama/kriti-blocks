/**
 * Build the inline styles for the team member wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the team member element.
 */
export const getTeamMemberStyles = (attributes) => {
  const { memberAlign, hasShadow } = attributes;

  const styles = {};

  if (memberAlign) {
    styles.textAlign = memberAlign;
  }

  if (hasShadow) {
    styles.boxShadow = '0 4px 14px rgba( 0, 0, 0, 0.12 )';
  }

  return styles;
};
