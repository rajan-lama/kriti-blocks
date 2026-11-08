# BW Modal

## Description
A trigger button that opens an accessible dialog containing inner blocks. Use it
for announcements, forms, videos, or any content that should appear on demand.

## Features
- Editable trigger text and colors
- Inner blocks for arbitrary dialog content
- Center or bottom sheet positioning
- Configurable panel width, corner radius, and background
- Optional close button and backdrop closing
- Focus trap, Escape handling, and focus restoration
- Hidden trigger without JavaScript, so no dead control remains

## Attributes
- `triggerText` (string) — Button label
- `triggerBackground` (string) — Trigger background color
- `triggerColor` (string) — Trigger text color
- `panelWidth` (number) — Maximum panel width in pixels
- `position` (string) — center | bottom
- `panelBackground` (string) — Panel background color
- `panelRadius` (number) — Panel corner radius in pixels
- `showCloseButton` (boolean) — Show the close button
- `closeOnBackdrop` (boolean) — Close when the backdrop is clicked
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block, set the trigger text, then add content inside the dialog. The
content is always visible in the editor and only appears on demand on the front
end.

## Accessibility
The dialog uses `role="dialog"` with `aria-modal`, links the trigger via
`aria-controls`, traps Tab focus, closes on Escape, restores focus to the
trigger, and locks background scrolling while open.

## Browser Support
All browsers supported by the modern WordPress block editor.
