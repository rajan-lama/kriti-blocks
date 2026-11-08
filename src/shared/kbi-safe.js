/**
 * Small validators for values that reach saved markup (inline CSS variables,
 * data attributes, class names). Anything that does not pass is dropped, so an
 * edited or malicious attribute can never inject CSS or HTML.
 */

const COLOR_RE =
  /^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\(\s*[\d.\s,%/-]+\)|var\(--[a-z0-9-]+\)|[a-z]{3,20})$/i;

// Plain CSS selectors only: ids, classes, attributes, combinators.
const SELECTOR_RE = /^[\w\s#.,>+~:[\]="'*()-]{1,120}$/;

/**
 * @param {*} value Candidate colour.
 * @return {string|undefined} The trimmed colour, or undefined when unsafe.
 */
export const safeColor = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return COLOR_RE.test(trimmed) ? trimmed : undefined;
};

/**
 * @param {*} value Candidate selector.
 * @return {string|undefined} The trimmed selector, or undefined when unsafe.
 */
export const safeSelector = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return SELECTOR_RE.test(trimmed) ? trimmed : undefined;
};

/**
 * @param {*}      value Candidate number.
 * @param {number} min   Lowest allowed value.
 * @param {number} max   Highest allowed value.
 * @return {number|undefined} The value clamped to the range, or undefined.
 */
export const clampNum = (value, min, max) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined;
  }
  return Math.min(max, Math.max(min, value));
};

/**
 * Like clampNum, but zero (or negative) means "not set" and returns undefined.
 *
 * @param {*}      value Candidate number.
 * @param {number} min   Lowest allowed value.
 * @param {number} max   Highest allowed value.
 * @return {number|undefined} The clamped value, or undefined when not positive.
 */
export const clampPos = (value, min, max) =>
  typeof value === 'number' && value > 0
    ? clampNum(value, min, max)
    : undefined;

/**
 * @param {*}        value Candidate value.
 * @param {string[]} list  Allow-list.
 * @return {string|undefined} The value when allowed, otherwise undefined.
 */
export const oneOf = (value, list) =>
  list.includes(value) ? value : undefined;

/**
 * Drop undefined entries so they never reach the markup.
 *
 * @param {Object} object Style or data object.
 * @return {Object} Object without undefined values.
 */
export const compact = (object) =>
  Object.fromEntries(Object.entries(object).filter(([, v]) => v !== undefined));

// http(s) or site-relative URLs without characters that could break out of
// url("..."), an attribute or markup.
const URL_RE = /^(?:https?:\/\/|\/(?!\/))[^\s"'()<>\\`{}]{1,2000}$/i;

/**
 * @param {*}         value Candidate URL.
 * @param {RegExp}    [ext] Optional file-extension test applied to the path.
 * @return {string|undefined} The URL when it is safe, otherwise undefined.
 */
export const safeUrl = (value, ext) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (!URL_RE.test(trimmed)) {
    return undefined;
  }
  if (ext && !ext.test(trimmed.split(/[?#]/)[0])) {
    return undefined;
  }
  return trimmed;
};
