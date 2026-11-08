/**
 * @jest-environment node
 *
 * New video options must add nothing to the saved HTML at their defaults, and
 * embeds must only ever be built from a parsed YouTube or Vimeo ID.
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
    RichText: {
      Content: ({ tagName: Tag = 'span', value, ...rest }) =>
        React.createElement(Tag, rest, value),
    },
  };
});

import saveNew from '../save';
import saveOld from './legacy/save';
import { parseEmbed, getEmbedSrc } from '../embed';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = {
  url: 'https://example.com/a.mp4',
  videoWidth: 100,
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  preload: 'metadata',
  caption: 'Cap',
  htmlId: '',
  extraClass: '',
};

describe('video save', () => {
  it.each([
    ['defaults', base],
    ['no caption', { ...base, caption: '' }],
    ['no url', { ...base, url: '' }],
    [
      'playback flags',
      {
        ...base,
        autoplay: true,
        loop: true,
        muted: true,
        controls: false,
        videoWidth: 60,
        videoAlign: 'center',
        extraClass: 'x',
      },
    ],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      embedUrl: '',
      poster: '',
      aspectRatio: '',
      playsInline: false,
      noDownload: false,
      startTime: 0,
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes file options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      poster: 'https://example.com/p.jpg',
      playsInline: true,
      noDownload: true,
      aspectRatio: '4/3',
      startTime: 5,
      endTime: 20,
    });
    expect(out).toContain('poster="https://example.com/p.jpg"');
    expect(out).toContain('playsinline');
    expect(out).toContain('controlsList="nodownload"');
    expect(out).toContain('aspect-ratio:4 / 3');
    expect(out).toContain('src="https://example.com/a.mp4#t=5,20"');
  });

  it('drops an unsafe poster', () => {
    expect(html(saveNew, { ...base, poster: 'javascript:alert(1)' })).toBe(
      html(saveOld, base),
    );
  });

  it('renders a YouTube embed without an uploaded file', () => {
    const out = html(saveNew, {
      ...base,
      url: '',
      embedUrl: 'https://youtu.be/dQw4w9WgXcQ?t=3',
      privacyMode: true,
      autoplay: true,
      startTime: 30,
      aspectRatio: '1/1',
    });
    expect(out).toContain(
      'src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&amp;mute=1&amp;start=30&amp;rel=0&amp;playsinline=1"',
    );
    expect(out).toContain('<iframe');
    expect(out).not.toContain('<video');
    expect(out).toContain('aspect-ratio:1 / 1');
  });

  it('renders a Vimeo embed', () => {
    const out = html(saveNew, {
      ...base,
      embedUrl: 'https://vimeo.com/76979871/abcdef1234',
      privacyMode: true,
    });
    expect(out).toContain(
      'src="https://player.vimeo.com/video/76979871?h=abcdef1234&amp;dnt=1"',
    );
  });
});

describe('parseEmbed', () => {
  it.each([
    [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=x',
      'youtube',
      'dQw4w9WgXcQ',
    ],
    ['https://youtube.com/shorts/dQw4w9WgXcQ', 'youtube', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'youtube', 'dQw4w9WgXcQ'],
    ['https://player.vimeo.com/video/76979871', 'vimeo', '76979871'],
    ['http://vimeo.com/76979871', 'vimeo', '76979871'],
  ])('accepts %s', (input, provider, id) => {
    expect(parseEmbed(input)).toMatchObject({ provider, id });
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'https://evil.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v="><script>',
    'https://www.youtube.com/watch?v=short',
    'https://vimeo.com/abc',
    '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
    '',
    null,
  ])('rejects %s', (input) => {
    expect(parseEmbed(input)).toBeNull();
    expect(getEmbedSrc({ embedUrl: input })).toBe('');
  });
});

describe('video facade and background mode', () => {
  it('renders a click-to-play button for embeds', () => {
    const out = html(saveNew, {
      ...base,
      url: '',
      embedUrl: 'https://youtu.be/dQw4w9WgXcQ',
      embedFacade: true,
    });
    expect(out).toContain('class="bw-video-facade"');
    expect(out).toContain(
      'data-bw-embed="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&amp;rel=0&amp;playsinline=1"',
    );
    expect(out).toContain('i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
    expect(out).not.toContain('<iframe');
  });

  it('forces muted looping autoplay without controls in background mode', () => {
    const out = html(saveNew, { ...base, backgroundMode: true });
    expect(out).toContain('bw-video--bg');
    expect(out).toContain('autoplay');
    expect(out).toContain('loop');
    expect(out).toContain('muted');
    expect(out).toContain('playsinline');
    expect(out).not.toContain('controls');
  });
});

it('does not put a poster with CSS-breaking characters in the facade style', () => {
  const out = html(saveNew, {
    ...base,
    url: '',
    embedUrl: 'https://vimeo.com/76979871',
    embedFacade: true,
    poster: 'https://x.com/a.jpg);background:url(https://evil.com/x',
  });
  expect(out).not.toContain('evil');
});
