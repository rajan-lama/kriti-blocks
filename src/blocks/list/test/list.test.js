/**
 * @jest-environment node
 *
 * New list options must add nothing to the saved HTML at their defaults.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block', p.className].filter(Boolean).join(' '),
      }),
    },
    RichText: {
      Content: ({ tagName: Tag = 'span', value, ...rest }) =>
        React.createElement(Tag, rest, value),
    },
  };
});

import saveNew from '../save';
import saveOld from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = {
  items: [{ text: 'One' }, { text: 'Two' }, { text: '' }, { text: 'Three' }],
  markerStyle: 'check',
  markerColor: '',
  htmlId: '',
  extraClass: '',
};

describe('list save', () => {
  it.each([
    ['defaults', base],
    [
      'numbered with color',
      { ...base, markerStyle: 'number', markerColor: '#f00', extraClass: 'x' },
    ],
    ['disc', { ...base, markerStyle: 'disc' }],
    ['no items', { ...base, items: [] }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      columns: 1,
      dividers: false,
      numberStart: undefined,
      items: base.items.map((item) => ({ ...item, url: '', newTab: false })),
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      markerStyle: 'number',
      numberStart: 5,
      markerSize: 28,
      itemGap: 16,
      columns: 2,
      dividers: true,
      dividerColor: '#ccc',
    });
    expect(out).toContain('kb-list--cols kb-list--divided');
    expect(out).toContain('--kb-list-marker:28px');
    expect(out).toContain('--kb-list-gap:16px');
    expect(out).toContain('--kb-list-cols:2');
    expect(out).toContain('--kb-list-div:#ccc');
    expect(out).toContain('>5</span>');
    expect(out).toContain('>6</span>');
  });

  it('wraps linked items in a safe anchor', () => {
    const out = html(saveNew, {
      ...base,
      items: [
        { text: 'Safe', url: 'https://example.com', newTab: true },
        { text: 'Bad', url: 'javascript:alert(1)' },
      ],
    });
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).not.toContain('javascript');
  });
});
