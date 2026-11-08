/**
 * Build the CSS custom properties for the modal.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object with CSS variables.
 */
export const getModalStyleVars = (attributes) => {
  const {
    triggerBackground,
    triggerColor,
    panelWidth,
    panelBackground,
    panelRadius,
  } = attributes;

  return {
    '--bw-modal-trigger-bg': triggerBackground,
    '--bw-modal-trigger-color': triggerColor,
    '--bw-modal-width': `${panelWidth}px`,
    '--bw-modal-panel-bg': panelBackground,
    '--bw-modal-radius': `${panelRadius}px`,
  };
};

/**
 * Build the modifier class names for the modal wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Space separated class names.
 */
export const getModalClassName = (attributes) => {
  const { position } = attributes;

  return `bw-modal--${position || 'center'}`;
};
