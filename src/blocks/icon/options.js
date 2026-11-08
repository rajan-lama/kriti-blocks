import {
  getLinkProps,
  joinClasses,
  num,
  oneOf,
  safeColor,
} from '../../shared/kbsb-options';

export const ALIGNS = ['left', 'center', 'right'];
export const LABEL_POSITIONS = ['right'];

/**
 * Extra classes, styles and content for the options added after the first
 * release. Everything is optional and adds nothing at its default.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object, link: (Object|null), label: string}} Additions.
 */
export const getIconExtras = (attributes) => {
  const classes = [];
  const style = {};

  const hoverColor = safeColor(attributes.hoverColor);
  if (hoverColor) {
    style['--bw-icon-hover-color'] = hoverColor;
  }
  const hoverBg = safeColor(attributes.hoverBg);
  if (hoverBg) {
    style['--bw-icon-hover-bg'] = hoverBg;
  }

  const rotation = num(attributes.rotation, -360, 360);
  if (rotation !== undefined && rotation !== 0) {
    style['--bw-icon-rot'] = `${Math.round(rotation)}deg`;
  }

  const tablet = num(attributes.sizeTablet, 8, 500);
  const mobile = num(attributes.sizeMobile, 8, 500);
  if (tablet !== undefined) {
    style['--bw-icon-size-t'] = `${Math.round(tablet)}px`;
  }
  if (mobile !== undefined) {
    style['--bw-icon-size-m'] = `${Math.round(mobile)}px`;
  }
  if (tablet !== undefined || mobile !== undefined) {
    classes.push('kb-icon--rs');
  }

  const align = oneOf(attributes.iconAlign, ALIGNS);
  if (align) {
    style.textAlign = align;
  }

  const label = String(attributes.label || '')
    .trim()
    .slice(0, 120);
  if (label && oneOf(attributes.labelPosition, LABEL_POSITIONS)) {
    classes.push('kb-icon--label-right');
  }

  const link = getLinkProps({
    url: attributes.linkUrl,
    newTab: attributes.linkNewTab === true,
    nofollow: attributes.linkNofollow === true,
  });
  if (link) {
    const name = String(attributes.ariaLabel || '')
      .trim()
      .slice(0, 120);
    if (name) {
      link['aria-label'] = name;
    }
    link.className = 'bw-icon-link';
  }

  return { classes, style, link, label };
};

/**
 * Props for the wrapper element, merged with the existing style.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} baseStyle  Existing CSS variables.
 * @return {Object} Props for the wrapper.
 */
export const getIconProps = (attributes, baseStyle) => {
  const extras = getIconExtras(attributes);
  const props = { style: { ...baseStyle, ...extras.style } };
  const className = joinClasses(...extras.classes);
  if (className) {
    props.className = className;
  }
  return props;
};
