/**
 * @jest-environment node
 *
 * New hero options must add nothing to the saved HTML at their defaults.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block', p.className].filter(Boolean).join(' '),
      }),
    },
    InnerBlocks: {
      Content: () => React.createElement('span', { 'data-inner': '1' }),
    },
  };
});

import saveNew from '../save';
import saveOld from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = {
  backgroundUrl: 'https://example.com/bg.jpg',
  overlayColor: '#000000',
  overlayOpacity: 40,
  heroHeight: 'medium',
  contentWidth: 'wide',
  contentAlign: 'center',
  htmlId: '',
  extraClass: '',
};

describe('hero save', () => {
  it.each([
    ['defaults', base],
    ['no background', { ...base, backgroundUrl: '' }],
    [
      'other settings',
      {
        ...base,
        heroHeight: 'full',
        contentWidth: 'narrow',
        contentAlign: 'right',
        extraClass: 'x',
        htmlId: 'h',
      },
    ],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      parallax: false,
      overlayGradFrom: '#000',
      verticalAlign: 'center',
      focalPoint: undefined,
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      parallax: true,
      overlayGradFrom: 'rgba(0,0,0,0.8)',
      overlayGradTo: 'rgba(0,0,0,0)',
      overlayGradAngle: 90,
      focalPoint: { x: 0.2, y: 0.9 },
      verticalAlign: 'bottom',
      contentMaxWidth: 700,
      heightTablet: 420,
      heightMobile: 300,
    });
    expect(out).toContain('kb-cover--parallax kb-cover--rh');
    expect(out).toContain(
      'linear-gradient( 90deg, rgba(0,0,0,0.8), rgba(0,0,0,0) ), url(https://example.com/bg.jpg)',
    );
    expect(out).toContain('background-position:20% 90%');
    expect(out).toContain('align-items:flex-end');
    expect(out).toContain('max-width:700px');
    expect(out).toContain('--kb-cover-h-t:420px');
    expect(out).toContain('--kb-cover-h-m:300px');
  });

  it('drops unsafe values', () => {
    const out = html(saveNew, {
      ...base,
      overlayGradFrom: 'red;background:url(x)',
      overlayGradTo: '#fff',
      verticalAlign: 'sideways',
      focalPoint: { x: 'a', y: 'b' },
      contentMaxWidth: 'wide',
    });
    expect(out).toBe(html(saveOld, base));
  });
});

describe('hero custom height', () => {
  it('replaces the height preset', () => {
    const out = html(saveNew, { ...base, customHeight: 640 });
    expect(out).toContain('min-height:640px');
    expect(out).not.toContain('min-height:520px');
  });
});

describe('hero video and scroll arrow', () => {
  it('adds a background video and arrow only when set', () => {
    const out = html(saveNew, {
      ...base,
      bgVideoUrl: '/wp-content/uploads/v.webm',
      scrollIndicator: true,
    });
    expect(out).toContain('class="kb-cover-video"');
    expect(out).toContain('data-kb-scroll="1"');
  });
});
