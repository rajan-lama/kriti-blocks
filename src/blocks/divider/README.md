# BW Divider

## Description

A horizontal divider to visually separate content sections. Fully customizable style, color, thickness, width, and alignment.

## Features

- Solid, dashed, dotted, double, and gradient styles
- Custom color via WordPress color palette
- Adjustable thickness (1-20px)
- Adjustable width (10-100%) and alignment (left/center/right)
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `dividerStyle` (string) — `solid` | `dashed` | `dotted` | `double` | `gradient` (default: `solid`)
- `dividerColor` (string) — CSS color for the line (default: `#d1d5db`)
- `dividerWeight` (number) — Thickness in px (default: `2`)
- `dividerWidth` (number) — Width as a percentage (default: `100`)
- `dividerAlign` (string) — `left` | `center` | `right` (default: `center`)
- `htmlId` (string) — Optional ID attribute for the wrapper
- `extraClass` (string) — Optional extra CSS class(es) for the wrapper

## Usage

Insert the BW Divider block between content sections and configure its appearance in the inspector.

## Accessibility

Uses the semantic `<hr>` element to represent a thematic break in content.

## Browser Support

All modern browsers.
