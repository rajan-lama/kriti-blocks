/**
 * Live suggestions for the BW Product Search block.
 *
 * The endpoint returns plain data. The list is built with text nodes, so
 * nothing from the server is ever inserted as HTML. Without JavaScript the
 * field is a normal search form.
 */
(function () {
  const DELAY = 250;
  const MIN = 2;

  function init(root) {
    const endpoint = root.dataset.endpoint;
    const form = root.querySelector('form');
    const input = root.querySelector('input[type="search"]');
    const list = root.querySelector('.bw-woo-product-search__list');
    const status = root.querySelector('[role="status"]');
    if (!endpoint || !form || !input || !list) {
      return;
    }

    const allText = root.dataset.all || 'View all results';
    const noneText = root.dataset.none || 'No products found.';
    let timer = null;
    let request = 0;
    let controller = null;
    let active = -1;

    const options = () => Array.from(list.querySelectorAll('[role="option"]'));

    function close() {
      list.hidden = true;
      list.textContent = '';
      active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function setActive(index) {
      const items = options();
      items.forEach(function (item, i) {
        item.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      active = index;
      if (index >= 0 && items[index]) {
        input.setAttribute('aria-activedescendant', items[index].id);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function option(id, href, parts) {
      const li = document.createElement('li');
      li.id = id;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      const link = document.createElement('a');
      link.href = href;
      parts.forEach(function (part) {
        link.appendChild(part);
      });
      li.appendChild(link);
      return li;
    }

    function span(className, text) {
      const el = document.createElement('span');
      el.className = className;
      el.textContent = text;
      return el;
    }

    function render(items) {
      list.textContent = '';
      if (!items.length) {
        const empty = document.createElement('li');
        empty.className = 'bw-woo-product-search__none';
        empty.textContent = noneText;
        list.appendChild(empty);
        if (status) {
          status.textContent = noneText;
        }
      } else {
        items.forEach(function (item, index) {
          const parts = [];
          // Only http(s) images are used, even though the server already checks.
          if (item.image && /^https?:/i.test(item.image)) {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = '';
            img.width = 40;
            img.height = 40;
            parts.push(img);
          }
          parts.push(span('bw-woo-product-search__title', item.title));
          if (item.price) {
            parts.push(span('bw-woo-product-search__price', item.price));
          }
          const href = /^https?:/i.test(item.url) ? item.url : '#';
          list.appendChild(option(list.id + '-' + index, href, parts));
        });
        const all = document.createElement('li');
        all.id = list.id + '-all';
        all.setAttribute('role', 'option');
        all.setAttribute('aria-selected', 'false');
        all.className = 'bw-woo-product-search__all';
        const allLink = document.createElement('a');
        allLink.href = '#';
        allLink.textContent = allText;
        allLink.addEventListener('click', function (event) {
          event.preventDefault();
          form.submit();
        });
        all.appendChild(allLink);
        list.appendChild(all);
        if (status) {
          status.textContent = items.length + ' ' + (root.dataset.found || '');
        }
      }
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      active = -1;
    }

    function search() {
      const term = input.value.trim();
      if (term.length < MIN) {
        close();
        return;
      }
      request += 1;
      const mine = request;
      if (controller) {
        controller.abort();
      }
      controller = 'AbortController' in window ? new AbortController() : null;
      const params = new URLSearchParams({ q: term });
      const category = form.querySelector('select[name="product_cat"]');
      if (category && category.value) {
        params.set('cat', category.value);
      }
      fetch(endpoint + '?' + params.toString(), {
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
          if (result.ok && result.data && Array.isArray(result.data.items)) {
            render(result.data.items);
          } else {
            close();
          }
        })
        .catch(function (error) {
          if (!error || error.name !== 'AbortError') {
            close();
          }
        });
    }

    input.addEventListener('input', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(search, DELAY);
    });

    input.addEventListener('keydown', function (event) {
      const items = options();
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowDown' && items.length) {
        event.preventDefault();
        setActive(active + 1 >= items.length ? 0 : active + 1);
      } else if (event.key === 'ArrowUp' && items.length) {
        event.preventDefault();
        setActive(active <= 0 ? items.length - 1 : active - 1);
      } else if (event.key === 'Enter' && active >= 0 && items[active]) {
        event.preventDefault();
        const link = items[active].querySelector('a');
        if (link) {
          link.click();
        }
      }
    });

    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        close();
      }
    });
    form.addEventListener('submit', close);
  }

  function ready() {
    document.querySelectorAll('[data-kb-live]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
