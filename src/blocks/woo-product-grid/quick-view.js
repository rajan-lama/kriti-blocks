/**
 * Quick view dialog for the product grid.
 *
 * Everything from the server is plain data and is put on the page as text, so
 * no server text is ever treated as HTML. A native <dialog> gives focus
 * handling and Escape for free.
 */
import { addToCart } from '../../shared/kbcart';
import {
  inWishlist,
  toggleWishlist,
  onWishlistChange,
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

/**
 * The variation that matches every chosen option, or null. A variation that
 * leaves an attribute empty accepts any value for it.
 *
 * @param {Array}  variations Variations from the server.
 * @param {Object} chosen     Selected values keyed by attribute key.
 * @return {Object|null} Matching variation.
 */
export function findVariation(variations, chosen) {
  return (
    variations.find(function (variation) {
      return Object.keys(chosen).every(function (key) {
        const wanted = variation.attributes[key];
        return wanted === undefined || wanted === '' || wanted === chosen[key];
      });
    }) || null
  );
}

/**
 * A whole number from the box, kept between a minimum and the most that can be bought.
 *
 * @param {*}      value Raw value from an input.
 * @param {number} min   Smallest allowed value.
 * @param {number} max   Largest allowed value.
 * @return {number} The value, kept in range.
 */
export function clampQuantity(value, min, max) {
  const n = parseInt(value, 10);
  return Math.min(max, Math.max(min, Number.isNaN(n) ? min : n));
}

export function openQuickView(options) {
  const { endpoint, cartEndpoint, cartUrl, id, opener, text } = options;
  const t = (key, fallback) => (text && text[key]) || fallback;

  const dialog = document.createElement('dialog');
  dialog.className = 'bw-qv';
  const labelId = 'bw-qv-title-' + id;
  dialog.setAttribute('aria-labelledby', labelId);
  document.body.appendChild(dialog);

  function close() {
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    }
    dialog.remove();
    if (opener && typeof opener.focus === 'function') {
      opener.focus();
    }
  }

  const closeButton = el('button', 'bw-qv__close', '×');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', t('close', 'Close'));
  closeButton.addEventListener('click', close);
  dialog.appendChild(closeButton);

  const body = el('div', 'bw-qv__body');
  dialog.appendChild(body);
  const loading = el('p', 'bw-qv__loading', '…');
  body.appendChild(loading);

  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) {
      close();
    }
  });
  dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    close();
  });

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }

  function fail(message) {
    body.textContent = '';
    body.appendChild(el('p', 'bw-qv__error', message));
  }

  function render(data) {
    body.textContent = '';

    const media = el('div', 'bw-qv__media');
    const main = el('img', 'bw-qv__image');
    main.alt = '';
    const images = (data.images || []).filter(isWeb);
    if (images.length) {
      main.src = images[0];
      media.appendChild(main);
      if (images.length > 1) {
        const thumbs = el('div', 'bw-qv__thumbs');
        images.forEach(function (url, index) {
          const button = el('button', 'bw-qv__thumb');
          button.type = 'button';
          button.setAttribute('aria-label', String(index + 1));
          const thumb = el('img');
          thumb.src = url;
          thumb.alt = '';
          button.appendChild(thumb);
          button.addEventListener('click', function () {
            main.src = url;
          });
          thumbs.appendChild(button);
        });
        media.appendChild(thumbs);
      }
    }

    const info = el('div', 'bw-qv__info');
    const title = el('h2', 'bw-qv__title', data.title);
    title.id = labelId;
    const price = el('p', 'bw-qv__price', data.price);
    const summary = el('p', 'bw-qv__summary', data.summary || '');
    const status = el('p', 'bw-qv__status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    info.appendChild(title);
    info.appendChild(price);
    if (data.summary) {
      info.appendChild(summary);
    }

    const chosen = {};
    const selects = [];
    if (data.mode === 'variation') {
      (data.attributes || []).forEach(function (attribute) {
        const field = el('label', 'bw-qv__field');
        field.appendChild(el('span', '', attribute.label));
        const select = document.createElement('select');
        select.dataset.key = attribute.key;
        const none = el('option', '', t('choose', 'Choose an option'));
        none.value = '';
        select.appendChild(none);
        attribute.options.forEach(function (option) {
          const node = el('option', '', option.label);
          node.value = option.value;
          select.appendChild(node);
        });
        field.appendChild(select);
        info.appendChild(field);
        selects.push(select);
      });
    }

    let quantity = null;
    let add = null;
    let limitNote = null;
    const groupInputs = [];
    // The most that can be bought: the shop's stock limit, or 99.
    const setLimit = function (max) {
      const limit = max > 0 ? Math.min(max, 99) : 99;
      quantity.max = String(limit);
      quantity.value = String(clampQuantity(quantity.value, 1, limit));
      limitNote.textContent =
        limit < 99 ? t('limit', 'Up to %d per order').replace('%d', limit) : '';
    };
    if (data.mode === 'ajax' || data.mode === 'variation') {
      const qtyField = el('label', 'bw-qv__field bw-qv__field--qty');
      qtyField.appendChild(el('span', '', t('quantity', 'Quantity')));
      quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.min = '1';
      quantity.max = '99';
      quantity.value = '1';
      quantity.addEventListener('change', function () {
        quantity.value = String(
          clampQuantity(quantity.value, 1, parseInt(quantity.max, 10) || 99),
        );
      });
      qtyField.appendChild(quantity);
      limitNote = el('small', 'bw-qv__limit');
      qtyField.appendChild(limitNote);
      info.appendChild(qtyField);
      if (data.mode === 'ajax') {
        setLimit(data.max);
      }

      add = el('button', 'bw-qv__add', t('addToCart', 'Add to cart'));
      add.type = 'button';
      add.disabled = data.mode === 'variation';
      info.appendChild(add);
    } else if (data.mode === 'grouped') {
      const group = el('div', 'bw-qv__group');
      (data.children || []).forEach(function (child) {
        const row = el('div', 'bw-qv__group-row');
        row.appendChild(el('span', 'bw-qv__group-name', child.title));
        row.appendChild(el('span', 'bw-qv__group-price', child.price));
        if (child.buyable) {
          const box = document.createElement('input');
          box.type = 'number';
          box.className = 'bw-qv__group-qty';
          box.min = '0';
          box.max = String(child.max > 0 ? Math.min(child.max, 99) : 99);
          box.value = '0';
          box.dataset.id = String(child.id);
          box.setAttribute(
            'aria-label',
            child.title + ': ' + t('quantity', 'Quantity'),
          );
          groupInputs.push(box);
          row.appendChild(box);
        } else {
          row.appendChild(
            el('span', 'bw-qv__group-out', t('outOfStock', 'Out of stock')),
          );
        }
        group.appendChild(row);
      });
      info.appendChild(group);

      add = el('button', 'bw-qv__add', t('addToCart', 'Add to cart'));
      add.type = 'button';
      add.disabled = true;
      groupInputs.forEach(function (box) {
        box.addEventListener('input', function () {
          const max = parseInt(box.max, 10) || 99;
          if (box.value !== '') {
            box.value = String(clampQuantity(box.value, 0, max));
          }
          add.disabled = !groupInputs.some(function (other) {
            return clampQuantity(other.value, 0, 99) > 0;
          });
        });
      });
      info.appendChild(add);
    } else if (!data.in_stock) {
      info.appendChild(el('p', 'bw-qv__out', t('outOfStock', 'Out of stock')));
    }

    let variation = null;
    function sync() {
      if (data.mode !== 'variation') {
        return;
      }
      selects.forEach(function (select) {
        if (select.value) {
          chosen[select.dataset.key] = select.value;
        } else {
          delete chosen[select.dataset.key];
        }
      });
      const complete = selects.every(function (select) {
        return select.value !== '';
      });
      variation = complete ? findVariation(data.variations, chosen) : null;
      add.disabled = true;
      setLimit(variation ? variation.max : 0);
      if (!complete) {
        status.textContent = '';
        price.textContent = data.price;
        return;
      }
      if (!variation) {
        status.textContent = t(
          'unavailable',
          'This combination is not available.',
        );
        return;
      }
      price.textContent = variation.price || data.price;
      if (variation.image && isWeb(variation.image)) {
        main.src = variation.image;
        // A product with no gallery has no picture on the page yet.
        if (!main.parentNode) {
          media.insertBefore(main, media.firstChild);
        }
      }
      if (!variation.in_stock) {
        status.textContent = t('outOfStock', 'Out of stock');
        return;
      }
      status.textContent = '';
      add.disabled = false;
    }
    selects.forEach(function (select) {
      select.addEventListener('change', sync);
    });

    if (add) {
      add.addEventListener('click', function () {
        if (data.mode === 'grouped') {
          if (!isWeb(data.url)) {
            return;
          }
          // WooCommerce adds the items of a grouped product from the product address.
          const params = new URLSearchParams({
            'add-to-cart': String(data.id),
          });
          groupInputs.forEach(function (box) {
            const n = clampQuantity(box.value, 0, parseInt(box.max, 10) || 99);
            if (n > 0) {
              params.set('quantity[' + box.dataset.id + ']', String(n));
            }
          });
          window.location.assign(data.url + '?' + params.toString());
          return;
        }
        const qty = clampQuantity(
          quantity.value,
          1,
          parseInt(quantity.max, 10) || 99,
        );
        if (data.mode === 'variation') {
          if (!variation || !isWeb(data.url)) {
            return;
          }
          // WooCommerce adds variable products from the product address.
          const params = new URLSearchParams({
            'add-to-cart': String(data.id),
            variation_id: String(variation.id),
            quantity: String(qty),
          });
          Object.keys(chosen).forEach(function (key) {
            params.set(key, chosen[key]);
          });
          window.location.assign(data.url + '?' + params.toString());
          return;
        }
        add.disabled = true;
        addToCart(cartEndpoint, data.id, qty).then(function (ok) {
          add.disabled = false;
          status.textContent = ok
            ? t('added', 'Added to cart.')
            : t('cartError', 'Could not add the product to the cart.');
          if (ok && cartUrl && isWeb(cartUrl)) {
            const link = el('a', 'bw-qv__cart', t('viewCart', 'View cart'));
            link.href = cartUrl;
            status.appendChild(document.createTextNode(' '));
            status.appendChild(link);
          }
        });
      });
    }

    info.appendChild(status);

    const links = el('p', 'bw-qv__links');
    if (isWeb(data.url)) {
      const view = el('a', 'bw-qv__view', t('view', 'View product'));
      view.href = data.url;
      links.appendChild(view);
    }
    if (options.wishlist) {
      const heart = el('button', 'bw-qv__heart');
      heart.type = 'button';
      const paint = function () {
        const on = inWishlist(data.id);
        heart.setAttribute('aria-pressed', on ? 'true' : 'false');
        heart.textContent = on
          ? t('wishRemove', 'Remove from wishlist')
          : t('wishAdd', 'Add to wishlist');
      };
      heart.addEventListener('click', function () {
        toggleWishlist(data.id);
      });
      onWishlistChange(paint);
      paint();
      links.appendChild(heart);
    }
    info.appendChild(links);

    // Without a picture the text takes the whole width.
    body.classList.toggle('bw-qv__body--no-media', !media.firstChild);
    body.appendChild(media);
    body.appendChild(info);
    closeButton.focus();
  }

  fetch(endpoint + '?id=' + encodeURIComponent(String(id)))
    .then(function (response) {
      return response.json().then(function (data) {
        return { ok: response.ok, data };
      });
    })
    .then(function (result) {
      if (!result.ok || !result.data || typeof result.data.title !== 'string') {
        fail(
          (result.data && result.data.message) ||
            t('error', 'Could not load the product.'),
        );
        return;
      }
      render(result.data);
    })
    .catch(function () {
      fail(t('error', 'Could not load the product.'));
    });

  return { close, dialog };
}
