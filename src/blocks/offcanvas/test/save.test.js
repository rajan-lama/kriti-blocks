/**
 * @jest-environment node
 *
 * Existing drawers must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy/save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-offcanvas', p.className]
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
  triggerText: 'Open menu',
  triggerBackground: '#4f46e5',
  triggerColor: '#ffffff',
  side: 'right',
  drawerWidth: 320,
  drawerBackground: '#ffffff',
  showCloseButton: true,
  closeOnBackdrop: true,
  htmlId: '',
  extraClass: '',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    ['left side, no close button', { side: 'left', showCloseButton: false }],
    [
      'id, class, no backdrop close',
      { htmlId: 'a', extraClass: 'mine', closeOnBackdrop: false },
    ],
    [
      'explicit falsy new options',
      {
        hamburger: false,
        hideTrigger: false,
        closeOnLink: false,
        widthTablet: 0,
        widthMobile: 0,
        overlayBlur: 0,
      },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('variables, classes and data attributes', () => {
    const out = html(save, {
      ...base,
      overlayColor: '#112233',
      overlayBlur: 4,
      animationSpeed: 500,
      widthTablet: 280,
      widthMobile: 240,
      hamburger: true,
      hideTrigger: true,
      closeOnLink: true,
      triggerSelector: '.menu-toggle',
    });
    expect(out).toContain('--bw-oc-overlay:#112233');
    expect(out).toContain('--bw-oc-blur:4px');
    expect(out).toContain('--bw-oc-speed:500ms');
    expect(out).toContain('--bw-oc-width-tablet:280px');
    expect(out).toContain('--bw-oc-width-mobile:240px');
    expect(out).toContain('bw-offcanvas--hamburger');
    expect(out).toContain('bw-offcanvas--no-trigger');
    expect(out).toContain('data-close-on-link="true"');
    expect(out).toContain('data-trigger-selector=".menu-toggle"');
  });

  test('a speed of 0 is kept (instant)', () => {
    expect(html(save, { ...base, animationSpeed: 0 })).toContain(
      '--bw-oc-speed:0ms',
    );
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      ...base,
      overlayColor: 'red;background:url(//evil)',
      triggerSelector: '<img src=x onerror=alert(1)>',
      widthMobile: 99999,
    });
    expect(out).not.toContain('evil');
    expect(out).not.toContain('onerror');
    expect(out).toContain('--bw-oc-width-mobile:900px');
  });
});
