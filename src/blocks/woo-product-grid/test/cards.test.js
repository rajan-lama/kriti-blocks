const markup = `
  <div class="bw-woo-product-grid" data-kb-card="1"
    data-card-endpoint="http://x/wp-json/kriti-blocks/v1/product-card"
    data-cart-endpoint="http://x/?wc-ajax=add_to_cart" data-cart-url="http://x/cart"
    data-i18n='{"wishAdd":"Add to wishlist","wishRemove":"Remove from wishlist"}'>
    <ul class="bw-woo-product-grid__items">
      <li class="bw-woo-product-grid__item">
        <div class="bw-woo-product-grid__actions">
          <button type="button" class="bw-woo-product-grid__heart" data-product="11" aria-pressed="false"></button>
          <button type="button" class="bw-woo-product-grid__quick" data-product="11">Quick view</button>
        </div>
      </li>
      <li class="bw-woo-product-grid__item">
        <div class="bw-woo-product-grid__actions">
          <button type="button" class="bw-woo-product-grid__heart" data-product="12" aria-pressed="false"></button>
        </div>
      </li>
    </ul>
  </div>`;

const flush = async () => {
  for (let i = 0; i < 8; i += 1) {
    await Promise.resolve();
  }
};
const load = (saved) => {
  jest.resetModules();
  window.localStorage.clear();
  if (saved) {
    window.localStorage.setItem('kb-wishlist', JSON.stringify(saved));
  }
  document.body.innerHTML = markup;
  window.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.open = false;
  };
  require('../view.js');
};
const hearts = () =>
  Array.from(document.querySelectorAll('.bw-woo-product-grid__heart'));

test('hearts show what is already saved, with matching labels', () => {
  load([12]);
  expect(hearts().map((h) => h.getAttribute('aria-pressed'))).toEqual([
    'false',
    'true',
  ]);
  expect(hearts()[1].getAttribute('aria-label')).toBe('Remove from wishlist');
  expect(hearts()[0].getAttribute('aria-label')).toBe('Add to wishlist');
});

test('clicking a heart saves and unsaves the product', () => {
  load();
  hearts()[0].click();
  expect(JSON.parse(window.localStorage.getItem('kb-wishlist'))).toEqual([11]);
  expect(hearts()[0].getAttribute('aria-pressed')).toBe('true');
  hearts()[0].click();
  expect(JSON.parse(window.localStorage.getItem('kb-wishlist'))).toEqual([]);
  expect(hearts()[0].getAttribute('aria-pressed')).toBe('false');
});

test('hearts added later by Load more are painted too', async () => {
  load([13]);
  const item = document.createElement('li');
  item.innerHTML =
    '<button type="button" class="bw-woo-product-grid__heart" data-product="13" aria-pressed="false"></button>';
  document.querySelector('.bw-woo-product-grid__items').appendChild(item);
  await flush();
  expect(item.querySelector('button').getAttribute('aria-pressed')).toBe(
    'true',
  );
});

test('quick view opens a dialog for the clicked product', async () => {
  load();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 11,
          title: 'Mug',
          url: 'http://x/p',
          price: '$1',
          in_stock: true,
          mode: 'view',
          images: [],
        }),
    }),
  );
  document.querySelector('.bw-woo-product-grid__quick').click();
  await flush();
  expect(new URL(global.fetch.mock.calls[0][0]).searchParams.get('id')).toBe(
    '11',
  );
  expect(document.querySelector('.bw-qv__title').textContent).toBe('Mug');
  // This grid has hearts, so the dialog offers the wishlist too.
  expect(document.querySelector('.bw-qv__heart')).not.toBeNull();
});
