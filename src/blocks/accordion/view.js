(function () {
  /**
   * Toggle one accordion item and optionally close the others.
   *
   * @param {HTMLElement} accordion   The accordion wrapper element.
   * @param {HTMLElement} item        The accordion item to toggle.
   * @param {boolean}     closeOthers Whether other open items should close.
   */
  const toggleItem = (accordion, item, closeOthers) => {
    const trigger = item.querySelector('.bw-accordion-trigger');
    const panel = item.querySelector('.bw-accordion-panel');
    const isOpen = item.classList.toggle('is-open');

    if (trigger) {
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    if (panel) {
      panel.hidden = !isOpen;
    }

    if (closeOthers && isOpen) {
      accordion
        .querySelectorAll('.wp-block-kriti-blocks-accordion-item.is-open')
        .forEach((other) => {
          if (other === item) {
            return;
          }

          other.classList.remove('is-open');

          const otherPanel = other.querySelector('.bw-accordion-panel');
          const otherTrigger = other.querySelector('.bw-accordion-trigger');

          if (otherPanel) {
            otherPanel.hidden = true;
          }

          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
    }
  };

  /**
   * Wire up click handlers for a single accordion.
   *
   * @param {HTMLElement} accordion The accordion wrapper element.
   */
  const initAccordion = (accordion) => {
    const closeOthers =
      accordion.getAttribute('data-bw-accordion-close-others') !== 'false';

    accordion.querySelectorAll('.bw-accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.wp-block-kriti-blocks-accordion-item');
        if (item) {
          toggleItem(accordion, item, closeOthers);
        }
      });
    });
  };

  /**
   * Open the item whose ID matches the URL hash, so links to a question work.
   *
   * @param {HTMLElement} accordion The accordion wrapper element.
   */
  const openFromHash = (accordion) => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      return;
    }
    const target = document.getElementById(id);
    const item =
      target && target.closest('.wp-block-kriti-blocks-accordion-item');
    if (
      item &&
      accordion.contains(item) &&
      !item.classList.contains('is-open')
    ) {
      toggleItem(accordion, item, true);
      if (item.scrollIntoView) {
        item.scrollIntoView();
      }
    }
  };

  document
    .querySelectorAll('.wp-block-kriti-blocks-accordion')
    .forEach((accordion) => {
      initAccordion(accordion);
      openFromHash(accordion);
    });
})();
