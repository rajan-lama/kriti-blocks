# BW List

## Description
A styled list block with custom markers for feature lists, checklists, and
benefit summaries. Each item is edited inline and can use check, arrow, disc,
dash, or numbered markers.

## Features
- Inline editable list items
- Check, arrow, disc, dash, and numbered marker styles
- Configurable marker color
- Add and remove items directly in the editor
- Semantic list markup for accessibility

## Attributes
- `items` (array) — List items with text
- `markerStyle` (string) — check | arrow | disc | dash | number
- `markerColor` (string) — Marker color override
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block and type each list item. Use the buttons below the list to add
or remove items, and choose a marker style and color in the inspector.

## Accessibility
The block renders a native unordered list, so items are announced with list
semantics. Decorative markers are hidden from assistive technology.

## Browser Support
All browsers supported by the modern WordPress block editor.
