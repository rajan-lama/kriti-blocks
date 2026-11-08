# BW FAQ

## Description

A list of questions and answers rendered as accessible accordion items using native HTML `<details>`/`<summary>`.

## Features

- Add, edit, and remove FAQ items
- Question and answer fields per item
- Option to open the first item by default
- No JavaScript required on the front end (native details/summary)
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `faqItems` (array) — List of `{ question, answer }` objects
- `firstOpen` (boolean) — Expand the first item on page load (default: `false`)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW FAQ block, add items with questions and answers, and optionally expand the first item by default.

## Accessibility

FAQ uses native `<details>`/`<summary>` elements, which are keyboard accessible and announced by screen readers.

## Browser Support

All modern browsers.
