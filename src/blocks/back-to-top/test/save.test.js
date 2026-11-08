/**
 * @jest-environment node
 *
 * Existing buttons must keep their saved markup: with the new options unset,
 * save() must match the original save() (kept in ./legacy/save.js).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: {
    save: (p = {}) => ({
      ...p,
      className: ['wp-block-kriti-blocks-back-to-top', p.className]
        .filter(Boolean)
        .join(' '),
    }),
  },
}));

import save from '../save';
import legacySave from './legacy/save';

const base = {
  position: 'bottom-right',
  offset: 24,
  showAfter: 300,
  buttonSize: 48,
  iconSize: 20,
  shape: 'circle',
  backgroundColor: '#4f46e5',
  iconColor: '#ffffff',
  ariaLabel: 'Back to top',
  smooth: true,
  htmlId: '',
  extraClass: '',
};
const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

describe('defaults keep the original markup', () => {
  test.each([
    ['defaults', {}],
    [
      'left, square, not smooth',
      { position: 'bottom-left', shape: 'square', smooth: false },
    ],
    [
      'rounded with id and class',
      { shape: 'rounded', htmlId: 'top', extraClass: 'mine' },
    ],
    [
      'explicit empty new options',
      { label: '', showProgress: false, iconType: '', borderWidth: 0 },
    ],
  ])('%s', (name, extra) => {
    const attrs = { ...base, ...extra };
    expect(html(save, attrs)).toBe(html(legacySave, attrs));
  });
});

describe('new options reach the markup', () => {
  test('hover, border and shadow', () => {
    const out = html(save, {
      ...base,
      hoverBackground: '#111111',
      hoverIconColor: '#ffeecc',
      borderWidth: 2,
      borderColor: '#ff0000',
      shadowStyle: 'none',
    });
    expect(out).toContain('--bw-btt-hover-bg:#111111');
    expect(out).toContain('--bw-btt-hover-color:#ffeecc');
    expect(out).toContain('--bw-btt-border-w:2px');
    expect(out).toContain('--bw-btt-border-c:#ff0000');
    expect(out).toContain('bw-btt--shadow-none');
  });

  test('label, icon and a pill radius for a labelled circle', () => {
    const out = html(save, { ...base, label: 'Top', iconType: 'chevron' });
    expect(out).toContain('<span class="bw-btt__label">Top</span>');
    expect(out).toContain('bw-btt--has-label');
    expect(out).toContain('--bw-btt-radius:999px');
    expect(out).toContain('M7.4 15.4');
    expect(out).not.toContain('M12 4 4 12h5v8h6v-8h5z');
  });

  test('progress ring and duration', () => {
    const out = html(save, {
      ...base,
      showProgress: true,
      progressColor: '#00ff00',
      scrollDuration: 800,
    });
    expect(out).toContain('bw-btt__ring-bar');
    expect(out).toContain('data-progress="true"');
    expect(out).toContain('data-duration="800"');
    expect(out).toContain('--bw-btt-ring:#00ff00');
  });

  test('unsafe values never reach the markup', () => {
    const out = html(save, {
      ...base,
      hoverBackground: 'red;background:url(//evil)',
      iconType: '"><script>',
      shadowStyle: 'x" onclick="y',
      label: '<b>x</b>',
    });
    expect(out).not.toContain('evil');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('onclick');
    expect(out).toContain('&lt;b&gt;');
  });
});
