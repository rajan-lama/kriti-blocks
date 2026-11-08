# BW Quote

## Description

A styled quotation with citation and alignment controls.

## Features

- RichText-based quote and attribution
- Alignment control (left/center/right)
- Size presets (small/medium/large)
- Border accent color via WordPress color palette
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `content` (string) — Quote content (HTML)
- `citation` (string) — Attribution content (HTML)
- `quoteAlign` (string) — `left` | `center` | `right`
- `quoteSize` (string) — `small` | `medium` | `large` (default: `medium`)
- `borderColor` (string) — Border accent hex color
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Quote block, type your quote and attribution, and configure styling in the inspector.

## Accessibility

Uses the semantic `<blockquote>` element with `<cite>` for the attribution.

## Browser Support

All modern browsers.
