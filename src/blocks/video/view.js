(function () {
  // Only these player URLs may be loaded by the click-to-play preview.
  const ALLOWED =
    /^https:\/\/(www\.youtube(-nocookie)?\.com\/embed\/[A-Za-z0-9_-]{11}|player\.vimeo\.com\/video\/\d{1,12})([?#]|$)/;

  document.addEventListener('click', (event) => {
    const button =
      event.target.closest && event.target.closest('.bw-video-facade');
    if (!button) {
      return;
    }
    const src = button.getAttribute('data-bw-embed') || '';
    if (!ALLOWED.test(src)) {
      return;
    }
    const frame = document.createElement('iframe');
    frame.className = 'bw-video-frame';
    frame.src = src;
    frame.title = 'Embedded video';
    frame.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(frame);
    frame.focus();
  });
})();
