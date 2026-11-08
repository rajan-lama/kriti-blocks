/* global Storage */
const load = () => {
  jest.resetModules();
  // The sync state lives on window (shared between script bundles), so start each test fresh.
  delete window.kbWishlistSync;
  return require('../kbwishlist');
};

beforeEach(() => {
  window.localStorage.clear();
});

test('adds and removes products, newest first', () => {
  const w = load();
  expect(w.toggleWishlist(5)).toBe(true);
  expect(w.toggleWishlist('7')).toBe(true);
  expect(w.getWishlist()).toEqual([7, 5]);
  expect(w.inWishlist(5)).toBe(true);
  expect(w.toggleWishlist(5)).toBe(false);
  expect(w.getWishlist()).toEqual([7]);
  w.removeFromWishlist(7);
  expect(w.getWishlist()).toEqual([]);
});

test('ignores invalid ids and cleans stored junk', () => {
  const w = load();
  expect(w.toggleWishlist('abc')).toBe(false);
  expect(w.toggleWishlist(-3)).toBe(false);
  window.localStorage.setItem(
    'kb-wishlist',
    JSON.stringify([3, '3', 'x', 0, -1, 9, null]),
  );
  expect(w.getWishlist()).toEqual([3, 9]);
  window.localStorage.setItem('kb-wishlist', '{not json');
  expect(w.getWishlist()).toEqual([]);
});

test('keeps at most 100 products', () => {
  const w = load();
  for (let i = 1; i <= 120; i += 1) {
    w.toggleWishlist(i);
  }
  expect(w.getWishlist()).toHaveLength(100);
  expect(w.getWishlist()[0]).toBe(120);
});

test('tells listeners about changes', () => {
  const w = load();
  const seen = [];
  w.onWishlistChange((ids) => seen.push(ids));
  w.toggleWishlist(4);
  w.toggleWishlist(4);
  expect(seen).toEqual([[4], []]);
});

test('still works in memory when storage is blocked', () => {
  const w = load();
  const getItem = jest
    .spyOn(Storage.prototype, 'getItem')
    .mockImplementation(() => {
      throw new Error('blocked');
    });
  const setItem = jest
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new Error('blocked');
    });
  expect(w.toggleWishlist(8)).toBe(true);
  expect(w.getWishlist()).toEqual([8]);
  getItem.mockRestore();
  setItem.mockRestore();
});

describe('account sync', () => {
  const ENDPOINT = 'http://x/wp-json/kriti-blocks/v1/wishlist';
  let calls;

  // The site answers GET with the saved list, and POST by echoing what it was sent.
  const site = ({
    user = 7,
    ids = [],
    failGet = false,
    failPost = false,
  } = {}) => {
    calls = [];
    global.fetch = jest.fn((url, init = {}) => {
      calls.push({
        method: init.method,
        headers: init.headers,
        body: init.body,
      });
      const ok = init.method === 'POST' ? !failPost : !failGet;
      const data =
        init.method === 'POST'
          ? { user, ids: JSON.parse(init.body).ids }
          : { user, ids };
      return Promise.resolve({ ok, json: () => Promise.resolve(data) });
    });
  };
  const flush = async () => {
    // Enough turns for a request, its reply, and the save that follows it.
    for (let i = 0; i < 30; i += 1) {
      await Promise.resolve();
    }
  };
  const posts = () => calls.filter((c) => c.method === 'POST');
  const stored = () =>
    JSON.parse(window.localStorage.getItem('kb-wishlist') || '[]');

  beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
  });
  afterEach(() => jest.useRealTimers());

  it('first sync on this browser merges the guest list and the account list, then saves it', async () => {
    window.localStorage.setItem('kb-wishlist', JSON.stringify([1, 2]));
    site({ ids: [2, 3] });
    const w = load();
    w.initAccountSync(ENDPOINT, 'nonce1');
    await flush();

    expect(stored()).toEqual([1, 2, 3]);
    expect(posts()).toHaveLength(1);
    expect(JSON.parse(posts()[0].body).ids).toEqual([1, 2, 3]);
    expect(window.localStorage.getItem('kb-wishlist-account')).toBe('7');
  });

  it('sends the nonce and the cookies with every request', async () => {
    site({ ids: [] });
    load().initAccountSync(ENDPOINT, 'abc123');
    await flush();
    expect(calls[0].method).toBe('GET');
    expect(calls[0].headers['X-WP-Nonce']).toBe('abc123');
  });

  it('same account again: the account list wins and nothing is sent back', async () => {
    window.localStorage.setItem('kb-wishlist-account', '7');
    window.localStorage.setItem('kb-wishlist', JSON.stringify([1, 2, 3]));
    site({ ids: [3] }); // another device removed 1 and 2
    load().initAccountSync(ENDPOINT, 'n');
    await flush();

    expect(stored()).toEqual([3]);
    expect(posts()).toHaveLength(0);
  });

  it('same account, but this browser has unsaved changes: they are kept and merged', async () => {
    window.localStorage.setItem('kb-wishlist-account', '7');
    window.localStorage.setItem('kb-wishlist-dirty', '1');
    window.localStorage.setItem('kb-wishlist', JSON.stringify([9]));
    site({ ids: [3] });
    load().initAccountSync(ENDPOINT, 'n');
    await flush();

    expect(stored()).toEqual([9, 3]);
    expect(JSON.parse(posts()[0].body).ids).toEqual([9, 3]);
    expect(window.localStorage.getItem('kb-wishlist-dirty')).toBeNull();
  });

  it("a different account: the previous person's list is not merged into it", async () => {
    window.localStorage.setItem('kb-wishlist-account', '5'); // someone else used this browser
    window.localStorage.setItem('kb-wishlist', JSON.stringify([100, 101]));
    site({ user: 7, ids: [3] });
    load().initAccountSync(ENDPOINT, 'n');
    await flush();

    expect(stored()).toEqual([3]);
    expect(posts()).toHaveLength(0);
    expect(window.localStorage.getItem('kb-wishlist-account')).toBe('7');
  });

  it('changes after syncing are saved to the account, in one request after a short wait', async () => {
    window.localStorage.setItem('kb-wishlist-account', '7');
    site({ ids: [] });
    const w = load();
    w.initAccountSync(ENDPOINT, 'n');
    await flush();

    w.toggleWishlist(4);
    w.toggleWishlist(5);
    expect(posts()).toHaveLength(0);
    jest.advanceTimersByTime(700);
    await flush();
    expect(posts()).toHaveLength(1);
    expect(JSON.parse(posts()[0].body).ids).toEqual([5, 4]);
  });

  it('a guest change is remembered for after login, and sends nothing', () => {
    site();
    const w = load();
    w.toggleWishlist(4);
    jest.advanceTimersByTime(2000);
    expect(calls).toHaveLength(0);
    expect(window.localStorage.getItem('kb-wishlist-dirty')).toBe('1');
  });

  it('a failed save is remembered, so the next page load tries again', async () => {
    window.localStorage.setItem('kb-wishlist-account', '7');
    site({ ids: [], failPost: true });
    const w = load();
    w.initAccountSync(ENDPOINT, 'n');
    await flush();
    w.toggleWishlist(4);
    jest.advanceTimersByTime(700);
    await flush();
    expect(window.localStorage.getItem('kb-wishlist-dirty')).toBe('1');
  });

  it('keeps the local list when the site cannot be reached', async () => {
    window.localStorage.setItem('kb-wishlist', JSON.stringify([1, 2]));
    site({ failGet: true });
    load().initAccountSync(ENDPOINT, 'n');
    await flush();
    expect(stored()).toEqual([1, 2]);
    expect(posts()).toHaveLength(0);
  });

  it('only the first call does anything, and a call without a nonce does nothing', async () => {
    site({ ids: [] });
    const w = load();
    w.initAccountSync(ENDPOINT, 'n');
    w.initAccountSync(ENDPOINT, 'n');
    w.initAccountSync('', '');
    await flush();
    expect(calls.filter((c) => c.method === 'GET')).toHaveLength(1);

    site({ ids: [] });
    load().initAccountSync(ENDPOINT, '');
    await flush();
    expect(calls).toHaveLength(0);
  });

  it('tells the page when the account list changes the local one', async () => {
    window.localStorage.setItem('kb-wishlist-account', '7');
    site({ ids: [8, 9] });
    const w = load();
    const seen = [];
    w.onWishlistChange((ids) => seen.push(ids));
    w.initAccountSync(ENDPOINT, 'n');
    await flush();
    expect(seen[0]).toEqual([8, 9]);
  });

  it('two script bundles on one page (grid + wishlist block) sync only once', async () => {
    window.localStorage.setItem('kb-wishlist', JSON.stringify([1]));
    site({ ids: [] });
    delete window.kbWishlistSync;
    // Two separate copies of the module, as two script bundles would have.
    let first;
    let second;
    jest.isolateModules(() => {
      first = require('../kbwishlist');
    });
    jest.isolateModules(() => {
      second = require('../kbwishlist');
    });
    first.initAccountSync(ENDPOINT, 'n');
    second.initAccountSync(ENDPOINT, 'n');
    await flush();

    expect(calls.filter((c) => c.method === 'GET')).toHaveLength(1);
    expect(posts()).toHaveLength(1);

    // A change made through the second copy is saved once, through the shared timer.
    second.toggleWishlist(5);
    first.toggleWishlist(6);
    jest.advanceTimersByTime(700);
    await flush();
    expect(posts()).toHaveLength(2);
    expect(JSON.parse(posts()[1].body).ids).toEqual([6, 5, 1]);
  });
});
