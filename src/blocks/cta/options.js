import {
  pick,
  safeCssUrl,
  safeNumber,
  setColorVar,
} from '../../shared/marketing-options';

/**
 * CTA options. Each one adds nothing to the markup at its default, so
 * banners saved before these options existed stay valid.
 */
export const LAYOUTS = ['stacked', 'split'];

/**
 * Classes and CSS variables for the CTA wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object}} Wrapper additions.
 */
export function getCtaOptions(attributes) {
  const {
    ctaBgImageUrl,
    ctaBgFixed,
    ctaOverlayColor,
    ctaOverlayOpacity,
    ctaLayout,
    ctaContentWidth,
  } = attributes;
  const classes = [];
  const style = {};

  const image = safeCssUrl(ctaBgImageUrl);
  if (image) {
    classes.push('bw-cta--bg');
    style['--kb-cta-bg-image'] = image;
    if (ctaBgFixed) {
      classes.push('bw-cta--fixed');
    }
  }

  const before = Object.keys(style).length;
  setColorVar(style, '--kb-cta-overlay', ctaOverlayColor);
  if (Object.keys(style).length > before) {
    classes.push('bw-cta--overlay');
    const opacity = safeNumber(ctaOverlayOpacity, 0, 100);
    if (opacity !== undefined) {
      style['--kb-cta-overlay-opacity'] = opacity / 100;
    }
  }

  if (pick(ctaLayout, LAYOUTS, 'stacked') === 'split') {
    classes.push('bw-cta--split');
  }

  const width = safeNumber(ctaContentWidth, 200, 1600);
  if (width !== undefined) {
    style['--kb-cta-width'] = `${width}px`;
  }

  return { classes, style };
}
