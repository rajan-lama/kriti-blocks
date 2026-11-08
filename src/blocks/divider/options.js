import { joinClasses, num, oneOf, safeColor } from '../../shared/kbsb-options';

export const ICONS = {
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  diamond: 'M12 2L2 12l10 10 10-10L12 2z',
  dot: 'M12 6a6 6 0 100 12 6 6 0 000-12z',
  heart:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
};

/**
 * Plain text and icon shown in the middle of the divider.
 *
 * @param {Object} attributes Block attributes.
 * @return {{text: string, icon: (string|undefined)}|null} Label or null for a plain line.
 */
export const getDividerLabel = (attributes) => {
  const text = String(attributes.dividerText || '')
    .trim()
    .slice(0, 120);
  const icon = oneOf(attributes.dividerIcon, Object.keys(ICONS));
  if (!text && !icon) {
    return null;
  }
  return { text, icon };
};

/**
 * Extra classes and CSS variables for the wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Additions.
 */
export const getDividerExtras = (attributes) => {
  const classes = [];
  const style = {};

  const tablet = num(attributes.widthTablet, 5, 100);
  const mobile = num(attributes.widthMobile, 5, 100);
  const weight = num(attributes.weightMobile, 1, 40);
  if (tablet !== undefined) {
    style['--kb-dv-w-t'] = `${Math.round(tablet)}%`;
  }
  if (mobile !== undefined) {
    style['--kb-dv-w-m'] = `${Math.round(mobile)}%`;
  }
  if (weight !== undefined) {
    style['--kb-dv-h-m'] = `${Math.round(weight)}px`;
  }
  if (Object.keys(style).length) {
    classes.push('kb-dv--rw');
  }

  const labelColor = safeColor(attributes.labelColor);
  if (labelColor && getDividerLabel(attributes)) {
    style['--kb-dv-label'] = labelColor;
  }

  return { classes, style };
};

/**
 * Wrapper props, empty beyond the extra class at the defaults.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Props for the wrapper.
 */
export const getDividerProps = (attributes) => {
  const extras = getDividerExtras(attributes);
  const props = {
    className: joinClasses(attributes.extraClass, ...extras.classes),
  };
  if (Object.keys(extras.style).length) {
    props.style = extras.style;
  }
  return props;
};

/**
 * Line style for the labelled variant: same color, weight and style as the
 * plain divider, using a solid line for the gradient style.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style for each line.
 */
export const getLabelLineStyle = (attributes) => {
  const { dividerStyle, dividerColor, dividerWeight } = attributes;
  const lineStyle =
    oneOf(dividerStyle, ['solid', 'dashed', 'dotted', 'double']) || 'solid';
  return {
    borderTop: `${dividerWeight || 2}px ${lineStyle} ${
      safeColor(dividerColor) || '#d1d5db'
    }`,
  };
};

const zigzag = () => {
  const points = ['M0,120'];
  for (let i = 0; i < 12; i++) {
    points.push(`L${i * 100 + 50},${i % 2 ? 120 : 30}`);
  }
  points.push('L1200,120', 'Z');
  return points.join(' ');
};

export const SHAPES = {
  wave: 'M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z',
  curve: 'M0,120 Q600,-60 1200,120 Z',
  triangle: 'M0,120 L600,10 L1200,120 Z',
  zigzag: zigzag(),
};

/**
 * Shape divider settings, or null for a line.
 *
 * @param {Object} attributes Block attributes.
 * @return {{path: string, height: number, flip: boolean, color: string}|null} Shape.
 */
export const getDividerShape = (attributes) => {
  const key = oneOf(attributes.dividerShape, Object.keys(SHAPES));
  if (!key) {
    return null;
  }
  return {
    path: SHAPES[key],
    height: Math.round(num(attributes.shapeHeight, 10, 240) ?? 40),
    flip: attributes.shapeFlip === true,
    color: safeColor(attributes.dividerColor) || '#d1d5db',
  };
};
