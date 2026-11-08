/**
 * Group-level options shared by the Accordion and FAQ blocks.
 *
 * Group styling is applied with classes and CSS variables on the wrapper,
 * because a block's save() cannot read context. Every option is optional and
 * adds nothing to the markup when it is left at its default, so content saved
 * before these options existed stays valid.
 */
export const ICON_STYLES = ['chevron', 'plus', 'caret', 'none'];
export const ICON_POSITIONS = ['right', 'left'];

const COLOR_VARS = {
  titleColor: '--kb-d-title',
  itemBg: '--kb-d-bg',
  openBg: '--kb-d-open-bg',
  hoverBg: '--kb-d-hover-bg',
  borderColor: '--kb-d-border',
  iconColor: '--kb-d-icon',
};

export const DISCLOSURE_ATTRIBUTES = {
  iconStyle: { type: 'string', enum: ICON_STYLES },
  iconPosition: { type: 'string', enum: ICON_POSITIONS },
  itemGap: { type: 'number' },
  itemRadius: { type: 'number' },
  titleColor: { type: 'string' },
  itemBg: { type: 'string' },
  openBg: { type: 'string' },
  hoverBg: { type: 'string' },
  borderColor: { type: 'string' },
  iconColor: { type: 'string' },
  faqSchema: { type: 'boolean', default: false },
};

/**
 * Classes and inline CSS variables for the wrapper element.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Wrapper additions.
 */
export function getDisclosureProps(attributes) {
  const classes = [];
  const style = {};
  const { iconStyle, iconPosition, itemGap, itemRadius } = attributes;

  if (ICON_STYLES.includes(iconStyle) && iconStyle !== 'chevron') {
    classes.push(`kb-d--icon-${iconStyle}`);
  }
  if (iconPosition === 'left') {
    classes.push('kb-d--icon-left');
  }
  if (typeof itemGap === 'number') {
    style['--kb-d-gap'] = `${itemGap}px`;
  }
  if (typeof itemRadius === 'number') {
    style['--kb-d-radius'] = `${itemRadius}px`;
  }
  Object.keys(COLOR_VARS).forEach((key) => {
    if (attributes[key]) {
      style[COLOR_VARS[key]] = attributes[key];
    }
  });
  return { classes, style };
}

/**
 * Merge the extra class (user supplied) with the group classes.
 *
 * @param {string}   extraClass Extra class from the block.
 * @param {string[]} classes    Group classes.
 * @return {string|undefined} Class name, or undefined when empty.
 */
export function joinClasses(extraClass, classes) {
  return [extraClass, ...classes].filter(Boolean).join(' ') || undefined;
}
