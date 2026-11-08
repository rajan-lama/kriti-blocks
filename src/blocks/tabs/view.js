/**
 * Front end tab switching for the BW Tabs block.
 * Enhances the server markup; without JavaScript only the first
 * panel is visible (each panel is hidden/shown with the hidden attribute).
 */
(function () {
  function initTabs(tabsEl) {
    const buttons = Array.from(tabsEl.querySelectorAll('.bw-tabs-tab'));
    const panels = Array.from(tabsEl.querySelectorAll('.bw-tabs-panel'));

    if (buttons.length === 0 || buttons.length !== panels.length) {
      return;
    }

    function activate(index) {
      buttons.forEach((button, i) => {
        const isActive = i === index;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      panels.forEach((panel, i) => {
        panel.hidden = i !== index;
      });
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', function () {
        activate(index);
      });
      button.addEventListener('keydown', function (event) {
        const current = buttons.indexOf(button);
        let next = -1;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          next = (current + 1) % buttons.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          next = (current - 1 + buttons.length) % buttons.length;
        }
        if (next !== -1) {
          event.preventDefault();
          activate(next);
          buttons[next].focus();
        }
      });
    });
  }

  document.querySelectorAll('.wp-block-kriti-blocks-tabs').forEach(initTabs);
})();
