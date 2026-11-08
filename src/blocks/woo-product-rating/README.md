# BW Product Rating

## Description
Displays the customer rating for a WooCommerce product. Use it inside a
product query loop or a single product template where the block receives the
current product from block context. Ratings are read on the server, so they
always reflect current review data.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Star rating rendered with WooCommerce's own accessible star markup
- Optional review count linked to the product reviews section
- Works with block context in product templates and query loops
- Optional text alignment, font size, and text color
- Editor preview shows a sample rating when no product is in context

## Attributes
- `showStars` (boolean) — Show the star rating
- `showCount` (boolean) — Show the linked review count
- `textAlign` (string) — left | center | right
- `fontSize` (number) — Font size in px (0 inherits the theme)
- `textColor` (string) — Text color as a hex value
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block inside a WooCommerce product template, a query loop that
queries products, or a single product page. The block renders nothing on the
front end when the product has no rating yet, so it is safe to place in a
shared template.

## Accessibility
The stars are output through `wc_get_rating_html()`, which renders an
accessible rating label such as "Rated 4.5 out of 5 based on 12 customer
ratings". The review count is a real link with descriptive text.

## Notes
The rating and review count come from `WC_Product::get_average_rating()` and
`WC_Product::get_review_count()`. The count string is translatable and uses
singular and plural forms.

## Browser Support
All browsers supported by the modern WordPress block editor.
