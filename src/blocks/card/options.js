import { pick, safeUrl, setColorVar } from '../../shared/marketing-options';

/**
 * Card options. Each one adds nothing to the markup at its default, so cards
 * saved before these options existed stay valid.
 */
export const IMAGE_POSITIONS = ['top', 'left', 'right'];
export const IMAGE_RATIOS = {
  '16-9': '16 / 9',
  '4-3': '4 / 3',
  '3-2': '3 / 2',
  '1-1': '1 / 1',
};
export const HOVER_EFFECTS = ['none', 'lift', 'zoom'];

/**
 * Classes, CSS variables and extra elements for the card.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Classes, style, badge text and link details.
 */
export function getCardOptions(attributes) {
  const {
    imagePosition,
    imageRatio,
    hoverEffect,
    badgeText,
    badgeBg,
    badgeColor,
    cardLinkUrl,
    cardLinkNewTab,
    cardLinkLabel,
  } = attributes;
  const classes = [];
  const style = {};

  const position = pick(imagePosition, IMAGE_POSITIONS, 'top');
  if (position !== 'top') {
    classes.push(`bw-card--img-${position}`);
  }
  if (IMAGE_RATIOS[imageRatio]) {
    classes.push('bw-card--ratio');
    style['--kb-card-ratio'] = IMAGE_RATIOS[imageRatio];
  }
  const hover = pick(hoverEffect, HOVER_EFFECTS, 'none');
  if (hover !== 'none') {
    classes.push(`bw-card--hover-${hover}`);
  }

  const badge =
    typeof badgeText === 'string' && badgeText.trim() ? badgeText.trim() : '';
  if (badge) {
    classes.push('bw-card--badge');
    setColorVar(style, '--kb-card-badge-bg', badgeBg);
    setColorVar(style, '--kb-card-badge-color', badgeColor);
  }

  const href = safeUrl(cardLinkUrl);
  let link = null;
  if (href) {
    classes.push('bw-card--linked');
    link = {
      href,
      target: cardLinkNewTab ? '_blank' : undefined,
      rel: cardLinkNewTab ? 'noreferrer noopener' : undefined,
      label:
        typeof cardLinkLabel === 'string' && cardLinkLabel.trim()
          ? cardLinkLabel.trim()
          : '',
    };
  }

  return { classes, style, badge, link };
}
