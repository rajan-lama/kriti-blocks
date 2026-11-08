/**
 * Optional sticky settings. Each one adds nothing to the saved markup at its
 * default (attribute left unset), so sections saved before these options
 * existed stay valid.
 */
import { safeColor, clampPos, oneOf, compact } from '../../shared/kbi-safe';

export const DISABLE_ON = ['tablet', 'mobile'];

export const getStickyOptionVars = (attributes) => {
  const pad = clampPos(attributes.stuckPadding, 1, 200);

  return compact({
    '--bw-sticky-stuck-bg': safeColor(attributes.stuckBackground),
    '--bw-sticky-stuck-pad': pad ? `${Math.round(pad)}px` : undefined,
  });
};

export const getStickyOptionClasses = (attributes) => {
  const classes = [];
  const off = oneOf(attributes.disableOn, DISABLE_ON);

  if (off) {
    classes.push(`bw-sticky--off-${off}`);
  }
  if (attributes.stickTo === 'bottom') {
    classes.push('bw-sticky--bottom');
  }
  if (safeColor(attributes.stuckBackground)) {
    classes.push('bw-sticky--stuck-bg');
  }
  if (clampPos(attributes.stuckPadding, 1, 200)) {
    classes.push('bw-sticky--shrink');
  }
  if (attributes.hideOnScrollDown === true && attributes.stickTo !== 'bottom') {
    classes.push('bw-sticky--smart');
  }
  return classes;
};
