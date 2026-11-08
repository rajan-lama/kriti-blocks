/**
 * Checks for layout values that blocks write into an inline style.
 *
 * A value that does not pass is left out, so it can never add other CSS
 * declarations to the block's style attribute. Normal values pass unchanged.
 */

const LENGTH =
  /^(auto|0|-?(\d+|\d*\.\d+)(px|em|rem|%|vh|vw|vmin|vmax|ch|svh|dvh|lvh))$/;
// A simple calc() with numbers, units, + - * / and brackets, such as calc(100vh - 80px).
const CALC = /^calc\([0-9a-z%.+\-*/() ]{1,80}\)$/i;
const POSITIONS = ['static', 'relative', 'absolute', 'fixed', 'sticky'];
const DISPLAYS = ['flex', 'inline-flex', 'block', 'grid', 'inline-grid'];

/**
 * A CSS length such as 300px or 30vh, or a simple calc().
 *
 * @param {*} value Raw value.
 * @return {string|undefined} The value, or undefined if it is not a length.
 */
export function safeLength(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return LENGTH.test(trimmed) || (CALC.test(trimmed) && balanced(trimmed))
    ? trimmed
    : undefined;
}

function balanced(text) {
  let depth = 0;
  for (const char of text) {
    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
      if (depth < 0) {
        return false;
      }
    }
  }
  return depth === 0;
}

/**
 * A CSS position keyword.
 *
 * @param {*} value Raw value.
 * @return {string|undefined} The keyword, or undefined.
 */
export function safePosition(value) {
  return POSITIONS.includes(value) ? value : undefined;
}

/**
 * A whole-number z-index (or "auto").
 *
 * @param {*} value Raw value, a number or a string.
 * @return {string|number|undefined} The value, or undefined.
 */
export function safeZIndex(value) {
  if (value === 'auto') {
    return value;
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) && Math.abs(value) <= 99999
      ? value
      : undefined;
  }
  return typeof value === 'string' && /^-?\d{1,5}$/.test(value.trim())
    ? value.trim()
    : undefined;
}

/**
 * A CSS display keyword the layout blocks support.
 *
 * @param {*} value Raw value.
 * @return {string|undefined} The keyword, or undefined.
 */
export function safeDisplay(value) {
  return DISPLAYS.includes(value) ? value : undefined;
}
