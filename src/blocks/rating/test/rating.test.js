/**
 * @jest-environment node
 *
 * New rating options must add nothing to the saved HTML at their defaults.
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
  ratingValue: 4.3,
  maxRating: 5,
  starSize: 'medium',
  starColor: '#f59e0b',
  emptyStarColor: '#e5e7eb',
  showValue: false,
  ratingLabel: '',
  htmlId: '',
  extraClass: '',
};

describe('rating save', () => {
  it.each([
    ['defaults', base],
    [
      'value and label',
      { ...base, showValue: true, ratingLabel: '120 reviews' },
    ],
    [
      'ten large stars',
      { ...base, maxRating: 10, starSize: 'large', ratingValue: 7.5 },
    ],
    [
      'colors and class',
      { ...base, starColor: '#f00', extraClass: 'x', htmlId: 'r' },
    ],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      showValue: true,
      iconShape: 'star',
      roundHalf: false,
      showMax: false,
      labelPosition: 'after',
      customSize: '',
    };
    expect(html(saveNew, attributes)).toBe(
      html(saveOld, { ...base, showValue: true }),
    );
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      showValue: true,
      showMax: true,
      iconShape: 'heart',
      roundHalf: true,
      customSize: 40,
      starGap: 6,
      labelPosition: 'below',
      ratingLabel: 'ok',
      valueColor: '#222',
    });
    expect(out).toContain('bw-rating--label-below');
    expect(out).toContain('--bw-rating-size:40px');
    expect(out).toContain('--kb-rating-gap:6px');
    expect(out).toContain('--kb-rating-value:#222');
    expect(out).toContain('M12 21.35l-1.45');
    expect(out).toContain('4.3 / 5');
    // 4.3 rounds to 4.5, so the last star is half filled.
    expect(out).toContain('width:50%');
  });

  it('drops unknown shapes and unsafe colors', () => {
    const out = html(saveNew, {
      ...base,
      iconShape: 'constructor',
      labelPosition: 'sideways',
      valueColor: 'red;x:y',
    });
    expect(out).toBe(html(saveOld, base));
  });
});

describe('rating schema markup', () => {
  it('adds AggregateRating microdata only with a name and count', () => {
    const on = html(saveNew, {
      ...base,
      schemaMarkup: true,
      schemaName: 'Acme "Pro"',
      ratingCount: 120,
    });
    expect(on).toContain('itemscope=""');
    expect(on).toContain('itemType="https://schema.org/AggregateRating"');
    expect(on).toContain('itemProp="ratingValue" content="4.3"');
    expect(on).toContain('itemProp="ratingCount" content="120"');
    expect(on).toContain('content="Acme &quot;Pro&quot;"');
    expect(
      html(saveNew, { ...base, schemaMarkup: true, schemaName: 'x' }),
    ).toBe(html(saveOld, base));
  });
});

describe('rating voting markup', () => {
  it('adds nothing when voting is off', () => {
    expect(html(saveNew, base)).toBe(html(saveOld, base));
    expect(html(saveNew, { ...base, voteId: 'abcd1234' })).toBe(
      html(saveOld, base),
    );
  });

  it('adds the vote id only when voting is on and the id is valid', () => {
    const on = html(saveNew, {
      ...base,
      allowVoting: true,
      voteId: 'abcd1234',
    });
    expect(on).toContain('data-kb-vote="abcd1234"');
    const bad = html(saveNew, {
      ...base,
      allowVoting: true,
      voteId: '"><script>',
    });
    expect(bad).not.toContain('data-kb-vote');
    expect(bad).not.toContain('<script>');
  });

  it('drops the search engine markup while voting is on', () => {
    const out = html(saveNew, {
      ...base,
      allowVoting: true,
      voteId: 'abcd1234',
      schemaMarkup: true,
      schemaName: 'Thing',
      ratingCount: 3,
    });
    expect(out).not.toContain('itemprop');
  });
});
