/**
 * Build the inline styles for the timeline wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the timeline element.
 */
export const getTimelineStyles = (attributes) => {
  const { timelineColor } = attributes;

  if (!timelineColor) {
    return {};
  }

  return {
    '--bw-timeline-accent': timelineColor,
  };
};
