const item = (name) =>
  `<li class="bw-woo-product-grid__item"><a href="#">${name}</a></li>`;

const markup = ({ pages = 2, more = true, bar = true } = {}) => `
  <div class="bw-woo-product-grid" data-kb-shop="abcd1234" data-post="7"
    data-endpoint="http://x/wp-json/kriti-blocks/v1/products" data-page="1"
    data-pages="${pages}" data-empty="Nothing here" data-more-label="Load more">
    ${
      bar
        ? `<form class="bw-woo-product-grid__bar">
            <input type="search" name="q">
            <select name="orderby"><option value="">Default</option><option value="price">Price</option></select>
            <input type="checkbox" name="stock" value="1">
          </form>`
        : ''
    }
    <p class="bw-woo-product-grid__status"></p>
    <ul class="bw-woo-product-grid__items">${item('One')}${item('Two')}</ul>
    ${more ? '<button type="button" class="bw-woo-product-grid__more">Load more</button>' : ''}
  </div>`;

let calls;
const respond = (data, ok = true) => {
  global.fetch = jest.fn((url) => {
    calls.push(String(url));
    return Promise.resolve({ ok, json: () => Promise.resolve(data) });
  });
};
const flush = async () => {
  for (let i = 0; i < 6; i += 1) {
    await Promise.resolve();
  }
};
const load = (html) => {
  jest.resetModules();
  document.body.innerHTML = html;
  require('../view.js');
};
const root = () => document.querySelector('.bw-woo-product-grid');
const names = () =>
  Array.from(document.querySelectorAll('.bw-woo-product-grid__item')).map(
    (li) => li.textContent.trim(),
  );

beforeEach(() => {
  calls = [];
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

test('load more appends the next page and hides the button on the last page', async () => {
  load(markup());
  respond({ html: item('Three') + item('Four'), count: 2, page: 2, pages: 2 });
  document.querySelector('.bw-woo-product-grid__more').click();
  await flush();

  expect(names()).toEqual(['One', 'Two', 'Three', 'Four']);
  const url = new URL(calls[0]);
  expect(url.searchParams.get('post_id')).toBe('7');
  expect(url.searchParams.get('grid')).toBe('abcd1234');
  expect(url.searchParams.get('page')).toBe('2');
  expect(document.querySelector('.bw-woo-product-grid__more').hidden).toBe(
    true,
  );
  expect(root().getAttribute('aria-busy')).toBeNull();
});

test('changing a filter replaces the items, starts at page 1 and sends the choice', async () => {
  load(markup());
  respond({ html: item('Cheap'), count: 1, page: 1, pages: 1 });
  const select = document.querySelector('select[name="orderby"]');
  select.value = 'price';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  await flush();

  expect(names()).toEqual(['Cheap']);
  const url = new URL(calls[0]);
  expect(url.searchParams.get('page')).toBe('1');
  expect(url.searchParams.get('orderby')).toBe('price');
  expect(url.searchParams.has('q')).toBe(false);
});

test('typing in search waits, then sends one request', async () => {
  load(markup());
  respond({ html: item('Found'), count: 1, page: 1, pages: 1 });
  const input = document.querySelector('input[name="q"]');
  ['a', 'ap', 'app'].forEach((value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  expect(calls).toHaveLength(0);
  jest.advanceTimersByTime(400);
  await flush();

  expect(calls).toHaveLength(1);
  expect(new URL(calls[0]).searchParams.get('q')).toBe('app');
});

test('shows the empty message when nothing matches', async () => {
  load(markup());
  respond({ html: '', count: 0, page: 1, pages: 0 });
  const box = document.querySelector('input[name="stock"]');
  box.checked = true;
  box.dispatchEvent(new Event('change', { bubbles: true }));
  await flush();

  expect(names()).toEqual([]);
  expect(
    document.querySelector('.bw-woo-product-grid__status').textContent,
  ).toBe('Nothing here');
});

test('keeps the items and says so when the request fails', async () => {
  load(markup());
  respond({ code: 'x', message: 'Too many requests.' }, false);
  document.querySelector('.bw-woo-product-grid__more').click();
  await flush();

  expect(names()).toEqual(['One', 'Two']);
  expect(
    document.querySelector('.bw-woo-product-grid__status').textContent,
  ).toBe('Too many requests.');
  expect(document.querySelector('.bw-woo-product-grid__more').disabled).toBe(
    false,
  );
});

test('creates the button when a filter produces more than one page', async () => {
  load(markup({ pages: 1, more: false }));
  expect(document.querySelector('.bw-woo-product-grid__more')).toBeNull();
  respond({ html: item('A') + item('B'), count: 2, page: 1, pages: 3 });
  const select = document.querySelector('select[name="orderby"]');
  select.value = 'price';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  await flush();

  const button = document.querySelector('.bw-woo-product-grid__more');
  expect(button).not.toBeNull();
  expect(button.hidden).toBe(false);
});

test('ignores a grid without the shop attributes', () => {
  load(
    '<div class="bw-woo-product-grid"><ul class="bw-woo-product-grid__items"></ul></div>',
  );
  global.fetch = jest.fn();
  expect(global.fetch).not.toHaveBeenCalled();
});
