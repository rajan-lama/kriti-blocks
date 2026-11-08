/**
 * @jest-environment node
 *
 * Existing grids must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy/save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-grid', p.className]
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

const base = {
  tagType: 'div',
  gridColumns: 2,
  gridColumnGap: 20,
  gridRowGap: 20,
  minHeight: '',
  htmlId: '',
  extraClass: '',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    [
      'four columns, no gaps',
      { gridColumns: 4, gridColumnGap: 0, gridRowGap: 0 },
    ],
    [
      'tag, id, class, min height, position',
      {
        tagType: 'section',
        htmlId: 'g',
        extraClass: 'mine',
        minHeight: '40vh',
        positionType: 'relative',
        zindex: '3',
      },
    ],
    [
      'explicit empty new options',
      {
        colsTablet: 0,
        colsMobile: undefined,
        autoFitMin: 0,
        gridDense: false,
        gridAlign: '',
      },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('per-device columns and auto-fit', () => {
    const out = html(save, {
      ...base,
      colsTablet: 2,
      colsMobile: 1,
      autoFitMin: 220,
    });
    expect(out).toContain('bw-grid--cols-t');
    expect(out).toContain('bw-grid--cols-m');
    expect(out).toContain('bw-grid--auto');
    expect(out).toContain('--bw-grid-cols-t:2');
    expect(out).toContain('--bw-grid-cols-m:1');
    expect(out).toContain('--bw-grid-min:220px');
  });

  test('alignment and dense packing', () => {
    const out = html(save, {
      ...base,
      gridAlign: 'center',
      gridJustify: 'end',
      gridDense: true,
    });
    expect(out).toContain('bw-grid--align-center');
    expect(out).toContain('bw-grid--justify-end');
    expect(out).toContain('bw-grid--dense');
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      ...base,
      gridAlign: 'x" onclick="y',
      colsTablet: 99,
      autoFitMin: 99999,
    });
    expect(out).not.toContain('onclick');
    expect(out).toContain('--bw-grid-cols-t:12');
    expect(out).toContain('--bw-grid-min:800px');
  });
});
