# BW Rating

## Description

A star rating display for reviews, testimonials, and product pages. Supports
full, half, and fractional fills, optional numeric value, and an editable label.

## Features

- Adjustable rating value with 0.5 steps
- One to ten stars
- Small, medium, and large size presets
- Optional numeric value display
- Editable label such as "Based on 120 reviews"
- Star and empty star color palettes

## Attributes

- `ratingValue` (number) — Current rating value
- `maxRating` (number) — Total number of stars
- `starSize` (string) — small | medium | large
- `starColor` (string) — Filled star color
- `emptyStarColor` (string) — Empty star color
- `showValue` (boolean) — Show the numeric value next to the stars
- `ratingLabel` (string) — Optional supporting label
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage

Insert the block and set the rating value in the inspector. Adjust the number of
stars, size, and colors, then optionally add a label by typing next to the stars.

## Accessibility

The rating is exposed as a single image role with an accessible label such as
"Rated 4.5 out of 5". Individual stars are decorative and hidden from assistive
technology.

## Browser Support

All browsers supported by the modern WordPress block editor.
