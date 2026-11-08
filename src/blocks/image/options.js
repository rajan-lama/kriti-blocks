import {
  getLinkProps,
  joinClasses,
  num,
  oneOf,
  safeUrl,
} from '../../shared/kbsb-options';

export const HOVER_EFFECTS = ['zoom', 'lift', 'grayscale', 'brighten'];
export const ASPECT_RATIOS = [
  '1/1',
  '4/3',
  '3/2',
  '16/9',
  '21/9',
  '3/4',
  '2/3',
];
export const LINK_TYPES = ['media', 'custom', 'lightbox'];
export const SHAPES = ['circle', 'rounded', 'hexagon', 'diamond', 'blob'];

/**
 * Extra classes and styles for the options added after the first release.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], imgStyle: Object}} Additions.
 */
export const getImageExtras = (attributes) => {
  const classes = [];
  const imgStyle = {};

  const hover = oneOf(attributes.hoverEffect, HOVER_EFFECTS);
  if (hover) {
    classes.push(`bw-image--hover-${hover}`);
  }

  const shape = oneOf(attributes.imageShape, SHAPES);
  if (shape) {
    classes.push(`bw-image--shape-${shape}`);
  }

  if (attributes.captionPosition === 'overlay') {
    classes.push('bw-image--cap-overlay');
  }

  const ratio = oneOf(attributes.aspectRatio, ASPECT_RATIOS);
  if (ratio) {
    classes.push('bw-image--ratio');
    imgStyle.aspectRatio = ratio.replace('/', ' / ');
  }

  const focal = attributes.focalPoint;
  if (focal && typeof focal === 'object') {
    const x = num(focal.x, 0, 1);
    const y = num(focal.y, 0, 1);
    if (x !== undefined && y !== undefined) {
      imgStyle.objectPosition = `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
    }
  }

  return { classes, imgStyle };
};

/**
 * Merge the extras into the figure class name.
 *
 * @param {Object} attributes Block attributes.
 * @return {string|undefined} Class string for the figure.
 */
export const getFigureClass = (attributes) =>
  joinClasses(attributes.extraClass, ...getImageExtras(attributes).classes);

/**
 * Link props for the anchor around the image, or null for no link.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object|null} Props for the anchor.
 */
export const getImageLink = (attributes) => {
  const type = oneOf(attributes.linkType, LINK_TYPES);
  if (!type) {
    return null;
  }
  const url = type === 'custom' ? attributes.linkUrl : safeUrl(attributes.url);
  if (type === 'lightbox') {
    const href = safeUrl(url);
    return href
      ? { href, className: 'bw-image-lightbox', 'data-bw-lightbox': '1' }
      : null;
  }
  return getLinkProps({
    url,
    newTab: attributes.linkNewTab === true,
    nofollow: attributes.linkNofollow === true,
  });
};
