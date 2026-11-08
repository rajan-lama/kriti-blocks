# BW Pagination

## Description
Displays pagination links for the current archive or query loop. Links are
generated on the server from the active query, so they always match the
surrounding content.

## Features
- Previous and next links with customizable labels
- Numbered page links with adjustable mid and end size
- Hide numbers for a simple previous/next control
- Left, center, or right alignment
- Renders nothing when there is a single page

## Attributes
- `showPrevNext` (boolean) — Show previous and next links
- `prevText` (string) — Previous link label
- `nextText` (string) — Next link label
- `showNumbers` (boolean) — Show numbered page links
- `midSize` (number) — Number of links next to the current page (0-3)
- `endSize` (number) — Number of links at each end (0-3)
- `justify` (string) — left | center | right
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block below an archive template or query loop. The editor preview
shows a sample pagination so the design can be styled before the page has
enough entries to paginate.

## Accessibility
The block renders a `nav` element with an `aria-label`. Previous and next links
include `rel="prev"` and `rel="next"`, and the current page is marked by
WordPress with `aria-current="page"`.

## Notes
Previous and next links are omitted on the first and last page respectively.
The block returns early when the surrounding query has a single page.

## Browser Support
All browsers supported by the modern WordPress block editor.
