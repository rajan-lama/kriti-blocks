/**
 * @jest-environment node
 *
 * New stat options must add nothing to the saved HTML at their defaults.
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
  statNumber: '1,250',
  statLabel: 'Customers',
  statPrefix: '$',
  statSuffix: '+',
  statAlign: 'center',
  enableCount: true,
  htmlId: '',
  extraClass: '',
};

describe('stat save', () => {
  it.each([
    ['defaults', base],
    ['count off, left', { ...base, enableCount: false, statAlign: 'left' }],
    ['number only', { ...base, statLabel: '', statPrefix: '', statSuffix: '' }],
    ['id and class', { ...base, htmlId: 'a', extraClass: 'b' }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      startValue: 0,
      countDuration: 1400,
      showProgress: false,
      progressValue: 40,
      separator: 'weird',
      easing: 'bounce',
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      startValue: 100,
      countDuration: 3000,
      decimals: 1,
      separator: 'space',
      easing: 'inout',
      valueColor: '#ff0000',
      labelColor: 'rgba(0,0,0,.5)',
      valueSize: 64,
      showProgress: true,
      progressValue: 72,
      progressColor: '#0a0',
    });
    expect(out).toContain('data-bw-start="100"');
    expect(out).toContain('data-bw-duration="3000"');
    expect(out).toContain('data-bw-decimals="1"');
    expect(out).toContain('data-bw-sep="space"');
    expect(out).toContain('data-bw-ease="inout"');
    expect(out).toContain('data-bw-count="true"');
    expect(out).toContain('--kb-stat-value:#ff0000');
    expect(out).toContain('--kb-stat-size:64px');
    expect(out).toContain('aria-valuenow="72"');
    expect(out).toContain('width:72%');
  });

  it('drops unsafe colors', () => {
    const out = html(saveNew, {
      ...base,
      valueColor: 'red;background:url(x)',
      labelColor: 'expression(1)',
    });
    expect(out).toBe(html(saveOld, base));
  });
});
