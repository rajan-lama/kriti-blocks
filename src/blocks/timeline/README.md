# BW Timeline

## Description
A vertical timeline for presenting dated milestones, history, roadmaps, or
step-by-step processes. Entries are added as Timeline Item blocks and are
arranged along a connecting line with marker dots.

## Features
- Automatically seeds three empty Timeline Item entries
- Restricts inner content to Timeline Item blocks
- Accent color control for the date labels and entry markers
- Clean vertical connector line across all entries
- Composable entries using any other blocks

## Attributes
- `timelineColor` (string) — Accent color for markers and dates
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block and add dates and content to each Timeline Item. Add more
entries with the block appender. Timeline content is built from ordinary blocks,
so headings, text, images, and buttons can be combined freely inside each entry.

## Accessibility
Content inside each entry is regular block content and is keyboard accessible.
The decorative line and markers are purely visual and do not convey information
by themselves.

## Browser Support
All browsers supported by the modern WordPress block editor.
