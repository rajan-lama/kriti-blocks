import { pick, setColorVar } from '../../shared/marketing-options';

/**
 * Pricing column options. Each one adds nothing to the markup at its default,
 * so columns saved before these options existed stay valid.
 */
export const FEATURE_ICONS = ['check', 'cross', 'dot', 'arrow', 'none'];
export const BUTTON_STYLES = ['solid', 'outline', 'ghost'];

const text = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Split a feature line into its text and whether it is marked "not included"
 * with a leading "[x] ". Only used when the marker option is on.
 *
 * @param {string}  line    Feature line.
 * @param {boolean} markers Whether markers are enabled.
 * @return {{text: string, excluded: boolean}} Parsed feature.
 */
export function parseFeature(line, markers) {
  if (markers) {
    const match = String(line).match(/^\[x\]\s*(.*)$/i);
    if (match) {
      return { text: match[1], excluded: true };
    }
  }
  return { text: line, excluded: false };
}

/**
 * Classes, CSS variables and extra values for the pricing column.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Options for save() and edit().
 */
export function getPricingColumnOptions(attributes) {
  const {
    featureIconStyle,
    featureIconColor,
    featureMarkers,
    badgeText,
    badgeBg,
    badgeColor,
    currencySymbol,
    originalPrice,
    buttonStyle,
    buttonBg,
    buttonColor,
    buttonNewTab,
    buttonNofollow,
    accentColor,
    yearlyPrice,
    yearlyPeriod,
  } = attributes;
  const classes = [];
  const style = {};

  const icons = pick(featureIconStyle, FEATURE_ICONS, 'check');
  if (icons !== 'check') {
    classes.push(`bw-pricing--icons-${icons}`);
  }
  setColorVar(style, '--kb-pc-icon', featureIconColor);
  setColorVar(style, '--kb-pc-accent', accentColor);
  setColorVar(style, '--kb-pc-badge-bg', badgeBg);
  setColorVar(style, '--kb-pc-badge-color', badgeColor);
  setColorVar(style, '--kb-pc-btn-bg', buttonBg);
  setColorVar(style, '--kb-pc-btn-color', buttonColor);
  if (style['--kb-pc-btn-bg']) {
    classes.push('bw-pricing--btn-custom');
  }

  const btnStyle = pick(buttonStyle, BUTTON_STYLES, 'solid');
  const rel = [
    buttonNofollow ? 'nofollow' : '',
    buttonNewTab ? 'noopener noreferrer' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    classes,
    style,
    markers: !!featureMarkers,
    badgeText: text(badgeText),
    currency: text(currencySymbol),
    originalPrice: text(originalPrice),
    yearlyPrice: text(yearlyPrice),
    yearlyPeriod: text(yearlyPeriod),
    buttonClass:
      btnStyle === 'solid'
        ? 'bw-pricing-button'
        : `bw-pricing-button bw-pricing-button--${btnStyle}`,
    target: buttonNewTab ? '_blank' : undefined,
    rel: rel || undefined,
  };
}
