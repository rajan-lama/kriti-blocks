/**
 * @jest-environment node
 *
 * Existing rows must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy/save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-row', p.className]
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
  gap: 20,
  minHeight: '',
  htmlId: '',
  extraClass: '',
  displayType: 'normal',
  rowDirection: 'normal',
  flexWrap: 'normal',
  justifyContent: 'normal',
  alignItem: 'normal',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    [
      'no attributes at all',
      { gap: undefined, displayType: undefined, rowDirection: undefined },
    ],
    [
      'tag, id, class, min height',
      {
        tagType: 'section',
        htmlId: 'r',
        extraClass: 'mine',
        minHeight: '300px',
      },
    ],
    ['stack variation', { displayType: 'flex', rowDirection: 'column' }],
    [
      'valid flex values',
      {
        rowDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItem: 'center',
      },
    ],
    [
      'explicit empty new options',
      {
        equalItems: false,
        stackReverse: false,
        stackOn: '',
        gapTablet: undefined,
      },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('equal items, stacking and responsive gaps', () => {
    const out = html(save, {
      ...base,
      equalItems: true,
      stackOn: 'mobile',
      stackReverse: true,
      gapTablet: 12,
      gapMobile: 0,
    });
    expect(out).toContain('bw-row--equal');
    expect(out).toContain('bw-row--stack-mobile');
    expect(out).toContain('bw-row--stack-reverse');
    expect(out).toContain('--bw-row-gap-t:12px');
    expect(out).toContain('--bw-row-gap-m:0px');
  });

  test('flex values come through when valid', () => {
    const out = html(save, {
      ...base,
      rowDirection: 'column',
      alignItem: 'flex-end',
    });
    expect(out).toContain('--bw-row-direction:column');
    expect(out).toContain('--bw-row-align:flex-end');
  });

  test('unknown flex values fall back instead of reaching the markup', () => {
    const out = html(save, {
      ...base,
      rowDirection: 'row;background:url(//evil)',
      alignItem: 'x" onclick="y',
      stackOn: '<script>',
    });
    expect(out).toContain('--bw-row-direction:row');
    expect(out).not.toContain('evil');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('script');
  });
});
