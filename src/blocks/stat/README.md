# BW Stat

## Description
A single statistic with a large number, optional prefix/suffix, and label. Combine several Stat blocks inside a Row, Grid, or Columns layout to build a statistics bar.

## Features
- Large editable number and label
- Optional prefix and suffix (currency, percent, plus signs)
- Count-up animation triggered when the stat enters the viewport
- Respects the prefers-reduced-motion setting
- Static fallback content without JavaScript
- Left, center, or right alignment

## Attributes
- `statNumber` (string) — The numeric value
- `statLabel` (string) — Short description under the number
- `statPrefix` (string) — Text before the number
- `statSuffix` (string) — Text after the number
- `statAlign` (string) — Alignment (left|center|right)
- `enableCount` (boolean) — Enables the count-up animation
- `htmlId` (string) — Optional element ID
- `extraClass` (string) — Optional extra CSS class

## Usage
Add a Stat block, type the number, then add a label and any prefix/suffix. To build a row of stats, insert multiple Stat blocks into a Grid or Columns layout.

## Accessibility
- Respects reduced-motion preferences
- Final values are present in the markup so content is readable without scripting

## Browser Support
All browsers supported by the block editor.
