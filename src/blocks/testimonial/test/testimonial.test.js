/**
 * @jest-environment node
 *
 * The testimonial block gained options. With the options at their defaults the saved HTML must equal what
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
  quote: 'Great',
  authorName: 'Ada',
  authorRole: 'CTO',
  avatarUrl: 'https://example.com/a.jpg',
  avatarAlt: 'Ada',
  testimonialAlign: 'left',
  showQuoteMark: true,
  htmlId: 't1',
  extraClass: 'mine',
};

describe('testimonial save compatibility', () => {
  it.each([
    ['full', base],
    ['no avatar or mark', { ...base, avatarUrl: '', showQuoteMark: false }],
    ['bare', {}],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown or unsafe values', () => {
    const attrs = {
      ...base,
      rating: 9,
      company: '   ',
      logoUrl: 'javascript:alert(1)',
      avatarPosition: 'middle',
      avatarShape: 'star',
      accentColor: 'red;x:y',
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('testimonial options reach the markup', () => {
  it('adds the star rating with an accessible label', () => {
    const out = html(save, { ...base, rating: 4, ratingColor: '#f59e0b' });
    expect(out).toContain('role="img" aria-label="Rated 4 out of 5"');
    expect(out).toContain(
      '★★★★<span class="bw-testimonial-rating__off">★</span>',
    );
    expect(out).toContain('--kb-tm-star:#f59e0b');
  });

  it('adds company, logo, avatar position and accent', () => {
    const out = html(save, {
      ...base,
      company: 'Acme',
      logoUrl: 'https://example.com/logo.png',
      logoAlt: 'Acme',
      avatarPosition: 'top',
      avatarShape: 'square',
      accentColor: '#e11d48',
    });
    expect(out).toContain('<div class="bw-testimonial-company">Acme</div>');
    expect(out).toContain(
      'class="bw-testimonial-logo" src="https://example.com/logo.png"',
    );
    expect(out).toContain('bw-testimonial--avatar-top');
    expect(out).toContain('bw-testimonial--avatar-square');
    expect(out).toContain('--kb-tm-accent:#e11d48');
  });
});
