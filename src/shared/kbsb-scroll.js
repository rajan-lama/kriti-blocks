/**
 * Scroll-down button for the Cover and Hero blocks: scrolls to the block that
 * follows the cover (or to the cover itself when it is the last block).
 */
document.addEventListener('click', (event) => {
  const button =
    event.target.closest && event.target.closest('[data-kb-scroll]');
  if (!button) {
    return;
  }
  const block = button.closest(
    '.wp-block-kriti-blocks-cover, .wp-block-kriti-blocks-hero',
  );
  if (!block) {
    return;
  }
  const target = block.nextElementSibling || block;
  const reduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  });
});
