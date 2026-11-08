# BW Post Carousel

## Description
A horizontally scrollable carousel of posts, pages, or public custom post
types. Slides are rendered on the server with `WP_Query` and enhanced on the
front end with arrows, dots, keyboard support, and optional autoplay.

## Features
- Choose any public post type
- Control the number of slides and how many are visible at once
- Order by date, title, modified date, menu order, or randomly
- Filter posts by category
- Toggle featured image (with size), excerpt (with length), date, author,
  categories, and a read more link
- Optional autoplay with a configurable interval
- Optional arrows and pagination dots
- Responsive: two slides on tablet, one on mobile
- Works without JavaScript (natively scrollable track)

## Attributes
- `postType` (string) — Post type slug
- `perPage` (number) — Number of slides (1-24)
- `columns` (number) — Slides visible at once (1-4)
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
- `autoplay` (boolean) — Advance slides automatically
- `interval` (number) — Autoplay interval in milliseconds (2000-15000)
- `showArrows` (boolean) — Show previous and next buttons
- `showDots` (boolean) — Show pagination dots
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block, choose a post type, and tune the query and display options in
the inspector. The editor preview uses the same server render as the front end;
arrows and dots appear on the front end only when JavaScript is available.

## Accessibility
The carousel is a labelled `region` with `aria-roledescription="carousel"`.
Each slide is a group labelled "X of Y". Controls are real buttons with labels,
the current dot exposes `aria-current`, and autoplay is disabled for users who
prefer reduced motion and pauses on hover or focus. Every slide remains
reachable without JavaScript through normal scrolling.

## Notes
`postType`, `orderBy`, and `order` values are validated against an allow list on
the server before the query runs.

## Browser Support
All browsers supported by the modern WordPress block editor.
