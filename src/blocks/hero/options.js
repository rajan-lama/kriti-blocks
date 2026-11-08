import { getCoverClass, getCoverExtras } from '../../shared/kbsb-cover';
import { num } from '../../shared/kbsb-options';

/**
 * Wrapper props including the extras. A custom desktop height replaces the
 * height preset.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} base       Styles from getHeroStyles().
 * @return {{className: (string|undefined), style: Object}} Props.
 */
export const getHeroProps = (attributes, base) => {
  const style = { ...base, ...getCoverExtras(attributes).style };
  const height = num(attributes.customHeight, 100, 2000);
  if (height !== undefined) {
    style.minHeight = `${Math.round(height)}px`;
  }
  return { className: getCoverClass(attributes), style };
};

/**
 * Inner content styles: a max width in pixels replaces the width preset.
 *
 * @param {Object} base Existing content style.
 * @param {Object} attributes Block attributes.
 * @return {Object} Content style.
 */
export const getHeroContentStyle = (base, attributes) => ({
  ...base,
  ...getCoverExtras(attributes).contentStyle,
});
