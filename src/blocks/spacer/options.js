import { joinClasses, num, oneOf } from '../../shared/kbsb-options';

export const UNITS = ['px', 'rem', 'vh'];

/**
 * Spacer height with the chosen unit. Pixels stay the default.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} base       Styles from getSpacerStyles().
 * @return {Object} Style object.
 */
const withUnit = (attributes, base) => {
  const unit = oneOf(attributes.heightUnit, UNITS);
  if (!unit || unit === 'px') {
    return base;
  }
  return { ...base, height: `${attributes.spacerHeight || 50}${unit}` };
};

/**
 * Props for the spacer element: unit, per-device heights and classes.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} base       Styles from getSpacerStyles().
 * @return {{className: (string|undefined), style: Object}} Props.
 */
export const getSpacerProps = (attributes, base) => {
  const style = withUnit(attributes, base);
  const classes = [];
  const unit = oneOf(attributes.heightUnit, UNITS) || 'px';
  const tablet = num(attributes.heightTablet, 0, 1000);
  const mobile = num(attributes.heightMobile, 0, 1000);
  const extra = {};

  if (tablet !== undefined) {
    extra['--kb-sp-t'] = `${tablet}${unit}`;
  }
  if (mobile !== undefined) {
    extra['--kb-sp-m'] = `${mobile}${unit}`;
  }
  if (Object.keys(extra).length) {
    classes.push('kb-sp--rh');
  }

  return {
    className: joinClasses(attributes.extraClass, ...classes),
    style: { ...style, ...extra },
  };
};
