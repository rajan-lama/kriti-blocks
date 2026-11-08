# BW Image

## Description

An image block with sizing, cropping, alignment, and caption controls.

## Features

- Media library upload/select via the WordPress media picker
- Click the image to replace it
- Width, height, and object-fit controls
- Border radius control
- Left/center/right alignment
- Caption via RichText
- Alt text control for accessibility and SEO
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `url` (string) — Image source URL
- `id` (number) — Attachment ID
- `alt` (string) — Alt text for the image
- `imageWidth` (number) — Image width in px
- `imageHeight` (number) — Image height in px
- `objectFit` (string) — `cover` | `contain` | `fill`
- `borderRadius` (number) — Border radius in px
- `imageAlign` (string) — `left` | `center` | `right`
- `caption` (string) — Caption content (HTML)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Image block, select an image from the media library, and configure sizing and alignment in the inspector.

## Accessibility

Supports alt text and uses a `<figure>`/`<figcaption>` structure. The editor click-to-replace control is keyboard accessible.

## Browser Support

All modern browsers.
