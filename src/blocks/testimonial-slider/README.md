# BW Testimonial Slider

## Description
A carousel of customer testimonials. Each slide holds a quote, optional avatar,
author name, and role, and the slider can autoplay with arrows and dots for
navigation.

## Features
- Multiple testimonials with inline editing
- Reorder or remove slides in the editor
- Optional avatar per testimonial
- Autoplay with configurable delay
- Optional navigation arrows and dots
- Decorative quote mark toggle
- Graceful fallback: without JavaScript slides stack vertically

## Attributes
- `slides` (array) — Testimonial slides (quote, author, role, avatar)
- `autoplay` (boolean) — Automatically advance slides
- `interval` (number) — Autoplay delay in milliseconds
- `showArrows` (boolean) — Show previous/next arrows
- `showDots` (boolean) — Show slide navigation dots
- `showQuoteMark` (boolean) — Show decorative quote mark
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block and fill in each testimonial. Add or reorder slides in the
editor, then configure autoplay and navigation in the inspector.

## Accessibility
The slider uses carousel and slide `aria-roledescription` values, labels each
slide with its position, and marks inactive slides as hidden. Autoplay is
disabled automatically when the user prefers reduced motion, and pauses on
hover or focus.

## Browser Support
All browsers supported by the modern WordPress block editor.
