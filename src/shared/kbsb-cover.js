import { joinClasses, num, safeColor } from './kbsb-options';

const VERTICAL = { top: 'flex-start', bottom: 'flex-end' };

/**
 * Extra classes and styles shared by the Cover and Hero blocks for the
 * options added after their first release. Everything is optional and adds
 * nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object, contentStyle: Object}} Additions.
 */
export const getCoverExtras = (attributes) => {
  const classes = [];
  const style = {};
  const contentStyle = {};

  if (attributes.parallax === true) {
    classes.push('kb-cover--parallax');
  }

  const from = safeColor(attributes.overlayGradFrom);
  const to = safeColor(attributes.overlayGradTo);
  if (from && to) {
    const angle = num(attributes.overlayGradAngle, 0, 360) ?? 180;
    const gradient = `linear-gradient( ${angle}deg, ${from}, ${to} )`;
    const { backgroundUrl } = attributes;
    style.backgroundImage = backgroundUrl
      ? `${gradient}, url(${backgroundUrl})`
      : gradient;
  }

  const focal = attributes.focalPoint;
  if (focal && typeof focal === 'object') {
    const x = num(focal.x, 0, 1);
    const y = num(focal.y, 0, 1);
    if (x !== undefined && y !== undefined) {
      style.backgroundPosition = `${Math.round(x * 100)}% ${Math.round(
        y * 100,
      )}%`;
    }
  }

  if (VERTICAL[attributes.verticalAlign]) {
    style.alignItems = VERTICAL[attributes.verticalAlign];
  }

  const maxWidth = num(attributes.contentMaxWidth, 200, 2400);
  if (maxWidth !== undefined) {
    contentStyle.maxWidth = `${Math.round(maxWidth)}px`;
  }

  const tablet = num(attributes.heightTablet, 100, 2000);
  const mobile = num(attributes.heightMobile, 100, 2000);
  if (tablet !== undefined) {
    style['--kb-cover-h-t'] = `${Math.round(tablet)}px`;
  }
  if (mobile !== undefined) {
    style['--kb-cover-h-m'] = `${Math.round(mobile)}px`;
  }
  if (tablet !== undefined || mobile !== undefined) {
    classes.push('kb-cover--rh');
  }

  return { classes, style, contentStyle };
};

/**
 * Wrapper class name including the extras.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Class string.
 */
export const getCoverClass = (attributes) =>
  joinClasses(attributes.extraClass, ...getCoverExtras(attributes).classes);
