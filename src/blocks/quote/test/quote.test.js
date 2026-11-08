/**
 * @jest-environment node
 *
 * New quote options must add nothing to the saved HTML at their defaults.
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
      Content: ({ tagName: Tag = 'span', className, style, value }) =>
        React.createElement(Tag, { className, style }, value),
    },
  };
});

import saveNew from '../save';
import saveOld from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = {
  content: 'Words',
  citation: 'Someone',
  quoteSize: 'medium',
  htmlId: '',
  extraClass: '',
};

describe('quote save', () => {
  it.each([
    ['defaults', base],
    ['no citation', { ...base, citation: '' }],
    ['empty', { ...base, content: '', citation: '' }],
    [
      'legacy styling',
      {
        ...base,
        quoteAlign: 'center',
        quoteSize: 'large',
        borderColor: '#f00',
        extraClass: 'a',
      },
    ],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      borderSide: 'left',
      showQuoteIcon: false,
      citationStyle: 'italic',
      authorImage: '',
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      borderSide: 'right',
      borderColor: '#ff0000',
      borderWidth: 8,
      showQuoteIcon: true,
      quoteIconColor: '#00f',
      quoteColor: '#111',
      citationColor: '#999',
      citationStyle: 'normal',
      authorImage: 'https://example.com/a.jpg',
      authorImageAlt: 'Ann',
    });
    expect(out).toContain('kb-q--border-right kb-q--icon');
    expect(out).toContain('--kb-q-bc:#ff0000');
    expect(out).toContain('--kb-q-bw:8px');
    expect(out).toContain('--kb-q-ic:#00f');
    expect(out).toContain('font-style:normal');
    expect(out).toContain('<div class="bw-quote-author"><img');
    expect(out).toContain('alt="Ann"');
  });

  it('drops unsafe values', () => {
    const out = html(saveNew, {
      ...base,
      borderSide: 'diagonal',
      quoteColor: 'red;x:y',
      authorImage: 'javascript:alert(1)',
    });
    expect(out).toBe(html(saveOld, base));
  });
});
