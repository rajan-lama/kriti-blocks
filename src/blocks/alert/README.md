# BW Alert

## Description

A notice box for info, success, warning, and error messages.

## Features

- Four color-coded types: info, success, warning, error
- Optional contextual icon per type
- RichText-based message content
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `content` (string) — Message content (HTML)
- `alertType` (string) — `info` | `success` | `warning` | `error` (default: `info`)
- `showIcon` (boolean) — Show the type icon (default: `true`)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Alert block, choose a type, and write your message.

## Accessibility

Icons are decorative (`aria-hidden`); the message text carries the meaning. Color is not the only indicator of state since the text conveys the message.

## Browser Support

All modern browsers.
