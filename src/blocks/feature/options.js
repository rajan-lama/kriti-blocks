import { pick, safeUrl, safeNumber } from '../../shared/marketing-options';

/**
 * Feature options. Each one adds nothing to the markup at its default, so
 * features saved before these options existed stay valid.
 */
export const TITLE_TAGS = ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];
export const LINK_STYLES = ['link', 'button', 'outline'];
export const ICON_HOVERS = ['none', 'scale', 'lift', 'rotate'];

/**
 * Extra classes and elements for the feature.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Classes, title tag, image details, number and link class.
 */
export function getFeatureOptions(attributes) {
  const {
    featureImageUrl,
    featureImageAlt,
    numberText,
    titleTag,
    linkStyle,
    showDivider,
    iconHover,
    stackOnMobile,
    featureImageSize,
  } = attributes;
  const classes = [];
  const styleVars = {};

  if (showDivider) {
    classes.push('bw-feature--divider');
  }
  if (stackOnMobile) {
    classes.push('bw-feature--stack-mobile');
  }
  const hover = pick(iconHover, ICON_HOVERS, 'none');
  if (hover !== 'none') {
    classes.push(`bw-feature--icon-hover-${hover}`);
  }

  const imageUrl = safeUrl(featureImageUrl);
  const style = pick(linkStyle, LINK_STYLES, 'link');
  const number = typeof numberText === 'string' ? numberText.trim() : '';

  const size = safeNumber(featureImageSize, 16, 400);
  if (imageUrl && size) {
    styleVars['--kb-feature-img-size'] = `${size}px`;
  }

  return {
    classes,
    styleVars,
    titleTag: pick(titleTag, TITLE_TAGS, 'h3'),
    image: imageUrl
      ? { url: imageUrl, alt: String(featureImageAlt || '') }
      : null,
    number,
    linkClass:
      style === 'link'
        ? 'bw-feature__link'
        : `bw-feature__link bw-feature__link--${style}`,
  };
}
