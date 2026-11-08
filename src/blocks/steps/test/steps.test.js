/**
 * @jest-environment node
 *
 * The steps block gained options. With the options at their defaults the saved HTML must equal what
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

import { formatStepNumber } from '../options';

const base = {
  steps: [
    { title: 'One', description: 'First' },
    { title: '', description: '' },
    { title: 'Three', description: '' },
  ],
  stepsLayout: 'horizontal',
  htmlId: 's1',
  extraClass: 'mine',
};

describe('steps save compatibility', () => {
  it.each([
    ['full', base],
    ['bare', {}],
  ])('is identical to the original at defaults (%s)', (_n, attrs) => {
    expect(html(save, attrs)).toBe(html(legacy, attrs));
  });

  it('ignores unknown values and unsafe links', () => {
    const attrs = {
      ...base,
      steps: base.steps.map((s) => ({ ...s, url: 'javascript:alert(1)' })),
      numberStyle: 'hex',
      numberFormat: 'roman',
      numberBg: 'red;x:y',
      numberSize: 4,
      stepAlign: 'right',
    };
    expect(html(save, attrs)).toBe(html(legacy, base));
  });
});

describe('steps options reach the markup', () => {
  it('adds classes and variables', () => {
    const out = html(save, {
      ...base,
      numberStyle: 'square',
      connector: true,
      stepAlign: 'center',
      numberSize: 56,
      numberBg: '#ff0000',
      connectorColor: '#00ff00',
    });
    expect(out).toContain('bw-steps--num-square');
    expect(out).toContain('bw-steps--connector');
    expect(out).toContain('bw-steps--center');
    expect(out).toContain('--kb-steps-num:56px');
    expect(out).toContain('--kb-steps-num-bg:#ff0000');
    expect(out).toContain('--kb-steps-line:#00ff00');
  });

  it('formats the marker text', () => {
    expect(html(save, { ...base, numberFormat: 'zero' })).toContain('>01<');
    expect(html(save, { ...base, numberFormat: 'alpha' })).toContain('>B<');
    expect(formatStepNumber(26, 'alpha')).toBe('AA');
    expect(formatStepNumber(0, undefined)).toBe(1);
  });

  it('links the title when the step has a safe URL', () => {
    const out = html(save, {
      ...base,
      steps: [{ title: 'One', description: 'x', url: 'https://example.com/a' }],
    });
    expect(out).toContain(
      '<h3 class="bw-step-title"><a href="https://example.com/a">One</a></h3>',
    );
  });
});
