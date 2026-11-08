/**
 * @jest-environment node
 *
 * New logo grid options must add nothing to the saved HTML at their defaults.
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
  logos: [
    { id: 1, url: 'https://example.com/a.png', alt: 'A' },
    { id: 2, url: 'https://example.com/b.png', alt: '' },
  ],
  logoColumns: 4,
  grayscale: true,
  htmlId: '',
  extraClass: '',
};

describe('logo grid save', () => {
  it.each([
    ['defaults', base],
    [
      'color, 3 columns',
      {
        ...base,
        grayscale: false,
        logoColumns: 3,
        extraClass: 'x',
        htmlId: 'g',
      },
    ],
    ['empty', { ...base, logos: [] }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      logoAlign: 'center',
      logoHeight: '',
      logos: base.logos.map((logo) => ({ ...logo, link: '', newTab: false })),
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      colsTablet: 3,
      colsMobile: 1,
      logoHeight: 80,
      logoGap: 32,
      logoOpacity: 50,
      logoAlign: 'left',
    });
    expect(out).toContain('kb-lg--rc kb-lg--left');
    expect(out).toContain('--kb-lg-t:3');
    expect(out).toContain('--kb-lg-m:1');
    expect(out).toContain('--kb-lg-h:80px');
    expect(out).toContain('--kb-lg-gap:32px');
    expect(out).toContain('--kb-lg-op:0.5');
  });

  it('wraps linked logos in a safe anchor', () => {
    const out = html(saveNew, {
      ...base,
      logos: [
        {
          id: 1,
          url: 'https://example.com/a.png',
          link: 'https://partner.com',
          newTab: true,
          nofollow: true,
        },
        {
          id: 2,
          url: 'https://example.com/b.png',
          link: 'javascript:alert(1)',
        },
      ],
    });
    expect(out).toContain(
      '<a href="https://partner.com" target="_blank" rel="nofollow noopener noreferrer"><img',
    );
    expect(out).not.toContain('javascript');
  });
});

describe('logo grid carousel mode', () => {
  it('adds the strip class only when on', () => {
    expect(html(saveNew, { ...base, carouselMode: true })).toContain(
      'kb-lg--strip',
    );
    expect(html(saveNew, { ...base, carouselMode: false })).toBe(
      html(saveOld, base),
    );
  });
});
