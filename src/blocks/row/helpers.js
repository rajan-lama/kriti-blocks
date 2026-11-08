import {
  DIRECTIONS,
  WRAPS,
  JUSTIFIES,
  ALIGNS,
  getRowOptionVars,
} from './options';
import {
  safeDisplay,
  safeLength,
  safePosition,
  safeZIndex,
} from '../../shared/layout-values';

/**
 * Normalize a layout option value to a CSS value.
 *
 * The shared inspector panels use "default"/"normal" sentinel values to
 * indicate that the theme/fallback should be used.
 *
 * @param {string|undefined} value    Raw attribute value.
 * @param {string}           fallback CSS value to use when the attribute is not set.
 * @return {string} CSS value.
 */
const normalizeValue = (value, fallback, allowed) => {
  if (allowed && !allowed.includes(value)) {
    return fallback;
  }

  if (
    value === undefined ||
    value === null ||
    value === '' ||
    value === 'default' ||
    value === 'normal'
  ) {
    return fallback;
  }
  return value;
};

/**
 * Build the inline styles for the row wrapper.
 *
 * Layout values are exposed as CSS custom properties so the flexbox layout
 * can be applied both to the block wrapper (front end) and to the inner
 * blocks container (editor) from a single set of attributes.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for useBlockProps / useBlockProps.save.
 */
export const getRowStyles = (attributes) => {
  const {
    displayType,
    rowDirection,
    flexWrap,
    justifyContent,
    alignItem,
    gap,
    minHeight,
    positionType,
    zindex,
  } = attributes;

  const styles = {
    '--bw-row-display': normalizeValue(safeDisplay(displayType), 'flex'),
    '--bw-row-direction': normalizeValue(rowDirection, 'row', DIRECTIONS),
    '--bw-row-wrap': normalizeValue(flexWrap, 'nowrap', WRAPS),
    '--bw-row-justify': normalizeValue(justifyContent, 'flex-start', JUSTIFIES),
    '--bw-row-align': normalizeValue(alignItem, 'stretch', ALIGNS),
    '--bw-row-gap': gap ? `${gap}px` : '0px',
    ...getRowOptionVars(attributes),
  };

  // These three are typed or stored as text, so only well-formed values are used.
  const height = safeLength(minHeight);
  if (height) {
    styles.minHeight = height;
  }

  const position = safePosition(positionType);
  if (position) {
    styles.position = position;
  }

  const layer = safeZIndex(zindex);
  if (layer !== undefined) {
    styles.zIndex = layer;
  }

  return styles;
};
