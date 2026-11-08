/**
 * @jest-environment node
 *
 * New alert options must add nothing to the saved HTML at their defaults.
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
  content: 'Message',
  alertType: 'info',
  showIcon: true,
  htmlId: '',
  extraClass: '',
};

describe('alert save', () => {
  it.each([
    ['defaults', base],
    [
      'warning without icon',
      { ...base, alertType: 'warning', showIcon: false },
    ],
    [
      'error with class and id',
      { ...base, alertType: 'error', extraClass: 'x', htmlId: 'y' },
    ],
    ['empty', { ...base, content: '' }],
  ])('is identical to the legacy markup: %s', (name, attributes) => {
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('ignores the default values of the new options', () => {
    const attributes = {
      ...base,
      alertTitle: '',
      dismissible: false,
      customIcon: '',
      rememberDismiss: true,
    };
    expect(html(saveNew, attributes)).toBe(html(saveOld, attributes));
  });

  it('writes new options to the markup', () => {
    const out = html(saveNew, {
      ...base,
      alertTitle: 'Heads up',
      customIcon: 'bell',
      iconSize: 28,
      accentColor: '#123456',
      dismissible: true,
      rememberDismiss: true,
      dismissKey: 'Promo Banner!',
      dismissDays: 7,
    });
    expect(out).toContain('bw-alert--dismissible');
    expect(out).toContain('--kb-alert-accent:#123456');
    expect(out).toContain('--kb-alert-icon:28px');
    expect(out).toContain('data-bw-remember="promobanner"');
    expect(out).toContain('data-bw-days="7"');
    expect(out).toContain(
      '<div class="bw-alert-body"><div class="bw-alert-title">Heads up</div>',
    );
    expect(out).toContain('class="bw-alert-dismiss"');
    expect(out).toContain('M12 22c1.1');
  });

  it('does not store a cookie key without a safe name', () => {
    const out = html(saveNew, {
      ...base,
      dismissible: true,
      rememberDismiss: true,
      dismissKey: '!!!',
    });
    expect(out).not.toContain('data-bw-remember');
  });

  it('drops unsafe values', () => {
    const out = html(saveNew, {
      ...base,
      customIcon: '__proto__',
      accentColor: 'red;background:url(x)',
    });
    expect(out).toBe(html(saveOld, base));
  });
});
