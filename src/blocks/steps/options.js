import {
  pick,
  safeNumber,
  safeUrl,
  setColorVar,
} from '../../shared/marketing-options';

/**
 * Steps options. Each one adds nothing to the markup at its default, so
 * steps saved before these options existed stay valid.
 */
export const NUMBER_STYLES = ['circle', 'square', 'rounded', 'plain'];
export const NUMBER_FORMATS = ['decimal', 'zero', 'alpha'];
export const STEP_ALIGNS = ['left', 'center'];

/**
 * Classes and CSS variables for the steps wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Wrapper additions.
 */
export function getStepsOptions(attributes) {
  const {
    numberStyle,
    numberSize,
    numberBg,
    numberColor,
    connector,
    connectorColor,
    stepAlign,
  } = attributes;
  const classes = [];
  const style = {};

  const shape = pick(numberStyle, NUMBER_STYLES, 'circle');
  if (shape !== 'circle') {
    classes.push(`bw-steps--num-${shape}`);
  }
  const size = safeNumber(numberSize, 20, 120);
  if (size !== undefined) {
    style['--kb-steps-num'] = `${size}px`;
  }
  setColorVar(style, '--kb-steps-num-bg', numberBg);
  setColorVar(style, '--kb-steps-num-color', numberColor);
  setColorVar(style, '--kb-steps-line', connectorColor);
  if (connector) {
    classes.push('bw-steps--connector');
  }
  if (pick(stepAlign, STEP_ALIGNS, 'left') === 'center') {
    classes.push('bw-steps--center');
  }

  return { classes, style };
}

/**
 * The text shown inside a step marker.
 *
 * @param {number} index  Zero-based step index.
 * @param {string} format decimal, zero (01, 02) or alpha (A, B).
 * @return {string|number} Marker text.
 */
export function formatStepNumber(index, format) {
  const kind = pick(format, NUMBER_FORMATS, 'decimal');
  if (kind === 'zero') {
    return String(index + 1).padStart(2, '0');
  }
  if (kind === 'alpha') {
    let n = index;
    let out = '';
    do {
      out = String.fromCharCode(65 + (n % 26)) + out;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return out;
  }
  return index + 1;
}

/**
 * Validated link for a step title, or an empty string.
 *
 * @param {Object} step Step object.
 * @return {string} Safe URL or ''.
 */
export function getStepUrl(step) {
  return safeUrl(step && step.url);
}
