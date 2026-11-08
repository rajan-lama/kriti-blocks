# BW Feature

## Description
A compact feature tile with an icon, title, description, and optional link.
Useful in feature grids, service lists, and benefit sections.

## Features
- Icon chosen from a small built-in set
- Configurable icon color, background, size, position, and shape
- Inline editable title, description, and link text
- Optional link with new tab support
- Content alignment controls

## Attributes
- `icon` (string) — Built-in icon name
- `showIcon` (boolean) — Show or hide the icon
- `iconColor` (string) — Icon color
- `iconBackground` (string) — Icon badge background color
- `iconSize` (number) — Icon size in pixels
- `iconPosition` (string) — top | left
- `iconShape` (string) — rounded | circle | square | none
- `contentAlign` (string) — left | center | right
- `title` (string) — Feature title
- `description` (string) — Feature description
- `linkText` (string) — Link label
- `linkUrl` (string) — Link URL
- `linkNewTab` (boolean) — Open the link in a new tab
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block, choose an icon, then fill in the title, description, and
optional link. Adjust icon styling and content alignment in the inspector.

## Accessibility
The decorative icon is hidden from assistive technology, and the link uses
native anchor semantics.

## Browser Support
All browsers supported by the modern WordPress block editor.
