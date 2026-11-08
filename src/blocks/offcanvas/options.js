/**
 * Optional off-canvas settings. Each one adds nothing to the saved markup at
 * its default (attribute left unset), so drawers saved before these options
 * existed stay valid.
 */
import {
  safeColor,
  safeSelector,
  clampNum,
  clampPos,
  compact,
} from '../../shared/kbi-safe';

const px = (value, min, max) => {
  const n = clampPos(value, min, max);
  return n ? `${Math.round(n)}px` : undefined;
};

export const getOffcanvasOptionVars = (attributes) => {
  const {
    overlayColor,
    overlayBlur,
    animationSpeed,
    widthTablet,
    widthMobile,
  } = attributes;
  const speed = clampNum(animationSpeed, 0, 1500);

  return compact({
    '--bw-oc-overlay': safeColor(overlayColor),
    '--bw-oc-blur': px(overlayBlur, 1, 30),
    '--bw-oc-speed': speed === undefined ? undefined : `${Math.round(speed)}ms`,
    '--bw-oc-width-tablet': px(widthTablet, 200, 900),
    '--bw-oc-width-mobile': px(widthMobile, 200, 900),
  });
};

export const getOffcanvasOptionClasses = (attributes) => {
  const classes = [];

  if (attributes.hamburger === true) {
    classes.push('bw-offcanvas--hamburger');
  }
  if (attributes.hideTrigger === true) {
    classes.push('bw-offcanvas--no-trigger');
  }
  return classes;
};

export const getOffcanvasOptionData = (attributes) =>
  compact({
    'data-close-on-link': attributes.closeOnLink === true ? 'true' : undefined,
    'data-trigger-selector': safeSelector(attributes.triggerSelector),
  });
