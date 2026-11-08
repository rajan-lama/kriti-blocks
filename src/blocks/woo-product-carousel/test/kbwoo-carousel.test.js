/**
 * @jest-environment jsdom
 *
 * Front end carousel: per-device columns, loop and pause on hover.
 */
import { getColumns, initKbWooCarousel } from '../../../shared/kbwoo-carousel';

const OPTIONS = {
  slideSelector: '.s',
  viewportSelector: '.vp',
  prevSelector: '.prev',
  nextSelector: '.next',
  dotsSelector: '.dots',
  dotSelector: '.dot',
  dotClass: 'dot',
  columnsProperty: '--cols',
  jsClass: 'is-js',
};

function build(count, dataset = {}, cols = '2') {
  document.body.innerHTML = `
    <div class="root" style="--cols:${cols}">
      <div class="vp"><ul>${Array.from({ length: count })
        .map(() => '<li class="s"></li>')
        .join('')}</ul></div>
      <button class="prev"></button><button class="next"></button>
      <ul class="dots"></ul>
    </div>`;
  const root = document.querySelector('.root');
  Object.assign(root.dataset, dataset);
  root.dataset.columns = '3';
  const viewport = root.querySelector('.vp');
  viewport.scrollTo = jest.fn();
  return { root, viewport };
}

describe('getColumns', () => {
  it('reads the CSS custom property, then data-columns, then 1', () => {
    const { root } = build(4, {}, '2');
    expect(getColumns(root, '--cols')).toBe(2);
    expect(getColumns(root, '--missing')).toBe(3);
    delete root.dataset.columns;
    expect(getColumns(root, '--missing')).toBe(1);
  });
});

describe('initKbWooCarousel', () => {
  it('builds one dot per page from the current columns', () => {
    const { root } = build(5, {}, '2');
    initKbWooCarousel(root, OPTIONS);

    expect(root.classList.contains('is-js')).toBe(true);
    expect(root.querySelectorAll('.dots .dot')).toHaveLength(3);
    expect(root.querySelector('.dots .dot').getAttribute('aria-label')).toMatch(
      /page 1/i,
    );
    expect(root.querySelector('.prev').disabled).toBe(true);
  });

  it('hides controls when everything fits on one page', () => {
    const { root } = build(2, {}, '2');
    initKbWooCarousel(root, OPTIONS);

    expect(root.querySelector('.dots').hidden).toBe(true);
    expect(root.querySelector('.next').hidden).toBe(true);
  });

  it('wraps around when loop is on', () => {
    const { root } = build(4, { loop: 'true' }, '2');
    initKbWooCarousel(root, OPTIONS);
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');

    expect(prev.disabled).toBe(false);
    next.click();
    next.click();
    expect(
      root.querySelectorAll('.dot')[0].classList.contains('is-active'),
    ).toBe(true);
    prev.click();
    expect(
      root.querySelectorAll('.dot')[1].classList.contains('is-active'),
    ).toBe(true);
  });

  it('does not wrap without loop', () => {
    const { root } = build(4, {}, '2');
    initKbWooCarousel(root, OPTIONS);
    const next = root.querySelector('.next');

    next.click();
    expect(next.disabled).toBe(true);
  });

  it('pauses autoplay on hover unless disabled', () => {
    jest.useFakeTimers();
    const first = build(4, { autoplay: 'true', interval: '1000' }, '2');
    initKbWooCarousel(first.root, OPTIONS);
    first.root.dispatchEvent(new Event('mouseenter'));
    jest.advanceTimersByTime(3000);
    expect(first.viewport.scrollTo).not.toHaveBeenCalled();

    const second = build(
      4,
      { autoplay: 'true', interval: '1000', pauseHover: 'false' },
      '2',
    );
    initKbWooCarousel(second.root, OPTIONS);
    second.root.dispatchEvent(new Event('mouseenter'));
    jest.advanceTimersByTime(1100);
    expect(second.viewport.scrollTo).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
