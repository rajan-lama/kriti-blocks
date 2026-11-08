/**
 * Small validators shared by the per-block option helpers.
 *
 * Every function returns `undefined` (or an empty string) for anything it does
 * not recognise, so an unknown or malicious value never reaches the saved
 * markup. Callers add classes, styles or elements only when a value comes back.
 */

const COLOR_PATTERNS = [
  /^#[0-9a-f]{3,8}$/i,
  /^(?:rgb|rgba|hsl|hsla)\(\s*[\d.\s,%/-]+\)$/i,
  /^var\(--wp--preset--color--[a-z0-9-]+\)$/i,
  /^[a-z]{3,20}$/i,
];

const SAFE_SCHEMES = ['http', 'https', 'mailto', 'tel'];

export const FONT_STACKS = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export const TEXT_SHADOWS = {
  soft: '0 1px 2px rgba(0, 0, 0, 0.25)',
  medium: '0 2px 6px rgba(0, 0, 0, 0.35)',
  strong: '0 3px 10px rgba(0, 0, 0, 0.55)',
  glow: '0 0 12px rgba(255, 255, 255, 0.85)',
};

/**
 * Return the value when it is one of the allowed values.
 *
 * @param {*}     value Candidate value.
 * @param {Array} list  Allowed values.
 * @return {*} The value or undefined.
 */
export const oneOf = (value, list) =>
  list.includes(value) ? value : undefined;

/**
 * Clamp a finite number into a range.
 *
 * @param {*}      value Candidate value.
 * @param {number} min   Lowest allowed value.
 * @param {number} max   Highest allowed value.
 * @return {number|undefined} Clamped number or undefined when not numeric.
 */
export const num = (value, min, max) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return undefined;
  }
  return Math.min(Math.max(n, min), max);
};

/**
 * Accept hex, rgb(a), hsl(a), a named color or a preset color variable.
 *
 * @param {*} value Candidate color.
 * @return {string|undefined} The trimmed color or undefined.
 */
export const safeColor = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const color = value.trim();
  return COLOR_PATTERNS.some((pattern) => pattern.test(color))
    ? color
    : undefined;
};

/**
 * Accept http(s), mailto, tel and relative URLs only.
 *
 * @param {*} value Candidate URL.
 * @return {string} A safe URL or an empty string.
 */
export const safeUrl = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  // eslint-disable-next-line no-control-regex
  const url = value.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  const scheme = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme && !SAFE_SCHEMES.includes(scheme[1].toLowerCase())) {
    return '';
  }
  return url;
};

/**
 * Link attributes for an anchor, or null when there is no safe URL.
 *
 * @param {Object}  link          Link options.
 * @param {string}  link.url      Destination.
 * @param {boolean} link.newTab   Open in a new tab.
 * @param {boolean} link.nofollow Add rel="nofollow".
 * @return {Object|null} Props for an <a> element.
 */
export const getLinkProps = ({ url, newTab, nofollow } = {}) => {
  const href = safeUrl(url);
  if (!href) {
    return null;
  }
  const rel = [];
  if (nofollow) {
    rel.push('nofollow');
  }
  if (newTab) {
    rel.push('noopener', 'noreferrer');
  }
  return {
    href,
    target: newTab ? '_blank' : undefined,
    rel: rel.length ? rel.join(' ') : undefined,
  };
};

/**
 * Resolve a font family choice into a CSS value.
 *
 * @param {string} key    One of sans, serif, mono, custom.
 * @param {string} custom Custom family list, used when key is "custom".
 * @return {string|undefined} CSS font-family value.
 */
export const getFontFamily = (key, custom) => {
  if (FONT_STACKS[key]) {
    return FONT_STACKS[key];
  }
  if (
    key === 'custom' &&
    typeof custom === 'string' &&
    /^[A-Za-z0-9 ,'"_-]{1,100}$/.test(custom.trim())
  ) {
    return custom.trim();
  }
  return undefined;
};

/**
 * Join class names, returning undefined when there are none.
 *
 * @param {...string} parts Class names, falsy values are skipped.
 * @return {string|undefined} Class string.
 */
export const joinClasses = (...parts) =>
  parts.filter(Boolean).join(' ') || undefined;

/**
 * Accept http(s) and relative URLs only (for media sources).
 *
 * @param {*} value Candidate URL.
 * @return {string} A safe URL or an empty string.
 */
export const safeMediaUrl = (value) => {
  const url = safeUrl(value);
  return /^(mailto|tel):/i.test(url) ? '' : url;
};
