/**
 * Option lists shared by the query blocks (post grid, post carousel and
 * related posts). They are plain data so they can be tested without the editor.
 * The same values are whitelisted again in each block's render.php.
 */
import { __ } from '@wordpress/i18n';

export const STICKY_OPTIONS = () => [
  { value: 'ignore', label: __('Treat like other posts', 'kriti-blocks') },
  { value: 'exclude', label: __('Hide sticky posts', 'kriti-blocks') },
  { value: 'only', label: __('Only sticky posts', 'kriti-blocks') },
];

export const CARD_STYLE_OPTIONS = () => [
  { value: 'boxed', label: __('Boxed', 'kriti-blocks') },
  { value: 'plain', label: __('Plain (no border)', 'kriti-blocks') },
  { value: 'overlay', label: __('Text over image', 'kriti-blocks') },
];

export const HOVER_OPTIONS = () => [
  { value: 'none', label: __('None', 'kriti-blocks') },
  { value: 'lift', label: __('Lift card', 'kriti-blocks') },
  { value: 'zoom', label: __('Zoom image', 'kriti-blocks') },
];

export const RATIO_OPTIONS = () => [
  { value: 'default', label: __('Default', 'kriti-blocks') },
  { value: '1x1', label: '1:1' },
  { value: '4x3', label: '4:3' },
  { value: '3x2', label: '3:2' },
  { value: '16x9', label: '16:9' },
  { value: '21x9', label: '21:9' },
  { value: '3x4', label: __('3:4 (portrait)', 'kriti-blocks') },
  { value: 'auto', label: __('Original', 'kriti-blocks') },
];

export const TITLE_TAG_OPTIONS = () =>
  ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].map((tag) => ({
    value: tag,
    label: tag === 'p' || tag === 'div' ? tag : tag.toUpperCase(),
  }));

/**
 * Keeps only digits and separators from a typed list of post IDs.
 *
 * @param {string} value Raw input.
 * @return {string} Comma separated IDs.
 */
export function normalizeIdList(value) {
  const ids = String(value || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map((id) => String(parseInt(id, 10)))
    .filter((id) => id !== '0');

  return Array.from(new Set(ids)).slice(0, 50).join(', ');
}

/**
 * Toggles a numeric ID in a list.
 *
 * @param {number[]} list Current IDs.
 * @param {number}   id   ID to toggle.
 * @return {number[]} New list.
 */
export function toggleId(list, id) {
  const current = Array.isArray(list) ? list : [];

  return current.includes(id)
    ? current.filter((value) => value !== id)
    : [...current, id];
}
