/**
 * @jest-environment node
 *
 * New text options must add nothing to the saved HTML at their defaults.
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
      Content: ({ tagName: Tag = 'span', className, style, id, value }) =>
        React.createElement(Tag, { className, style, id }, value),
    },
  };
});

import saveNew from '../save';
import saveOld from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = { tagType: 'p', content: 'Body', htmlId: '', extraClass: '' };

describe('text save', () => {
  it.each([
    ['defaults', base],
    [
      'legacy styling',
      {
        ...base,
        fontSize: 18,
        textAlign: 'center',
        contentColor: '#333',
        dropCap: true,
        extraClass: 'foo',
        htmlId: 'x',
      },
    ],
    ['div', { ...base, tagType: 'div' }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores empty or out-of-range options', () => {
    const attributes = { ...base, columns: 1, maxWidth: '', columnGap: 20 };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      textAlign: 'center',
      fontFamily: 'mono',
      textShadow: 'strong',
      columns: 3,
      columnGap: 24,
      maxWidth: 60,
      maxWidthUnit: 'ch',
    });
    expect(out).toContain('column-count:3');
    expect(out).toContain('column-gap:24px');
    expect(out).toContain('max-width:60ch');
    expect(out).toContain('margin-left:auto');
    expect(out).toContain('font-family:ui-monospace');
    expect(out).toContain('text-shadow:0 3px 10px');
  });

  it('drops unsafe values', () => {
    const out = html(saveNew, {
      ...base,
      fontFamily: 'custom',
      fontFamilyCustom: 'a;b:url(x)',
      textShadow: 'bogus',
      maxWidth: 50,
      maxWidthUnit: 'vh;color:red',
      columns: 99,
    });
    expect(out).not.toContain('url(');
    expect(out).not.toContain('bogus');
    expect(out).not.toContain('color:red');
    expect(out).toContain('max-width:50px');
    expect(out).toContain('column-count:4');
  });
});
