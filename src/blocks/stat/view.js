(function () {
  const DEFAULT_DURATION = 1400;
  const SEPARATORS = { comma: ',', space: ' ', dot: '.', none: '' };

  /**
   * Format a number for display during the count-up animation.
   *
   * @param {number}  value    Current animated value.
   * @param {number}  decimals Decimal places to keep.
   * @param {boolean} grouped  Whether to use thousands grouping.
   * @param {string}  groupSep Grouping character.
   * @param {string}  decSep   Decimal character.
   * @return {string} Formatted number string.
   */
  const formatValue = (value, decimals, grouped, groupSep, decSep) => {
    const sign = value < 0 ? '-' : '';
    const parts = Math.abs(value).toFixed(decimals).split('.');
    const whole = grouped
      ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupSep)
      : parts[0];

    return sign + whole + (parts[1] ? decSep + parts[1] : '');
  };

  const EASINGS = {
    // Default ease-out curve.
    out: (progress) => 1 - Math.pow(1 - progress, 3),
    linear: (progress) => progress,
    inout: (progress) =>
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2,
  };

  /**
   * Read a numeric data attribute.
   *
   * @param {HTMLElement} el   Element carrying the attribute.
   * @param {string}      name Attribute name.
   * @return {number|undefined} The number, or undefined when missing.
   */
  const readNumber = (el, name) => {
    const value = parseFloat(el.getAttribute(name));
    return Number.isNaN(value) ? undefined : value;
  };

  /**
   * Animate a stat number from its start value to its target value.
   *
   * @param {HTMLElement} numElement Element containing the target number.
   * @param {HTMLElement} stat       The stat wrapper element.
   */
  const runCountUp = (numElement, stat) => {
    const raw = numElement.textContent || '';
    const target = parseFloat(raw.replace(/[^0-9.\-]/g, ''));

    if (Number.isNaN(target)) {
      return;
    }

    const parts = raw.trim().split('.');
    const authoredDecimals = parts.length > 1 ? parts[1].length : 0;
    const decimalsAttr = readNumber(stat, 'data-bw-decimals');
    const decimals =
      decimalsAttr !== undefined
        ? Math.min(Math.max(Math.round(decimalsAttr), 0), 6)
        : authoredDecimals;
    const separator = stat.getAttribute('data-bw-sep');
    const hasSeparator = Object.prototype.hasOwnProperty.call(
      SEPARATORS,
      separator,
    );
    const grouped = hasSeparator
      ? separator !== 'none'
      : raw.indexOf(',') !== -1 && decimals === 0;
    const groupSep =
      hasSeparator && separator !== 'none' ? SEPARATORS[separator] : ',';
    const decSep = separator === 'dot' ? ',' : '.';
    const start = readNumber(stat, 'data-bw-start') || 0;
    const duration = Math.min(
      Math.max(readNumber(stat, 'data-bw-duration') || DEFAULT_DURATION, 100),
      20000,
    );
    const easeKey = stat.getAttribute('data-bw-ease');
    const ease = EASINGS[easeKey] || EASINGS.out;
    const reducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      numElement.textContent = raw;
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = start + (target - start) * ease(progress);

      numElement.textContent = formatValue(
        current,
        decimals,
        grouped,
        groupSep,
        decSep,
      );

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  /**
   * Set up the count-up animation for a single stat block.
   *
   * @param {HTMLElement} stat The stat wrapper element.
   */
  const initStat = (stat) => {
    if (stat.getAttribute('data-bw-count') === 'false') {
      return;
    }

    const numElement = stat.querySelector('.bw-stat-num');

    if (!numElement) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      runCountUp(numElement, stat);
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp(numElement, stat);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(stat);
  };

  document.querySelectorAll('.wp-block-kriti-blocks-stat').forEach(initStat);
})();
