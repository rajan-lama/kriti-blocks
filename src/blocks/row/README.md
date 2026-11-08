# BW Row

## Description

A flexible flexbox layout container that arranges its child blocks horizontally in a row. Use it to place columns, cards, groups, or any other blocks side by side with full control over spacing and alignment.

A **Stack** variation is also available from the inserter. It behaves like the Row but stacks its children vertically (column direction) with consistent spacing.

## Features

- Flexbox layout with direction, wrap, justification, and alignment controls.
- Uniform gap between items.
- Configurable minimum height.
- HTML tag selection (div, section, article, aside, main, header, footer, figure, nav).
- Shared Kriti Blocks styling options: background, border, box shadow, position, z-index, spacing, device visibility, user visibility, and animations.

## Attributes

- `tagType` (string) - HTML element used to render the row (default: `div`).
- `gap` (number) - Gap in pixels between items (default: `20`).
- `minHeight` (string) - Minimum height, e.g. `300px` or `30vh` (default: `""`).
- `htmlId` (string) - Custom HTML id for the row wrapper.
- `extraClass` (string) - Additional CSS class names for the row wrapper.

Shared layout attributes (from `layoutOptionsAttributes`):

- `displayType` (string) - CSS display value.
- `rowDirection` (string) - Flex direction (row, row-reverse, column, ...).
- `flexWrap` (string) - Flex wrap behavior.
- `justifyContent` (string) - Horizontal alignment of items.
- `alignItem` (string) - Vertical alignment of items.
- `positionType` (string) - CSS position.
- `zindex` (string) - CSS z-index.

## Usage

1. Add the "BW Row" block from the Kriti Blocks category.
2. Insert any blocks inside it (groups, cards, headings, ...).
3. Use the General tab to set the gap, min-height, and HTML tag.
4. Use the Layout tab to change display type, direction, wrap, justify, and align.

## Accessibility

The block renders a native HTML element chosen by the user (default `div`). When a semantic tag such as `nav`, `header`, or `footer` is selected, the block keeps the correct landmark semantics. All editor controls are native WordPress components.

## Browser Support

Modern browsers with flexbox support.
