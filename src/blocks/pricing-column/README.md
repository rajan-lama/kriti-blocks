# BW Pricing Column

## Description

A single pricing plan column used inside the BW Pricing Table block. Displays a plan name, price, feature list, and optional call-to-action button.

## Features

- Editable plan name, price, and period
- Feature list entered one item per line in settings
- Button text and URL
- Optional "Featured" highlight state with badge
- Left, center, or right content alignment
- Selectable HTML tag (div, article, aside, section)

## Attributes

- `planName` (string) — Plan display name
- `planPrice` (string) — Price text (for example $29)
- `planPeriod` (string) — Billing period (for example / month)
- `features` (string) — Newline separated feature list
- `buttonText` (string) — CTA button label
- `buttonUrl` (string) — CTA button link
- `isHighlight` (boolean) — Marks the column as featured
- `planAlign` (string) — Content alignment (left|center|right)
- `tagType` (string) — Wrapper HTML tag
- `htmlId` (string) — Optional element ID
- `extraClass` (string) — Optional extra CSS class

## Usage

Edit the column inside a Pricing Table. Enter each feature on its own line under Features in the block settings.

## Accessibility

- Plan name uses a heading
- Features use a semantic list
- The button renders as a link when a URL is set

## Browser Support

All browsers supported by the block editor.
