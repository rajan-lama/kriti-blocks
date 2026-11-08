# BW Product Carousel

## Description
A horizontally scrollable carousel of WooCommerce products. Products are
queried and rendered on the server, and the front end adds arrows, dots,
keyboard support, and optional autoplay.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Control the number of products and how many are visible at once
- Order by date, title, price, popularity, rating, menu order, or randomly
- Filter by product category
- Show only featured products
- Show only products on sale
- Toggle image, category, rating, price, and add to cart
- Sale badge for discounted products
- Optional autoplay with a configurable interval
- Optional arrows and pagination dots
- Responsive: two slides on tablet, one on mobile
- Works without JavaScript (natively scrollable track)

## Attributes
- `perPage` (number) — Number of slides (1-24)
- `columns` (number) — Slides visible at once (1-4)
- `orderBy` (string) — date | title | modified | menu_order | price |
  popularity | rating | rand
- `order` (string) — DESC | ASC
- `categoryIds` (array) — Product category term IDs to include
- `featuredOnly` (boolean) — Only featured products
- `onSaleOnly` (boolean) — Only products on sale
- `showImage` (boolean) — Show the product image
- `showCategory` (boolean) — Show product categories
- `showRating` (boolean) — Show the customer rating
- `showPrice` (boolean) — Show the price
- `showAddToCart` (boolean) — Show the add to cart link
- `autoplay` (boolean) — Advance slides automatically
- `interval` (number) — Autoplay interval in milliseconds (2000-15000)
- `showArrows` (boolean) — Show previous and next buttons
- `showDots` (boolean) — Show pagination dots
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block into any page or template on a WooCommerce store. The editor
preview uses the same server render as the front end; arrows and dots appear on
the front end only when JavaScript is available.

## Accessibility
The carousel is a labelled `region` with `aria-roledescription="carousel"`.
Each slide is a group labelled "X of Y". Controls are real buttons with labels,
the current dot exposes `aria-current`, and autoplay is disabled for visitors
who prefer reduced motion and pauses on hover or focus. Every slide remains
reachable without JavaScript.

## Notes
Prices, ratings, and category lists are output through
`wp_kses_post()`. Only published products are queried, and `orderBy`, `order`,
and category values are validated before the query runs.

## Browser Support
All browsers supported by the modern WordPress block editor.
