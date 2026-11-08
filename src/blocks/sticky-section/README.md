# BW Sticky Section

## Description
A container that sticks to the top of the viewport while the visitor scrolls,
commonly used for persistent headers, alerts, or calls to action. Any blocks can
be placed inside.

## Features
- Sticks to the top of the viewport with a configurable offset
- Adjustable z-index for stacking control
- Optional shadow once the section becomes stuck
- Inner blocks for arbitrary content

## Attributes
- `stickyOffset` (number) — Distance from the top of the viewport in pixels
- `zIndex` (number) — Stacking order while stuck
- `showShadow` (boolean) — Add a shadow once stuck
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block and add the content that should remain visible while scrolling.
Set the top offset to clear a fixed site header if needed.

## Accessibility
Sticky behavior is a visual enhancement. The content remains in normal document
order and is fully readable and focusable, and it stops sticking when the
reduced-motion preference is not relevant because no motion is introduced.

## Notes
Sticky positioning only works when no ancestor element has an `overflow` value
of `hidden`, `scroll`, or `auto`.

## Browser Support
All browsers supported by the modern WordPress block editor.
