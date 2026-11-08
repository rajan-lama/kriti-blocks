/**
 * Append an empty FAQ item to the current list.
 *
 * @param {Array}  faqItems      Current FAQ items.
 * @param {Object} setAttributes Block attribute setter.
 */
export const addFaqItem = (faqItems, setAttributes) => {
  const nextItems = Array.isArray(faqItems) ? [...faqItems] : [];
  nextItems.push({ question: '', answer: '' });
  setAttributes({ faqItems: nextItems });
};

/**
 * Remove an FAQ item by index.
 *
 * @param {number} index         Index of the item to remove.
 * @param {Array}  faqItems      Current FAQ items.
 * @param {Object} setAttributes Block attribute setter.
 */
export const removeFaqItem = (index, faqItems, setAttributes) => {
  const nextItems = Array.isArray(faqItems) ? [...faqItems] : [];
  nextItems.splice(index, 1);
  setAttributes({ faqItems: nextItems });
};

/**
 * Update one field of an FAQ item by index.
 *
 * @param {number} index         Index of the item to update.
 * @param {string} key           Item field key (question or answer).
 * @param {string} value         New field value.
 * @param {Array}  faqItems      Current FAQ items.
 * @param {Object} setAttributes Block attribute setter.
 */
export const updateFaqItem = (index, key, value, faqItems, setAttributes) => {
  const nextItems = Array.isArray(faqItems) ? [...faqItems] : [];
  nextItems[index] = {
    ...nextItems[index],
    [key]: value,
  };
  setAttributes({ faqItems: nextItems });
};
