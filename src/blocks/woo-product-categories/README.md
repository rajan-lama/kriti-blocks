# BW Product Categories

## Description
Displays WooCommerce product categories, optionally with their thumbnails.
Categories are queried and rendered on the server, so counts and images always
reflect current store data.

## Requirements
- WooCommerce must be active. The block is only registered when WooCommerce is
  available.

## Features
- Grid, list, or inline layout
- Optional category thumbnail in grid and list layouts
- Optional product count
- Optional nested child categories
- Order by name, count, slug, or term ID
- Limit the number of categories
- Editor preview shows sample items when the store has no categories

## Attributes
- `layout` (string) — grid | list | inline
- `columns` (number) — Columns in the grid layout (1-6)
- `hierarchical` (boolean) — Nest child categories
- `hideEmpty` (boolean) — Hide categories without products
- `showCount` (boolean) — Show the product count
- `showThumbnail` (boolean) — Show the category thumbnail
- `orderBy` (string) — name | count | slug | term_id
- `order` (string) — ASC | DESC
- `limit` (number) — Maximum categories (0 shows all)
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block on a shop page, homepage, or any content area. Thumbnails use
the WooCommerce category image stored in the `thumbnail_id` term meta, and
categories without an image show a neutral placeholder. Inline layout omits
thumbnails so it reads as a compact list of links.

## Accessibility
Categories render as a semantic list of links with visible names, and counts
are plain text. Placeholder images are marked `aria-hidden` because they carry
no information.

## Notes
Layout, ordering, and limit values are validated before the query runs. Only
the `product_cat` taxonomy is queried, and images are output through
`wp_get_attachment_image()`.

## Browser Support
All browsers supported by the modern WordPress block editor.
