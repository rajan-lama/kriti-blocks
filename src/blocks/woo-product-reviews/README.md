# BW Product Reviews

## Description
Displays the customer reviews for a WooCommerce product. Use it inside a
product query loop or a single product template where the block receives the
current product from block context.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- List of approved reviews with author, rating, date, and content
- Optional star rating, avatar, date, and verified owner label
- Optional heading with the total review count
- Newest or oldest reviews first
- Limit the number of reviews shown
- Editor preview shows sample reviews when no product is in context

## Attributes
- `perPage` (number) — Number of reviews (0 shows all, maximum 50)
- `order` (string) — DESC (newest first) | ASC (oldest first)
- `headingLevel` (number) — Heading level for the review count (2-6)
- `showTitle` (boolean) — Show the review count heading
- `showRating` (boolean) — Show each review's star rating
- `showAvatar` (boolean) — Show each reviewer's avatar
- `showDate` (boolean) — Show each review's date
- `showVerified` (boolean) — Show the verified owner label
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block inside a WooCommerce product template, a query loop that
queries products, or a single product page. Only approved reviews are queried,
and an empty state message is shown when the product has no reviews yet.

## Accessibility
Reviews render as a semantic ordered list with a heading, and dates use the
`<time>` element with a machine readable value. Avatars include alt text from
WordPress, and placeholder avatars are marked `aria-hidden`.

## Notes
Reviews are fetched with `get_comments()` for the resolved product, falling
back to standard comments for older WooCommerce versions that did not use the
review comment type. Star ratings come from the `rating` comment meta, and
review content is escaped through `wp_kses_post()`.

## Browser Support
All browsers supported by the modern WordPress block editor.
