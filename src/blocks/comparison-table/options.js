import { pick, safeNumber, setColorVar } from '../../shared/marketing-options';

/**
 * Comparison table options. Each one adds nothing to the markup at its
 * default, so tables saved before these options existed stay valid.
 */
export const CELL_ALIGNS = ['left', 'center', 'right'];
export const DENSITIES = ['compact', 'default', 'comfortable'];

/**
 * Classes and CSS variables for the comparison table wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Wrapper additions.
 */
export function getComparisonTableOptions(attributes) {
  const {
    stickyHeader,
    stickyOffset,
    stickyFirstCol,
    cellAlign,
    striped,
    rowHover,
    density,
    hideNo,
    yesColor,
    noColor,
    headerBg,
    headerColor,
  } = attributes;
  const classes = [];
  const style = {};

  if (stickyHeader) {
    classes.push('bw-cmp--sticky-head');
    const offset = safeNumber(stickyOffset, 0, 400);
    if (offset) {
      style['--kb-cmp-sticky-top'] = `${offset}px`;
    }
  }
  if (stickyFirstCol) {
    classes.push('bw-cmp--sticky-col');
  }
  const align = pick(cellAlign, CELL_ALIGNS, 'center');
  if (align !== 'center') {
    classes.push(`bw-cmp--align-${align}`);
  }
  if (striped) {
    classes.push('bw-cmp--striped');
  }
  if (rowHover) {
    classes.push('bw-cmp--row-hover');
  }
  const dense = pick(density, DENSITIES, 'default');
  if (dense !== 'default') {
    classes.push(`bw-cmp--${dense}`);
  }
  if (hideNo) {
    classes.push('bw-cmp--hide-no');
  }
  setColorVar(style, '--kb-cmp-yes', yesColor);
  setColorVar(style, '--kb-cmp-no', noColor);
  setColorVar(style, '--kb-cmp-head-bg', headerBg);
  setColorVar(style, '--kb-cmp-head-color', headerColor);

  return { classes, style };
}
