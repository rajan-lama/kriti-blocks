/* global KeyboardEvent, HTMLElement, MouseEvent */
/**
 * Front-end behavior of the modal, run against real saved-style markup.
 */
const markup = (data = '', inner = '<h2>Title</h2><a href="#x">link</a>') => `
<a class="open-me" href="#">External trigger</a>
<div class="wp-block-kriti-blocks-modal bw-modal" id="m1" data-close-on-backdrop="true" ${data}>
  <button type="button" class="bw-modal__trigger" aria-expanded="false">Open</button>
  <div class="bw-modal__overlay" hidden>
    <div class="bw-modal__panel" role="dialog" aria-modal="true" aria-label="Open" tabindex="-1">
      <button type="button" class="bw-modal__close">x</button>
      <div class="bw-modal__content">${inner}</div>
    </div>
  </div>
</div>`;

const load = (html) => {
  jest.resetModules();
  document.body.innerHTML = html;
  document.documentElement.className = '';
  require('../view.js');
};
const overlay = () => document.querySelector('.bw-modal__overlay');
const trigger = () => document.querySelector('.bw-modal__trigger');
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
  // jsdom has no layout; treat attached elements as visible.
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    get() {
      return this.parentNode;
    },
  });
});

beforeEach(() => {
  jest.useFakeTimers();
  window.localStorage.clear();
});
afterEach(() => jest.useRealTimers());

test('opens, locks scroll, focuses inside, and names the dialog by its heading', () => {
  load(markup());
  trigger().focus();
  trigger().click();
  expect(overlay().hidden).toBe(false);
  expect(document.documentElement.classList.contains('bw-modal-lock')).toBe(
    true,
  );
  expect(
    document.querySelector('.bw-modal__panel').contains(document.activeElement),
  ).toBe(true);
  const panel = document.querySelector('.bw-modal__panel');
  expect(panel.getAttribute('aria-labelledby')).toBe(
    panel.querySelector('h2').id,
  );
});

test('Escape closes, unlocks scroll and restores focus to the trigger', () => {
  load(markup());
  trigger().focus();
  trigger().click();
  key('Escape');
  expect(overlay().hidden).toBe(true);
  expect(document.documentElement.classList.contains('bw-modal-lock')).toBe(
    false,
  );
  expect(document.activeElement).toBe(trigger());
});

test('Tab wraps inside the dialog', () => {
  load(markup());
  trigger().click();
  const items = document.querySelectorAll(
    '.bw-modal__panel button, .bw-modal__panel a',
  );
  items[items.length - 1].focus();
  key('Tab');
  expect(document.activeElement).toBe(items[0]);
  key('Tab', { shiftKey: true });
  expect(document.activeElement).toBe(items[items.length - 1]);
});

test('backdrop click closes', () => {
  load(markup());
  trigger().click();
  overlay().click();
  expect(overlay().hidden).toBe(true);
});

test('a CSS selector trigger opens the modal and gets focus back', () => {
  load(markup('data-trigger-selector=".open-me"'));
  const ext = document.querySelector('.open-me');
  ext.focus();
  ext.click();
  expect(overlay().hidden).toBe(false);
  key('Escape');
  expect(document.activeElement).toBe(ext);
});

test('an invalid selector is ignored without breaking the block', () => {
  load(markup('data-trigger-selector="..bad(("'));
  trigger().click();
  expect(overlay().hidden).toBe(false);
});

test('auto open waits for its delay and is opt-in', () => {
  load(markup());
  jest.advanceTimersByTime(10000);
  expect(overlay().hidden).toBe(true);

  load(markup('data-auto-open="3"'));
  jest.advanceTimersByTime(2900);
  expect(overlay().hidden).toBe(true);
  jest.advanceTimersByTime(200);
  expect(overlay().hidden).toBe(false);
});

test('show once: a second visit does not auto open', () => {
  load(markup('data-auto-open="0" data-once-days="7"'));
  jest.advanceTimersByTime(10);
  expect(overlay().hidden).toBe(false);

  load(markup('data-auto-open="0" data-once-days="7"'));
  jest.advanceTimersByTime(10);
  expect(overlay().hidden).toBe(true);
  // The trigger button still works.
  trigger().click();
  expect(overlay().hidden).toBe(false);
});

test('exit intent opens when the pointer leaves through the top', () => {
  load(markup('data-exit-intent="true"'));
  document.dispatchEvent(new MouseEvent('mouseout', { clientY: 200 }));
  expect(overlay().hidden).toBe(true);
  document.dispatchEvent(new MouseEvent('mouseout', { clientY: -1 }));
  expect(overlay().hidden).toBe(false);
});

test('scroll open fires once the threshold is passed', () => {
  load(markup('data-scroll-open="50"'));
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 2000,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: 1000,
    configurable: true,
  });
  window.scrollY = 300;
  window.dispatchEvent(new Event('scroll'));
  expect(overlay().hidden).toBe(true);
  window.scrollY = 600;
  window.dispatchEvent(new Event('scroll'));
  expect(overlay().hidden).toBe(false);
});
