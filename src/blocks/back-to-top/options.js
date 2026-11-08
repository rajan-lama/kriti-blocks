/**
 * Optional back-to-top settings. Each one adds nothing to the saved markup at
 * its default (attribute left unset), so buttons saved before these options
 * existed stay valid.
 */
import { BackToTopIcon } from './icon';
import { safeColor, clampPos, oneOf, compact } from '../../shared/kbi-safe';

export const ICON_TYPES = ['chevron', 'arrow', 'double'];
export const SHADOWS = ['none', 'large'];

const svg = (path) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  chevron: svg('M7.4 15.4 12 10.8l4.6 4.6L18 14l-6-6-6 6z'),
  arrow: svg('M11 20h2V8.8l4.6 4.6 1.4-1.4L12 5l-7 7 1.4 1.4L11 8.8z'),
  double: svg(
    'M7.4 18.4 12 13.8l4.6 4.6L18 17l-6-6-6 6zm0-6L12 7.8l4.6 4.6L18 11l-6-6-6 6z',
  ),
};

/**
 * @param {string|undefined} type Saved icon type.
 * @return {Element} The default arrow unless a known icon is chosen.
 */
export const getBackToTopIconElement = (type) =>
  ICONS[oneOf(type, ICON_TYPES)] || BackToTopIcon;

/**
 * Trimmed visible label, or undefined.
 *
 * @param {*} label Saved label.
 * @return {string|undefined} Label.
 */
export const getLabel = (label) =>
  typeof label === 'string' && label.trim()
    ? label.trim().slice(0, 30)
    : undefined;

export const getBackToTopOptionVars = (attributes) => {
  const {
    hoverBackground,
    hoverIconColor,
    borderWidth,
    borderColor,
    progressColor,
  } = attributes;
  const width = clampPos(borderWidth, 1, 10);

  return compact({
    '--bw-btt-hover-bg': safeColor(hoverBackground),
    '--bw-btt-hover-color': safeColor(hoverIconColor),
    '--bw-btt-border-w': width ? `${Math.round(width)}px` : undefined,
    '--bw-btt-border-c': width ? safeColor(borderColor) : undefined,
    '--bw-btt-ring':
      attributes.showProgress === true ? safeColor(progressColor) : undefined,
  });
};

export const getBackToTopOptionClasses = (attributes) => {
  const classes = [];
  const shadow = oneOf(attributes.shadowStyle, SHADOWS);

  if (shadow) {
    classes.push(`bw-btt--shadow-${shadow}`);
  }
  if (getLabel(attributes.label)) {
    classes.push('bw-btt--has-label');
  }
  if (attributes.showProgress === true) {
    classes.push('bw-btt--progress');
  }
  return classes;
};

export const getBackToTopOptionData = (attributes) => {
  const duration = clampPos(attributes.scrollDuration, 100, 3000);

  return compact({
    'data-duration': duration ? String(Math.round(duration)) : undefined,
    'data-progress': attributes.showProgress === true ? 'true' : undefined,
  });
};

/**
 * Progress ring drawn around the button. Only rendered when enabled.
 */
export const ProgressRing = () => (
  <svg
    className="bw-btt__ring"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle className="bw-btt__ring-track" cx="24" cy="24" r="22" />
    <circle className="bw-btt__ring-bar" cx="24" cy="24" r="22" />
  </svg>
);
