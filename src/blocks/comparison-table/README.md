# BW Comparison Table

## Description

A feature-by-option matrix used to compare products, plans, or packages. Each
row lists a feature and each column marks whether an option includes it with a
check or cross marker. A highlighted column can be styled with an accent color.

## Features

- Two to four product columns with editable names and prices
- Unlimited feature rows with inline label editing
- Per-cell included/not-included toggles rendered as check or cross markers
- Optional highlighted column with "Most Popular" badge
- Configurable accent color
- Horizontal scrolling on small screens
- Accessible table semantics

## Attributes

- `featureColLabel` (string) — Label for the first column
- `products` (array) — List of product columns (name, price)
- `rows` (array) — List of feature rows (label, included)
- `highlightIndex` (number) — Index of the highlighted column, -1 for none
- `accentColor` (string) — Accent color used by the highlighted column
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage

Insert the block, then use the inspector to add columns and pick a highlighted
column. Click "Add Feature Row" and edit each feature label inline. Use the
check and cross buttons in each cell to mark whether the column includes the
feature. Editable product names and prices appear in the table header.

## Accessibility

The table uses native `table`, `th`, and `td` elements with `scope` attributes.
Check and cross icons are accompanied by visually hidden "Included" or "Not
included" text for screen readers. Icon buttons carry accessible labels.

## Browser Support

All browsers supported by the modern WordPress block editor.
