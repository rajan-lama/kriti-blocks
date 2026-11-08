/**
 * @jest-environment node
 *
 * New cover options must add nothing to the saved HTML at their defaults.
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
  tagType: 'div',
  backgroundUrl: 'https://example.com/bg.jpg',
  overlayColor: '#000000',
  overlayOpacity: 40,
  minHeight: 400,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  contentAlign: 'center',
  htmlId: '',
  extraClass: '',
};

describe('cover save', () => {
  it.each([
    ['defaults', base],
    ['no background', { ...base, backgroundUrl: '' }],
    [
      'other settings',
      {
        ...base,
        tagType: 'section',
        contentAlign: 'left',
        minHeight: 600,
        extraClass: 'x',
        htmlId: 'c',
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

describe('cover video and scroll arrow', () => {
  it('adds a background video and arrow only when set', () => {
    const out = html(saveNew, {
      ...base,
      bgVideoUrl: 'https://example.com/v.mp4',
      scrollIndicator: true,
    });
    expect(out).toContain(
      '<video class="kb-cover-video" src="https://example.com/v.mp4"',
    );
    expect(out).toContain('kb-cover-video-overlay');
    expect(out).toContain('data-kb-scroll="1"');
  });

  it('rejects unsafe video URLs', () => {
    expect(html(saveNew, { ...base, bgVideoUrl: 'javascript:alert(1)' })).toBe(
      html(saveOld, base),
    );
  });
});
