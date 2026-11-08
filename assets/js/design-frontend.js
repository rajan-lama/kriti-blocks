/* Kriti Blocks: reveals .kb-anim elements once, when they scroll into view. */
(function () {
  var items = document.querySelectorAll('.kb-anim');
  if (!items.length) {
    return;
  }
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('kb-in');
    });
    return;
  }
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('kb-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  items.forEach(function (el) {
    observer.observe(el);
  });
})();
