/**
 * Optional columns settings. Every option is unset by default and adds
 * nothing to the markup until it is used, so content saved before these
 * options existed stays valid.
 */
import { clampNum, oneOf, compact } from '../../shared/kbi-safe';

export const ALIGNS = ['start', 'center', 'end'];
export const JUSTIFIES = ['center', 'end', 'between', 'around'];
export const STACK_ON = ['tablet', 'mobile'];

/**
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], rowStyle: (Object|undefined)}} Additions for
 *         the wrapper (classes) and the inner .row (gutter variables).
 */
export const getColumnsOptions = (attributes) => {
  const classes = [];
  const align = oneOf(attributes.rowAlign, ALIGNS);
  const justify = oneOf(attributes.rowJustify, JUSTIFIES);
  const stack = oneOf(attributes.stackOn, STACK_ON);

  if (align) {
    classes.push(`kb-columns--align-${align}`);
  }
  if (justify) {
    classes.push(`kb-columns--justify-${justify}`);
  }
  if (attributes.rowReverse === true) {
    classes.push('kb-columns--reverse');
  }
  if (stack) {
    classes.push(`kb-columns--stack-${stack}`);
    if (attributes.stackReverse === true) {
      classes.push('kb-columns--stack-reverse');
    }
  }

  const gap = clampNum(attributes.colGap, 0, 120);
  const rowGap = clampNum(attributes.rowGapY, 0, 120);
  const rowStyle = compact({
    '--bs-gutter-x': gap === undefined ? undefined : `${Math.round(gap)}px`,
    '--bs-gutter-y':
      rowGap === undefined ? undefined : `${Math.round(rowGap)}px`,
  });

  return {
    classes,
    rowStyle: Object.keys(rowStyle).length ? rowStyle : undefined,
  };
};

export const joinClasses = (base, extra) =>
  [base, ...extra].filter(Boolean).join(' ');
