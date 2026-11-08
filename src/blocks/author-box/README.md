# BW Author Box

## Description
Displays the author of the current entry with an avatar, display name,
biography, and a link to the author archive. The box is rendered on the server
so it always reflects current user data.

## Features
- Defaults to the author of the current entry
- Optionally pin a specific author
- Horizontal or stacked layout
- Toggle the avatar (with a selectable size up to 256px)
- Toggle the biography
- Toggle the author archive link and customize its label
- Configurable heading level (2-6)

## Attributes
- `authorId` (number) — Specific user ID (0 = current entry author)
- `layout` (string) — horizontal | stacked
- `headingLevel` (number) — Heading tag for the display name (2-6)
- `showAvatar` (boolean) — Show the avatar
- `avatarSize` (number) — Avatar size in pixels (24-256)
- `showBio` (boolean) — Show the author biography
- `showArchiveLink` (boolean) — Show the author archive link
- `archiveLinkText` (string) — Archive link label
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block on a post, page, or single template. By default it follows the
entry being viewed; pick a specific author to always show the same profile.

## Accessibility
The display name is rendered as a real heading element with a selectable level.
The avatar uses the author display name as alternative text.

## Notes
Only the public author profile fields are rendered. The biography and display
name are escaped on output.

## Browser Support
All browsers supported by the modern WordPress block editor.
