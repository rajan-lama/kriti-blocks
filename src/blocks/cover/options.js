import { getCoverClass, getCoverExtras } from '../../shared/kbsb-cover';

/**
 * Wrapper props including the extras.
 *
 * @param {Object} attributes Block attributes.
 * @param {Object} base       Styles from getCoverStyles().
 * @return {{className: (string|undefined), style: Object}} Props.
 */
export const getCoverProps = (attributes, base) => ({
  className: getCoverClass(attributes),
  style: { ...base, ...getCoverExtras(attributes).style },
});

/**
 * Props for the inner content wrapper, empty at the defaults.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Props for the content div.
 */
export const getContentProps = (attributes) => {
  const { contentStyle } = getCoverExtras(attributes);
  return Object.keys(contentStyle).length ? { style: contentStyle } : {};
};
