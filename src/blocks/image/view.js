(function () {
  /**
   * Open a full-screen overlay with the linked image. Click, Escape or the
   * close button dismiss it and focus returns to the link.
   *
   * @param {HTMLAnchorElement} link The lightbox link.
   */
  const open = (link) => {
    const overlay = document.createElement('div');
    overlay.className = 'bw-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.tabIndex = -1;

    const img = document.createElement('img');
    img.src = link.href;
    const thumb = link.querySelector('img');
    img.alt = thumb ? thumb.alt : '';
    overlay.appendChild(img);

    const close = () => {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      link.focus();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    overlay.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    overlay.focus();
  };

  document.addEventListener('click', (event) => {
    const link =
      event.target.closest && event.target.closest('a[data-bw-lightbox]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    open(link);
  });
})();
