# BW Off-canvas Drawer

## Description
A side drawer that slides in from the left or right edge of the screen. Use it
for navigation menus, filters, or any content that should appear on demand.

## Features
- Slide in from the left or right
- Editable trigger text and colors
- Inner blocks for arbitrary drawer content
- Configurable drawer width and background
- Optional close button and backdrop closing
- Focus trap, Escape handling, and focus restoration
- Hidden trigger without JavaScript, so no dead control remains

## Attributes
- `triggerText` (string) — Button label
- `triggerBackground` (string) — Trigger background color
- `triggerColor` (string) — Trigger text color
- `side` (string) — right | left
- `drawerWidth` (number) — Maximum drawer width in pixels
- `drawerBackground` (string) — Drawer background color
- `showCloseButton` (boolean) — Show the close button
- `closeOnBackdrop` (boolean) — Close when the backdrop is clicked
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block, set the trigger text, then add content inside the drawer. The
content is always visible in the editor and only appears on demand on the front
end.

## Accessibility
The drawer uses `role="dialog"` with `aria-modal`, links the trigger via
`aria-controls`, traps Tab focus, closes on Escape, restores focus to the
trigger, and locks background scrolling while open. The slide animation is
disabled when the visitor prefers reduced motion.

## Browser Support
All browsers supported by the modern WordPress block editor.
