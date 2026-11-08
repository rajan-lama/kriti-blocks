/**
 * Normalize the steps list, dropping entries that have no content.
 *
 * @param {Array} steps Raw steps attribute.
 * @return {Array} Steps that contain a title or a description.
 */
export const getVisibleSteps = (steps) => {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.filter(
    (step) =>
      step &&
      (String(step.title || '').trim() ||
        String(step.description || '').trim()),
  );
};
