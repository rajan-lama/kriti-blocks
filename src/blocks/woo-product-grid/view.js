/* global MutationObserver */
import { openQuickView } from './quick-view';
import {
  getWishlist,
  toggleWishlist,
  onWishlistChange,
  initAccountSync,
} from '../../shared/kbwishlist';

/**
 * Front end behavior for the BW Product Grid: "Load more", the filter bar,
 * quick view and wishlist hearts.
 *
 * Without JavaScript the grid shows its first page, as before, and the bar and
 * button stay hidden. The endpoint returns the same item markup the block
 * prints on the first load.
 */
(function () {
  const DEBOUNCE = 350;

  function init(root) {
    const endpoint = root.dataset.endpoint;
    const postId = root.dataset.post;
    const grid = root.dataset.kbShop;
    const list = root.querySelector('.bw-woo-product-grid__items');
    const bar = root.querySelector('.bw-woo-product-grid__bar');
    const status = root.querySelector('.bw-woo-product-grid__status');
    if (!endpoint || !postId || !grid || !list) {
      return;
    }

    const emptyText = root.dataset.empty || '';
    const moreLabel = root.dataset.moreLabel || '';
    let more = root.querySelector('.bw-woo-product-grid__more');
    let page = parseInt(root.dataset.page, 10) || 1;
    let pages = parseInt(root.dataset.pages, 10) || 1;
    let request = 0;
    let controller = null;
    let timer = null;

    function query(target) {
      const params = new URLSearchParams({
        post_id: postId,
        grid,
        page: String(target),
      });
      if (bar) {
        new FormData(bar).forEach(function (value, key) {
          if (value !== '') {
            params.set(key, String(value));
          }
        });
      }
      return params;
    }

    function say(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function syncMore() {
      if (!moreLabel) {
        return;
      }
      if (!more && pages > page) {
        more = document.createElement('button');
        more.type = 'button';
        more.className = 'bw-woo-product-grid__more';
        more.textContent = moreLabel;
        more.addEventListener('click', function () {
          load(page + 1, true);
        });
        root.appendChild(more);
      }
      if (more) {
        more.hidden = pages <= page;
      }
    }

    function load(target, append) {
      request += 1;
      const mine = request;
      if (controller) {
        controller.abort();
      }
      controller = 'AbortController' in window ? new AbortController() : null;
      root.classList.add('is-loading');
      root.setAttribute('aria-busy', 'true');
      if (more) {
        more.disabled = true;
      }

      fetch(endpoint + '?' + query(target).toString(), {
        signal: controller ? controller.signal : undefined,
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data };
          });
        })
        .then(function (result) {
          if (mine !== request) {
            return;
          }
          const data = result.data;
          if (!result.ok || !data || typeof data.html !== 'string') {
            say(
              (data && data.message) ||
                root.dataset.error ||
                'Could not load products.',
            );
            return;
          }
          const before = list.children.length;
          if (append) {
            list.insertAdjacentHTML('beforeend', data.html);
            const first = list.children[before];
            const link = first && first.querySelector('a');
            if (link) {
              link.focus();
            }
          } else {
            list.innerHTML = data.html;
          }
          page = data.page;
          pages = data.pages;
          say(list.children.length === 0 ? emptyText : '');
          syncMore();
        })
        .catch(function (error) {
          if (error && error.name === 'AbortError') {
            return;
          }
          say(root.dataset.error || 'Could not load products.');
        })
        .finally(function () {
          if (mine === request) {
            root.classList.remove('is-loading');
            root.removeAttribute('aria-busy');
            if (more) {
              more.disabled = false;
            }
          }
        });
    }

    if (more) {
      more.addEventListener('click', function () {
        load(page + 1, true);
      });
    }

    if (bar) {
      bar.addEventListener('submit', function (event) {
        event.preventDefault();
        load(1, false);
      });
      bar.addEventListener('input', function (event) {
        const type = event.target.type;
        if (type === 'search' || type === 'number') {
          window.clearTimeout(timer);
          timer = window.setTimeout(function () {
            load(1, false);
          }, DEBOUNCE);
        }
      });
      bar.addEventListener('change', function (event) {
        const type = event.target.type;
        if (type !== 'search' && type !== 'number') {
          load(1, false);
        }
      });
    }
  }

  // Quick view and wishlist hearts. One delegated listener per grid, so items
  // added later by "Load more" or the filters work without extra setup.
  function initCards(root) {
    let text = {};
    try {
      text = JSON.parse(root.dataset.i18n || '{}');
    } catch (e) {
      text = {};
    }
    const hasHearts = !!root.querySelector('.bw-woo-product-grid__heart');

    function paintHearts() {
      const saved = getWishlist();
      root
        .querySelectorAll('.bw-woo-product-grid__heart')
        .forEach(function (heart) {
          const on = saved.indexOf(parseInt(heart.dataset.product, 10)) !== -1;
          heart.setAttribute('aria-pressed', on ? 'true' : 'false');
          heart.setAttribute(
            'aria-label',
            on
              ? text.wishRemove || 'Remove from wishlist'
              : text.wishAdd || 'Add to wishlist',
          );
        });
    }

    root.addEventListener('click', function (event) {
      const heart = event.target.closest('.bw-woo-product-grid__heart');
      if (heart && root.contains(heart)) {
        toggleWishlist(heart.dataset.product);
        return;
      }
      const quick = event.target.closest('.bw-woo-product-grid__quick');
      if (quick && root.contains(quick)) {
        openQuickView({
          endpoint: root.dataset.cardEndpoint,
          cartEndpoint: root.dataset.cartEndpoint,
          cartUrl: root.dataset.cartUrl,
          id: quick.dataset.product,
          opener: quick,
          text,
          wishlist: hasHearts,
        });
      }
    });

    if (hasHearts) {
      // Logged in: the wishlist is also kept on the account.
      initAccountSync(root.dataset.accountEndpoint, root.dataset.accountNonce);
      paintHearts();
      onWishlistChange(paintHearts);
      if ('MutationObserver' in window) {
        new MutationObserver(paintHearts).observe(root, {
          childList: true,
          subtree: true,
        });
      }
    }
  }

  function ready() {
    document.querySelectorAll('[data-kb-shop]').forEach(init);
    document.querySelectorAll('[data-kb-card]').forEach(initCards);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
