/**
 * @jest-environment node
 *
 * Existing modals must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy.save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-modal', p.className]
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
  triggerText: 'Open modal',
  triggerBackground: '#4f46e5',
  triggerColor: '#ffffff',
  panelWidth: 560,
  position: 'center',
  panelBackground: '#ffffff',
  panelRadius: 12,
  showCloseButton: true,
  closeOnBackdrop: true,
  htmlId: '',
  extraClass: '',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    ['bottom, no close button', { position: 'bottom', showCloseButton: false }],
    [
      'id, class, no backdrop close',
      { htmlId: 'a', extraClass: 'mine', closeOnBackdrop: false },
    ],
    [
      'explicit falsy new options',
      {
        autoOpen: false,
        exitIntent: false,
        hideTrigger: false,
        maxHeight: 0,
        scrollOpen: 0,
        showOnceDays: 0,
        overlayBlur: 0,
        animation: '',
      },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('overlay, blur, max height and animation', () => {
    const out = html(save, {
      ...base,
      overlayColor: 'rgba(0,0,0,0.8)',
      overlayBlur: 6,
      maxHeight: 70,
      animation: 'zoom',
    });
    expect(out).toContain('--bw-modal-overlay:rgba(0,0,0,0.8)');
    expect(out).toContain('--bw-modal-blur:6px');
    expect(out).toContain('--bw-modal-max-h:70vh');
    expect(out).toContain('bw-modal--anim-zoom');
  });

  test('automatic triggers become data attributes', () => {
    const out = html(save, {
      ...base,
      autoOpen: true,
      autoOpenDelay: 5,
      exitIntent: true,
      scrollOpen: 50,
      showOnceDays: 7,
      hideTrigger: true,
      triggerSelector: '.open-me',
    });
    expect(out).toContain('data-auto-open="5"');
    expect(out).toContain('data-exit-intent="true"');
    expect(out).toContain('data-scroll-open="50"');
    expect(out).toContain('data-once-days="7"');
    expect(out).toContain('data-trigger-selector=".open-me"');
    expect(out).toContain('bw-modal--no-trigger');
  });

  test('show once is ignored without an automatic trigger', () => {
    expect(html(save, { ...base, showOnceDays: 7 })).not.toContain(
      'data-once-days',
    );
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      ...base,
      overlayColor: 'red;background:url(//evil)',
      animation: '"><script>',
      triggerSelector: '<img src=x onerror=alert(1)>',
      overlayBlur: 9999,
    });
    expect(out).not.toContain('evil');
    expect(out).not.toContain('script');
    expect(out).not.toContain('onerror');
    expect(out).toContain('--bw-modal-blur:30px');
  });
});
