# BW Sale Badge

## Description
Displays a sale badge for a WooCommerce product. Use it inside a product query
loop or a single product template where the block receives the current product
from block context. The badge only renders when the product is on sale.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Shows a text badge such as "Sale" for discounted products
- Optionally shows the discount percentage instead of a fixed label
- Works with block context in product templates and query loops
- Custom badge and text colors, font size, and corner radius
- Editor preview shows a sample badge when no product is in context

## Attributes
- `text` (string) — Badge label (defaults to "Sale")
- `showPercentage` (boolean) — Show the discount percentage instead of the label
- `badgeColor` (string) — Badge background color as a hex value
- `textColor` (string) — Badge text color as a hex value
- `fontSize` (number) — Badge font size in px (0 uses the block default)
- `borderRadius` (number) — Corner radius in px (999 renders a pill)
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block inside a WooCommerce product template, a query loop that
queries products, or a single product page. On the front end the badge renders
nothing unless the resolved product is on sale, so it is safe to place in a
shared template.

## Accessibility
The badge is real text, not a color-only indicator, so the sale state is
communicated to assistive technology. Discount percentages use a translatable
string with the number passed as a placeholder.

## Notes
Colors, sizes, and the corner radius are validated before output. Variable
products calculate the percentage from their minimum regular and sale prices.

## Browser Support
All browsers supported by the modern WordPress block editor.
