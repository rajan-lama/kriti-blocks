/**
 * Front end voting for the BW Rating block.
 *
 * Without JavaScript the block shows the value saved in the editor. With it,
 * the stars show the visitors' average and can be clicked to vote.
 */
(function () {
  const TOKEN_KEY = 'kb-rating-token';

  function store(method, key, value) {
    try {
      return method === 'get'
        ? window.localStorage.getItem(key)
        : window.localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
  }

  function token() {
    let value = store('get', TOKEN_KEY);
    if (!value || !/^[a-z0-9]{6,40}$/.test(value)) {
      value =
        Math.random().toString(36).slice(2, 12) +
        Math.random().toString(36).slice(2, 12);
      store('set', TOKEN_KEY, value);
    }
    return value;
  }

  function init(root) {
    const endpoint = root.dataset.endpoint;
    const postId = root.dataset.post;
    const voteId = root.dataset.kbVote;
    if (!endpoint || !postId || !voteId) {
      return;
    }

    const stars = Array.from(root.querySelectorAll('.bw-rating__star'));
    const max = stars.length;
    const doneKey = 'kb-rated-' + postId + '-' + voteId;
    let voted = store('get', doneKey) !== null;
    let average = parseFloat(root.dataset.average) || 0;
    let count = parseInt(root.dataset.count, 10) || 0;

    const status = document.createElement('span');
    status.className = 'bw-rating__status';
    status.setAttribute('role', 'status');
    root.appendChild(status);

    function paint(value) {
      stars.forEach(function (star, index) {
        const fill = star.querySelector('.bw-rating__fill');
        if (fill) {
          fill.style.width =
            Math.max(0, Math.min(1, value - index)) * 100 + '%';
        }
      });
    }

    function show() {
      if (count > 0) {
        paint(average);
        const valueEl = root.querySelector('.bw-rating__value');
        if (valueEl) {
          valueEl.textContent = String(average);
        }
        root.setAttribute(
          'aria-label',
          average + ' / ' + max + ' (' + count + ')',
        );
      }
    }

    function setVoted(message) {
      voted = true;
      store('set', doneKey, '1');
      root.classList.remove('bw-rating--voting');
      stars.forEach(function (star) {
        star.removeAttribute('role');
        star.removeAttribute('tabindex');
        star.removeAttribute('aria-checked');
        star.removeAttribute('aria-label');
        star.setAttribute('aria-hidden', 'true');
      });
      root.setAttribute('role', 'img');
      status.textContent = message;
    }

    function send(value) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: parseInt(postId, 10),
          vote_id: voteId,
          token: token(),
          value,
        }),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, status: response.status, data };
          });
        })
        .then(function (result) {
          if (result.data && typeof result.data.average === 'number') {
            average = result.data.average;
            count = result.data.count;
            show();
          }
          if (result.ok) {
            setVoted(root.dataset.thanks || 'Thanks for voting.');
          } else if (result.status === 409) {
            setVoted(root.dataset.already || 'You have already voted.');
          } else {
            status.textContent =
              (result.data && result.data.message) ||
              'Could not save your vote.';
            paint(average);
          }
        })
        .catch(function () {
          status.textContent = 'Could not save your vote.';
          paint(average);
        });
    }

    show();

    if (voted) {
      return;
    }

    root.classList.add('bw-rating--voting');
    root.setAttribute('role', 'radiogroup');
    stars.forEach(function (star, index) {
      star.setAttribute('role', 'radio');
      star.setAttribute('aria-checked', 'false');
      star.setAttribute('aria-label', index + 1 + ' / ' + max);
      star.setAttribute('tabindex', index === 0 ? '0' : '-1');
      star.removeAttribute('aria-hidden');

      star.addEventListener('mouseenter', function () {
        if (!voted) {
          paint(index + 1);
        }
      });
      star.addEventListener('mouseleave', function () {
        if (!voted) {
          paint(count > 0 ? average : parseFloat(root.dataset.initial) || 0);
        }
      });
      star.addEventListener('click', function () {
        if (!voted) {
          star.setAttribute('aria-checked', 'true');
          paint(index + 1);
          send(index + 1);
        }
      });
      star.addEventListener('keydown', function (event) {
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
          next = Math.min(index + 1, max - 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
          next = Math.max(index - 1, 0);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          star.click();
          return;
        }
        if (next !== null) {
          event.preventDefault();
          stars.forEach(function (s, i) {
            s.setAttribute('tabindex', i === next ? '0' : '-1');
          });
          stars[next].focus();
        }
      });
    });

    // Remember the saved value so hover can restore it before the first vote.
    const first = root.querySelectorAll('.bw-rating__fill');
    let saved = 0;
    first.forEach(function (fill) {
      saved += (parseFloat(fill.style.width) || 0) / 100;
    });
    root.dataset.initial = String(saved);
  }

  function ready() {
    document.querySelectorAll('[data-kb-vote]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
