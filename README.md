# Kriti Blocks

Kriti Blocks is a Gutenberg-focused WordPress plugin that adds a collection of reusable blocks for building modern, responsive layouts with minimal effort. It is designed for content creators and developers who want to create polished pages directly in the block editor.

## Features

- Custom Gutenberg blocks for sections, columns, buttons, icons, carousel content, and advanced headers
- Responsive layout and styling controls
- Lightweight and modular architecture
- Built with the WordPress block editor APIs and React
- Easy to extend for additional block-based experiences

## Included blocks

- Section
- Row (with Stack variation)
- Back To Top
- Modal
- Off-canvas Drawer
- Post Grid (grid or list layout)
- Post Carousel
- Product Grid (WooCommerce)
- Product Carousel (WooCommerce)
- Product Price (WooCommerce)
- Sale Badge (WooCommerce)
- Product Rating (WooCommerce)
- Add To Cart (WooCommerce)
- Product Categories (WooCommerce)
- Product Filters (WooCommerce)
- Product Reviews (WooCommerce)
- Product Search (WooCommerce)
- Grid
- Divider
- Spacer
- Heading
- Text
- Image
- Video
- Cover
- Quote
- Alert
- Call To Action
- Card
- Testimonial
- FAQ
- Feature
- Tabs
- Team Member
- Pricing Table
- Accordion
- Stat
- Logo Grid
- Steps
- Sticky Section
- Hero
- Comparison Table
- Timeline
- Rating
- Related Posts
- Author Box
- Search
- Term List
- Pagination
- Archive Header
- List
- Testimonial Slider
- Columns
- Column
- Buttons
- Carousel
- Advance Header
- Icon

## Installation

1. Upload the `kriti-blocks` plugin folder to your WordPress installation under `wp-content/plugins/`.
2. Activate the plugin from the Plugins screen in the WordPress admin.
3. Open the block editor and search for "Kriti Blocks" blocks to start building.

## Development

This plugin includes source files in `src/` and generated build assets in `blocks/`.

### Requirements

- Node.js and npm
- WordPress environment for testing

### Common commands

- `npm install`
- `npm run start` – watch mode for admin, public, and block assets
- `npm run build` – build all assets
- `npm run build:blocks` – build block assets only
- `npm run lint:js` – lint JavaScript files
- `npm run lint:php` – run PHP CodeSniffer

## Notes

- After changing block source files, rebuild assets so the generated files in `blocks/` stay in sync.
- Follow WordPress coding standards and existing plugin conventions when contributing.
