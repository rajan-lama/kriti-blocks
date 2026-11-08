/**
 * @jest-environment node
 *
 * New heading options must add nothing to the saved HTML at their defaults.
 * legacy.save.js is the original save() copied before the options were added.
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

const base = { tagType: 'h2', content: 'Hello', htmlId: '', extraClass: '' };

describe('heading save', () => {
  it.each([
    ['defaults', base],
    [
      'legacy styling',
      {
        ...base,
        fontSize: 40,
        fontWeight: '700',
        textAlign: 'center',
        headingColor: '#111111',
        letterSpacing: '1px',
        lineHeight: '1.2',
        textTransform: 'uppercase',
      },
    ],
    ['id and class', { ...base, htmlId: 'a', extraClass: 'x y' }],
    ['h4', { ...base, tagType: 'h4' }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores unset or empty new options', () => {
    const attributes = {
      ...base,
      fontFamily: undefined,
      textShadow: '',
      accentBar: false,
      gradientFrom: '#fff',
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      extraClass: 'mine',
      fontFamily: 'serif',
      textShadow: 'soft',
      gradientFrom: '#ff0000',
      gradientTo: 'rgb(0, 0, 255)',
      gradientAngle: 45,
      accentBar: true,
      barAlign: 'center',
      barWidth: 80,
      barColor: '#00ff00',
    });
    expect(out).toContain(
      'class="wp-block mine kb-h--gradient kb-h--bar kb-h--bar-center"',
    );
    expect(out).toContain('font-family:Georgia');
    expect(out).toContain('text-shadow:0 1px 2px');
    expect(out).toContain('--kb-h-g1:#ff0000');
    expect(out).toContain('--kb-h-gangle:45deg');
    expect(out).toContain('--kb-h-bar-w:80px');
  });

  it('uses a decoration instead of the highlight when both are set', () => {
    const out = html(saveNew, {
      ...base,
      textDecoration: 'underline',
      decorationStyle: 'wavy',
      highlightColor: '#ff0',
    });
    expect(out).toContain('text-decoration-line:underline');
    expect(out).toContain('text-decoration-style:wavy');
    expect(out).not.toContain('kb-h--hl');
  });

  it('drops unknown or unsafe values', () => {
    const out = html(saveNew, {
      ...base,
      fontFamily: 'custom',
      fontFamilyCustom: 'x; background:url(//evil)',
      textShadow: '0 0 9px red',
      textDecoration: 'blink',
      gradientFrom: 'red;background:url(x)',
      gradientTo: '#fff',
      highlightColor: 'url(javascript:1)',
      accentBar: true,
      barColor: 'expression(1)',
      barAlign: 'diagonal',
    });
    expect(out).not.toContain('evil');
    expect(out).not.toContain('blink');
    expect(out).not.toContain('url(');
    expect(out).not.toContain('expression');
    expect(out).not.toContain('diagonal');
    expect(out).not.toContain('kb-h--gradient');
    expect(out).not.toContain('kb-h--hl');
  });
});

describe('heading subheading', () => {
  it('wraps heading and subheading, moving block props to the wrapper', () => {
    const out = html(saveNew, { ...base, subheading: 'Sub', extraClass: 'x' });
    expect(out).toBe(
      '<div class="wp-block x"><h2>Hello</h2><p class="kb-heading-sub">Sub</p></div>',
    );
  });

  it('can put the subheading above', () => {
    const out = html(saveNew, {
      ...base,
      subheading: 'Sub',
      subheadingPosition: 'above',
    });
    expect(out).toBe(
      '<div class="wp-block"><p class="kb-heading-sub">Sub</p><h2>Hello</h2></div>',
    );
  });
});
