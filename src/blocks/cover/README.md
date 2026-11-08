# BW Cover

## Description

A full-bleed background image section with overlay and content. Use it for heroes, banners, and featured sections.

## Features

- Media library background image via the WordPress media picker
- Overlay color and opacity controls
- Adjustable minimum height
- Background position presets
- Content alignment (left/center/right)
- InnerBlocks-based, so any blocks can be placed on top of the background
- Selectable HTML tag (div, section, article, etc.)
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `backgroundUrl` (string) — Background image URL
- `backgroundId` (number) — Attachment ID
- `overlayColor` (string) — Overlay hex color
- `overlayOpacity` (number) — Overlay opacity percentage 0-100 (default: `50`)
- `minHeight` (number) — Minimum height in px (default: `400`)
- `backgroundSize` (string) — Background size (default: `cover`)
- `backgroundPosition` (string) — Background position (default: `center`)
- `contentAlign` (string) — `left` | `center` | `right` (default: `center`)
- `tagType` (string) — HTML element used for the wrapper (default: `div`)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Cover block, select a background image, configure the overlay and height, then add content blocks inside.

## Accessibility

Ensure content placed on the background has sufficient contrast against the overlay. Text inside the cover remains keyboard accessible.

## Browser Support

All modern browsers.
