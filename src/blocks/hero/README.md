# BW Hero

## Description
A prominent page banner designed for landing pages and site headers. The hero
renders a full-width background image with an optional color overlay and
centers a block-editable content area where headings, text, and buttons can be
added.

## Features
- Background image picker with replace/remove support
- Overlay color presets plus custom color palette
- Overlay opacity control
- Height presets: short, medium, tall, and full viewport
- Content width presets: narrow or wide
- Content alignment: left, center, or right
- Block content area for composing headings, text, and buttons

## Attributes
- `backgroundUrl` (string) — Background image URL
- `backgroundId` (number) — Background image attachment ID
- `overlayColor` (string) — Overlay color hex value
- `overlayOpacity` (number) — Overlay opacity percentage 0-100
- `heroHeight` (string) — short | medium | tall | full
- `contentWidth` (string) — narrow | wide
- `contentAlign` (string) — left | center | right
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block and choose a background image from the Block tab. Adjust the
overlay, height, width, and alignment to suit the section, then add blocks such
as heading, text, and buttons inside the content area.

## Accessibility
The background image is decorative and does not require an alt description.
Content placed inside the hero must provide its own accessible text and
contrast against the overlay.

## Browser Support
All browsers supported by the modern WordPress block editor.
