# BW Mini Cart

## Description
Displays a collapsible WooCommerce mini cart with the current cart contents,
subtotal, and cart/checkout links. Intended for headers and sidebars.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Renders WooCommerce's standard mini cart template so item rows, subtotal, and
  buttons match the store's theme
- Uses the `widget_shopping_cart_content` class, so WooCommerce cart fragments
  refresh the contents in place after AJAX cart updates
- Optional toggle button with item count and optional open-by-default state
- Panel stays visible when JavaScript is unavailable
- Renders nothing when WooCommerce is unavailable

## Attributes
- `title` (string) — Optional heading above the cart
- `toggleText` (string) — Label for the toggle button
- `showToggle` (boolean) — Show the toggle button (otherwise always visible)
- `showCount` (boolean) — Append the current item count to the toggle label
- `openByDefault` (boolean) — Start with the panel expanded
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Place the block in a header template or sidebar. On the front end the block
renders `woocommerce_mini_cart()`, which outputs WooCommerce's
`cart/mini-cart.php` template. In the editor a sample cart is shown so the
layout is visible without a live session.

## Accessibility
The toggle is a real button with `aria-expanded` and `aria-controls`. The panel
is visible by default in the markup so the cart remains reachable without
JavaScript, and JavaScript only collapses it when it is enabled.

## Notes
Cart contents are intentionally not rendered in the block editor because the
REST preview request has no customer session; a static sample is displayed
instead. The front end relies on WooCommerce's cart fragments script to keep
the contents in sync.

## Browser Support
All browsers supported by the modern WordPress block editor.
