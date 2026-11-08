import { getOffcanvasOptionVars, getOffcanvasOptionClasses } from './options';

/**
 * Build the CSS custom properties for the off-canvas drawer.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object with CSS variables.
 */
export const getOffcanvasStyleVars = (attributes) => {
  const { triggerBackground, triggerColor, drawerWidth, drawerBackground } =
    attributes;

  return {
    '--bw-oc-trigger-bg': triggerBackground,
    '--bw-oc-trigger-color': triggerColor,
    '--bw-oc-width': `${drawerWidth}px`,
    '--bw-oc-panel-bg': drawerBackground,
    ...getOffcanvasOptionVars(attributes),
  };
};

/**
 * Build the modifier class names for the off-canvas wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Space separated class names.
 */
export const getOffcanvasClassName = (attributes) => {
  const { side } = attributes;

  return [
    `bw-offcanvas--${side || 'right'}`,
    ...getOffcanvasOptionClasses(attributes),
  ].join(' ');
};
