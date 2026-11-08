/**
 * Curated icon set for the Feature block. Using a small built-in set keeps
 * the editor bundle small while still covering common feature use cases.
 */
import {
  check,
  starFilled,
  shield,
  globe,
  people,
  megaphone,
  trendingUp,
  search,
} from '@wordpress/icons';

export const FEATURE_ICONS = {
  check,
  starFilled,
  shield,
  globe,
  people,
  megaphone,
  trendingUp,
  search,
};

export const FEATURE_ICON_OPTIONS = [
  { value: 'check', label: 'Check' },
  { value: 'starFilled', label: 'Star' },
  { value: 'shield', label: 'Shield' },
  { value: 'globe', label: 'Globe' },
  { value: 'people', label: 'People' },
  { value: 'megaphone', label: 'Megaphone' },
  { value: 'trendingUp', label: 'Trending up' },
  { value: 'search', label: 'Search' },
];

/**
 * Resolve an icon component by name, falling back to the check icon.
 *
 * @param {string} name Icon name.
 * @return {Function} Icon component.
 */
export const getFeatureIcon = (name) =>
  FEATURE_ICONS[name] || FEATURE_ICONS.check;
