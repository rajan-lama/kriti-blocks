/**
 * Optional grid settings. Every option is unset by default and adds nothing to
 * the markup until it is used, so grids saved before these options existed
 * stay valid.
 */
import { clampPos, oneOf, compact } from '../../shared/kbi-safe';

export const ALIGNS = ['start', 'center', 'end'];

const count = (value) => {
  const n = clampPos(value, 1, 12);
  return n === undefined ? undefined : Math.round(n);
};

export const getGridOptionVars = (attributes) => {
  const tablet = count(attributes.colsTablet);
  const mobile = count(attributes.colsMobile);
  const min = clampPos(attributes.autoFitMin, 80, 800);

  return compact({
    '--bw-grid-cols-t': tablet,
    '--bw-grid-cols-m': mobile,
    '--bw-grid-min': min ? `${Math.round(min)}px` : undefined,
  });
};

export const getGridOptionClasses = (attributes) => {
  const classes = [];
  const align = oneOf(attributes.gridAlign, ALIGNS);
  const justify = oneOf(attributes.gridJustify, ALIGNS);

  if (count(attributes.colsTablet)) {
    classes.push('bw-grid--cols-t');
  }
  if (count(attributes.colsMobile)) {
    classes.push('bw-grid--cols-m');
  }
  if (clampPos(attributes.autoFitMin, 80, 800)) {
    classes.push('bw-grid--auto');
  }
  if (align) {
    classes.push(`bw-grid--align-${align}`);
  }
  if (justify) {
    classes.push(`bw-grid--justify-${justify}`);
  }
  if (attributes.gridDense === true) {
    classes.push('bw-grid--dense');
  }
  return classes;
};

export const joinClasses = (base, extra) =>
  [base, ...extra].filter(Boolean).join(' ');
