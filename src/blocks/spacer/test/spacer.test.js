/**
 * @jest-environment node
 *
 * New spacer options must add nothing to the saved HTML at their defaults.
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
const base = { spacerHeight: 50, htmlId: '', extraClass: '' };

describe('spacer save', () => {
  it.each([
    ['defaults', base],
    [
      'taller with class and id',
      { spacerHeight: 120, extraClass: 'x', htmlId: 's' },
    ],
    ['zero height falls back', { ...base, spacerHeight: 0 }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = { ...base, heightUnit: 'px', heightTablet: '' };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      spacerHeight: 10,
      heightUnit: 'vh',
      heightTablet: 6,
      heightMobile: 4,
    });
    expect(out).toContain('height:10vh');
    expect(out).toContain('--kb-sp-t:6vh');
    expect(out).toContain('--kb-sp-m:4vh');
    expect(out).toContain('kb-sp--rh');
  });

  it('drops unknown units', () => {
    const out = html(saveNew, {
      ...base,
      heightUnit: 'px;color:red',
      heightTablet: 'x',
    });
    expect(out).toBe(html(saveOld, base));
  });
});
