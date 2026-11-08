import { pick, safeNumber, setColorVar } from '../../shared/marketing-options';

/**
 * Timeline options. Each one adds nothing to the markup at its default, so
 * timelines saved before these options existed stay valid.
 */
export const LAYOUTS = ['left', 'right', 'alternate'];
export const LINE_STYLES = ['solid', 'dashed', 'dotted'];
export const MARKER_STYLES = ['dot', 'ring', 'square'];
export const DATE_STYLES = ['plain', 'badge'];

/**
 * Classes and CSS variables for the timeline wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Wrapper additions.
 */
export function getTimelineOptions(attributes) {
  const {
    timelineLayout,
    lineStyle,
    lineWidth,
    lineColor,
    markerStyle,
    markerSize,
    dateStyle,
  } = attributes;
  const classes = [];
  const style = {};

  const layout = pick(timelineLayout, LAYOUTS, 'left');
  if (layout === 'right') {
    classes.push('bw-timeline--right');
  } else if (layout === 'alternate') {
    classes.push('bw-timeline--alt');
  }
  const line = pick(lineStyle, LINE_STYLES, 'solid');
  if (line !== 'solid') {
    classes.push(`bw-timeline--line-${line}`);
  }
  const width = safeNumber(lineWidth, 1, 10);
  if (width !== undefined) {
    style['--kb-tl-line-w'] = `${width}px`;
  }
  setColorVar(style, '--kb-tl-line', lineColor);
  const marker = pick(markerStyle, MARKER_STYLES, 'dot');
  if (marker !== 'dot') {
    classes.push(`bw-timeline--marker-${marker}`);
  }
  const size = safeNumber(markerSize, 8, 40);
  if (size !== undefined) {
    style['--kb-tl-marker'] = `${size}px`;
  }
  if (pick(dateStyle, DATE_STYLES, 'plain') === 'badge') {
    classes.push('bw-timeline--date-badge');
  }

  return { classes, style };
}
