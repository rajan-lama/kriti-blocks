import { pick, safeNumber } from '../../shared/marketing-options';

/**
 * Pricing table options. Each one adds nothing to the markup at its default,
 * so tables saved before these options existed stay valid.
 */
export const STACK_BELOW = ['none', 'tablet', 'mobile'];

/**
 * Classes and CSS variables for the pricing table wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Wrapper additions.
 */
export function getPricingTableOptions(attributes) {
  const {
    columns,
    columnGap,
    naturalHeight,
    stackBelow,
    billingToggle,
    monthlyLabel,
    yearlyLabel,
    yearlyDefault,
  } = attributes;
  const classes = [];
  const style = {};

  const count = safeNumber(columns, 1, 6);
  if (count !== undefined && Number.isInteger(count)) {
    classes.push('kb-pt--cols');
    style['--kb-pt-cols'] = count;
  }
  const gap = safeNumber(columnGap, 0, 120);
  if (gap !== undefined) {
    style['--kb-pt-gap'] = `${gap}px`;
  }
  if (naturalHeight) {
    classes.push('kb-pt--natural');
  }
  const stack = pick(stackBelow, STACK_BELOW, 'none');
  if (stack !== 'none') {
    classes.push(`kb-pt--stack-${stack}`);
  }

  const text = (v, fallback) =>
    typeof v === 'string' && v.trim() ? v.trim() : fallback;
  const toggle = billingToggle
    ? {
        monthly: text(monthlyLabel, 'Monthly'),
        yearly: text(yearlyLabel, 'Yearly'),
        yearlyDefault: !!yearlyDefault,
      }
    : null;
  if (toggle) {
    classes.push('kb-pt--toggle');
  }

  return { classes, style, toggle };
}
