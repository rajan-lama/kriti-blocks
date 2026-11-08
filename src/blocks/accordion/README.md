# BW Accordion

## Description
A collapsible group of accordion panels that reveal content on demand. Each panel accepts any inner blocks, making it suitable for FAQ sections, product details, and documentation.

## Features
- Ships with two accordion items
- Add, remove, or reorder panels with the appender button
- Optionally keep only one panel open at a time
- Works without JavaScript (all panels visible when scripting is off)
- Keyboard and screen-reader friendly toggle buttons
- Customizable open state per item

## Attributes
- `closeOthers` (boolean) — Closes sibling panels when one opens
- `htmlId` (string) — Optional element ID
- `extraClass` (string) — Optional extra CSS class

## Usage
Add the Accordion block, then edit each BW Accordion Item for its title and content. Select the wrapper and toggle "Only one open at a time" to control the behavior.

## Accessibility
- Each title is a button inside a heading with `aria-expanded`
- Panels use the `hidden` attribute when collapsed
- A no-script fallback keeps all content readable

## Browser Support
All browsers supported by the block editor.
