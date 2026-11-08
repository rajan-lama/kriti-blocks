/**
 * @jest-environment node
 *
 * The comparison table gained options. With the options at their defaults the saved HTML must equal what
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
  featureColLabel: 'Features',
  products: [
    { name: 'Basic', price: '$5' },
    { name: 'Pro', price: '$9' },
  ],
  rows: [
    { label: 'Support', included: [true, true] },
    { label: 'API', included: [false, true] },
  ],
  highlightIndex: 1,
  accentColor: '#2563eb',
  htmlId: 'cmp',
  extraClass: 'mine',
};

describe('comparison table save compatibility', () => {
  it.each([
    ['full', base],
    ['no rows', { ...base, rows: [] }],
    ['no products', { ...base, products: [] }],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown values', () => {
    const attrs = {
      ...base,
      cellAlign: 'justify',
      density: 'huge',
      yesColor: 'red;position:fixed',
      headerBg: 'url(x)',
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('comparison table options reach the markup', () => {
  it('adds the style classes', () => {
    const out = html(save, {
      ...base,
      stickyHeader: true,
      stickyFirstCol: true,
      cellAlign: 'left',
      striped: true,
      rowHover: true,
      density: 'compact',
      hideNo: true,
    });
    [
      'bw-cmp--sticky-head',
      'bw-cmp--sticky-col',
      'bw-cmp--align-left',
      'bw-cmp--striped',
      'bw-cmp--row-hover',
      'bw-cmp--compact',
      'bw-cmp--hide-no',
    ].forEach((name) => expect(out).toContain(name));
  });

  it('adds validated color and offset variables', () => {
    const out = html(save, {
      ...base,
      stickyHeader: true,
      stickyOffset: 64,
      yesColor: '#00aa00',
      noColor: '#aa0000',
      headerBg: '#111111',
      headerColor: '#ffffff',
    });
    expect(out).toContain('--kb-cmp-sticky-top:64px');
    expect(out).toContain('--kb-cmp-yes:#00aa00');
    expect(out).toContain('--kb-cmp-no:#aa0000');
    expect(out).toContain('--kb-cmp-head-bg:#111111');
    expect(out).toContain('--kb-cmp-head-color:#ffffff');
  });
});

describe('comparison table cell text and tooltips', () => {
  const base = {
    products: [{ name: 'A', price: '' }],
    rows: [{ label: 'Storage', included: [true] }],
  };

  it('renders cell text instead of a mark, with a tooltip', () => {
    const out = html(save, {
      ...base,
      rows: [
        {
          label: 'Storage',
          tip: 'Per user',
          included: [true],
          text: ['10 GB'],
          tips: ['Fair use'],
        },
      ],
    });
    expect(out).toContain('10 GB');
    expect(out).toContain('Fair use');
    expect(out).toContain('Per user');
    expect(out).not.toContain('Included');
  });

  it('escapes tooltip text', () => {
    const out = html(save, {
      ...base,
      rows: [{ label: 'x', included: [true], tips: ['<script>x</script>'] }],
    });
    expect(out).not.toContain('<script>');
  });

  it('leaves a plain row unchanged', () => {
    expect(html(save, base)).toBe(html(legacy, base));
  });
});
