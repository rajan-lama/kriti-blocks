(function () {
  const PREFIX = 'kb_alert_';

  const hasCookie = (name) =>
    document.cookie
      .split(';')
      .some((part) => part.trim().indexOf(name + '=') === 0);

  const setCookie = (name, days) => {
    const maxAge = Math.round(days * 86400);
    document.cookie = name + '=1; max-age=' + maxAge + '; path=/; SameSite=Lax';
  };

  /**
   * Wire up one dismissible alert.
   *
   * @param {HTMLElement} alert The alert wrapper.
   */
  const initAlert = (alert) => {
    const button = alert.querySelector('.bw-alert-dismiss');
    const key = (alert.getAttribute('data-bw-remember') || '').replace(
      /[^a-z0-9_-]/g,
      '',
    );
    const days = parseInt(alert.getAttribute('data-bw-days'), 10) || 30;

    if (key && hasCookie(PREFIX + key)) {
      alert.hidden = true;
      alert.style.display = 'none';
      return;
    }

    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      alert.hidden = true;
      alert.style.display = 'none';
      if (key) {
        setCookie(PREFIX + key, days);
      }
    });
  };

  document
    .querySelectorAll('.wp-block-kriti-blocks-alert.bw-alert--dismissible')
    .forEach(initAlert);
})();
