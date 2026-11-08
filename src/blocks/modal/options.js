/**
 * Optional modal settings. Each one adds nothing to the saved markup at its
 * default (attribute left unset), so modals saved before these options
 * existed stay valid.
 */
import {
  safeColor,
  safeSelector,
  clampNum,
  clampPos,
  oneOf,
  compact,
} from '../../shared/kbi-safe';

export const ANIMATIONS = ['fade', 'zoom', 'slide', 'none'];

export const getModalOptionVars = (attributes) => {
  const { overlayColor, overlayBlur, maxHeight } = attributes;
  const blur = clampPos(overlayBlur, 1, 30);
  const height = clampPos(maxHeight, 30, 100);

  return compact({
    '--bw-modal-overlay': safeColor(overlayColor),
    '--bw-modal-blur': blur ? `${blur}px` : undefined,
    '--bw-modal-max-h': height ? `${height}vh` : undefined,
  });
};

export const getModalOptionClasses = (attributes) => {
  const classes = [];
  const animation = oneOf(attributes.animation, ANIMATIONS);

  if (animation) {
    classes.push(`bw-modal--anim-${animation}`);
  }
  if (attributes.hideTrigger === true) {
    classes.push('bw-modal--no-trigger');
  }
  return classes;
};

/**
 * data-* attributes read by view.js. Only the enabled ones are returned.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Data attributes.
 */
export const getModalOptionData = (attributes) => {
  const { autoOpen, autoOpenDelay, exitIntent, scrollOpen, showOnceDays } =
    attributes;
  const delay = clampNum(autoOpenDelay, 0, 600);
  const scroll = clampPos(scrollOpen, 1, 100);
  const days = clampPos(showOnceDays, 1, 365);
  const hasAuto = autoOpen === true || exitIntent === true || !!scroll;

  return compact({
    'data-auto-open':
      autoOpen === true ? String(Math.round(delay || 0)) : undefined,
    'data-exit-intent': exitIntent === true ? 'true' : undefined,
    'data-scroll-open': scroll ? String(Math.round(scroll)) : undefined,
    'data-once-days': hasAuto && days ? String(Math.round(days)) : undefined,
    'data-trigger-selector': safeSelector(attributes.triggerSelector),
  });
};
