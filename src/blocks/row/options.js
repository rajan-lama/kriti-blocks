/**
 * Optional row settings. Every option is unset by default and adds nothing to
 * the markup until it is used, so rows saved before these options existed
 * stay valid.
 */
import { clampNum, oneOf, compact } from '../../shared/kbi-safe';

export const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
export const WRAPS = ['nowrap', 'wrap', 'wrap-reverse'];
export const JUSTIFIES = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];
export const ALIGNS = [
  'stretch',
  'flex-start',
  'center',
  'flex-end',
  'baseline',
];
export const STACK_ON = ['tablet', 'mobile'];

const px = (value) => {
  const n = clampNum(value, 0, 200);
  return n === undefined ? undefined : `${Math.round(n)}px`;
};

export const getRowOptionVars = (attributes) =>
  compact({
    '--bw-row-gap-t': px(attributes.gapTablet),
    '--bw-row-gap-m': px(attributes.gapMobile),
  });

export const getRowOptionClasses = (attributes) => {
  const classes = [];
  const stack = oneOf(attributes.stackOn, STACK_ON);

  if (attributes.equalItems === true) {
    classes.push('bw-row--equal');
  }
  if (stack) {
    classes.push(`bw-row--stack-${stack}`);
    if (attributes.stackReverse === true) {
      classes.push('bw-row--stack-reverse');
    }
  }
  return classes;
};

export const joinClasses = (base, extra) =>
  [base, ...extra].filter(Boolean).join(' ');
