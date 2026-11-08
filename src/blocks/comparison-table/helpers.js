/**
 * Convert a hex color to an rgba value.
 *
 * @param {string} hex   Hex color, e.g. #4f46e5.
 * @param {number} alpha Alpha value 0-1.
 * @return {string} rgba() color string.
 */
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || !hex.startsWith('#')) {
    return hex;
  }

  let value = hex.replace('#', '');

  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (value.length !== 6) {
    return hex;
  }

  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);

  return `rgba( ${red}, ${green}, ${blue}, ${alpha} )`;
};

/**
 * Build the inline styles for the comparison table wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the comparison table element.
 */
export const getComparisonTableStyles = (attributes) => {
  const { accentColor } = attributes;

  const accent = accentColor || '#4f46e5';

  const styles = {
    '--bw-cmp-accent': accent,
    '--bw-cmp-accent-soft': hexToRgba(accent, 0.06),
    '--bw-cmp-accent-border': hexToRgba(accent, 0.35),
  };

  return styles;
};

/**
 * Get a fresh product definition.
 *
 * @return {Object} Empty product object.
 */
export const createProduct = () => ({
  name: '',
  price: '',
});

/**
 * Add a product column while keeping rows in sync.
 *
 * @param {Array} products List of product columns.
 * @param {Array} rows     List of feature rows.
 * @return {Object} Updated products and rows.
 */
export const addProduct = (products, rows) => {
  const nextProducts = [...products, createProduct()];

  const nextRows = rows.map((row) => ({
    ...row,
    included: [...(row.included || []), true],
  }));

  return { products: nextProducts, rows: nextRows };
};

/**
 * Remove the last product column while keeping rows in sync.
 *
 * @param {Array} products List of product columns.
 * @param {Array} rows     List of feature rows.
 * @return {Object} Updated products and rows.
 */
export const removeProduct = (products, rows) => {
  const nextProducts = products.slice(0, -1);

  const nextRows = rows.map((row) => ({
    ...row,
    included: (row.included || []).slice(0, -1),
  }));

  return { products: nextProducts, rows: nextRows };
};

/**
 * Create a new feature row with all products marked as included.
 *
 * @param {Array} products List of product columns.
 * @return {Object} Empty feature row object.
 */
export const createRow = (products) => ({
  label: '',
  included: products.map(() => true),
});

/**
 * Toggle the included value of a cell.
 *
 * @param {Array}  rows         List of feature rows.
 * @param {number} rowIndex     Index of the row to update.
 * @param {number} productIndex Index of the product column to update.
 * @return {Array} Updated list of feature rows.
 */
export const toggleCell = (rows, rowIndex, productIndex) =>
  rows.map((row, index) => {
    if (index !== rowIndex) {
      return row;
    }

    const included = (row.included || []).map((value, cellIndex) =>
      cellIndex === productIndex ? !value : value,
    );

    return { ...row, included };
  });

/**
 * Update the label of a feature row.
 *
 * @param {Array}  rows     List of feature rows.
 * @param {number} rowIndex Index of the row to update.
 * @param {string} label    New row label.
 * @return {Array} Updated list of feature rows.
 */
export const updateRowLabel = (rows, rowIndex, label) =>
  rows.map((row, index) => (index === rowIndex ? { ...row, label } : row));

/**
 * Remove a feature row.
 *
 * @param {Array}  rows     List of feature rows.
 * @param {number} rowIndex Index of the row to remove.
 * @return {Array} Updated list of feature rows.
 */
export const removeRow = (rows, rowIndex) =>
  rows.filter((row, index) => index !== rowIndex);

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Read the optional per-cell text and tooltip from a row.
 *
 * @param {Object} row          Feature row.
 * @param {number} productIndex Product column index.
 * @return {{text: string, tip: string}} Cell details, empty when unset.
 */
export const getCellDetails = (row, productIndex) => ({
  text: cleanText(row?.text?.[productIndex]),
  tip: cleanText(row?.tips?.[productIndex]),
});

/**
 * Set a single top level field on a row (for example its tooltip).
 *
 * @param {Array}  rows     List of feature rows.
 * @param {number} rowIndex Index of the row to update.
 * @param {string} key      Field name.
 * @param {string} value    New value. Empty removes the field.
 * @return {Array} Updated list of feature rows.
 */
export const updateRowField = (rows, rowIndex, key, value) =>
  rows.map((row, index) => {
    if (index !== rowIndex) {
      return row;
    }
    const next = { ...row, [key]: value };
    if (!value) {
      delete next[key];
    }
    return next;
  });

/**
 * Set the text or tooltip of one cell. `key` is "text" or "tips".
 *
 * @param {Array}  rows         List of feature rows.
 * @param {number} rowIndex     Index of the row to update.
 * @param {string} key          "text" or "tips".
 * @param {number} productIndex Product column index.
 * @param {string} value        New value. Empty clears the cell value.
 * @return {Array} Updated list of feature rows.
 */
export const updateCellField = (rows, rowIndex, key, productIndex, value) =>
  rows.map((row, index) => {
    if (index !== rowIndex) {
      return row;
    }
    const list = Array.from(
      { length: Math.max((row[key] || []).length, productIndex + 1) },
      (_, i) => (row[key] || [])[i] || '',
    );
    list[productIndex] = value;
    const next = { ...row, [key]: list };
    if (!list.some(Boolean)) {
      delete next[key];
    }
    return next;
  });
