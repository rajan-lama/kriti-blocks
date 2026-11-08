/**
 * @jest-environment node
 *
 * New image options must add nothing to the saved HTML at their defaults.
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

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));
const base = {
  url: 'https://example.com/a.jpg',
  alt: 'An image',
  caption: 'Caption',
  htmlId: '',
  extraClass: '',
};

describe('image save', () => {
  it.each([
    ['defaults', base],
    ['no caption', { ...base, caption: '' }],
    ['no url', { ...base, url: '' }],
    [
      'legacy styling',
      {
        ...base,
        imageWidth: 300,
        imageHeight: 200,
        objectFit: 'cover',
        borderRadius: 8,
        imageAlign: 'center',
        extraClass: 'x',
        htmlId: 'i',
      },
    ],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      linkType: '',
      linkUrl: 'https://example.com',
      hoverEffect: '',
      aspectRatio: '',
      captionPosition: '',
      focalPoint: undefined,
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      linkType: 'custom',
      linkUrl: 'https://example.com/page',
      linkNewTab: true,
      linkNofollow: true,
      hoverEffect: 'zoom',
      aspectRatio: '16/9',
      focalPoint: { x: 0.25, y: 0.75 },
      captionPosition: 'overlay',
    });
    expect(out).toContain(
      'bw-image--hover-zoom bw-image--cap-overlay bw-image--ratio',
    );
    expect(out).toContain(
      '<a href="https://example.com/page" target="_blank" rel="nofollow noopener noreferrer"><img',
    );
    expect(out).toContain('aspect-ratio:16 / 9');
    expect(out).toContain('object-position:25% 75%');
  });

  it('links to the image file for the media option', () => {
    const out = html(saveNew, { ...base, linkType: 'media' });
    expect(out).toContain('<a href="https://example.com/a.jpg"><img');
  });

  it('drops unsafe links and unknown values', () => {
    const out = html(saveNew, {
      ...base,
      linkType: 'custom',
      linkUrl: 'javascript:alert(1)',
      hoverEffect: 'spin',
      aspectRatio: '1/1;x:y',
      focalPoint: { x: 'a', y: 2 },
    });
    expect(out).toBe(html(saveOld, base));
    expect(
      html(saveNew, {
        ...base,
        linkType: 'custom',
        linkUrl: ' JaVa\tScRiPt:alert(1)',
      }),
    ).toBe(html(saveOld, base));
  });
});

describe('image lightbox and shape', () => {
  it('renders a lightbox link and shape class', () => {
    const out = html(saveNew, {
      ...base,
      linkType: 'lightbox',
      imageShape: 'hexagon',
    });
    expect(out).toContain(
      '<a href="https://example.com/a.jpg" class="bw-image-lightbox" data-bw-lightbox="1"><img',
    );
    expect(out).toContain('bw-image--shape-hexagon');
  });

  it('ignores unknown shapes', () => {
    expect(html(saveNew, { ...base, imageShape: 'star' })).toBe(
      html(saveOld, base),
    );
  });
});
