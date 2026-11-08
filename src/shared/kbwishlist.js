/**
 * Wishlist kept in the visitor's browser (localStorage), as a list of product
 * IDs. If the browser blocks storage, it is kept in memory for the page.
 *
 * For a logged-in visitor it is also saved on their account (see initAccountSync),
 * so it follows them to other devices. Guests only use the browser.
 */
const KEY = 'kb-wishlist';
// The account the browser's list was last synced with, and whether it changed since.
const ACCOUNT_KEY = 'kb-wishlist-account';
const DIRTY_KEY = 'kb-wishlist-dirty';
const PUSH_DELAY = 600;
const MAX = 100;
const EVENT = 'kb-wishlist-change';

let memory = [];

function clean(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = {};
  return value
    .map(function (id) {
      return parseInt(id, 10);
    })
    .filter(function (id) {
      if (!(id > 0) || seen[id]) {
        return false;
      }
      seen[id] = true;
      return true;
    })
    .slice(0, MAX);
}

export function getWishlist() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? clean(JSON.parse(raw)) : memory;
  } catch (e) {
    return memory;
  }
}

function save(ids, options) {
  memory = ids;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch (e) {
    // The in-memory copy is enough for this page.
  }
  document.dispatchEvent(new CustomEvent(EVENT, { detail: ids }));
  if (!(options && options.silent)) {
    if (sync.account) {
      schedulePush();
    } else {
      // A guest change. If the visitor logs in later, it is kept.
      setFlag(DIRTY_KEY, '1');
    }
  }
}

export function inWishlist(id) {
  return getWishlist().indexOf(parseInt(id, 10)) !== -1;
}

/**
 * Adds or removes a product.
 *
 * @param {number|string} id Product ID.
 * @return {boolean} True when the product is now in the wishlist.
 */
export function toggleWishlist(id) {
  const target = parseInt(id, 10);
  if (!(target > 0)) {
    return false;
  }
  const ids = getWishlist();
  const at = ids.indexOf(target);
  if (at === -1) {
    save([target].concat(ids).slice(0, MAX));
    return true;
  }
  save(
    ids.filter(function (value) {
      return value !== target;
    }),
  );
  return false;
}

export function removeFromWishlist(id) {
  const target = parseInt(id, 10);
  save(
    getWishlist().filter(function (value) {
      return value !== target;
    }),
  );
}

/**
 * Calls back whenever the wishlist changes, including from another tab.
 *
 * @param {Function} callback Receives the list of IDs.
 */
export function onWishlistChange(callback) {
  document.addEventListener(EVENT, function () {
    callback(getWishlist());
  });
  window.addEventListener('storage', function (event) {
    if (event.key === KEY) {
      callback(getWishlist());
    }
  });
}

/* ------------------------------------------------------------------
 * Account sync (logged-in visitors)
 * ---------------------------------------------------------------- */

// The grid block and the Wishlist block are separate scripts, and each has its own copy of
// this module. The sync state therefore lives on `window`, so that only one of them syncs
// and they share one waiting timer. Without this, two syncs would race each other.
const sync = (window.kbWishlistSync = window.kbWishlistSync || {
  account: null,
  pushTimer: null,
});
const flags = {};

function getFlag(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? flags[key] || null : value;
  } catch (e) {
    return flags[key] || null;
  }
}

function setFlag(key, value) {
  if (value === null) {
    delete flags[key];
  } else {
    flags[key] = value;
  }
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    // The in-memory flag is enough for this page.
  }
}

function request(method, body) {
  return fetch(sync.account.endpoint, {
    method,
    headers: {
      'X-WP-Nonce': sync.account.nonce,
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(function (response) {
      return response.ok ? response.json() : null;
    })
    .catch(function () {
      return null;
    });
}

function push() {
  sync.pushTimer = null;
  return request('POST', { ids: getWishlist() }).then(function (data) {
    // If saving failed, remember it, so the next page load tries again.
    setFlag(DIRTY_KEY, data ? null : '1');
  });
}

function schedulePush() {
  window.clearTimeout(sync.pushTimer);
  sync.pushTimer = window.setTimeout(push, PUSH_DELAY);
}

function same(a, b) {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

/**
 * Keeps the browser's list and the account's list together. Safe to call from every
 * block on the page: only the first call does anything.
 *
 * What happens when a page loads:
 * - First time this browser syncs: the guest list and the account list are merged.
 * - Same account as last time: the account list wins, unless this browser has changes
 *   that were never saved (made as a guest, or while offline). Then they are merged.
 * - A different account than last time: the account list wins. The previous person's
 *   leftover list is never merged into someone else's account.
 *
 * @param {string} endpoint Account wishlist address.
 * @param {string} nonce    REST nonce for the logged-in user.
 */
export function initAccountSync(endpoint, nonce) {
  if (sync.account || !endpoint || !nonce) {
    return;
  }
  sync.account = { endpoint, nonce };

  request('GET').then(function (data) {
    if (!data || !Array.isArray(data.ids)) {
      return;
    }
    const user = String(data.user);
    const marker = getFlag(ACCOUNT_KEY);
    const dirty = getFlag(DIRTY_KEY) === '1';
    const local = getWishlist();
    const server = clean(data.ids);

    const merge = marker === null || (marker === user && dirty);
    const next = merge ? clean(local.concat(server)) : server;

    setFlag(ACCOUNT_KEY, user);
    if (!same(next, local)) {
      save(next, { silent: true });
    }
    if (!same(next, server)) {
      push();
    } else {
      setFlag(DIRTY_KEY, null);
    }
  });
}
