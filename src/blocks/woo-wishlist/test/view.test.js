const markup = `
  <div class="bw-woo-wishlist" data-kb-wishlist="1"
    data-endpoint="http://x/wp-json/kriti-blocks/v1/product-list"
    data-cart-endpoint="http://x/?wc-ajax=add_to_cart" data-cart-url="http://x/cart"
    data-i18n='{"empty":"Nothing saved","addToCart":"Add to cart","added":"Added to cart.","remove":"Remove","outOfStock":"Out of stock","choose":"Choose options","cartError":"Cart error","error":"Load error"}'>
    <p class="bw-woo-wishlist__empty" hidden>Nothing saved</p>
    <ul class="bw-woo-wishlist__items"></ul>
    <p class="bw-woo-wishlist__status" role="status"></p>
  </div>`;

const products = {
  1: {
    id: 1,
    title: 'Mug',
    url: 'http://x/p/1',
    price: '$10',
    image: 'http://x/1.jpg',
    in_stock: true,
    mode: 'ajax',
  },
  2: {
    id: 2,
    title: 'Shirt',
    url: 'http://x/p/2',
    price: '$20',
    image: '',
    in_stock: true,
    mode: 'variation',
  },
  3: {
    id: 3,
    title: 'Sold <b>out</b>',
    url: 'javascript:alert(1)',
    price: '',
    image: 'javascript:alert(2)',
    in_stock: false,
    mode: 'view',
  },
};
const flush = async () => {
  for (let i = 0; i < 8; i += 1) {
    await Promise.resolve();
  }
};
let calls;
const answer = () => {
  global.fetch = jest.fn((url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('add_to_cart')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ fragments: {}, cart_hash: 'h' }),
      });
    }
    const ids = new URL(String(url)).searchParams
      .get('ids')
      .split(',')
      .map(Number);
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          items: ids.filter((id) => products[id]).map((id) => products[id]),
        }),
    });
  });
};
const load = (saved) => {
  jest.resetModules();
  calls = [];
  window.localStorage.clear();
  if (saved) {
    window.localStorage.setItem('kb-wishlist', JSON.stringify(saved));
  }
  document.body.innerHTML = markup;
  answer();
  require('../view.js');
};
const names = () =>
  Array.from(document.querySelectorAll('.bw-woo-wishlist__name')).map(
    (n) => n.textContent,
  );
const empty = () => document.querySelector('.bw-woo-wishlist__empty');

test('shows the empty message and does not call the site when nothing is saved', () => {
  load();
  expect(empty().hidden).toBe(false);
  expect(calls).toHaveLength(0);
});

test('lists saved products in the order they were saved, as text', async () => {
  load([3, 1, 2]);
  await flush();
  expect(new URL(calls[0].url).searchParams.get('ids')).toBe('3,1,2');
  expect(names()).toEqual(['Sold <b>out</b>', 'Mug', 'Shirt']);
  expect(document.querySelector('.bw-woo-wishlist__name b')).toBeNull();
  expect(empty().hidden).toBe(true);
  const sold = document.querySelector('.bw-woo-wishlist__item');
  expect(sold.querySelector('img')).toBeNull();
  expect(sold.querySelector('a').getAttribute('href')).toBe('#');
  expect(sold.querySelector('.bw-woo-wishlist__out').textContent).toBe(
    'Out of stock',
  );
});

test('offers add to cart for simple products and a link for others', async () => {
  load([1, 2]);
  await flush();
  const items = document.querySelectorAll('.bw-woo-wishlist__item');
  expect(items[0].querySelector('.bw-woo-wishlist__add')).not.toBeNull();
  expect(items[1].querySelector('.bw-woo-wishlist__add')).toBeNull();
  expect(
    items[1].querySelector('.bw-woo-wishlist__choose').getAttribute('href'),
  ).toBe('http://x/p/2');

  items[0].querySelector('.bw-woo-wishlist__add').click();
  await flush();
  const post = calls.find((c) => c.url.includes('add_to_cart'));
  expect(String(post.init.body)).toContain('product_id=1');
  expect(document.querySelector('.bw-woo-wishlist__status').textContent).toBe(
    'Added to cart.',
  );
});

test('removing a product updates the list and shows the message when it is the last', async () => {
  load([1, 2]);
  await flush();
  document.querySelectorAll('.bw-woo-wishlist__remove')[0].click();
  expect(names()).toEqual(['Shirt']);
  expect(JSON.parse(window.localStorage.getItem('kb-wishlist'))).toEqual([2]);
  document.querySelector('.bw-woo-wishlist__remove').click();
  expect(names()).toEqual([]);
  expect(empty().hidden).toBe(false);
});

test('a product saved elsewhere on the page appears without a reload', async () => {
  load([1]);
  await flush();
  const { toggleWishlist } = require('../../../shared/kbwishlist');
  toggleWishlist(2);
  await flush();
  expect(names()).toEqual(['Shirt', 'Mug']);
});

test('says so when the list cannot be loaded', async () => {
  load([1]);
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: '' }),
    }),
  );
  jest.resetModules();
  document.body.innerHTML = markup;
  require('../view.js');
  await flush();
  expect(document.querySelector('.bw-woo-wishlist__status').textContent).toBe(
    'Load error',
  );
});
