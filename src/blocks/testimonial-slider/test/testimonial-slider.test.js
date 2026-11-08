/**
 * @jest-environment node
 *
 * The testimonial slider gained options. With the options at their defaults the saved HTML must equal what
 * the original save() produced, or existing posts would show "invalid block".
 * test/legacy/save.js is the original save() copied unchanged.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({ className: 'wp-block', ...p }),
    },
    RichText: {
      Content: ({ tagName: Tag, className, value }) =>
        Tag
          ? React.createElement(Tag, { className }, value)
          : React.createElement(React.Fragment, null, value),
    },
    InnerBlocks: {
      Content: () => React.createElement('span', { 'data-inner': '1' }),
    },
  };
});

import save from '../save';
import legacy from './legacy/save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

const base = {
  slides: [
    {
      id: 1,
      quote: 'One',
      authorName: 'A',
      authorRole: 'R',
      avatarUrl: '',
      avatarAlt: '',
    },
    {
      id: 2,
      quote: 'Two',
      authorName: 'B',
      authorRole: '',
      avatarUrl: 'https://example.com/b.jpg',
      avatarAlt: 'B',
    },
  ],
  autoplay: true,
  interval: 4000,
  showArrows: true,
  showDots: true,
  showQuoteMark: true,
  htmlId: 'ts1',
  extraClass: 'mine',
};

describe('testimonial slider save compatibility', () => {
  it.each([
    ['full', base],
    [
      'single slide, no autoplay',
      { ...base, slides: [base.slides[0]], autoplay: false },
    ],
    [
      'no controls',
      { ...base, showArrows: false, showDots: false, showQuoteMark: false },
    ],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown values and the true/default forms of toggles', () => {
    const attrs = {
      ...base,
      slidesPerView: 9,
      loop: true,
      pauseOnHover: true,
      transition: 'spin',
      speed: 5,
      arrowStyle: 'star',
      dotStyle: 'blob',
      accentColor: 'red;x:y',
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('testimonial slider options reach the markup', () => {
  it('adds data attributes for per view, loop and pause', () => {
    const out = html(save, {
      ...base,
      slidesPerView: 3,
      loop: false,
      pauseOnHover: false,
    });
    expect(out).toContain('data-per-view="3"');
    expect(out).toContain('data-loop="false"');
    expect(out).toContain('data-pause="false"');
  });

  it('fade drops slides per view and adds the fade class and speed', () => {
    const out = html(save, {
      ...base,
      transition: 'fade',
      slidesPerView: 3,
      speed: 800,
    });
    expect(out).toContain('bw-ts--fade');
    expect(out).not.toContain('data-per-view');
    expect(out).toContain('--kb-ts-speed:800ms');
  });

  it('adds arrow and dot styles and validated colors', () => {
    const out = html(save, {
      ...base,
      arrowStyle: 'square',
      dotStyle: 'line',
      accentColor: '#e11d48',
      dotColor: '#cccccc',
      arrowColor: '#111111',
      arrowBg: '#ffffff',
    });
    expect(out).toContain('bw-ts--arrows-square');
    expect(out).toContain('bw-ts--dots-line');
    expect(out).toContain('--kb-ts-accent:#e11d48');
    expect(out).toContain('--kb-ts-dot:#cccccc');
    expect(out).toContain('--kb-ts-arrow:#111111');
    expect(out).toContain('--kb-ts-arrow-bg:#ffffff');
  });
});
