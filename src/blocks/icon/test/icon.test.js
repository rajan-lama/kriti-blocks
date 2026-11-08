/**
 * @jest-environment node
 *
 * New icon options must add nothing to the saved HTML at their defaults.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: {
    save: (p = {}) => ({
      ...p,
      className: ['wp-block', p.className].filter(Boolean).join(' '),
    }),
  },
}));

import saveNew from '../save';
import saveOld from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = {
  icon: 'star',
  svg: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
  size: 24,
  color: '#000000',
  bgColor: '',
  padding: 0,
  borderRadius: 0,
};

describe('icon save', () => {
  it.each([
    ['defaults', base],
    [
      'styled',
      {
        ...base,
        size: 64,
        color: '#f00',
        bgColor: '#eee',
        padding: 12,
        borderRadius: 50,
      },
    ],
    ['no svg', { ...base, svg: '' }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      rotation: 0,
      label: '  ',
      linkUrl: '',
      iconAlign: '',
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, base));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      hoverColor: '#ff0000',
      hoverBg: 'rgba(0,0,0,.1)',
      rotation: 45,
      sizeTablet: 40,
      sizeMobile: 32,
      iconAlign: 'center',
      label: 'Support',
      labelPosition: 'right',
      linkUrl: 'https://example.com',
      linkNewTab: true,
      linkNofollow: true,
      ariaLabel: 'Contact support',
    });
    expect(out).toContain('--bw-icon-hover-color:#ff0000');
    expect(out).toContain('--bw-icon-rot:45deg');
    expect(out).toContain('--bw-icon-size-t:40px');
    expect(out).toContain('text-align:center');
    expect(out).toContain('kb-icon--rs kb-icon--label-right');
    expect(out).toContain('<span class="bw-icon-label">Support</span>');
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="nofollow noopener noreferrer"');
    expect(out).toContain('aria-label="Contact support"');
  });

  it('drops unsafe links and colors', () => {
    const out = html(saveNew, {
      ...base,
      linkUrl: 'javascript:alert(1)',
      hoverColor: 'red;background:url(x)',
      iconAlign: 'justify',
    });
    expect(out).toBe(html(saveOld, base));
  });

  it('escapes the label', () => {
    const out = html(saveNew, {
      ...base,
      label: '<img src=x onerror=alert(1)>',
    });
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });
});
