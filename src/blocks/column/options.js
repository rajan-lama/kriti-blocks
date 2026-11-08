/**
 * Optional column settings. Every option is unset by default and adds
 * nothing to the markup until it is used, so content saved before these
 * options existed stays valid.
 */
import { clampPos, oneOf, compact } from '../../shared/kbi-safe';

export const SELF_ALIGNS = ['start', 'center', 'end'];
export const ORDERS = ['first', 'last'];

const span = (value) => {
  const n = clampPos(value, 1, 12);
  return n === undefined ? undefined : Math.round(n);
};

/**
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: (Object|undefined)}} Additions.
 */
export const getColumnOptions = (attributes) => {
  const classes = [];
  const tablet = span(attributes.colTablet);
  const mobile = span(attributes.colMobile);
  const self = oneOf(attributes.selfAlign, SELF_ALIGNS);
  const order = oneOf(attributes.mobileOrder, ORDERS);

  if (tablet) {
    classes.push(`kb-col-t-${tablet}`);
  }
  if (mobile) {
    classes.push(`kb-col-m-${mobile}`);
  }
  if (self) {
    classes.push(`kb-col--self-${self}`);
  }
  if (order) {
    classes.push(`kb-col--order-${order}`);
  }

  const top = clampPos(attributes.stickyTop, 1, 400);
  const sticky = attributes.sticky === true;
  if (sticky) {
    classes.push('kb-col--sticky');
  }

  const style = compact({
    '--kb-col-sticky-top': sticky && top ? `${Math.round(top)}px` : undefined,
  });

  return { classes, style: Object.keys(style).length ? style : undefined };
};

export const joinClasses = (base, extra) =>
  [base, ...extra].filter(Boolean).join(' ');
