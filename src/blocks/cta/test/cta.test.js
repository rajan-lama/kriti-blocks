/**
 * @jest-environment node
 *
 * The CTA block gained options. With the options at their defaults the saved HTML must equal what
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
  ctaAlign: 'left',
  ctaBackground: '#111827',
  ctaTextColor: '#ffffff',
  tagType: 'section',
  htmlId: 'cta1',
  extraClass: 'mine',
};

describe('cta save compatibility', () => {
  it.each([
    ['full', base],
    ['bare', { tagType: 'div' }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unsafe or unknown values', () => {
    const attrs = {
      ...base,
      ctaBgImageUrl: 'https://x.test/a.jpg");background:url(//evil',
      ctaOverlayColor: 'red;position:fixed',
      ctaLayout: 'diagonal',
      ctaContentWidth: -5,
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('cta options reach the markup', () => {
  it('adds the background image, overlay and fixed class', () => {
    const out = html(save, {
      ...base,
      ctaBgImageUrl: 'https://example.com/bg.jpg',
      ctaBgFixed: true,
      ctaOverlayColor: '#000000',
      ctaOverlayOpacity: 40,
    });
    expect(out).toContain('bw-cta--bg');
    expect(out).toContain('bw-cta--fixed');
    expect(out).toContain('bw-cta--overlay');
    expect(out).toContain(
      '--kb-cta-bg-image:url(&quot;https://example.com/bg.jpg&quot;)',
    );
    expect(out).toContain('--kb-cta-overlay:#000000');
    expect(out).toContain('--kb-cta-overlay-opacity:0.4');
  });

  it('adds the split layout and content width', () => {
    const out = html(save, {
      ...base,
      ctaLayout: 'split',
      ctaContentWidth: 900,
    });
    expect(out).toContain('bw-cta--split');
    expect(out).toContain('--kb-cta-width:900px');
  });
});
