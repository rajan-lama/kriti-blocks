/**
 * @jest-environment node
 *
 * The pricing table gained options. With the options at their defaults the saved HTML must equal what
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

describe('pricing table save compatibility', () => {
  it.each([
    ['empty', {}],
    ['id and class', { htmlId: 't1', extraClass: 'mine' }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown or out-of-range values', () => {
    const attrs = {
      htmlId: 't1',
      columns: 99,
      columnGap: -4,
      stackBelow: 'sometimes',
      naturalHeight: false,
    };
    expect(html(save, attrs)).toBe(html(legacy, { htmlId: 't1' }));
  });
});

describe('pricing table options reach the markup', () => {
  it('adds columns, gap, natural height and stacking', () => {
    const out = html(save, {
      columns: 3,
      columnGap: 16,
      naturalHeight: true,
      stackBelow: 'tablet',
      extraClass: 'mine',
    });
    expect(out).toContain('kb-pt--cols');
    expect(out).toContain('kb-pt--natural');
    expect(out).toContain('kb-pt--stack-tablet');
    expect(out).toContain('class="mine kb-pt--cols');
    expect(out).toContain('--kb-pt-cols:3');
    expect(out).toContain('--kb-pt-gap:16px');
  });
});

describe('pricing table billing toggle', () => {
  it('adds the toggle only when enabled', () => {
    expect(html(save, {})).not.toContain('kb-pt__toggle');
    const out = html(save, { billingToggle: true, yearlyLabel: 'Annual' });
    expect(out).toContain('kb-pt--toggle');
    expect(out).toContain('Monthly');
    expect(out).toContain('Annual');
  });

  it('escapes label text', () => {
    const out = html(save, {
      billingToggle: true,
      monthlyLabel: '<img src=x>',
    });
    expect(out).not.toContain('<img');
  });
});
