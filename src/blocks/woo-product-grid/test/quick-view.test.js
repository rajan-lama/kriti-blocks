/* global MouseEvent */
import { clampQuantity, findVariation, openQuickView } from '../quick-view';

const flush = async () => {
  for (let i = 0; i < 8; i += 1) {
    await Promise.resolve();
  }
};

beforeAll(() => {
  // jsdom has no <dialog> behavior.
  window.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.open = false;
  };
});

let calls;
const respond = (data, ok = true) => {
  global.fetch = jest.fn((url, init) => {
    calls.push({ url: String(url), init });
    return Promise.resolve({ ok, json: () => Promise.resolve(data) });
  });
};
beforeEach(() => {
  calls = [];
  document.body.innerHTML = '<button id="opener">Quick view</button>';
  window.localStorage.clear();
});

const simple = {
  id: 5,
  title: 'Mug <b>big</b>',
  url: 'http://x/p/mug',
  price: '$10.00',
  summary: 'A <i>nice</i> mug',
  images: ['http://x/1.jpg', 'http://x/2.jpg', 'javascript:alert(1)'],
  in_stock: true,
  mode: 'ajax',
};
const variable = {
  id: 9,
  title: 'Shirt',
  url: 'http://x/p/shirt',
  price: '$20 - $25',
  summary: '',
  images: [],
  in_stock: true,
  mode: 'variation',
  attributes: [
    {
      key: 'attribute_size',
      label: 'Size',
      options: [
        { value: 's', label: 'Small' },
        { value: 'l', label: 'Large' },
      ],
    },
    {
      key: 'attribute_color',
      label: 'Color',
      options: [{ value: 'red', label: 'Red' }],
    },
  ],
  variations: [
    {
      id: 91,
      attributes: { attribute_size: 's', attribute_color: '' },
      price: '$20',
      in_stock: true,
      image: '',
    },
    {
      id: 92,
      attributes: { attribute_size: 'l', attribute_color: 'red' },
      price: '$25',
      in_stock: false,
      image: 'http://x/l.jpg',
    },
  ],
};
const open = (extra = {}) =>
  openQuickView({
    endpoint: 'http://x/wp-json/kriti-blocks/v1/product-card',
    cartEndpoint: 'http://x/?wc-ajax=add_to_cart',
    cartUrl: 'http://x/cart',
    id: 5,
    opener: document.getElementById('opener'),
    text: {},
    ...extra,
  });
const q = (sel) => document.querySelector(sel);

describe('findVariation', () => {
  it('matches chosen options and treats an empty attribute as "any"', () => {
    expect(
      findVariation(variable.variations, {
        attribute_size: 's',
        attribute_color: 'red',
      }).id,
    ).toBe(91);
    expect(
      findVariation(variable.variations, {
        attribute_size: 'l',
        attribute_color: 'red',
      }).id,
    ).toBe(92);
    expect(
      findVariation(variable.variations, {
        attribute_size: 'l',
        attribute_color: 'blue',
      }),
    ).toBeNull();
  });
});

describe('quick view dialog', () => {
  it('shows a product as text, never as HTML, and ignores non-web pictures', async () => {
    respond(simple);
    open();
    await flush();
    expect(q('.bw-qv__title').textContent).toBe('Mug <b>big</b>');
    expect(q('.bw-qv__title b')).toBeNull();
    expect(q('.bw-qv__summary i')).toBeNull();
    expect(document.querySelectorAll('.bw-qv__thumb')).toHaveLength(2);
    expect(q('.bw-qv__image').getAttribute('src')).toBe('http://x/1.jpg');
    expect(q('.bw-qv').getAttribute('aria-labelledby')).toBe(
      q('.bw-qv__title').id,
    );
    expect(new URL(calls[0].url).searchParams.get('id')).toBe('5');
  });

  it('adds a simple product through the cart endpoint and links to the cart', async () => {
    respond(simple);
    open();
    await flush();
    respond({ fragments: {}, cart_hash: 'x' });
    q('.bw-qv__field--qty input').value = '3';
    q('.bw-qv__add').click();
    await flush();
    const post = calls[calls.length - 1];
    expect(post.url).toBe('http://x/?wc-ajax=add_to_cart');
    expect(String(post.init.body)).toContain('product_id=5');
    expect(String(post.init.body)).toContain('quantity=3');
    expect(q('.bw-qv__status').textContent).toContain('Added to cart.');
    expect(q('.bw-qv__cart').getAttribute('href')).toBe('http://x/cart');
  });

  it('says so when adding fails', async () => {
    respond(simple);
    open();
    await flush();
    respond({ error: true, product_url: 'http://x/p/mug' });
    q('.bw-qv__add').click();
    await flush();
    expect(q('.bw-qv__status').textContent).toContain('Could not add');
    expect(q('.bw-qv__add').disabled).toBe(false);
  });

  it('needs every option, updates the price, and blocks unavailable or sold-out choices', async () => {
    respond(variable);
    open({ id: 9 });
    await flush();
    const [size, color] = Array.from(
      document.querySelectorAll('.bw-qv select'),
    );
    expect(q('.bw-qv__add').disabled).toBe(true);

    size.value = 's';
    size.dispatchEvent(new Event('change'));
    expect(q('.bw-qv__add').disabled).toBe(true);
    color.value = 'red';
    color.dispatchEvent(new Event('change'));
    expect(q('.bw-qv__price').textContent).toBe('$20');
    expect(q('.bw-qv__add').disabled).toBe(false);

    size.value = 'l';
    size.dispatchEvent(new Event('change'));
    expect(q('.bw-qv__price').textContent).toBe('$25');
    expect(q('.bw-qv__status').textContent).toBe('Out of stock');
    expect(q('.bw-qv__add').disabled).toBe(true);
    expect(q('.bw-qv__image').getAttribute('src')).toBe('http://x/l.jpg');
  });

  it('shows a message for a product that cannot be bought here', async () => {
    respond({ ...simple, mode: 'view', in_stock: false });
    open();
    await flush();
    expect(q('.bw-qv__add')).toBeNull();
    expect(q('.bw-qv__out').textContent).toBe('Out of stock');
    expect(q('.bw-qv__view').getAttribute('href')).toBe('http://x/p/mug');
  });

  it('closes on the button, on the backdrop and on Escape, and returns focus', async () => {
    respond(simple);
    open();
    await flush();
    q('.bw-qv__close').click();
    expect(q('.bw-qv')).toBeNull();
    expect(document.activeElement).toBe(document.getElementById('opener'));

    respond(simple);
    open();
    await flush();
    q('.bw-qv').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(q('.bw-qv')).toBeNull();

    respond(simple);
    open();
    await flush();
    q('.bw-qv').dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(q('.bw-qv')).toBeNull();
  });

  it('shows an error when the product cannot be loaded', async () => {
    respond({ code: 'kb_card_missing', message: 'Product not found.' }, false);
    open();
    await flush();
    expect(q('.bw-qv__error').textContent).toBe('Product not found.');
  });

  it('wishlist button in the dialog toggles the saved product', async () => {
    respond(simple);
    open({ wishlist: true });
    await flush();
    const heart = q('.bw-qv__heart');
    expect(heart.getAttribute('aria-pressed')).toBe('false');
    heart.click();
    expect(heart.getAttribute('aria-pressed')).toBe('true');
    expect(JSON.parse(window.localStorage.getItem('kb-wishlist'))).toEqual([5]);
  });
});

describe('quantity limits and grouped products', () => {
  let assign;
  beforeEach(() => {
    assign = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign },
      writable: true,
      configurable: true,
    });
  });

  it('clampQuantity keeps a number in range and copes with junk', () => {
    expect(clampQuantity('7', 1, 5)).toBe(5);
    expect(clampQuantity('0', 1, 5)).toBe(1);
    expect(clampQuantity('abc', 1, 5)).toBe(1);
    expect(clampQuantity('', 0, 5)).toBe(0);
    expect(clampQuantity('3', 0, 5)).toBe(3);
  });

  it('a stock limit sets the box, says so, and the amount sent never goes above it', async () => {
    respond({ ...simple, max: 3 });
    open();
    await flush();
    const box = q('.bw-qv__field--qty input');
    expect(box.max).toBe('3');
    expect(q('.bw-qv__limit').textContent).toBe('Up to 3 per order');

    box.value = '10';
    box.dispatchEvent(new Event('change'));
    expect(box.value).toBe('3');

    box.value = '50'; // typed after the box was set, without a change event
    respond({ fragments: {}, cart_hash: 'x' });
    q('.bw-qv__add').click();
    await flush();
    const post = calls[calls.length - 1];
    expect(String(post.init.body)).toContain('quantity=3');
  });

  it('no limit means the usual cap of 99 and no note', async () => {
    respond({ ...simple, max: null });
    open();
    await flush();
    expect(q('.bw-qv__field--qty input').max).toBe('99');
    expect(q('.bw-qv__limit').textContent).toBe('');
  });

  it('a variation brings its own limit, and the limit goes away when it has none', async () => {
    const limited = {
      ...variable,
      attributes: [variable.attributes[0]],
      variations: [
        {
          id: 91,
          attributes: { attribute_size: 's' },
          price: '$20',
          in_stock: true,
          image: '',
          max: 5,
        },
        {
          id: 92,
          attributes: { attribute_size: 'l' },
          price: '$25',
          in_stock: true,
          image: '',
          max: null,
        },
      ],
    };
    respond(limited);
    open({ id: 9 });
    await flush();
    const size = q('.bw-qv select');
    const box = q('.bw-qv__field--qty input');
    size.value = 's';
    size.dispatchEvent(new Event('change'));
    expect(box.max).toBe('5');
    expect(q('.bw-qv__limit').textContent).toBe('Up to 5 per order');
    box.value = '5';
    size.value = 'l';
    size.dispatchEvent(new Event('change'));
    expect(box.max).toBe('99');
    expect(q('.bw-qv__limit').textContent).toBe('');
    size.value = 's';
    box.value = '9';
    size.dispatchEvent(new Event('change'));
    expect(box.value).toBe('5'); // an amount above the new limit is brought down
  });

  const grouped = {
    id: 20,
    title: 'Bundle',
    url: 'http://x/p/bundle',
    price: '$5 - $7',
    summary: '',
    images: [],
    in_stock: true,
    mode: 'grouped',
    children: [
      {
        id: 21,
        title: 'Part A',
        price: '$5',
        in_stock: true,
        buyable: true,
        max: 4,
      },
      {
        id: 22,
        title: 'Part B',
        price: '$6',
        in_stock: false,
        buyable: false,
        max: null,
      },
      {
        id: 23,
        title: 'Part <i>C</i>',
        price: '$7',
        in_stock: true,
        buyable: true,
        max: null,
      },
    ],
  };

  it('lists the items of a grouped product, each with its own quantity, as text', async () => {
    respond(grouped);
    open({ id: 20 });
    await flush();
    const rows = document.querySelectorAll('.bw-qv__group-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('Part A');
    expect(rows[1].querySelector('input')).toBeNull();
    expect(rows[1].textContent).toContain('Out of stock');
    expect(rows[2].textContent).toContain('Part <i>C</i>');
    expect(rows[2].querySelector('i')).toBeNull();
    const inputs = document.querySelectorAll('.bw-qv__group-qty');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].max).toBe('4');
    expect(inputs[1].max).toBe('99');
    expect(inputs[0].getAttribute('aria-label')).toBe('Part A: Quantity');
    expect(q('.bw-qv__field--qty')).toBeNull();
  });

  it('Add to cart waits for a quantity, then sends the whole group in one address', async () => {
    respond(grouped);
    open({ id: 20 });
    await flush();
    const add = q('.bw-qv__add');
    const [a, c] = document.querySelectorAll('.bw-qv__group-qty');
    expect(add.disabled).toBe(true);

    a.value = '9'; // above that item's limit of 4
    a.dispatchEvent(new Event('input', { bubbles: true }));
    expect(a.value).toBe('4');
    expect(add.disabled).toBe(false);

    c.value = '2';
    c.dispatchEvent(new Event('input', { bubbles: true }));
    add.click();
    expect(assign).toHaveBeenCalledTimes(1);
    const url = new URL(assign.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe('http://x/p/bundle');
    expect(url.searchParams.get('add-to-cart')).toBe('20');
    expect(url.searchParams.get('quantity[21]')).toBe('4');
    expect(url.searchParams.get('quantity[23]')).toBe('2');
    expect(url.searchParams.has('quantity[22]')).toBe(false);
  });

  it('goes back to disabled when every quantity is cleared, and sends nothing for zero', async () => {
    respond(grouped);
    open({ id: 20 });
    await flush();
    const [a] = document.querySelectorAll('.bw-qv__group-qty');
    a.value = '1';
    a.dispatchEvent(new Event('input', { bubbles: true }));
    expect(q('.bw-qv__add').disabled).toBe(false);
    a.value = '0';
    a.dispatchEvent(new Event('input', { bubbles: true }));
    expect(q('.bw-qv__add').disabled).toBe(true);
    q('.bw-qv__add').click();
    expect(assign).not.toHaveBeenCalled();
  });
});
