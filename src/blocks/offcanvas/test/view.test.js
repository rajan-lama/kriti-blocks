/* global KeyboardEvent, HTMLElement */
const markup = (data = '') => `
<a class="menu-toggle" href="#">Menu</a>
<div class="wp-block-kriti-blocks-offcanvas bw-offcanvas" data-close-on-backdrop="true" ${data}>
  <button type="button" class="bw-offcanvas__trigger" aria-expanded="false">Open</button>
  <div class="bw-offcanvas__overlay" hidden>
    <aside class="bw-offcanvas__panel" role="dialog" aria-modal="true" aria-label="Open" tabindex="-1">
      <button type="button" class="bw-offcanvas__close">x</button>
      <div class="bw-offcanvas__content"><h2>Menu</h2><a class="inner" href="#about">About</a></div>
    </aside>
  </div>
</div>`;

const load = (html) => {
  jest.resetModules();
  document.body.innerHTML = html;
  document.documentElement.className = '';
  require('../view.js');
};
const overlay = () => document.querySelector('.bw-offcanvas__overlay');
const trigger = () => document.querySelector('.bw-offcanvas__trigger');
const key = (k, opts = {}) =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: k,
      bubbles: true,
      cancelable: true,
      ...opts,
    }),
  );

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    get() {
      return this.parentNode;
    },
  });
});

test('opens with scroll lock, aria state and focus inside', () => {
  load(markup());
  trigger().focus();
  trigger().click();
  const panel = document.querySelector('.bw-offcanvas__panel');
  expect(overlay().hidden).toBe(false);
  expect(document.documentElement.classList.contains('bw-offcanvas-lock')).toBe(
    true,
  );
  expect(trigger().getAttribute('aria-expanded')).toBe('true');
  expect(panel.contains(document.activeElement)).toBe(true);
  expect(panel.getAttribute('aria-labelledby')).toBe(
    panel.querySelector('h2').id,
  );
  expect(
    document
      .querySelector('.wp-block-kriti-blocks-offcanvas')
      .classList.contains('bw-offcanvas--open'),
  ).toBe(true);
});

test('Escape closes, unlocks and restores focus', () => {
  load(markup());
  trigger().focus();
  trigger().click();
  key('Escape');
  expect(overlay().hidden).toBe(true);
  expect(document.documentElement.classList.contains('bw-offcanvas-lock')).toBe(
    false,
  );
  expect(document.activeElement).toBe(trigger());
});

test('Tab is trapped inside the drawer', () => {
  load(markup());
  trigger().click();
  const items = document.querySelectorAll(
    '.bw-offcanvas__panel button, .bw-offcanvas__panel a',
  );
  items[items.length - 1].focus();
  key('Tab');
  expect(document.activeElement).toBe(items[0]);
});

test('a link inside closes the drawer only when opted in', () => {
  load(markup());
  trigger().click();
  document.querySelector('.inner').click();
  expect(overlay().hidden).toBe(false);

  load(markup('data-close-on-link="true"'));
  trigger().click();
  document.querySelector('.inner').click();
  expect(overlay().hidden).toBe(true);
});

test('a CSS selector opens the drawer', () => {
  load(markup('data-trigger-selector=".menu-toggle"'));
  document.querySelector('.menu-toggle').click();
  expect(overlay().hidden).toBe(false);
});
