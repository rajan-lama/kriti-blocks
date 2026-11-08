/**
 * Tabs group options. Like the Accordion and FAQ options, each one adds
 * nothing to the markup at its default, so older content stays valid.
 */
export const TAB_STYLES = ['underline', 'pills', 'boxed'];
export const ORIENTATIONS = ['horizontal', 'vertical'];
export const TAB_ALIGNS = ['left', 'center', 'right', 'stretch'];

const COLOR_VARS = {
  activeColor: '--kb-t-active',
  tabColor: '--kb-t-color',
  hoverColor: '--kb-t-hover',
  activeBg: '--kb-t-active-bg',
  lineColor: '--kb-t-line',
  panelBg: '--kb-t-panel-bg',
};

export function getTabsProps(attributes) {
  const { tabsStyle, orientation, tabAlign, panelPadding } = attributes;
  const classes = [];
  const style = {};

  if (TAB_STYLES.includes(tabsStyle) && tabsStyle !== 'underline') {
    classes.push(`kb-tabs--${tabsStyle}`);
  }
  if (orientation === 'vertical') {
    classes.push('kb-tabs--vertical');
  }
  if (TAB_ALIGNS.includes(tabAlign) && tabAlign !== 'left') {
    classes.push(`kb-tabs--align-${tabAlign}`);
  }
  if (typeof panelPadding === 'number') {
    style['--kb-t-panel-pad'] = `${panelPadding}px`;
  }
  Object.keys(COLOR_VARS).forEach((key) => {
    if (attributes[key]) {
      style[COLOR_VARS[key]] = attributes[key];
    }
  });
  return { classes, style };
}

/**
 * The tab that starts open, kept inside the list.
 *
 * @param {number} defaultTab Saved index.
 * @param {number} count      Number of tabs.
 * @return {number} Index.
 */
export function startIndex(defaultTab, count) {
  if (!Number.isInteger(defaultTab) || defaultTab < 0 || defaultTab >= count) {
    return 0;
  }
  return defaultTab;
}
