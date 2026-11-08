/**
 * Build the inline styles for the list wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the list element.
 */
export const getListStyles = (attributes) => {
  const { markerColor } = attributes;

  if (!markerColor) {
    return {};
  }

  return {
    '--bw-list-color': markerColor,
  };
};

/**
 * Build the class name for the list wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Class name string.
 */
export const getListClassName = (attributes) => {
  const { markerStyle, extraClass } = attributes;

  return (
    ['bw-list', `bw-list--${markerStyle || 'check'}`, extraClass]
      .filter(Boolean)
      .join(' ') || undefined
  );
};

/**
 * Normalize the list items, dropping entries that have no text.
 *
 * @param {Array} items Raw items attribute.
 * @return {Array} Items that contain text.
 */
export const getVisibleItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter((item) => item && String(item.text || '').trim() !== '');
};
