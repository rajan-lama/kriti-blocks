# BW Archive Header

## Description
Displays the title and description of the current archive. It covers category,
tag, custom taxonomy, author, date, post type archives, the blog posts page,
and search results.

## Features
- Works with every WordPress archive type, plus the posts page and search
- Optional archive title prefix (for example "Category:")
- Selectable heading level for the title
- Toggle the archive description
- Renders nothing when there is no title or description

## Attributes
- `showTitle` (boolean) — Show the archive title
- `headingLevel` (number) — Heading tag for the title (1-6)
- `showPrefix` (boolean) — Include the archive type prefix
- `showDescription` (boolean) — Show the archive description
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block at the top of an archive template. The editor preview shows a
sample title and description so the layout can be styled.

## Accessibility
The title is rendered as a real heading element with a selectable level so the
document outline stays valid.

## Notes
The description is term or author content and is sanitized with
`wp_kses_post()` before output. The archive prefix filter is added and removed
around the title call so it does not affect other blocks.

## Browser Support
All browsers supported by the modern WordPress block editor.
