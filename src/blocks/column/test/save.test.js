/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-column', p.className]
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
    ['colMd', { colMd: 'col-6' }],
    ['empty colMd', { colMd: '' }],
    [
      'explicit empty new options',
      { colMd: 'col-4', sticky: false, stickyTop: 0, selfAlign: '' },
    ],
  ])('%s', (name, attrs) => {
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('per-device widths, alignment and order', () => {
    const out = html(save, {
      colMd: 'col-6',
      colTablet: 12,
      colMobile: 6,
      selfAlign: 'center',
      mobileOrder: 'first',
    });
    expect(out).toContain(
      'col-6 kb-col-t-12 kb-col-m-6 kb-col--self-center kb-col--order-first',
    );
  });

  test('sticky with an offset', () => {
    const out = html(save, { sticky: true, stickyTop: 80 });
    expect(out).toContain('kb-col--sticky');
    expect(out).toContain('--kb-col-sticky-top:80px');
    expect(html(save, { stickyTop: 80 })).not.toContain('sticky');
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      colTablet: 99,
      colMobile: -3,
      selfAlign: 'x" onclick="y',
      mobileOrder: '<b>',
    });
    expect(out).toContain('kb-col-t-12');
    expect(out).not.toContain('kb-col-m');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('<b>');
  });
});
