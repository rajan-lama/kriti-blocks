/**
 * Helpers shared by the design panels and the editor preview.
 *
 * The saved value is one object (`kbStyle`). Its shape is documented in
 * includes/class-kriti-blocks-design.php, which is also the code that turns
 * it into front-end CSS.
 */

export const BLOCK_PREFIX = 'kriti-blocks/';
export const DEVICES = ['d', 't', 'm'];
export const TABLET_MAX = 1024;
export const MOBILE_MAX = 767;

const isEmpty = (v) =>
  v === '' ||
  v === undefined ||
  v === null ||
  (typeof v === 'object' && Object.keys(v).length === 0);

/**
 * Immutable set that removes empty values and prunes empty parents, so the
 * saved attribute stays small.
 *
 * @param {Object} obj   Object to copy and change.
 * @param {Array}  path  Keys down to the value.
 * @param {*}      value New value. Empty removes it.
 * @return {Object} The updated copy.
 */
export function setIn(obj, path, value) {
  const [head, ...rest] = path;
  const next = { ...(obj || {}) };
  const child = rest.length ? setIn(next[head], rest, value) : value;
  if (isEmpty(child)) {
    delete next[head];
  } else {
    next[head] = child;
  }
  return next;
}

/**
 * Text alignment for one device. `font.align` is a string in older content
 * (desktop only) or a map of devices.
 *
 * @param {string|Object} align Saved alignment.
 * @param {string}        dev   Device key: d, t or m.
 * @return {string} Alignment, or '' when not set.
 */
export function alignAt(align, dev) {
  if (align && typeof align === 'object') {
    return align[dev] || '';
  }
  return dev === 'd' ? align || '' : '';
}

/**
 * The alignment as a per-device map, converting the older single string.
 *
 * @param {string|Object} align Saved alignment.
 * @return {Object} Map of device to alignment.
 */
export function alignMap(align) {
  if (align && typeof align === 'object') {
    return align;
  }
  return align ? { d: align } : {};
}

export function getIn(obj, path, fallback = '') {
  let cur = obj;
  for (const key of path) {
    if (cur === undefined || cur === null) {
      return fallback;
    }
    cur = cur[key];
  }
  return cur === undefined || cur === null ? fallback : cur;
}

export function shadowToCss(s) {
  if (!s) {
    return '';
  }
  const px = (n) => `${Number(n) || 0}px`;
  if (!s.x && !s.y && !s.blur && !s.spread) {
    return '';
  }
  return `${px(s.x)} ${px(s.y)} ${px(s.blur)} ${px(
    s.spread,
  )} ${s.color || 'rgba(0,0,0,.25)'}`;
}

/**
 * Builds the same CSS the server prints, scoped to `sel`. Used only for the
 * editor preview, so values are trusted and not validated here.
 *
 * @param {Object} s   Saved `kbStyle` value.
 * @param {string} sel CSS selector for the block.
 * @return {string} CSS text.
 */
export function buildCss(s, sel) {
  if (!s || !Object.keys(s).length) {
    return '';
  }
  const base = [];
  const hover = [];
  const bucket = { d: base, t: [], m: [] };
  const add = (list, prop, v) => {
    if (!isEmpty(v)) {
      list.push(`${prop}:${v}`);
    }
  };
  const preset = (v) =>
    typeof v === 'string' && v.startsWith('var:preset|')
      ? `var(--wp--preset--${v.split('|')[1]}--${v.split('|')[2]})`
      : v;

  add(base, 'background-image', getIn(s, ['bg', 'gradient']));
  add(base, 'background-color', getIn(s, ['bg', 'color']));
  add(base, 'color', getIn(s, ['color', 'text']));
  add(hover, 'background-color', getIn(s, ['bg', 'hover']));
  add(hover, 'color', getIn(s, ['color', 'hover']));

  DEVICES.forEach((dev) => {
    add(bucket[dev], 'font-size', getIn(s, ['font', 'size', dev]));
    add(bucket[dev], 'min-height', getIn(s, ['minHeight', dev]));
    ['top', 'right', 'bottom', 'left'].forEach((side) => {
      add(bucket[dev], side, getIn(s, ['inset', dev, side]));
    });
    add(bucket[dev], 'gap', getIn(s, ['gap', dev]));
    if (dev !== 'd') {
      const cols = getIn(s, ['cols', dev]);
      if (cols) {
        add(
          bucket[dev],
          'grid-template-columns',
          `repeat(${Number(cols)},minmax(0,1fr)) !important`,
        );
      }
      const stack = getIn(s, ['stack', dev]);
      if (stack) {
        add(bucket[dev], 'flex-direction', `${stack} !important`);
      }
    }
    // `font.align` is a string in older content (desktop only) or a per-device map.
    const align = getIn(s, ['font', 'align']);
    add(bucket[dev], 'text-align', alignAt(align, dev));
    ['padding', 'margin'].forEach((prop) => {
      ['top', 'right', 'bottom', 'left'].forEach((side) => {
        add(
          bucket[dev],
          `${prop}-${side}`,
          preset(getIn(s, [prop, dev, side])),
        );
      });
    });
  });

  add(base, 'font-weight', getIn(s, ['font', 'weight']));
  add(base, 'text-transform', getIn(s, ['font', 'transform']));
  add(base, 'line-height', getIn(s, ['font', 'lineHeight']));
  add(base, 'letter-spacing', getIn(s, ['font', 'letterSpacing']));

  const bw = getIn(s, ['border', 'width']);
  if (bw) {
    add(base, 'border-width', bw);
    add(base, 'border-style', getIn(s, ['border', 'style']) || 'solid');
  }
  add(base, 'border-color', getIn(s, ['border', 'color']));
  if (getIn(s, ['border', 'radius'])) {
    add(base, 'border-radius', s.border.radius);
    base.push('overflow:hidden');
  }
  add(hover, 'border-color', getIn(s, ['border', 'hover']));
  add(base, 'box-shadow', shadowToCss(s.shadow));
  add(hover, 'box-shadow', shadowToCss(s.shadowHover));
  add(base, 'position', getIn(s, ['position']));
  add(base, 'z-index', getIn(s, ['zIndex'], undefined));
  add(base, 'opacity', getIn(s, ['opacity']));

  const fx = s.hoverFx || {};
  const tf = [];
  if (fx.scale !== undefined) {
    tf.push(`scale(${fx.scale})`);
  }
  if (fx.rotate !== undefined) {
    tf.push(`rotate(${fx.rotate}deg)`);
  }
  if (fx.lift !== undefined) {
    tf.push(`translateY(-${fx.lift}px)`);
  }
  if (tf.length) {
    hover.push(`transform:${tf.join(' ')}`);
  }
  if (hover.length) {
    base.push(`transition:all ${fx.duration ?? 200}ms ease`);
  }

  let css = '';
  if (base.length) {
    css += `${sel}{${base.join(';')}}`;
  }
  if (hover.length) {
    css += `${sel}:hover{${hover.join(';')}}`;
  }
  if (bucket.t.length) {
    css += `@media (max-width:${TABLET_MAX}px){${sel}{${bucket.t.join(';')}}}`;
  }
  if (bucket.m.length) {
    css += `@media (max-width:${MOBILE_MAX}px){${sel}{${bucket.m.join(';')}}}`;
  }
  // In the editor, hidden blocks are dimmed instead of removed so they can
  // still be selected.
  const hide = s.hide || {};
  if (hide.d || hide.t || hide.m) {
    css += `${sel}{opacity:.35;outline:1px dashed #999}`;
  }
  const custom = getIn(s, ['customCss']);
  if (custom) {
    css += String(custom).replace(/selector/g, sel);
  }
  return css;
}
