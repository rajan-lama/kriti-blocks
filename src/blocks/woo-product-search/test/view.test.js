/* global HTMLFormElement, KeyboardEvent */
const markup = `
  <div class="bw-woo-product-search" data-kb-live="1"
    data-endpoint="http://x/wp-json/kriti-blocks/v1/product-search"
    data-all="View all results" data-none="No products found." data-found="suggestions available">
    <form action="/" method="get">
      <input type="search" name="s" role="combobox" aria-expanded="false" aria-controls="f-list">
      <select name="product_cat"><option value="">All</option><option value="shoes">Shoes</option></select>
    </form>
    <ul id="f-list" class="bw-woo-product-search__list" role="listbox" hidden></ul>
    <p role="status"></p>
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
const load = () => {
  jest.resetModules();
  document.body.innerHTML = markup;
  HTMLFormElement.prototype.submit = jest.fn();
  require('../view.js');
};
const input = () => document.querySelector('input[type="search"]');
const list = () => document.querySelector('.bw-woo-product-search__list');
const type = (value) => {
  input().value = value;
  input().dispatchEvent(new Event('input', { bubbles: true }));
  jest.advanceTimersByTime(300);
};
const key = (k) =>
  input().dispatchEvent(
    new KeyboardEvent('keydown', { key: k, bubbles: true }),
  );

beforeEach(() => {
  calls = [];
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

const items = [
  {
    title: 'Mango Juice',
    url: 'http://x/p/1',
    price: '$12.00',
    image: 'http://x/a.jpg',
  },
  { title: 'Mango Jam', url: 'http://x/p/2', price: '', image: '' },
];

test('waits, then shows suggestions with a "view all" row', async () => {
  load();
  respond({ items });
  input().value = 'man';
  input().dispatchEvent(new Event('input', { bubbles: true }));
  jest.advanceTimersByTime(100);
  type('mang');
  await flush();

  expect(calls).toHaveLength(1);
  expect(new URL(calls[0]).searchParams.get('q')).toBe('mang');
  expect(list().hidden).toBe(false);
  expect(input().getAttribute('aria-expanded')).toBe('true');
  const rows = list().querySelectorAll('[role="option"]');
  expect(rows).toHaveLength(3);
  expect(rows[0].textContent).toContain('Mango Juice');
  expect(rows[0].textContent).toContain('$12.00');
  expect(rows[2].textContent).toBe('View all results');
});

test('does not search for a single character and sends the category', async () => {
  load();
  respond({ items });
  type('m');
  await flush();
  expect(calls).toHaveLength(0);

  document.querySelector('select').value = 'shoes';
  type('mango');
  await flush();
  expect(new URL(calls[0]).searchParams.get('cat')).toBe('shoes');
});

test('never inserts server text as HTML', async () => {
  load();
  respond({
    items: [
      {
        title: '<img src=x onerror=alert(1)>',
        url: 'javascript:alert(1)',
        price: '<b>$1</b>',
        image: 'javascript:alert(2)',
      },
    ],
  });
  type('evil');
  await flush();

  expect(list().querySelector('img')).toBeNull();
  expect(list().querySelector('b')).toBeNull();
  expect(list().textContent).toContain('<img src=x onerror=alert(1)>');
  expect(list().querySelector('a').getAttribute('href')).toBe('#');
});

test('arrow keys move through options, Escape closes', async () => {
  load();
  respond({ items });
  type('mango');
  await flush();

  key('ArrowDown');
  expect(input().getAttribute('aria-activedescendant')).toMatch(/-0$/);
  key('ArrowDown');
  expect(input().getAttribute('aria-activedescendant')).toMatch(/-1$/);
  key('ArrowUp');
  key('ArrowUp');
  expect(input().getAttribute('aria-activedescendant')).toMatch(/-all$/);
  key('Escape');
  expect(list().hidden).toBe(true);
  expect(input().getAttribute('aria-expanded')).toBe('false');
});

test('says so when nothing matches, and closes on a failed request', async () => {
  load();
  respond({ items: [] });
  type('zzzz');
  await flush();
  expect(list().textContent).toBe('No products found.');

  respond({ code: 'kb_search_rate' }, false);
  type('mango');
  await flush();
  expect(list().hidden).toBe(true);
});
