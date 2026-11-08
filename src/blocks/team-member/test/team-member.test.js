/**
 * @jest-environment node
 *
 * The team member block gained options. With the options at their defaults the saved HTML must equal what
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

import { getSocialLinks } from '../options';

const base = {
  memberName: 'Ada',
  memberRole: 'Engineer',
  memberBio: 'Writes code.',
  avatarUrl: 'https://example.com/ada.jpg',
  avatarAlt: 'Ada',
  avatarShape: 'square',
  memberAlign: 'center',
  hasShadow: true,
  tagType: 'article',
  htmlId: 'm1',
  extraClass: 'mine',
};

describe('team member save compatibility', () => {
  it.each([
    ['full', base],
    ['no photo', { ...base, avatarUrl: '' }],
    ['bare', { tagType: 'div' }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown or unsafe values', () => {
    const attrs = {
      ...base,
      photoPosition: 'center',
      photoSize: 5,
      nameTag: 'script',
      profileUrl: 'javascript:alert(1)',
      socials: [
        { network: 'myspace', url: 'https://example.com' },
        { network: 'linkedin', url: 'javascript:alert(1)' },
        { network: 'email', url: 'not an email' },
      ],
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('team member options reach the markup', () => {
  it('adds position, size, grayscale and name element', () => {
    const out = html(save, {
      ...base,
      photoPosition: 'left',
      photoSize: 160,
      photoGrayscale: true,
      nameTag: 'h2',
    });
    expect(out).toContain('bw-team-member--photo-left');
    expect(out).toContain('bw-team-member--grayscale');
    expect(out).toContain('--kb-tm-photo:160px');
    expect(out).toContain('<h2 class="bw-team-member-name">Ada</h2>');
  });

  it('links the name to the profile page', () => {
    const out = html(save, {
      ...base,
      profileUrl: 'https://example.com/ada',
      profileNewTab: true,
    });
    expect(out).toContain(
      '<h3 class="bw-team-member-name"><a href="https://example.com/ada" target="_blank" rel="noreferrer noopener">Ada</a></h3>',
    );
  });

  it('renders social links and keeps only safe ones', () => {
    const socials = [
      { network: 'linkedin', url: 'https://linkedin.com/in/ada' },
      { network: 'email', url: 'ada@example.com' },
      { network: 'github', url: 'javascript:alert(1)' },
    ];
    const out = html(save, { ...base, socials, socialNewTab: true });
    expect(out).toContain('href="https://linkedin.com/in/ada"');
    expect(out).toContain('href="mailto:ada@example.com"');
    expect(out).not.toContain('javascript');
    expect(out).toContain('rel="noreferrer noopener"');
    expect(getSocialLinks(socials)).toHaveLength(2);
    expect(getSocialLinks('x')).toEqual([]);
  });
});
