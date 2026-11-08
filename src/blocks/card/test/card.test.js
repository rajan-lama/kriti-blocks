/**
 * @jest-environment node
 *
 * The card gained options. With the options at their defaults the saved HTML
 * must equal what the original save() produced, or existing posts would show
 * "invalid block". legacy.save.js is the original save() copied unchanged.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({ className: 'wp-block', ...p }),
    },
    RichText: {
      Content: ({ tagName: Tag = 'span', className, value }) =>
        React.createElement(Tag, { className }, value),
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
  cardImageUrl: 'https://example.com/a.jpg',
  cardImageAlt: 'A',
  cardAlign: 'center',
  cardPadding: 'large',
  borderRadius: 12,
  hasShadow: true,
  tagType: 'article',
  htmlId: 'c1',
  extraClass: 'mine',
};

describe('card save compatibility', () => {
  it.each([
    ['with image', base],
    ['without image', { ...base, cardImageUrl: '' }],
    ['bare', { cardPadding: 'medium', tagType: 'div' }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown or unsafe values', () => {
    const attrs = {
      ...base,
      imagePosition: 'diagonal',
      imageRatio: 'x',
      hoverEffect: '"><script>',
      cardLinkUrl: 'javascript:alert(1)',
      badgeText: '   ',
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('card options reach the markup', () => {
  it('adds position, ratio and hover classes', () => {
    const out = html(save, {
      ...base,
      imagePosition: 'left',
      imageRatio: '16-9',
      hoverEffect: 'zoom',
    });
    expect(out).toContain('bw-card--img-left');
    expect(out).toContain('bw-card--ratio');
    expect(out).toContain('--kb-card-ratio:16 / 9');
    expect(out).toContain('bw-card--hover-zoom');
  });

  it('renders a badge with validated colors', () => {
    const out = html(save, {
      ...base,
      badgeText: 'New',
      badgeBg: '#ff0000',
      badgeColor: 'red;background:url(x)',
    });
    expect(out).toContain('<span class="bw-card-badge">New</span>');
    expect(out).toContain('--kb-card-badge-bg:#ff0000');
    expect(out).not.toContain('url(x)');
  });

  it('renders a whole-card link with rel for new tabs', () => {
    const out = html(save, {
      ...base,
      cardLinkUrl: 'https://example.com/x',
      cardLinkNewTab: true,
    });
    expect(out).toContain('href="https://example.com/x"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noreferrer noopener"');
    expect(out).toContain('aria-label="Read more"');
    expect(out).toContain('bw-card--linked');
  });
});
