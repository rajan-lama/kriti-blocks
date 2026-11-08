# BW Card

## Description

A card container with an optional image header and a content area for composing any inner blocks.

## Features

- Optional card image via the WordPress media library
- Content alignment (left/center/right)
- Content padding presets (none, small, medium, large)
- Border radius control and optional shadow
- Selectable HTML tag (div, article, aside)
- InnerBlocks-based content area
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `cardImageUrl` (string) — Image URL for the card header
- `cardImageId` (number) — Attachment ID of the card image
- `cardImageAlt` (string) — Alt text for the card image
- `cardAlign` (string) — `left` | `center` | `right`
- `cardPadding` (string) — `none` | `small` | `medium` | `large` (default: `medium`)
- `borderRadius` (number) — Border radius in px (default: `8`)
- `hasShadow` (boolean) — Whether to render a soft shadow
- `tagType` (string) — HTML element used for the wrapper (default: `div`)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Card block, optionally add an image, then add headings, text, and buttons inside the content area.

## Accessibility

Use meaningful alt text for the card image.

## Browser Support

All modern browsers.
