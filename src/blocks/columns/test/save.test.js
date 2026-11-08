/**
 * @jest-environment node
 *
 * Existing columns must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy/save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-columns', p.className]
          .filter(Boolean)
          .join(' '),
      }),
    },
    InnerBlocks: {
      Content: () => React.createElement('span', { 'data-inner': '1' }),
    },
  };
});

import save from '../save';
import legacySave from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['no attributes', {}],
    [
      'legacy attributes only',
      {
        layout: 'layout-two',
        container: 'container',
        paddingY: 'py-0',
        verticalAlignment: 'center',
      },
    ],
    ['colMd', { colMd: 'col-6' }],
    [
      'explicit empty new options',
      {
        rowReverse: false,
        stackReverse: false,
        rowAlign: '',
        stackOn: '',
        colGap: undefined,
      },
    ],
  ])('%s', (name, attrs) => {
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('alignment, reverse and stacking classes', () => {
    const out = html(save, {
      rowAlign: 'center',
      rowJustify: 'between',
      rowReverse: true,
      stackOn: 'mobile',
      stackReverse: true,
    });
    expect(out).toContain('kb-columns--align-center');
    expect(out).toContain('kb-columns--justify-between');
    expect(out).toContain('kb-columns--reverse');
    expect(out).toContain('kb-columns--stack-mobile');
    expect(out).toContain('kb-columns--stack-reverse');
  });

  test('reverse-when-stacked needs a stack setting', () => {
    expect(html(save, { stackReverse: true })).not.toContain('stack-reverse');
  });

  test('gutter is set on the inner row, and zero is allowed', () => {
    const out = html(save, { colGap: 0, rowGapY: 24 });
    expect(out).toContain(
      '<div class="row" style="--bs-gutter-x:0px;--bs-gutter-y:24px">',
    );
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      rowAlign: 'x" onclick="y',
      stackOn: '<script>',
      colGap: 99999,
    });
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('script');
    expect(out).toContain('--bs-gutter-x:120px');
  });
});
