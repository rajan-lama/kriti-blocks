const markup = (data = '') => `
<div class="wp-block-kriti-blocks-back-to-top bw-btt" data-show-after="100" data-smooth="true" ${data}>
  <button type="button" class="bw-btt__button" aria-label="Back to top">
    <svg><path d="M0 0"/></svg>
    <svg class="bw-btt__ring"><circle class="bw-btt__ring-track"/><circle class="bw-btt__ring-bar"/></svg>
  </button>
</div>`;

const load = (html) => {
  jest.resetModules();
  document.body.innerHTML = html;
  window.matchMedia = () => ({ matches: false });
  window.scrollTo = jest.fn();
  require('../view.js');
};
const scrollTo = (y) => {
  window.scrollY = y;
  window.dispatchEvent(new Event('scroll'));
};

beforeEach(() => {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 2000,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: 1000,
    configurable: true,
  });
  window.scrollY = 0;
});

test('shows after the threshold', () => {
  load(markup());
  const root = document.querySelector('.bw-btt');
  expect(root.classList.contains('bw-btt--visible')).toBe(false);
  scrollTo(200);
  expect(root.classList.contains('bw-btt--visible')).toBe(true);
});

test('default click uses the browser smooth scroll', () => {
  load(markup());
  document.querySelector('.bw-btt__button').click();
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
});

test('a duration animates the scroll back to the top', () => {
  jest.useFakeTimers();
  let now = 0;
  window.performance.now = () => now;
  window.requestAnimationFrame = (cb) =>
    setTimeout(() => {
      now += 100;
      cb(now);
    }, 0);
  load(markup('data-duration="300"'));
  scrollTo(800);
  document.querySelector('.bw-btt__button').click();
  jest.runAllTimers();
  const calls = window.scrollTo.mock.calls;
  expect(calls.length).toBeGreaterThan(1);
  expect(calls[calls.length - 1]).toEqual([0, 0]);
  jest.useRealTimers();
});

test('the progress ring follows the scroll position', () => {
  load(markup('data-progress="true"'));
  const bar = document.querySelector('.bw-btt__ring-bar');
  scrollTo(500);
  expect(parseFloat(bar.style.strokeDashoffset)).toBeCloseTo(138.23 * 0.5, 1);
  scrollTo(1000);
  expect(parseFloat(bar.style.strokeDashoffset)).toBeCloseTo(0, 1);
});
