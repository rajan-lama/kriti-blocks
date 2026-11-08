/* global KeyboardEvent */
/**
 * @jest-environment jsdom
 *
 * Mini cart front end: inline toggle, dropdown and drawer behavior.
 */
function mount(classes, openByDefault = 'false') {
  document.body.innerHTML = `
    <div class="wp-block-kriti-blocks-woo-mini-cart ${classes}" data-open-by-default="${openByDefault}">
      <button class="bw-woo-mini-cart__toggle" aria-expanded="true">Cart (1)</button>
      <div class="bw-woo-mini-cart__overlay" hidden></div>
      <div class="bw-woo-mini-cart__panel">
        <button class="bw-woo-mini-cart__close">x</button>
        <a href="#x">Checkout</a>
      </div>
    </div>
    <p id="outside">outside</p>`;
  jest.isolateModules(() => {
    require('../view.js');
  });
  return document.querySelector('.wp-block-kriti-blocks-woo-mini-cart');
}

const isOpen = (root) => root.classList.contains('bw-woo-mini-cart--open');

describe('mini cart view', () => {
  it('toggles inline', () => {
    const root = mount('');
    const toggle = root.querySelector('.bw-woo-mini-cart__toggle');

    expect(root.classList.contains('bw-woo-mini-cart--enhanced')).toBe(true);
    expect(isOpen(root)).toBe(false);
    toggle.click();
    expect(isOpen(root)).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('respects open by default', () => {
    expect(isOpen(mount('', 'true'))).toBe(true);
  });

  it('drawer: overlay, close button and Escape close it and return focus', () => {
    const root = mount('bw-woo-mini-cart--drawer');
    const toggle = root.querySelector('.bw-woo-mini-cart__toggle');
    const overlay = root.querySelector('.bw-woo-mini-cart__overlay');
    const panel = root.querySelector('.bw-woo-mini-cart__panel');

    expect(panel.getAttribute('role')).toBe('dialog');
    toggle.click();
    expect(isOpen(root)).toBe(true);
    expect(overlay.hidden).toBe(false);
    expect(document.activeElement).toBe(
      root.querySelector('.bw-woo-mini-cart__close'),
    );

    overlay.click();
    expect(isOpen(root)).toBe(false);
    expect(overlay.hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);

    toggle.click();
    root.querySelector('.bw-woo-mini-cart__close').click();
    expect(isOpen(root)).toBe(false);

    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(isOpen(root)).toBe(false);
  });

  it('dropdown: closes on outside click but not inside', () => {
    const root = mount('bw-woo-mini-cart--dropdown');
    const toggle = root.querySelector('.bw-woo-mini-cart__toggle');

    toggle.click();
    expect(isOpen(root)).toBe(true);
    root.querySelector('a').click();
    expect(isOpen(root)).toBe(true);
    document.getElementById('outside').click();
    expect(isOpen(root)).toBe(false);
  });
});
