# BW Video

## Description

A video player block with playback controls and alignment options.

## Features

- Media library upload/select via the WordPress media picker
- Width (10-100%) and alignment controls
- Playback options: controls, autoplay, loop, muted, and preload
- Caption via RichText
- Standard layout/advanced options (spacing, position, visibility)

## Attributes

- `url` (string) — Video source URL
- `id` (number) — Attachment ID
- `videoWidth` (number) — Video width as a percentage (default: `100`)
- `videoAlign` (string) — `left` | `center` | `right`
- `controls` (boolean) — Show native playback controls (default: `true`)
- `autoplay` (boolean) — Start playback automatically
- `loop` (boolean) — Loop playback
- `muted` (boolean) — Mute audio
- `preload` (string) — `metadata` | `auto` | `none` (default: `metadata`)
- `caption` (string) — Caption content (HTML)
- `htmlId` (string) — Optional ID attribute
- `extraClass` (string) — Optional extra CSS class(es)

## Usage

Insert the BW Video block, select a video from the media library, and configure playback and alignment in the inspector.

## Accessibility

Uses the native HTML5 `<video>` element with configurable controls. Provide a caption to convey context for users who cannot view the video.

## Browser Support

All modern browsers with HTML5 video support.
