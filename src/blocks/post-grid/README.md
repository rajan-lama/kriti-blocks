# BW Post Grid

## Description
Displays a responsive grid of posts, pages, or public custom post types. The
grid is rendered on the server with `WP_Query`, so it always reflects current
content.

## Features
- Choose any public post type
- Grid or list layout
- Control the number of items and columns
- Order by date, title, modified date, menu order, or randomly
- Filter posts by category
- Toggle featured image (with size), excerpt (with length), date, author,
  categories, and a read more link
- Responsive columns: configured columns on desktop, two on tablet, one on
  mobile. List items stack the image above the text on small screens

## Attributes
- `postType` (string) — Post type slug
- `perPage` (number) — Number of items (1-24)
- `columns` (number) — Columns on desktop (1-4)
- `layout` (string) — grid | list
- `orderBy` (string) — date | title | modified | menu_order | rand
- `order` (string) — DESC | ASC
- `categoryIds` (array) — Category term IDs to include
- `showFeaturedImage` (boolean) — Show the featured image
- `imageSize` (string) — Registered image size
- `showExcerpt` (boolean) — Show the excerpt
- `excerptLength` (number) — Excerpt length in words
- `showDate` (boolean) — Show the published date
- `showAuthor` (boolean) — Show the author
- `showCategory` (boolean) — Show categories
- `readMoreText` (string) — Read more link label
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block, choose a post type, and tune the query and display options in
the inspector. The editor preview uses the same server render as the front end.

## Accessibility
The block renders semantic `article` elements with headings and links. Images
are lazy loaded and dates use the `time` element with a machine readable
`datetime` value.

## Notes
`postType`, `orderBy`, and `order` values are validated against an allow list on
the server before the query runs.

## Browser Support
All browsers supported by the modern WordPress block editor.
