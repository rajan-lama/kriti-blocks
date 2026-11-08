# BW Testimonial

## Description

A customer quote card with decorative quote mark, optional avatar, author name, and role.

## Features

- Editable quote, author name, and role (RichText)
- Optional avatar image via the WordPress media library
- Content alignment (left/center/right)
- Toggleable decorative quote mark
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `quote` (string) — Testimonial text
- `authorName` (string) — Author name
- `authorRole` (string) — Role or company
- `avatarUrl` (string) — Avatar image URL
- `avatarId` (number) — Avatar attachment ID
- `avatarAlt` (string) — Avatar alt text
- `testimonialAlign` (string) — `left` | `center` | `right`
- `showQuoteMark` (boolean) — Show decorative quote mark (default: `true`)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Testimonial block, write the quote, add an author and avatar, and align as desired.

## Accessibility

Avatar images should have meaningful alt text. Decorative quote mark is hidden from screen readers.

## Browser Support

All modern browsers.
