const markup = (classes = '', shadow = 'true') =>
  `<div class="wp-block-kriti-blocks-sticky-section bw-sticky ${classes}" data-offset="0" data-shadow="${shadow}">x</div>`;

let rectTop;
const load = (html) => {
  jest.resetModules();
  document.body.innerHTML = html;
  document.querySelector('.bw-sticky').getBoundingClientRect = () => ({
    top: rectTop,
    bottom: rectTop + 80,
  });
  require('../view.js');
};
const scroll = (y, top) => {
  rectTop = top;
  window.scrollY = y;
  window.dispatchEvent(new Event('scroll'));
  jest.runAllTimers();
};
const root = () => document.querySelector('.bw-sticky');

beforeEach(() => {
  jest.useFakeTimers();
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  window.scrollY = 0;
  rectTop = 100;
});
afterEach(() => jest.useRealTimers());

test('marks the section as stuck and clears it again', () => {
  load(markup());
  expect(root().classList.contains('is-stuck')).toBe(false);
  scroll(300, 0);
  expect(root().classList.contains('is-stuck')).toBe(true);
  scroll(0, 100);
  expect(root().classList.contains('is-stuck')).toBe(false);
});

test('does nothing when shadow is off and there are no effects (as before)', () => {
  load(markup('', 'false'));
  scroll(300, 0);
  expect(root().classList.contains('is-stuck')).toBe(false);
});

test('works without shadow when a stuck effect is set', () => {
  load(markup('bw-sticky--shrink', 'false'));
  scroll(300, 0);
  expect(root().classList.contains('is-stuck')).toBe(true);
});

test('smart mode hides on scroll down and shows on scroll up', () => {
  load(markup('bw-sticky--smart'));
  scroll(300, 0);
  scroll(400, 0);
  expect(root().classList.contains('is-hidden')).toBe(true);
  scroll(350, 0);
  expect(root().classList.contains('is-hidden')).toBe(false);
});

test('bottom mode is stuck when its bottom reaches the viewport bottom', () => {
  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    configurable: true,
  });
  load(markup('bw-sticky--bottom'));
  scroll(10, 720);
  expect(root().classList.contains('is-stuck')).toBe(true);
  scroll(10, 300);
  expect(root().classList.contains('is-stuck')).toBe(false);
});
