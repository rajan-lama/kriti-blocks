# BW Team Member

## Description
A team member profile card that displays a photo, name, role, and short bio for people-focused sections such as about and team pages.

## Features
- Optional avatar photo with WordPress media library integration
- Editable member name, role, and bio
- Left, center, or right content alignment
- Round or square photo shape
- Optional drop shadow
- Semantic HTML tag selection (div, article, aside, section)
- Works inside rows, grids, and columns for team layouts

## Attributes
- `memberName` (string) — Member display name
- `memberRole` (string) — Role or title text
- `memberBio` (string) — Short biographical text
- `avatarUrl` (string) — Avatar image URL
- `avatarId` (number) — Avatar attachment ID
- `avatarAlt` (string) — Avatar alt text
- `memberAlign` (string) — Content alignment (left|center|right)
- `avatarShape` (string) — Photo shape (round|square)
- `hasShadow` (boolean) — Adds a soft drop shadow
- `tagType` (string) — Wrapper HTML tag
- `htmlId` (string) — Optional element ID
- `extraClass` (string) — Optional extra CSS class

## Usage
Add the Team Member block inside a Row or Grid, then choose a photo and fill in the name, role, and bio from the block settings.

## Accessibility
- Photo uses the provided alt text
- Headings and paragraphs keep native semantics
- All inspector controls are standard WordPress controls

## Browser Support
All browsers supported by the block editor.
