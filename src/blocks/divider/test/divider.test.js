/**
 * @jest-environment node
 *
 * New divider options must add nothing to the saved HTML at their defaults.
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
  dividerStyle: 'solid',
  dividerColor: '#d1d5db',
  dividerWeight: 2,
  dividerWidth: 100,
  dividerAlign: 'center',
  htmlId: '',
  extraClass: '',
};

describe('divider save', () => {
  it.each([
    ['defaults', base],
    [
      'gradient left',
      {
        ...base,
        dividerStyle: 'gradient',
        dividerAlign: 'left',
        dividerWidth: 40,
      },
    ],
    [
      'dashed with class',
      { ...base, dividerStyle: 'dashed', extraClass: 'x', htmlId: 'd' },
    ],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      dividerText: '  ',
      dividerIcon: '',
      widthTablet: '',
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('renders text and an icon in the middle', () => {
    const out = html(saveNew, {
      ...base,
      dividerText: 'Or <b>continue</b>',
      dividerIcon: 'star',
      labelColor: '#333',
    });
    expect(out).toContain('bw-divider-labeled');
    expect(out).toContain('Or &lt;b&gt;continue&lt;/b&gt;');
    expect(out).toContain('<svg class="bw-divider-icon"');
    expect(out).toContain('--kb-dv-label:#333');
    expect(out).not.toContain('<hr');
    expect(out.match(/bw-divider-line/g)).toHaveLength(2);
  });

  it('writes responsive options to the wrapper', () => {
    const out = html(saveNew, {
      ...base,
      widthTablet: 80,
      widthMobile: 60,
      weightMobile: 1,
    });
    expect(out).toContain('kb-dv--rw');
    expect(out).toContain('--kb-dv-w-t:80%');
    expect(out).toContain('--kb-dv-w-m:60%');
    expect(out).toContain('--kb-dv-h-m:1px');
    expect(out).toContain('<hr');
  });

  it('drops unknown icons', () => {
    const out = html(saveNew, { ...base, dividerIcon: 'skull' });
    expect(out).toBe(html(saveOld, base));
  });
});

describe('divider shapes', () => {
  it('renders a shape instead of a line', () => {
    const out = html(saveNew, {
      ...base,
      dividerShape: 'wave',
      shapeHeight: 80,
      shapeFlip: true,
      dividerColor: '#123456',
    });
    expect(out).toContain('bw-divider-shape');
    expect(out).toContain('height:80px');
    expect(out).toContain('color:#123456');
    expect(out).toContain('scaleY(-1)');
    expect(out).not.toContain('<hr');
  });

  it('ignores unknown shapes', () => {
    expect(html(saveNew, { ...base, dividerShape: 'sawtooth' })).toBe(
      html(saveOld, base),
    );
  });
});
