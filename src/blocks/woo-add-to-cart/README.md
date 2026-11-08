# BW Add To Cart

## Description
Displays an add to cart button for a WooCommerce product. Use it inside a
product query loop or a single product template where the block receives the
current product from block context.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Simple, in-stock products use WooCommerce's AJAX add to cart behavior
- Variable, external, grouped, and out of stock products link to the product
  page with WooCommerce's own button label, such as "Select options"
- Optional custom label, button and text colors, font size, and corner radius
- Optional full width button
- Editor preview shows a sample button when no product is in context

## Attributes
- `text` (string) — Custom button label (defaults to the WooCommerce label)
- `buttonColor` (string) — Button background color as a hex value
- `textColor` (string) — Button text color as a hex value
- `fontSize` (number) — Button font size in px (0 uses the block default)
- `borderRadius` (number) — Corner radius in px
- `fullWidth` (boolean) — Stretch the button to the full column width
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block inside a WooCommerce product template, a query loop that
queries products, or a single product page. The button uses WooCommerce's
standard `add_to_cart_button` and `ajax_add_to_cart` classes for simple
products, so the cart updates without a page reload when WooCommerce scripts
are present.

## Accessibility
The button is a real link with a visible label, and its label comes from
WooCommerce so it matches the rest of the store. Out of stock products use a
"Read more" label rather than a disabled control.

## Notes
Colors, sizes, and the corner radius are validated before output. Products
that are neither purchasable nor in stock render nothing on the front end.

## Browser Support
All browsers supported by the modern WordPress block editor.
