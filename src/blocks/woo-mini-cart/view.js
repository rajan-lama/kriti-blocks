/**
 * Front end behavior for the BW Mini Cart block.
 * The panel stays visible without JavaScript. When JavaScript is available the
 * toggle collapses or expands the cart contents and keeps the cart in sync
 * through WooCommerce's cart fragments (widget_shopping_cart_content).
 *
 * Display modes: inline (collapsible), dropdown (closes on outside click) and
 * drawer (side panel with overlay, close button and Escape to close).
 */
(function () {
  const FOCUSABLE =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function initMiniCart(root) {
    const toggle = root.querySelector('.bw-woo-mini-cart__toggle');

    if (!toggle) {
      return;
    }

    const panel = root.querySelector('.bw-woo-mini-cart__panel');
    const overlay = root.querySelector('.bw-woo-mini-cart__overlay');
    const isDrawer = root.classList.contains('bw-woo-mini-cart--drawer');
    const isDropdown = root.classList.contains('bw-woo-mini-cart--dropdown');
    const openByDefault = root.dataset.openByDefault === 'true';

    root.classList.add('bw-woo-mini-cart--enhanced');

    if (isDrawer && panel) {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', toggle.textContent.trim());
    }

    function isOpen() {
      return root.classList.contains('bw-woo-mini-cart--open');
    }

    function setOpen(open, restoreFocus) {
      root.classList.toggle('bw-woo-mini-cart--open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (overlay) {
        overlay.hidden = !open;
      }

      if (isDrawer && panel) {
        if (open) {
          const first = panel.querySelector(FOCUSABLE);
          if (first) {
            first.focus();
          }
        } else if (restoreFocus) {
          toggle.focus();
        }
      }
    }

    setOpen(openByDefault, false);

    toggle.addEventListener('click', function () {
      setOpen(!isOpen(), true);
    });

    const close = root.querySelector('.bw-woo-mini-cart__close');

    if (close) {
      close.addEventListener('click', function () {
        setOpen(false, true);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        setOpen(false, true);
      });
    }

    if (isDrawer || isDropdown) {
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isOpen()) {
          setOpen(false, true);
        }
      });
    }

    if (isDropdown) {
      document.addEventListener('click', function (event) {
        if (isOpen() && !root.contains(event.target)) {
          setOpen(false, false);
        }
      });
    }
  }

  document
    .querySelectorAll('.wp-block-kriti-blocks-woo-mini-cart')
    .forEach(initMiniCart);
})();
