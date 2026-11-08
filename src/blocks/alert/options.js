import { joinClasses, num, safeColor } from '../../shared/kbsb-options';

export const CUSTOM_ICONS = {
  bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  heart:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  bolt: 'M7 2v11h3v9l7-12h-4l4-8z',
  shield: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  question:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
};

/**
 * Safe key for the "remember dismissal" cookie.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} Key made of a-z, 0-9, dash and underscore, or ''.
 */
export const getDismissKey = (attributes) => {
  const raw = String(attributes.dismissKey || attributes.htmlId || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  return raw.slice(0, 40);
};

/**
 * Extra classes, CSS variables and data attributes for the wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object, data: Object}} Additions.
 */
export const getAlertExtras = (attributes) => {
  const classes = [];
  const style = {};
  const data = {};

  const accent = safeColor(attributes.accentColor);
  if (accent) {
    style['--kb-alert-accent'] = accent;
  }

  const iconSize = num(attributes.iconSize, 12, 64);
  if (iconSize !== undefined) {
    style['--kb-alert-icon'] = `${iconSize}px`;
  }

  if (attributes.dismissible === true) {
    classes.push('bw-alert--dismissible');
    const key =
      attributes.rememberDismiss === true && getDismissKey(attributes);
    if (key) {
      data['data-bw-remember'] = key;
      const days = num(attributes.dismissDays, 1, 365);
      if (days !== undefined && Math.round(days) !== 30) {
        data['data-bw-days'] = String(Math.round(days));
      }
    }
  }

  return { classes, style, data };
};

/**
 * Props for the wrapper, merged with the existing class list.
 *
 * @param {Object} attributes Block attributes.
 * @param {string} baseClass  Existing classes.
 * @return {Object} Props for the wrapper element.
 */
export const getAlertProps = (attributes, baseClass) => {
  const extras = getAlertExtras(attributes);
  const props = {
    className: joinClasses(baseClass, ...extras.classes),
    ...extras.data,
  };
  if (Object.keys(extras.style).length) {
    props.style = extras.style;
  }
  return props;
};
