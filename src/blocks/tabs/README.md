# BW Tabs

## Description

A switchable tabbed content component. Add tabs, name them, and fill each panel with content.

## Features

- Add, remove, and edit tabs directly in the editor
- Tab labels and panel content are RichText editable
- Arrow key navigation between tabs on the front end
- No-JavaScript fallback (all panels shown stacked when scripts are disabled)
- Uses `viewScript` for a tiny, scoped front end script
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `tabItems` (array) — List of `{ label, content }` objects
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Tabs block, add tabs with the + button, then edit each label and panel content.

## Accessibility

Tabs expose `role="tablist"`, `role="tab"`, and `role="tabpanel"`, with `aria-selected` states and arrow-key navigation. Native buttons are used for the tab controls.

## Browser Support

All modern browsers.
