import { getStickyOptionVars } from './options';

/**
 * Build the CSS custom properties for the sticky section.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object with CSS variables.
 */
export const getStickyStyleVars = (attributes) => {
  const { stickyOffset, zIndex } = attributes;

  return {
    '--bw-sticky-offset': `${stickyOffset}px`,
    '--bw-sticky-z': zIndex,
    ...getStickyOptionVars(attributes),
  };
};
