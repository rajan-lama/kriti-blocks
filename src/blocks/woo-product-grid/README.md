# BW Product Grid

## Description

A responsive grid or list of WooCommerce products. Products are queried and
rendered on the server, so prices, stock state, and sale badges always reflect
current data.

## Requirements

- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features

- Grid or list layout
- Control the number of products and columns
- Order by date, title, price, popularity, rating, menu order, or randomly
- Filter by product category
- Show only featured products
- Show only products on sale
- Toggle image, category, rating, price, and add to cart
- Sale badge for discounted products
- Responsive: configured columns on desktop, two on tablet, one on mobile

## Attributes

- `perPage` (number) — Number of products (1-24)
- `columns` (number) — Columns on desktop (1-4)
- `layout` (string) — grid | list
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
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage

Insert the block into any page or template on a WooCommerce store. Add to cart
uses WooCommerce's standard AJAX classes for simple products, so the cart
updates without a page reload when WooCommerce scripts are present.

## Accessibility

Products render as a semantic list with heading links. The sale badge is text,
not a color-only indicator, and the add to cart control is a real link with the
product name available through its label.

## Notes

Prices, ratings, and category lists are output through
`wp_kses_post()`. Only published products are queried, and `postType`,
`orderBy`, `order`, and category values are validated before the query runs.

## Browser Support

All browsers supported by the modern WordPress block editor.
