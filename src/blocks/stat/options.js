import { joinClasses, num, oneOf, safeColor } from '../../shared/kbsb-options';

export const SEPARATORS = ['comma', 'space', 'dot', 'none'];
export const EASINGS = ['linear', 'inout'];
const DEFAULT_DURATION = 1400;

/**
 * Extra CSS variables and data attributes for the options added after the
 * first release. Everything is optional and adds nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{style: Object, data: Object}} Additions for the wrapper.
 */
export const getStatExtras = (attributes) => {
  const style = {};
  const data = {};

  const valueColor = safeColor(attributes.valueColor);
  if (valueColor) {
    style['--kb-stat-value'] = valueColor;
  }
  const labelColor = safeColor(attributes.labelColor);
  if (labelColor) {
    style['--kb-stat-label'] = labelColor;
  }
  const valueSize = num(attributes.valueSize, 12, 200);
  if (valueSize !== undefined) {
    style['--kb-stat-size'] = `${valueSize}px`;
  }
  const barColor = safeColor(attributes.progressColor);
  if (barColor) {
    style['--kb-stat-bar'] = barColor;
  }

  const duration = num(attributes.countDuration, 200, 10000);
  if (duration !== undefined && Math.round(duration) !== DEFAULT_DURATION) {
    data['data-bw-duration'] = String(Math.round(duration));
  }
  const start = num(attributes.startValue, -1000000000, 1000000000);
  if (start !== undefined && start !== 0) {
    data['data-bw-start'] = String(start);
  }
  const decimals = num(attributes.decimals, 0, 6);
  if (decimals !== undefined) {
    data['data-bw-decimals'] = String(Math.round(decimals));
  }
  const separator = oneOf(attributes.separator, SEPARATORS);
  if (separator) {
    data['data-bw-sep'] = separator;
  }
  const easing = oneOf(attributes.easing, EASINGS);
  if (easing) {
    data['data-bw-ease'] = easing;
  }

  return { style, data };
};

/**
 * Props for the wrapper, merged with the existing class name and style.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} baseStyle  Style from getStatStyles().
 * @return {Object} Props for the wrapper element.
 */
export const getStatProps = (attributes, baseStyle) => {
  const extras = getStatExtras(attributes);
  return {
    className: joinClasses(attributes.extraClass),
    style: { ...baseStyle, ...extras.style },
    ...extras.data,
  };
};

/**
 * Progress bar percentage, or undefined when the bar is off.
 *
 * @param {Object} attributes Block attributes.
 * @return {number|undefined} 0 to 100.
 */
export const getProgress = (attributes) =>
  attributes.showProgress === true
    ? num(attributes.progressValue, 0, 100)
    : undefined;
