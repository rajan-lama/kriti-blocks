# BW Product Price

## Description
Displays the price of a WooCommerce product. Use it inside a product query
loop or a single product template where the block receives the current product
from block context. Prices are resolved and formatted on the server, so sale
prices and currency settings always reflect current data.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Renders the full WooCommerce price, including sale and variable price ranges
- Works with block context in product templates and query loops
- Optional text alignment, font size, and price color
- Editor preview shows a sample price when no product is in context

## Attributes
- `textAlign` (string) — left | center | right
- `fontSize` (number) — Price font size in px (0 inherits the theme)
- `priceColor` (string) — Price color as a hex value
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block inside a WooCommerce product template, a query loop that
queries products, or a single product page. The block uses
`WC_Product::get_price_html()` so sale pricing, currency position, and price
ranges match the rest of the store.

## Accessibility
The price uses WooCommerce's own markup, which includes screen reader text for
sale prices such as "Original price was" and "Current price is". Color is never
the only indicator of a discount because the original price is struck through.

## Notes
Sizes and colors are validated before output, and the price HTML is escaped
through `wp_kses_post()`. The block renders nothing on the front end when no
product can be resolved, and shows a sample price only in the editor preview.

## Browser Support
All browsers supported by the modern WordPress block editor.
