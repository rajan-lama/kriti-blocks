import {
  getBackToTopOptionVars,
  getBackToTopOptionClasses,
  getLabel,
} from './options';

/**
 * Build the CSS custom properties for the back to top button.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object with CSS variables.
 */
export const getBackToTopStyleVars = (attributes) => {
  const { buttonSize, iconSize, shape, backgroundColor, iconColor } =
    attributes;

  let radius = '0';

  if (shape === 'circle') {
    radius = '50%';
  } else if (shape === 'rounded') {
    radius = '10px';
  }

  if (radius === '50%' && getLabel(attributes.label)) {
    radius = '999px';
  }

  return {
    '--bw-btt-size': `${buttonSize}px`,
    '--bw-btt-icon-size': `${iconSize}px`,
    '--bw-btt-bg': backgroundColor,
    '--bw-btt-color': iconColor,
    '--bw-btt-radius': radius,
    ...getBackToTopOptionVars(attributes),
  };
};

/**
 * Build the fixed positioning styles for the back to top wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for positioning.
 */
export const getBackToTopPositionStyles = (attributes) => {
  const { position, offset } = attributes;

  const styles = {
    position: 'fixed',
    bottom: `${offset}px`,
    zIndex: 1000,
  };

  if (position === 'bottom-left') {
    styles.left = `${offset}px`;
  } else {
    styles.right = `${offset}px`;
  }

  return styles;
};

/**
 * Build the modifier class names for the back to top wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Space separated class names.
 */
export const getBackToTopClassName = (attributes) => {
  const { position, shape } = attributes;

  return [
    `bw-btt--${position || 'bottom-right'}`,
    `bw-btt--shape-${shape || 'circle'}`,
    ...getBackToTopOptionClasses(attributes),
  ].join(' ');
};
