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
        className: ['wp-block-kriti-blocks-sticky-section', p.className]
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
  stickyOffset: 0,
  zIndex: 10,
  showShadow: true,
  htmlId: '',
  extraClass: '',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    ['offset, no shadow', { stickyOffset: 60, showShadow: false, zIndex: 99 }],
    ['id and class', { htmlId: 'hdr', extraClass: 'mine' }],
    [
      'explicit empty new options',
      { stuckPadding: 0, hideOnScrollDown: false, stuckBackground: '' },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('classes and variables', () => {
    const out = html(save, {
      ...base,
      disableOn: 'mobile',
      stickTo: 'bottom',
      stuckBackground: '#ffffff',
      stuckPadding: 8,
      hideOnScrollDown: true,
    });
    expect(out).toContain('bw-sticky--off-mobile');
    expect(out).toContain('bw-sticky--bottom');
    expect(out).toContain('bw-sticky--stuck-bg');
    expect(out).toContain('bw-sticky--shrink');
    expect(out).toContain('--bw-sticky-stuck-bg:#ffffff');
    expect(out).toContain('--bw-sticky-stuck-pad:8px');
    // Hiding on scroll only makes sense for a top-sticky section.
    expect(out).not.toContain('bw-sticky--smart');
    expect(html(save, { ...base, hideOnScrollDown: true })).toContain(
      'bw-sticky--smart',
    );
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      ...base,
      disableOn: 'x" onclick="y',
      stuckBackground: 'red;background:url(//evil)',
      stickTo: 'left',
    });
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('evil');
    expect(out).not.toContain('bw-sticky--bottom');
  });
});
