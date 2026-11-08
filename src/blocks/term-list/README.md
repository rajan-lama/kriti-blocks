# BW Term List

## Description
Displays a list of taxonomy terms: categories, tags, or any public custom
taxonomy. Terms are rendered on the server so counts and names always reflect
current content.

## Features
- Works with categories, tags, and public custom taxonomies
- Optional nested display for hierarchical taxonomies
- Toggle term counts
- Toggle empty terms
- Order by name, count, slug, or term ID
- Optional item limit
- List or inline (chip) layout

## Attributes
- `taxonomy` (string) — Taxonomy slug (default: category)
- `layout` (string) — list | inline
- `hierarchical` (boolean) — Nest child terms (hierarchical taxonomies only)
- `hideEmpty` (boolean) — Hide terms with no entries
- `showCount` (boolean) — Show the entry count
- `orderBy` (string) — name | count | slug | term_id
- `order` (string) — ASC | DESC
- `limit` (number) — Maximum number of terms (0 = all, capped at 100)
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block and choose the taxonomy to display. Select a hierarchical
taxonomy to enable the nested display option.

## Accessibility
Terms render as an unordered list with real links. Child terms use a nested
list so assistive technology can convey the hierarchy.

## Notes
The `taxonomy`, `orderBy`, and `order` values are validated against WordPress
APIs and an allow list before the query runs. Only viewable taxonomies are
rendered.

## Browser Support
All browsers supported by the modern WordPress block editor.
