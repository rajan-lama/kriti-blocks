# BW Text

## Description

Paragraph text with full typography controls.

## Features

- Selectable HTML tag (p, div, span)
- Font size, weight, transform, alignment, letter spacing, and line height controls
- Drop cap option
- Custom color via WordPress color palette
- RichText-based editing with undo/redo support
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `content` (string) — Text content (HTML)
- `tagType` (string) — `p` | `div` | `span` (default: `p`)
- `contentColor` (string) — CSS color for the text
- `fontSize` (number) — Font size in px
- `fontWeight` (string) — CSS font weight
- `textAlign` (string) — `left` | `center` | `right`
- `textTransform` (string) — `uppercase` | `lowercase` | `capitalize`
- `letterSpacing` (string) — e.g. `0.5px`, `-0.02em`
- `lineHeight` (string) — e.g. `1.5`, `1.2em`
- `dropCap` (boolean) — Render the first letter as a drop cap
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Text block, type your content, and configure typography in the inspector.

## Accessibility

Uses semantic HTML elements for the selected tag type. Drop cap styling is decorative.

## Browser Support

All modern browsers.
