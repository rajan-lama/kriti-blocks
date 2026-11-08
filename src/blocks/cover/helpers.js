/**
 * Build a hex color with an alpha channel.
 *
 * @param {string} color   Hex color, e.g. #111111.
 * @param {number} opacity Opacity percentage 0-100.
 * @return {string} Hex color with alpha channel.
 */
export const getOverlay = (color, opacity) => {
  const alpha = Math.round(((opacity ?? 50) / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${alpha}`;
};

/**
 * Build the inline styles for the cover wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the cover element.
 */
export const getCoverStyles = (attributes) => {
  const {
    backgroundUrl,
    overlayColor,
    overlayOpacity,
    minHeight,
    backgroundSize,
    backgroundPosition,
    contentAlign,
  } = attributes;

  let justifyContent = 'center';

  if (contentAlign === 'left') {
    justifyContent = 'flex-start';
  } else if (contentAlign === 'right') {
    justifyContent = 'flex-end';
  }

  const styles = {
    minHeight: `${minHeight || 400}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent,
    backgroundSize: backgroundSize || 'cover',
    backgroundPosition: backgroundPosition || 'center',
    backgroundRepeat: 'no-repeat',
  };

  if (backgroundUrl) {
    const overlay = overlayColor
      ? getOverlay(overlayColor, overlayOpacity)
      : null;

    styles.backgroundImage = overlay
      ? `linear-gradient( ${overlay}, ${overlay} ), url(${backgroundUrl})`
      : `url(${backgroundUrl})`;
  }

  return styles;
};
