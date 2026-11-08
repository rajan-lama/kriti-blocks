# BW Back To Top

## Description
A floating button that scrolls the page back to the top. It appears after the
visitor scrolls past a configurable threshold.

## Features
- Fixed bottom-right or bottom-left positioning
- Configurable edge offset and reveal threshold
- Circle, rounded, or square button shapes
- Custom background and icon colors, plus size controls
- Optional smooth scrolling
- Editable accessible label
- Hidden without JavaScript, so no dead control remains

## Attributes
- `position` (string) — bottom-right | bottom-left
- `offset` (number) — Distance from the screen edges in pixels
- `showAfter` (number) — Scroll distance before the button appears
- `buttonSize` (number) — Button size in pixels
- `iconSize` (number) — Icon size in pixels
- `shape` (string) — circle | rounded | square
- `backgroundColor` (string) — Button background color
- `iconColor` (string) — Icon color
- `ariaLabel` (string) — Accessible button label
- `smooth` (boolean) — Use smooth scrolling
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block once and configure its position and appearance in the
inspector. It floats above the page content and appears while scrolling.

## Accessibility
The button uses a native `button` element with a configurable label, is
keyboard focusable, and respects the reduced motion preference by disabling
smooth scrolling.

## Browser Support
All browsers supported by the modern WordPress block editor.
