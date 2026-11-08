# BW Heading

## Description

A heading block with full typography controls for titles and section headings.

## Features

- Level selector (h1-h6)
- Font size, weight, transform, alignment, letter spacing, and line height controls
- Custom color via WordPress color palette
- RichText-based editing with undo/redo support
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `content` (string) — Heading text content (HTML)
- `tagType` (string) — `h1` - `h6` (default: `h2`)
- `headingColor` (string) — CSS color for the heading
- `fontSize` (number) — Font size in px
- `fontWeight` (string) — CSS font weight
- `textAlign` (string) — `left` | `center` | `right`
- `textTransform` (string) — `uppercase` | `lowercase` | `capitalize`
- `letterSpacing` (string) — e.g. `0.5px`, `-0.02em`
- `lineHeight` (string) — e.g. `1.5`, `1.2em`
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Heading block, type your title, and configure typography in the inspector.

## Accessibility

Uses native heading elements (h1-h6) to preserve document outline and keyboard navigation.

## Browser Support

All modern browsers.
