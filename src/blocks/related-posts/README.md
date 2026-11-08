# BW Related Posts

## Description
Displays a responsive grid of entries related to the current post, page, or
custom post type entry. Related entries are found through shared taxonomy
terms and rendered on the server with `WP_Query`.

## Features
- Automatically matches the current entry's post type and taxonomy terms
- Supports posts, pages, and public custom post types
- Control the number of items and columns
- Order by date, title, modified date, or randomly
- Toggle featured image (with size), excerpt (with length), date, and a read
  more link
- Falls back to the latest entries when no shared terms exist
- Responsive columns: configured columns on desktop, two on tablet, one on
  mobile

## Attributes
- `perPage` (number) — Number of items (1-12)
- `columns` (number) — Columns on desktop (1-4)
- `orderBy` (string) — date | title | modified | rand
- `order` (string) — DESC | ASC
- `showFeaturedImage` (boolean) — Show the featured image
- `imageSize` (string) — Registered image size
- `showExcerpt` (boolean) — Show the excerpt
- `excerptLength` (number) — Excerpt length in words
- `showDate` (boolean) — Show the published date
- `readMoreText` (string) — Read more link label
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block into a post, page, or single template. The current entry is
resolved from block context on the front end; the editor preview passes the
post being edited.

## Accessibility
The block renders semantic `article` elements with headings and links. Images
are lazy loaded and dates use the `time` element with a machine readable
`datetime` value.

## Notes
The `orderBy` and `order` values are validated against an allow list on the
server before the query runs. Only published entries of a public post type are
returned.

## Browser Support
All browsers supported by the modern WordPress block editor.
