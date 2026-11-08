# BW Accordion Item

## Description
A single collapsible accordion panel used inside the BW Accordion block. Provides an editable title and a rich content area that accepts any inner blocks.

## Features
- Editable item title
- Rich content area powered by inner blocks
- Optional "open by default" state
- Add as many items as needed within an accordion

## Attributes
- `itemTitle` (string) — Panel title text
- `itemOpen` (boolean) — Whether the panel starts open
- `htmlId` (string) — Optional element ID
- `extraClass` (string) — Optional extra CSS class

## Usage
Edit the title directly on the canvas, then add content blocks inside the panel body.

## Accessibility
- Title renders inside a heading containing a button with `aria-expanded`
- Content is a region revealed on toggle
- The `hidden` attribute hides closed content

## Browser Support
All browsers supported by the block editor.
