/**
 * @jest-environment node
 *
 * The feature block gained options. With the options at their defaults the saved HTML must equal what
 * the original save() produced, or existing posts would show "invalid block".
 * test/legacy/save.js is the original save() copied unchanged.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({ className: 'wp-block', ...p }),
    },
    RichText: {
      Content: ({ tagName: Tag, className, value }) =>
        Tag
          ? React.createElement(Tag, { className }, value)
          : React.createElement(React.Fragment, null, value),
    },
    InnerBlocks: {
      Content: () => React.createElement('span', { 'data-inner': '1' }),
    },
  };
});

import save from '../save';
import legacy from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

const base = {
  icon: 'check',
  showIcon: true,
  iconColor: '#4f46e5',
  iconBackground: '#eef2ff',
  iconSize: 24,
  iconPosition: 'left',
  iconShape: 'circle',
  contentAlign: 'center',
  title: 'Fast',
  description: 'Very fast',
  linkText: 'More',
  linkUrl: 'https://example.com',
  linkNewTab: true,
  htmlId: 'f1',
  extraClass: 'mine',
};

describe('feature save compatibility', () => {
  // The original save() renders the icon as <Icon /> although @wordpress/icons
  // exports elements, so it throws whenever the icon is shown. Compare the
  // cases where it can run, and check the icon markup separately below.
  it.each([
    ['no icon', { ...base, showIcon: false }],
    ['no icon or link', { ...base, showIcon: false, linkUrl: '' }],
    ['bare', { showIcon: false }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown values', () => {
    const attrs = {
      ...base,
      titleTag: 'script',
      linkStyle: 'neon',
      iconHover: 'spin',
      featureImageUrl: 'javascript:alert(1)',
      numberText: '  ',
    };
    expect(html(save, attrs)).toBe(html(save, base));
    expect(html(save, { ...attrs, showIcon: false })).toBe(
      html(legacy, { ...base, showIcon: false }),
    );
  });

  it('renders the icon svg inside its span', () => {
    expect(html(save, base)).toContain(
      '<span class="bw-feature__icon" aria-hidden="true"><svg',
    );
  });
});

describe('feature options reach the markup', () => {
  it('uses the chosen title element', () => {
    expect(html(save, { ...base, titleTag: 'h2' })).toContain(
      '<h2 class="bw-feature__title">Fast</h2>',
    );
  });

  it('shows an image instead of the icon', () => {
    const out = html(save, {
      ...base,
      featureImageUrl: 'https://example.com/i.png',
      featureImageAlt: 'Logo',
      featureImageSize: 80,
    });
    expect(out).toContain('bw-feature__icon--image');
    expect(out).toContain('src="https://example.com/i.png"');
    expect(out).toContain('--kb-feature-img-size:80px');
    expect(out).not.toContain('<svg');
  });

  it('adds the number badge, divider, hover, stacking and link style', () => {
    const out = html(save, {
      ...base,
      numberText: '01',
      showDivider: true,
      iconHover: 'lift',
      stackOnMobile: true,
      linkStyle: 'button',
    });
    expect(out).toContain('<span class="bw-feature__number">01</span>');
    expect(out).toContain('bw-feature--divider');
    expect(out).toContain('bw-feature--icon-hover-lift');
    expect(out).toContain('bw-feature--stack-mobile');
    expect(out).toContain('bw-feature__link bw-feature__link--button');
  });
});
