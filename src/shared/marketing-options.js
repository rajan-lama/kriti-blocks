/**
 * Small validation helpers shared by the marketing blocks (card, feature, CTA,
 * pricing, comparison table, steps, timeline, team member, testimonials).
 *
 * Every option built on these helpers adds nothing to the saved markup when it
 * is left at its default, so content saved before the option existed stays
 * valid. Values that fail validation are dropped instead of reaching markup.
 */

const COLOR_PATTERN =
  /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\(\s*[0-9.,%\s/-]+\)|[a-z]{3,24}|var\(--[a-z0-9-]+\))$/i;
const ALLOWED_PROTOCOLS = ['http', 'https', 'mailto', 'tel'];

/**
 * Return the color when it looks like a plain CSS color, else an empty string.
 *
 * @param {*} value Candidate color.
 * @return {string} Safe color or ''.
 */
export function safeColor(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const color = value.trim();
  return COLOR_PATTERN.test(color) ? color : '';
}

/**
 * Return the URL when its protocol is allowed (http, https, mailto, tel or
 * none, for relative links), else an empty string.
 *
 * @param {*} value Candidate URL.
 * @return {string} Safe URL or ''.
 */
export function safeUrl(value) {
  if (typeof value !== 'string') {
    return '';
  }
  // Browsers ignore control characters and spaces inside a scheme.
  // eslint-disable-next-line no-control-regex
  const url = value.trim().replace(/[\u0000-\u001F\u007F]/g, '');
  if (!url) {
    return '';
  }
  const scheme = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme) {
    return ALLOWED_PROTOCOLS.includes(scheme[1].toLowerCase()) ? url : '';
  }
  // "java\nscript:" style tricks leave a colon before any slash.
  return /^[^/?#]*:/.test(url) ? '' : url;
}

/**
 * Build a CSS url() value for an image, or '' when the URL is not safe to
 * place inside url("").
 *
 * @param {*} value Image URL.
 * @return {string} CSS value or ''.
 */
export function safeCssUrl(value) {
  const url = safeUrl(value);
  if (!url || /^(mailto|tel):/i.test(url) || /["'()\\\s<>]/.test(url)) {
    return '';
  }
  return `url("${url}")`;
}

/**
 * Return the value when it is in the allow-list, else the fallback.
 *
 * @param {*}        value    Candidate value.
 * @param {string[]} allowed  Allowed values.
 * @param {string}   fallback Fallback value.
 * @return {string} Allowed value.
 */
export function pick(value, allowed, fallback = '') {
  return allowed.includes(value) ? value : fallback;
}

/**
 * Return the value when it is a finite number inside the range, else
 * undefined.
 *
 * @param {*}      value Candidate number.
 * @param {number} min   Minimum.
 * @param {number} max   Maximum.
 * @return {number|undefined} The number or undefined.
 */
export function safeNumber(value, min, max) {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : undefined;
}

/**
 * Join the user's extra class with the option classes.
 *
 * @param {...(string|false|undefined)} parts Class names.
 * @return {string|undefined} Class name, or undefined when empty.
 */
export function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ') || undefined;
}

/**
 * Drop empty values from a style object.
 *
 * @param {Object} style Style object.
 * @return {Object} Style object with only set values.
 */
export function cleanStyle(style) {
  const out = {};
  Object.keys(style).forEach((key) => {
    if (style[key] !== undefined && style[key] !== '') {
      out[key] = style[key];
    }
  });
  return out;
}

/**
 * Set a CSS variable from a validated color.
 *
 * @param {Object} style Style object, changed in place.
 * @param {string} name  CSS variable name.
 * @param {*}      value Color candidate.
 */
export function setColorVar(style, name, value) {
  const color = safeColor(value);
  if (color) {
    style[name] = color;
  }
}
