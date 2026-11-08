/**
 * Front end behavior for the BW Off-canvas Drawer block.
 * The trigger stays hidden without JavaScript and the drawer opens with
 * focus management, a focus trap, Escape handling, scroll lock, and optional
 * backdrop closing. A CSS selector can open it too and links inside it can
 * close it, both opt-in through data attributes.
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

  function initDrawer(root) {
    const trigger = root.querySelector('.bw-offcanvas__trigger');
    const overlay = root.querySelector('.bw-offcanvas__overlay');
    const panel = root.querySelector('.bw-offcanvas__panel');

    if (!trigger || !overlay || !panel) {
      return;
    }

    const ownerDocument = panel.ownerDocument;
    const closeOnBackdrop = root.dataset.closeOnBackdrop !== 'false';
    let lastFocused = null;
    let isOpen = false;

    root.classList.add('bw-offcanvas--js');

    if (!panel.id) {
      panel.id = 'bw-offcanvas-panel-' + Math.random().toString(36).slice(2, 8);
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
      // Force a layout pass so the slide-in transition actually runs.
      void panel.offsetWidth;
      root.classList.add('bw-offcanvas--open');
      trigger.setAttribute('aria-expanded', 'true');
      ownerDocument.documentElement.classList.add('bw-offcanvas-lock');
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
      root.classList.remove('bw-offcanvas--open');
      trigger.setAttribute('aria-expanded', 'false');
      ownerDocument.documentElement.classList.remove('bw-offcanvas-lock');
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

    const closeButton = root.querySelector('.bw-offcanvas__close');

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

    // Any element matching a CSS selector can open the drawer too.
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

    // Close after following a link inside the drawer (menus, anchors).
    if (root.dataset.closeOnLink === 'true') {
      panel.addEventListener('click', function (event) {
        if (event.target.closest && event.target.closest('a[href]')) {
          close();
        }
      });
    }
  }

  document
    .querySelectorAll('.wp-block-kriti-blocks-offcanvas')
    .forEach(initDrawer);
})();
