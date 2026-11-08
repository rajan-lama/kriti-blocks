/**
 * Build the inline styles for the grid wrapper.
 *
 * Grid values are exposed as CSS custom properties so the layout can be
 * applied both to the block wrapper (front end) and to the inner blocks
 * container (editor) from a single set of attributes.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for useBlockProps / useBlockProps.save.
 */
export const getGridStyles = (attributes) => {
  const {
    gridColumns,
    gridColumnGap,
    gridRowGap,
    minHeight,
    positionType,
    zindex,
  } = attributes;

  const columns = Number.isFinite(gridColumns) ? gridColumns : 2;

  const styles = {
    '--bw-grid-columns': columns,
    '--bw-grid-column-gap': `${gridColumnGap || 0}px`,
    '--bw-grid-row-gap': `${gridRowGap || 0}px`,
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    columnGap: `${gridColumnGap || 0}px`,
    rowGap: `${gridRowGap || 0}px`,
  };

  if (minHeight) {
    styles.minHeight = minHeight;
  }

  if (positionType && positionType !== 'default' && positionType !== 'normal') {
    styles.position = positionType;
  }

  if (zindex && zindex !== 'normal') {
    styles.zIndex = zindex;
  }

  return styles;
};
