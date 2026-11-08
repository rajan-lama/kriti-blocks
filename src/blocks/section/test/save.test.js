/**
 * @jest-environment node
 *
 * Existing sections must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy/save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        ...p,
        className: ['wp-block-kriti-blocks-section', p.className]
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
  tagType: 'section',
  container: 'container',
  paddingY: 'py-5',
  background: 'none',
  htmlId: '',
  extraClass: '',
  borderStyle: 'solid',
  borderWidth: 0,
  borderColor: '#000000',
  boxShadow: 'none',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    [
      'fluid, div, id and class',
      {
        container: 'container-fluid',
        tagType: 'div',
        htmlId: 'a',
        extraClass: 'mine',
      },
    ],
    ['no container', { container: 'none' }],
    [
      'border and shadow',
      {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#ff0000',
        boxShadow: 'large',
      },
    ],
    [
      'explicit empty new options',
      {
        bgImage: '',
        bgVideo: '',
        bgOverlayColor: '',
        contentWidth: 0,
        bgFixed: false,
        bgFocal: { x: 0.5, y: 0.5 },
      },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('content width, vertical alignment and overflow', () => {
    const out = html(save, {
      ...base,
      contentWidth: 800,
      contentWidthUnit: '%',
      verticalAlign: 'center',
      overflow: 'hidden',
    });
    expect(out).toContain('kb-section--content-w');
    expect(out).toContain('--kb-section-w:800%');
    expect(out).toContain('kb-section--valign-center');
    expect(out).toContain('kb-section--overflow-hidden');
    expect(out).not.toContain('kb-section__bg');
  });

  test('background image with focal point and overlay is the first child', () => {
    const out = html(save, {
      ...base,
      bgImage: 'https://example.com/a.jpg',
      bgFocal: { x: 0.25, y: 0.75 },
      bgFixed: true,
      bgOverlayColor: '#000000',
      bgOverlayOpacity: 40,
    });
    expect(out).toContain('kb-section--has-bg');
    expect(out).toContain('kb-section--parallax');
    expect(out).toContain(
      'background-image:url(&quot;https://example.com/a.jpg&quot;)',
    );
    expect(out).toContain('background-position:25% 75%');
    expect(out).toContain('opacity:0.4');
    expect(out.indexOf('kb-section__bg')).toBeLessThan(
      out.indexOf('class="container"'),
    );
  });

  test('background video is muted, looping and decorative', () => {
    const out = html(save, {
      ...base,
      bgVideo: '/wp-content/uploads/loop.mp4',
      bgImage: 'https://example.com/poster.png',
      bgVideoHideMobile: true,
    });
    expect(out).toContain('<video');
    expect(out).toContain('src="/wp-content/uploads/loop.mp4"');
    expect(out).toContain('poster="https://example.com/poster.png"');
    expect(out).toMatch(/autoPlay|autoplay/i);
    expect(out).toContain('muted');
    expect(out).toContain('playsinline');
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain('kb-section--video-no-mobile');
  });
});

describe('unsafe values never reach the markup', () => {
  test.each([
    ['bgImage', 'javascript:alert(1)'],
    ['bgImage', 'https://x.com/a.jpg");background:url(//evil'],
    ['bgImage', '//evil.com/a.jpg'],
    ['bgVideo', 'https://x.com/file.exe'],
    ['bgOverlayColor', 'red;background:url(//evil)'],
    ['verticalAlign', 'x" onclick="y'],
    ['overflow', 'scroll'],
  ])('%s = %s', (key, value) => {
    const out = html(save, { ...base, [key]: value });
    expect(out).not.toContain('evil');
    expect(out).not.toContain('javascript');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('file.exe');
    expect(out).not.toContain('kb-section__bg');
    expect(out).not.toContain('overflow-scroll');
  });
});
