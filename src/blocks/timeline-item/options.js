import { safeColor, safeUrl } from '../../shared/marketing-options';

/**
 * Timeline item options. Each one adds nothing to the markup at its default,
 * so items saved before these options existed stay valid.
 */

/**
 * Classes, CSS variables and extra elements for a timeline item.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Classes, style, image and link details.
 */
export function getTimelineItemOptions(attributes) {
  const {
    itemColor,
    itemHighlight,
    itemImageUrl,
    itemImageAlt,
    itemLinkUrl,
    itemLinkText,
    itemLinkNewTab,
  } = attributes;
  const classes = [];
  const style = {};

  const color = safeColor(itemColor);
  if (color) {
    style['--bw-timeline-accent'] = color;
  }
  if (itemHighlight) {
    classes.push('is-highlight');
  }

  const imageUrl = safeUrl(itemImageUrl);
  const href = safeUrl(itemLinkUrl);

  return {
    classes,
    style,
    image: imageUrl ? { url: imageUrl, alt: String(itemImageAlt || '') } : null,
    link: href
      ? {
          href,
          text:
            typeof itemLinkText === 'string' && itemLinkText.trim()
              ? itemLinkText.trim()
              : '',
          target: itemLinkNewTab ? '_blank' : undefined,
          rel: itemLinkNewTab ? 'noreferrer noopener' : undefined,
        }
      : null,
  };
}
