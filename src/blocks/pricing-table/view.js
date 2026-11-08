/**
 * Front end behavior for the pricing table billing toggle.
 * Swaps each column's price and period for its yearly values. Columns without
 * a yearly price are left alone.
 */
(function () {
  function setPeriod(table, period) {
    table.querySelectorAll('.bw-pricing-amount').forEach(function (amount) {
      const price = amount.querySelector('.bw-pricing-price');
      const per = amount.querySelector('.bw-pricing-period');
      const yearlyPrice = amount.dataset.yearlyPrice;
      const yearlyPeriod = amount.dataset.yearlyPeriod;
      if (price && yearlyPrice) {
        if (price.dataset.monthly === undefined) {
          price.dataset.monthly = price.textContent;
        }
        price.textContent =
          period === 'yearly' ? yearlyPrice : price.dataset.monthly;
      }
      if (per && yearlyPeriod) {
        if (per.dataset.monthly === undefined) {
          per.dataset.monthly = per.textContent;
        }
        per.textContent =
          period === 'yearly' ? yearlyPeriod : per.dataset.monthly;
      }
    });
    table.querySelectorAll('.kb-pt__toggle-btn').forEach(function (btn) {
      btn.setAttribute(
        'aria-pressed',
        btn.dataset.period === period ? 'true' : 'false',
      );
    });
  }

  function init(table) {
    const toggle = table.querySelector('.kb-pt__toggle');
    if (!toggle) {
      return;
    }
    toggle.addEventListener('click', function (event) {
      const btn = event.target.closest('.kb-pt__toggle-btn');
      if (btn) {
        setPeriod(table, btn.dataset.period);
      }
    });
    setPeriod(
      table,
      toggle.dataset.yearlyDefault === 'true' ? 'yearly' : 'monthly',
    );
  }

  function ready() {
    document.querySelectorAll('.kb-pt--toggle').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
