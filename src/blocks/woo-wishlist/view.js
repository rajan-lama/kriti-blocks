/**
 * Front end for the BW Wishlist block.
 *
 * The saved product IDs live in the visitor's browser. This asks the site for
 * the current details of those products and builds the cards with text nodes,
 * so nothing from the server is treated as HTML.
 */
import { addToCart } from '../../shared/kbcart';
import {
  getWishlist,
  removeFromWishlist,
  onWishlistChange,
  initAccountSync,
} from '../../shared/kbwishlist';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

const isWeb = (url) => /^https?:/i.test(String(url || ''));

function init(root) {
  const endpoint = root.dataset.endpoint;
  const list = root.querySelector('.bw-woo-wishlist__items');
  const empty = root.querySelector('.bw-woo-wishlist__empty');
  const status = root.querySelector('.bw-woo-wishlist__status');
  if (!endpoint || !list) {
    return;
  }
  let text = {};
  try {
    text = JSON.parse(root.dataset.i18n || '{}');
  } catch (e) {
    text = {};
  }
  const cartEndpoint = root.dataset.cartEndpoint;
  let shown = [];
  let request = 0;

  function say(message) {
    status.textContent = message || '';
  }

  function card(item) {
    const li = el('li', 'bw-woo-wishlist__item');
    li.dataset.product = String(item.id);

    if (item.image && isWeb(item.image)) {
      const link = el('a', 'bw-woo-wishlist__media');
      link.href = isWeb(item.url) ? item.url : '#';
      const img = el('img');
      img.src = item.image;
      img.alt = '';
      img.loading = 'lazy';
      link.appendChild(img);
      li.appendChild(link);
    }

    const title = el('h3', 'bw-woo-wishlist__name');
    const titleLink = el('a', '', item.title);
    titleLink.href = isWeb(item.url) ? item.url : '#';
    title.appendChild(titleLink);
    li.appendChild(title);
    if (item.price) {
      li.appendChild(el('p', 'bw-woo-wishlist__price', item.price));
    }

    const actions = el('div', 'bw-woo-wishlist__actions');
    if (cartEndpoint && item.mode === 'ajax') {
      const add = el('button', 'bw-woo-wishlist__add', text.addToCart);
      add.type = 'button';
      add.addEventListener('click', function () {
        add.disabled = true;
        addToCart(cartEndpoint, item.id, 1).then(function (ok) {
          add.disabled = false;
          say(ok ? text.added : text.cartError);
        });
      });
      actions.appendChild(add);
    } else if (!item.in_stock) {
      actions.appendChild(el('span', 'bw-woo-wishlist__out', text.outOfStock));
    } else if (isWeb(item.url)) {
      const choose = el(
        'a',
        'bw-woo-wishlist__choose',
        text.choose || text.view,
      );
      choose.href = item.url;
      actions.appendChild(choose);
    }
    const remove = el('button', 'bw-woo-wishlist__remove', '×');
    remove.type = 'button';
    remove.setAttribute('aria-label', (text.remove || '') + ': ' + item.title);
    remove.addEventListener('click', function () {
      removeFromWishlist(item.id);
    });
    actions.appendChild(remove);
    li.appendChild(actions);
    return li;
  }

  function showEmpty(isEmpty) {
    if (empty) {
      empty.hidden = !isEmpty;
    }
  }

  function load() {
    const ids = getWishlist();
    request += 1;
    const mine = request;
    if (!ids.length) {
      list.textContent = '';
      shown = [];
      showEmpty(true);
      return;
    }
    fetch(endpoint + '?ids=' + encodeURIComponent(ids.join(',')))
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data };
        });
      })
      .then(function (result) {
        if (mine !== request) {
          return;
        }
        if (!result.ok || !result.data || !Array.isArray(result.data.items)) {
          say((result.data && result.data.message) || text.error);
          return;
        }
        say('');
        const items = result.data.items;
        // Keep the order the visitor saved them in.
        items.sort(function (a, b) {
          return ids.indexOf(a.id) - ids.indexOf(b.id);
        });
        list.textContent = '';
        items.forEach(function (item) {
          list.appendChild(card(item));
        });
        shown = items.map(function (item) {
          return item.id;
        });
        showEmpty(items.length === 0);
      })
      .catch(function () {
        say(text.error);
      });
  }

  onWishlistChange(function (ids) {
    // Removing is local. Anything new needs the product details from the site.
    const added = ids.some(function (id) {
      return shown.indexOf(id) === -1;
    });
    if (added) {
      load();
      return;
    }
    list.querySelectorAll('.bw-woo-wishlist__item').forEach(function (item) {
      if (ids.indexOf(parseInt(item.dataset.product, 10)) === -1) {
        item.remove();
      }
    });
    shown = shown.filter(function (id) {
      return ids.indexOf(id) !== -1;
    });
    showEmpty(shown.length === 0);
  });

  // Logged in: the wishlist is also kept on the account.
  initAccountSync(root.dataset.accountEndpoint, root.dataset.accountNonce);
  load();
}

function ready() {
  document.querySelectorAll('[data-kb-wishlist]').forEach(init);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}
