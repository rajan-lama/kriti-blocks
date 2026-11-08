/**
 * Front end behavior for the BW Modal block.
 * The trigger stays hidden without JavaScript and the dialog opens with
 * focus management, a focus trap, Escape handling, scroll lock, and optional
 * backdrop closing. Auto open, exit intent, scroll and "show once" triggers
 * are opt-in through data attributes.
 */
(function () {
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"])';

  function getFocusable(panel) {
    return Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
      (element) => element.offsetParent !== null,
    );
  }

  function readSeen(key) {
    try {
      const expires = parseInt(window.localStorage.getItem(key), 10);
      return expires > Date.now();
    } catch (e) {
      return false;
    }
  }

  function writeSeen(key, days) {
    try {
      window.localStorage.setItem(key, String(Date.now() + days * 86400000));
    } catch (e) {
      // Storage is blocked: the modal may show again, which is safe.
    }
  }

  function initModal(root, index) {
    const trigger = root.querySelector('.bw-modal__trigger');
    const overlay = root.querySelector('.bw-modal__overlay');
    const panel = root.querySelector('.bw-modal__panel');

    if (!trigger || !overlay || !panel) {
      return;
    }

    const ownerDocument = panel.ownerDocument;
    const closeOnBackdrop = root.dataset.closeOnBackdrop !== 'false';
    const onceDays = parseInt(root.dataset.onceDays, 10) || 0;
    const seenKey = 'bw-modal-seen:' + (root.id || index);
    let lastFocused = null;
    let isOpen = false;

    root.classList.add('bw-modal--js');

    if (!panel.id) {
      panel.id = 'bw-modal-panel-' + Math.random().toString(36).slice(2, 8);
    }

    trigger.setAttribute('aria-controls', panel.id);

    // Name the dialog after its first heading when there is one.
    const heading = panel.querySelector('h1, h2, h3, h4, h5, h6');

    if (heading) {
      if (!heading.id) {
        heading.id = panel.id + '-title';
      }
      panel.setAttribute('aria-labelledby', heading.id);
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = getFocusable(panel);

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = ownerDocument.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function open(opener) {
      if (isOpen) {
        return;
      }

      isOpen = true;
      lastFocused = opener || ownerDocument.activeElement;
      overlay.hidden = false;
      root.classList.add('bw-modal--open');
      trigger.setAttribute('aria-expanded', 'true');
      ownerDocument.documentElement.classList.add('bw-modal-lock');
      ownerDocument.addEventListener('keydown', onKeydown);

      const focusable = getFocusable(panel);
      (focusable[0] || panel).focus();
    }

    function close() {
      if (!isOpen) {
        return;
      }

      isOpen = false;
      overlay.hidden = true;
      root.classList.remove('bw-modal--open');
      trigger.setAttribute('aria-expanded', 'false');
      ownerDocument.documentElement.classList.remove('bw-modal-lock');
      ownerDocument.removeEventListener('keydown', onKeydown);

      const target =
        lastFocused && ownerDocument.body.contains(lastFocused)
          ? lastFocused
          : trigger;

      target.focus();
    }

    trigger.addEventListener('click', function () {
      open(trigger);
    });

    const closeButton = root.querySelector('.bw-modal__close');

    if (closeButton) {
      closeButton.addEventListener('click', close);
    }

    if (closeOnBackdrop) {
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
          close();
        }
      });
    }

    // Any element matching a CSS selector can open the modal too.
    const selector = root.dataset.triggerSelector;

    if (selector) {
      let matches = [];

      try {
        matches = Array.from(ownerDocument.querySelectorAll(selector));
      } catch (e) {
        matches = [];
      }

      matches.forEach(function (element) {
        if (root.contains(element)) {
          return;
        }

        element.setAttribute('aria-haspopup', 'dialog');
        element.setAttribute('aria-controls', panel.id);
        element.addEventListener('click', function (event) {
          event.preventDefault();
          open(element);
        });
      });
    }

    // Automatic triggers. They never open over another open dialog, and
    // "show once" remembers the visit for the chosen number of days.
    const autoDelay = root.dataset.autoOpen;
    const exitIntent = root.dataset.exitIntent === 'true';
    const scrollOpen = parseInt(root.dataset.scrollOpen, 10) || 0;
    const hasAuto = autoDelay !== undefined || exitIntent || scrollOpen > 0;

    if (!hasAuto || (onceDays && readSeen(seenKey))) {
      return;
    }

    let fired = false;
    const cleanups = [];

    function fire() {
      if (
        fired ||
        ownerDocument.documentElement.classList.contains('bw-modal-lock')
      ) {
        return;
      }

      fired = true;
      cleanups.forEach((cleanup) => cleanup());

      if (onceDays) {
        writeSeen(seenKey, onceDays);
      }

      open(ownerDocument.activeElement);
    }

    if (autoDelay !== undefined) {
      const timer = window.setTimeout(
        fire,
        (parseInt(autoDelay, 10) || 0) * 1000,
      );
      cleanups.push(() => window.clearTimeout(timer));
    }

    if (exitIntent) {
      const onLeave = function (event) {
        if (event.clientY <= 0 && !event.relatedTarget) {
          fire();
        }
      };
      ownerDocument.addEventListener('mouseout', onLeave);
      cleanups.push(() =>
        ownerDocument.removeEventListener('mouseout', onLeave),
      );
    }

    if (scrollOpen > 0) {
      const onScroll = function () {
        const scrollable =
          ownerDocument.documentElement.scrollHeight - window.innerHeight;
        const percent =
          scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;

        if (percent >= scrollOpen) {
          fire();
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    }
  }

  document.querySelectorAll('.wp-block-kriti-blocks-modal').forEach(initModal);
})();
