/**
 * Shared by edit.js and save.js so the editor preview and the saved markup
 * use the same classes and CSS variables.
 */
export const ICONS = [
  { value: '', label: 'None' },
  { value: 'arrow-right', label: 'Arrow right' },
  { value: 'arrow-left', label: 'Arrow left' },
  { value: 'download', label: 'Download' },
  { value: 'external', label: 'External link' },
  { value: 'check', label: 'Check' },
  { value: 'cart', label: 'Cart' },
  { value: 'mail', label: 'Mail' },
  { value: 'phone', label: 'Phone' },
  { value: 'play', label: 'Play' },
];

export const ICON_IDS = ICONS.map((i) => i.value).filter(Boolean);
export const VARIANTS = ['solid', 'outline', 'ghost', 'link'];
export const SIZES = ['sm', 'md', 'lg'];
export const ALIGNS = ['left', 'center', 'right', 'between'];

const pick = (value, allowed, fallback) =>
  allowed.includes(value) ? value : fallback;

export const newButton = () => ({
  text: 'Button',
  url: '',
  variant: 'solid',
  size: 'md',
});

export function getGroupProps(attributes) {
  const { justify, gap, direction, stackMobile } = attributes;
  const classes = ['kb-buttons'];
  if (justify && justify !== 'left') {
    classes.push(`kb-buttons--${pick(justify, ALIGNS, 'left')}`);
  }
  if (direction === 'column') {
    classes.push('kb-buttons--column');
  }
  if (stackMobile) {
    classes.push('kb-buttons--stack');
  }
  const style = {};
  if (typeof gap === 'number' && gap !== 12) {
    style['--kb-btn-gap'] = `${gap}px`;
  }
  return { className: classes.join(' '), style };
}

export function getButtonProps(btn) {
  const classes = [
    'my-button',
    'kb-btn',
    `kb-btn--${pick(btn.variant, VARIANTS, 'solid')}`,
    `kb-btn--${pick(btn.size, SIZES, 'md')}`,
  ];
  if (btn.fullWidth) {
    classes.push('kb-btn--full');
  }
  const icon = pick(btn.icon, ICON_IDS, '');
  const style = {};
  const map = {
    bg: '--kb-btn-bg',
    color: '--kb-btn-color',
    border: '--kb-btn-border',
    hoverBg: '--kb-btn-hover-bg',
    hoverColor: '--kb-btn-hover-color',
  };
  Object.keys(map).forEach((key) => {
    if (btn[key]) {
      style[map[key]] = btn[key];
    }
  });
  if (btn.radius) {
    style.borderRadius = btn.radius;
  }

  const rel = [];
  if (btn.nofollow) {
    rel.push('nofollow');
  }
  if (btn.sponsored) {
    rel.push('sponsored');
  }
  if (btn.newTab) {
    rel.push('noopener', 'noreferrer');
  }

  return {
    className: classes.join(' '),
    style,
    icon,
    iconRight: btn.iconPosition === 'right',
    linkProps: {
      href: btn.url || undefined,
      target: btn.newTab ? '_blank' : undefined,
      rel: rel.length ? rel.join(' ') : undefined,
      'aria-label': btn.ariaLabel || undefined,
    },
  };
}
