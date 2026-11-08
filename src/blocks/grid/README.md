# BW Grid

## Description

A CSS grid layout container for arranging blocks in rows and columns. Use it to build responsive layouts, card grids, galleries, or any structured arrangement of blocks.

## Features

- 1-12 configurable columns
- Independent column and row gap controls
- Selectable HTML tag (div, section, article, main, etc.)
- Min-height control for consistent grid sizing
- InnerBlocks-based, so any block can be placed inside cells
- Standard layout/advanced options (background, border, shadow, position, visibility)

## Attributes

- `tagType` (string) — HTML element used for the wrapper (default: `div`)
- `gridColumns` (number) — Number of grid columns, 1-12 (default: `2`)
- `gridColumnGap` (number) — Gap between columns in px (default: `20`)
- `gridRowGap` (number) — Gap between rows in px (default: `20`)
- `minHeight` (string) — Minimum height for the grid (e.g. `300px`, `30vh`)
- `htmlId` (string) — Optional ID attribute for the wrapper
- `extraClass` (string) — Optional extra CSS class(es) for the wrapper

## Usage

Insert the BW Grid block, configure the number of columns and gaps, then place blocks into each grid cell.

## Accessibility

- Uses native semantic HTML tags as selected.
- Blocks placed inside remain keyboard accessible.

## Browser Support

Modern browsers with CSS Grid support.
