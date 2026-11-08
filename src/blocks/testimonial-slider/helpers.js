/**
 * Helpers for managing the testimonial slider slides array.
 */

/**
 * Create a new empty slide.
 *
 * @return {Object} A new slide object.
 */
export const createSlide = () => ({
  id: Date.now(),
  quote: '',
  authorName: '',
  authorRole: '',
  avatarUrl: '',
  avatarId: 0,
  avatarAlt: '',
});

/**
 * Append a slide to the list.
 *
 * @param {Array} slides Current slides.
 * @return {Array} New slides array.
 */
export const addSlide = (slides) => [...slides, createSlide()];

/**
 * Remove a slide by index.
 *
 * @param {Array}  slides Current slides.
 * @param {number} index  Slide index to remove.
 * @return {Array} New slides array.
 */
export const removeSlide = (slides, index) =>
  slides.filter((slide, i) => i !== index);

/**
 * Update a single field on a slide.
 *
 * @param {Array}  slides Current slides.
 * @param {number} index  Slide index to update.
 * @param {string} field  Field name to update.
 * @param {*}      value  New value.
 * @return {Array} New slides array.
 */
export const updateSlide = (slides, index, field, value) =>
  slides.map((slide, i) =>
    i === index ? { ...slide, [field]: value } : slide,
  );

/**
 * Move a slide up or down in the list.
 *
 * @param {Array}  slides Current slides.
 * @param {number} index  Slide index to move.
 * @param {number} offset Direction to move (-1 up, 1 down).
 * @return {Array} New slides array.
 */
export const moveSlide = (slides, index, offset) => {
  const target = index + offset;

  if (target < 0 || target >= slides.length) {
    return slides;
  }

  const next = [...slides];
  const [removed] = next.splice(index, 1);
  next.splice(target, 0, removed);

  return next;
};
