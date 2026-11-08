/**
 * @jest-environment node
 *
 * The pricing column gained options. With the options at their defaults the saved HTML must equal what
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
  planName: 'Pro',
  planPrice: '$29',
  planPeriod: '/ month',
  features: 'One\n[x] Two\n Three ',
  buttonText: 'Buy',
  buttonUrl: 'https://example.com/buy',
  isHighlight: true,
  planAlign: 'center',
  tagType: 'article',
  htmlId: 'p1',
  extraClass: 'mine',
};

describe('pricing column save compatibility', () => {
  it.each([
    ['full', base],
    ['no url', { ...base, buttonUrl: '' }],
    [
      'not highlighted, no price',
      { ...base, isHighlight: false, planPrice: '', planPeriod: '' },
    ],
    ['bare', { tagType: 'div' }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('keeps "[x]" literal text unless markers are on, and ignores unsafe values', () => {
    const attrs = {
      ...base,
      featureIconStyle: 'sparkle',
      buttonStyle: 'neon',
      badgeBg: 'red;position:fixed',
      buttonBg: 'url(x)',
      currencySymbol: '  ',
      originalPrice: '',
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('pricing column options reach the markup', () => {
  it('adds feature icon classes and "not included" markers', () => {
    const out = html(save, {
      ...base,
      featureIconStyle: 'cross',
      featureMarkers: true,
    });
    expect(out).toContain('bw-pricing--icons-cross');
    expect(out).toContain('<li class="is-excluded">Two</li>');
    expect(out).toContain('<li>One</li>');
  });

  it('adds a custom badge, currency and sale price', () => {
    const out = html(save, {
      ...base,
      isHighlight: false,
      badgeText: 'Best value',
      currencySymbol: '$',
      originalPrice: '$49',
    });
    expect(out).toContain('<span class="bw-pricing-badge">Best value</span>');
    expect(out).toContain('<span class="bw-pricing-currency">$</span>');
    expect(out).toContain('<del class="bw-pricing-original">$49</del>');
  });

  it('adds button style, colors, rel and target', () => {
    const out = html(save, {
      ...base,
      buttonStyle: 'outline',
      buttonBg: '#ff0000',
      buttonNewTab: true,
      buttonNofollow: true,
      accentColor: '#00ff00',
    });
    expect(out).toContain('bw-pricing-button bw-pricing-button--outline');
    expect(out).toContain('--kb-pc-btn-bg:#ff0000');
    expect(out).toContain('--kb-pc-accent:#00ff00');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="nofollow noopener noreferrer"');
  });
});
