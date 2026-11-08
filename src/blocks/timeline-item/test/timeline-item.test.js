/**
 * @jest-environment node
 *
 * The timeline item gained options. With the options at their defaults the saved HTML must equal what
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

const base = { itemDate: '2024', htmlId: 'i1', extraClass: 'mine' };

describe('timeline item save compatibility', () => {
  it.each([
    ['full', base],
    ['no date', {}],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unsafe values', () => {
    const attrs = {
      ...base,
      itemColor: 'red;position:fixed',
      itemImageUrl: 'javascript:alert(1)',
      itemLinkUrl: 'data:text/html,x',
      itemHighlight: false,
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('timeline item options reach the markup', () => {
  it('adds color, highlight, image and link', () => {
    const out = html(save, {
      ...base,
      itemColor: '#e11d48',
      itemHighlight: true,
      itemImageUrl: 'https://example.com/a.jpg',
      itemImageAlt: 'A',
      itemLinkUrl: 'https://example.com/more',
      itemLinkNewTab: true,
    });
    expect(out).toContain('--bw-timeline-accent:#e11d48');
    expect(out).toContain('is-highlight');
    expect(out).toContain(
      '<img class="bw-timeline-item__image" src="https://example.com/a.jpg" alt="A" loading="lazy"/>',
    );
    expect(out).toContain('href="https://example.com/more"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noreferrer noopener"');
    expect(out).toContain('>Read more</a>');
  });
});
