/**
 * Map a hero height preset to a CSS min-height value.
 *
 * @param {string} preset Hero height preset.
 * @return {string} CSS min-height value.
 */
export const getHeroMinHeight = (preset) => {
  switch (preset) {
    case 'short':
      return '360px';
    case 'medium':
      return '520px';
    case 'tall':
      return '680px';
    case 'full':
      return '100vh';
    default:
      return '520px';
  }
};

/**
 * Map a hero content width preset to a CSS max-width value.
 *
 * @param {string} width Content width preset.
 * @return {string} CSS max-width value.
 */
export const getHeroContentWidth = (width) => {
  switch (width) {
    case 'narrow':
      return '860px';
    case 'wide':
      return '1200px';
    default:
      return '1200px';
  }
};

/**
 * Build a hex color with an alpha channel.
 *
 * @param {string} color   Hex color, e.g. #000000.
 * @param {number} opacity Opacity percentage 0-100.
 * @return {string} Hex color with alpha channel.
 */
export const getHeroOverlay = (color, opacity) => {
  const alpha = Math.round(((opacity ?? 50) / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${alpha}`;
};

/**
 * Build the inline styles for the hero wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the hero element.
 */
export const getHeroStyles = (attributes) => {
  const {
    backgroundUrl,
    overlayColor,
    overlayOpacity,
    heroHeight,
    contentAlign,
  } = attributes;

  let justifyContent = 'center';

  if (contentAlign === 'left') {
    justifyContent = 'flex-start';
  } else if (contentAlign === 'right') {
    justifyContent = 'flex-end';
  }

  const styles = {
    minHeight: getHeroMinHeight(heroHeight),
    display: 'flex',
    alignItems: 'center',
    justifyContent,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  if (backgroundUrl) {
    const overlay = overlayColor
      ? getHeroOverlay(overlayColor, overlayOpacity)
      : null;

    styles.backgroundImage = overlay
      ? `linear-gradient( ${overlay}, ${overlay} ), url(${backgroundUrl})`
      : `url(${backgroundUrl})`;
  }

  return styles;
};
