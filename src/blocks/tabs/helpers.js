/**
 * Append an empty tab item to the current list.
 *
 * @param {Array}  tabItems      Current tab items.
 * @param {Object} setAttributes Block attribute setter.
 */
export const addTabItem = (tabItems, setAttributes) => {
  const nextItems = Array.isArray(tabItems) ? [...tabItems] : [];
  nextItems.push({ label: '', content: '' });
  setAttributes({ tabItems: nextItems });
};

/**
 * Remove a tab item by index.
 *
 * @param {number} index         Index of the item to remove.
 * @param {Array}  tabItems      Current tab items.
 * @param {Object} setAttributes Block attribute setter.
 */
export const removeTabItem = (index, tabItems, setAttributes) => {
  const nextItems = Array.isArray(tabItems) ? [...tabItems] : [];
  nextItems.splice(index, 1);
  setAttributes({ tabItems: nextItems });
};

/**
 * Update one field of a tab item by index.
 *
 * @param {number} index         Index of the item to update.
 * @param {string} key           Item field key (label or content).
 * @param {string} value         New field value.
 * @param {Array}  tabItems      Current tab items.
 * @param {Object} setAttributes Block attribute setter.
 */
export const updateTabItem = (index, key, value, tabItems, setAttributes) => {
  const nextItems = Array.isArray(tabItems) ? [...tabItems] : [];
  nextItems[index] = {
    ...nextItems[index],
    [key]: value,
  };
  setAttributes({ tabItems: nextItems });
};

/**
 * Clamp an index into the valid range for a list length.
 *
 * @param {number} index  Candidate index.
 * @param {number} length List length.
 * @return {number} Clamped index (0 when the list is empty).
 */
export const clampIndex = (index, length) => {
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), length - 1);
};
