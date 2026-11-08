/**
 * @jest-environment node
 *
 * The timeline gained options. With the options at their defaults the saved HTML must equal what
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

describe('timeline save compatibility', () => {
  it.each([
    ['empty', {}],
    [
      'color, id and class',
      { timelineColor: '#e11d48', htmlId: 't', extraClass: 'mine' },
    ],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown values', () => {
    const attrs = {
      timelineColor: '#e11d48',
      timelineLayout: 'zigzag',
      lineStyle: 'wavy',
      lineWidth: 99,
      lineColor: 'red;x:y',
      markerStyle: 'star',
      dateStyle: 'neon',
    };
    expect(html(save, attrs)).toBe(html(legacy, { timelineColor: '#e11d48' }));
  });
});

describe('timeline options reach the markup', () => {
  it('adds classes and variables', () => {
    const out = html(save, {
      timelineLayout: 'alternate',
      lineStyle: 'dashed',
      lineWidth: 4,
      lineColor: '#111111',
      markerStyle: 'ring',
      markerSize: 20,
      dateStyle: 'badge',
    });
    [
      'bw-timeline--alt',
      'bw-timeline--line-dashed',
      'bw-timeline--marker-ring',
      'bw-timeline--date-badge',
    ].forEach((name) => expect(out).toContain(name));
    expect(out).toContain('--kb-tl-line-w:4px');
    expect(out).toContain('--kb-tl-line:#111111');
    expect(out).toContain('--kb-tl-marker:20px');
    expect(html(save, { timelineLayout: 'right' })).toContain(
      'bw-timeline--right',
    );
  });
});
