# Kriti Blocks: block options inventory and competitor gap analysis

Plugin version 1.0.7 · 61 block folders in `blocks/` · 542 attributes in `block.json`.

## How this was produced

- **Our options** come from `src/constants/blockOptions.js` (which panels each block shows), `src/inspectors/{general,layout,advanced}/*` (the controls inside each panel) and each `block.json`. Control labels were extracted by script, so a few unlabeled controls (some color pickers, repeaters) may be missing from the lists.
- **Competitors** are Spectra, Kadence Blocks, Stackable, GenerateBlocks and Otter. Their feature lists are **from general product knowledge. I did not check them against live docs or current releases.** Spot-check anything before you build it.
- "Missing" means there is no equivalent control in our block UI. It does not mean the attribute is absent from `block.json`.

---

## 1. Shared option panels

Each block opts in to panels through `blockOptions.js`.

| Tab | Panel | Controls |
|---|---|---|
| Layout | Background | Color, gradient, image, focal point, image overlay, attachment, blend mode, repeat, opacity |
| Layout | Border / Border Control | Per-side borders, hover borders |
| Layout | Box Shadow | Horizontal, vertical, blur, spread |
| Layout | Display Type | Display, flex direction, wrap, justify, align items |
| Layout | Position | Type, offsets |
| Layout | Spacing | Row gap, column gap, padding, margin |
| Layout | Z-index | Z-index |
| Layout | Text Color | Text color |
| Layout | Shape Divider | Top and bottom divider |
| Advanced | Animation | Entrance animation, hover animation |
| Advanced | Device Visibility | Show on desktop, tablet, mobile |
| Advanced | User Visibility | Logged-in or capability based |
| Advanced | Date Range Visibility | Listed in the registry but **not rendered** (commented out in `AdvanceOptions.js`) |
| Per block | HTML ID, extra CSS class | Plain attributes |

**Coverage across the blocks**

- **50 blocks** get only `Spacing / Position / Z-index` in the Layout tab. They have no background, border, shadow or text color panel.
- Only `accordion-item`, `buttons`, `grid`, `pricing-column`, `row` and `timeline-item` get the richer Layout set.
- `section`, `columns`, `carousel`, `icon` and `advanced-header` have an **empty Layout tab**. `section` has a full spec in `Options.md` (dividers, borders, shadow, spacing), but none of it is wired into the UI.
- `TypographyPanel` exists but is commented out. Only `heading` and `text` have typography controls.
- No block has per-device values for spacing, font size, columns, alignment or content. Only the show/hide toggles are per device.

---

## 2. Cross-cutting gaps

These are the same across most blocks. ✔ = I recall the competitor offering it.

| # | Missing option | Spectra | Kadence | Stackable | GenerateBlocks | Otter |
|---|---|:-:|:-:|:-:|:-:|:-:|
| 1 | Responsive (per-device) spacing, font size, columns, alignment | ✔ | ✔ | ✔ | ✔ | ✔ |
| 2 | Typography group (family, size, weight, style, transform, decoration, line height, letter spacing) | ✔ | ✔ | ✔ | ✔ | partial |
| 3 | Normal and hover states for colors, borders, shadows | ✔ | ✔ | ✔ | ✔ | partial |
| 4 | Border, radius, shadow and background on every container block | ✔ | ✔ | ✔ | ✔ | ✔ |
| 5 | Gradient and background video | ✔ | ✔ | ✔ | partial | partial |
| 6 | Custom CSS per block | partial | ✔ | ✔ | ✔ | ✔ |
| 7 | Dynamic content (post fields, meta, ACF) in text, link, image | partial | ✔ | ✔ | ✔ | partial |
| 8 | Link control (URL, new tab, nofollow, sponsored) on every link | ✔ | ✔ | ✔ | ✔ | ✔ |
| 9 | Aspect ratio, focal point and object-fit on every image | ✔ | ✔ | ✔ | ✔ | partial |
| 10 | Transform, opacity, CSS filters, blend mode | partial | partial | ✔ | ✔ | no |
| 11 | Scroll effects (parallax, entrance with delay and duration) | partial | ✔ | ✔ | partial | partial |
| 12 | Conditional display by URL, referrer, cookie, browser, WooCommerce state | no | ✔ | partial | no | ✔ |
| 13 | Global styles and presets (colors, typography, spacing tokens) | ✔ | ✔ | ✔ | ✔ | no |
| 14 | Copy and paste styles, reset to default | ✔ | ✔ | ✔ | no | no |
| 15 | Accessibility fields (ARIA label, role, heading tag) | partial | ✔ | partial | ✔ | no |
| 16 | Image `loading` and `fetchpriority` | no | partial | no | ✔ | no |
| 17 | Icons inside text and buttons, with an icon library | ✔ | ✔ | ✔ | ✔ | ✔ |
| 18 | Schema markup toggles (FAQ, review, product) | ✔ | ✔ | partial | no | partial |

---

## 3. Per-block inventory and missing options

Shared gaps from section 2 are not repeated unless they matter most for that block.

### 3.1 Layout and structure

#### section
- **Ours**: HTML tag, container, vertical padding, background color and image, border style, width and color, shadow, margin, padding, z-index, device visibility, user visibility, date range, top and bottom divider image, animation, hover animation, ID, class. Most of these exist as attributes only, because the Layout tab is empty.
- **Missing**: background video, gradient, parallax, overlay opacity, min height with units, content width with units, overflow, vertical alignment of content, divider color, height and flip, responsive padding and margin (Spectra, Kadence, Stackable).

#### row, columns, column, grid
- **Ours**:
  - `row`: HTML tag, gap, min height, plus Display, Background, Border, Shadow, Spacing.
  - `columns`: width, alignment, text color, vertical alignment, tag, container, padding, background, border, margin (Layout tab empty).
  - `column`: one attribute.
  - `grid`: tag, columns, column and row gap, min height, plus Background, Border, Shadow, Position.
- **Missing**: per-device column count and widths, stack and reverse on mobile, per-column background, border, padding, link and hover, align items, justify, wrap, direction on `row` and `columns`, grid auto-fit and minmax, per-item span (Kadence, Spectra, GenerateBlocks, Stackable).

#### sticky-section
- **Ours**: top offset, z-index, shadow when stuck.
- **Missing**: sticky per device, stick to bottom, stop at parent end, background change when stuck, shrink on scroll (Kadence Pro, Stackable Premium).

#### spacer, divider
- **Ours**: spacer height. Divider style, color, thickness, width, alignment.
- **Missing**: per-device height and units (spacer). Icon or text in the middle, gradient, shape dividers, responsive width and thickness (divider) (Kadence, Stackable, Spectra).

#### advanced-header
- **Ours**: nothing usable. The registry key `advanced-header` doesn't match the folder `advance-header`, and the registry entry has no attributes.
- **Missing**: fix the naming first. Then decide scope (logo, navigation, sticky, transparent). Spectra and Kadence have header builders.

### 3.2 Content and text

#### heading
- **Ours**: level, font size, weight, alignment, transform, letter spacing, line height, color.
- **Missing**: font family and style, decoration, text shadow, gradient text, highlighted text, underline or separator, subheading, responsive size, hover color, link (Kadence, Spectra, Stackable).

#### text
- **Ours**: tag, size, weight, alignment, transform, spacing, line height, drop cap, color.
- **Missing**: font family, text columns, text shadow, max width, responsive size, link, dynamic content.

#### quote
- **Ours**: alignment, size, border color, citation.
- **Missing**: quote icon and style, author image, background, border side, typography for quote and citation (Spectra, Kadence, Stackable).

#### list
- **Ours**: marker style, marker color, items.
- **Missing**: icon per item, icon size and spacing, ordered start and reverse, per-item link, columns, typography, divider between items (Kadence, Spectra, Stackable).

#### alert
- **Ours**: type, show icon, content.
- **Missing**: dismiss button with cookie, custom icon, title and description fields, colors per type, border and radius, typography (Spectra, Kadence, Stackable, Otter).

#### stat
- **Ours**: alignment, prefix, suffix, count-up toggle.
- **Missing**: start value, duration, decimals, thousands separator, easing, trigger on scroll, icon, progress bar or circle, typography (Kadence, Spectra, Stackable).

#### rating
- **Ours**: value, number of stars, star size, show value, star color, empty color.
- **Missing**: half stars, icon choice, schema markup, star spacing, label placement, interactive voting (Spectra, Kadence).

### 3.3 Media

#### image
- **Ours**: alt, width, height, object fit, radius, alignment, caption.
- **Missing**: link and lightbox, hover effects, aspect ratio, focal point, border and shadow, size choice, mask or shape, caption position (Spectra, Kadence, Stackable).

#### video
- **Ours**: width, alignment, controls, autoplay, loop, muted, preload, caption.
- **Missing**: YouTube and Vimeo embeds, poster image, play button overlay and lightbox, aspect ratio, start and end time, background video mode (Kadence, Spectra, Stackable).

#### icon
- **Ours**: icon, SVG, category, URL, size, color, background, padding, radius (Layout tab empty).
- **Missing**: hover color and background, border and shadow, rotation, link rel and new tab, label, per-device size (all).

#### cover and hero
- **Ours**: cover has background image, overlay color and opacity, min height, size, position, alignment. Hero has background image, overlay color and opacity, height, content width, alignment.
- **Missing**: background video, parallax, gradient overlay, focal point, per-device height, vertical alignment, content max width in units, heading, text and button controls inside the block (hero), scroll-down indicator (Spectra, Kadence). The two blocks overlap heavily, so consider merging.

#### logo-grid
- **Ours**: columns, grayscale until hover, logos.
- **Missing**: per-device columns, logo height, per-logo link and rel, carousel mode, hover opacity, gap, alignment (Kadence, Spectra, Stackable).

#### carousel
- **Ours**: slides, active index, title, subtitle, description and button toggles, interval, indicators, controls, slide effect (Layout tab empty).
- **Missing**: slides per view per device, loop, pause on hover, drag and touch, thumbnails, transition speed, per-slide background, arrow and dot styling, vertical direction (Kadence, Spectra, Stackable).

### 3.4 Interactive

#### accordion, accordion-item, faq
- **Ours**: close others, open by default, item title, first item open (FAQ).
- **Missing**: icon choice and position, title tag and typography, colors per state, item border and spacing, animation speed, FAQPage schema, open all and collapse all (Spectra, Kadence, Stackable, Otter).

#### tabs
- **Ours**: tab items only. The settings panel is empty.
- **Missing**: orientation, alignment, style (underline, pills, boxed), colors per state, icons in tabs, default active tab, mobile fallback to accordion, content padding (Kadence, Spectra, Stackable, Otter).

#### modal
- **Ours**: trigger text and colors, position, panel width, background, radius, close button, close on backdrop.
- **Missing**: trigger types (image, icon, auto-open, exit intent, on scroll, CSS selector), delay, cookie to show once, overlay color and blur, animation, max height with scroll, close icon style (Kadence Pro, Spectra, Stackable, Otter).

#### offcanvas
- **Ours**: trigger text and colors, side, drawer width and background, close button, close on backdrop.
- **Missing**: push or overlay mode, overlay color, animation speed, hamburger trigger, focus trap and Esc, scroll lock, per-device width (Kadence, Spectra).

#### back-to-top
- **Ours**: position, offset, show after scroll, size, icon size, shape, colors, aria label, smooth scroll.
- **Missing**: hover colors, icon choice, text label, scroll duration, progress ring, device visibility, border and shadow (Spectra, Kadence).

#### pagination, search, term-list, archive-header, author-box
- **pagination** ours: previous and next, labels, numbers, mid and end size, alignment. Missing: style variants, colors per state, load more and infinite scroll, AJAX, typography (Kadence, Stackable, GenerateBlocks).
- **search** ours: label, placeholder, button text, show button, post type. Missing: live search, icon-only and expandable modes, styling, width, category filter (Spectra, Kadence, Otter).
- **term-list** ours: taxonomy, layout, nest, hide empty, count, order, limit. Missing: include and exclude IDs, pill and button styles, colors, icon, description, columns (Kadence, Stackable).
- **archive-header** ours: title, heading level, prefix, description. Missing: image, breadcrumbs, post count, alignment, typography, background.
- **author-box** ours: author, layout, heading level, avatar and size, bio, archive link. Missing: social links, role label, post count, background and border, avatar shape, typography (Kadence, Spectra, Stackable).

### 3.5 Marketing and cards

- **card** ours: image, alignment, padding, tag, radius, shadow. Missing: image position (top, left, right, overlay), hover lift or zoom, link on whole card, border, background, badge, button (Spectra, Kadence, Stackable).
- **feature** ours: show icon, icon, size, position, shape, colors, alignment, link text, URL, new tab. Missing: image instead of icon, number badge, icon hover, link as button, typography, divider, responsive layout (Kadence, Spectra, Stackable).
- **cta** ours: alignment, background color, text color, tag. Missing: heading, text and button controls inside the block, button style, background image and overlay, side-by-side layout, border, radius (Spectra, Kadence, Stackable).
- **pricing-column** ours: plan name, price, period, features, button text and URL, highlight, alignment, tag. Missing: feature icons (check, cross), ribbon badge, currency symbol, sale price with strikethrough, button style, rel and new tab, feature tooltips, header background (Spectra, Kadence, Stackable).
- **pricing-table** ours: ID and class only. Missing: monthly and yearly toggle, columns control, equal height, gap, responsive stacking.
- **comparison-table** ours: highlight column, add and remove column, accent color, rows, products. Missing: sticky header, row and column styling, check and cross icons per cell, tooltips, responsive scroll, cell alignment, add and remove rows (Kadence, Stackable).
- **steps** ours: layout, title, description, add step. Missing: number or icon style, connector line, colors, per-device layout, link, alignment (Stackable, Spectra).
- **timeline and timeline-item** ours: timeline color, item date, no general panel on either. Missing: layout (left, right, alternating), marker or icon, line style and thickness, date position, per-item color and image, scroll animation, link (Spectra, Kadence).
- **team-member** ours: name, role, bio, photo, alignment, photo shape, shadow, tag. Missing: social icons, email, hover overlay, photo size, border, background, profile link, image left or right (Spectra, Kadence, Stackable).
- **testimonial** ours: quote, author, role, avatar, alignment, quote mark. Missing: star rating, company and logo, avatar position, card background, border, typography, schema (Kadence, Spectra, Stackable).
- **testimonial-slider** ours: autoplay, delay, arrows, dots, quote mark. Missing: slides per view, loop, pause on hover, transition type and speed, arrow and dot styles, equal height, drag (Kadence, Spectra, Stackable).

#### buttons
- **Ours**: buttons array and label only. It has the full Layout panel set but no General panel.
- **Missing** (every competitor leads with this block): per-button text and link with rel and new tab, icon before or after, size presets, width (auto, full, fixed), hover colors for text, background and border, gradient background, typography, per-corner radius, per-device alignment and gap, aria-label (Spectra, Kadence, Stackable, GenerateBlocks).

### 3.6 Query blocks

#### post-grid, post-carousel, related-posts
- **Ours** (post-grid): post type, number, columns, layout, order by, order, categories, image and size, excerpt and length, date, author, category display, read more. Post-carousel adds slides visible, autoplay, interval, arrows, dots. Related posts has number, columns, order, image, excerpt, date, read more.
- **Missing**: tag and taxonomy filters, include and exclude posts, offset, sticky posts handling, card styles (overlay, boxed, list, masonry), image ratio, hover effect, per-card background and border, reading time, comments count, custom fields, no-results message, pagination or load more, per-device columns, title tag and typography. Related posts also lack relate-by choice (category, tag, taxonomy) and manual selection. Carousel lacks loop, drag, per-device slides, transition speed, pause on hover (Spectra, Kadence, Stackable, GenerateBlocks, Otter).

### 3.7 WooCommerce

- **woo-product-grid and woo-product-carousel** ours: number, columns, layout, order by, order, categories, featured only, on sale only, image, category, rating, price, add to cart, plus carousel autoplay, interval, arrows, dots. Missing: tag, attribute, stock and price filters, include and exclude IDs, offset, title and sale badge toggles, quick view, wishlist, hover image swap, button style, sorting, pagination or load more, per-device columns, card style, no-products message. Carousel also lacks loop, drag, per-device slides (Kadence Pro, Spectra, Otter).
- **woo-product-price** ours: alignment, size, color. Missing: sale and regular price styling, strikethrough color, currency styling, typography, tax suffix.
- **woo-sale-badge** ours: text, percentage, colors, size, radius. Missing: position over image, shape (circle, ribbon), "New" and stock badges, typography.
- **woo-product-rating** ours: stars, count, alignment, size, color. Missing: star icon, link to reviews, hide when zero.
- **woo-add-to-cart** ours: label, colors, size, radius, full width. Missing: quantity input, variation selector, AJAX add, redirect to cart or checkout, hover styles, icon, loading and added states, out-of-stock message.
- **woo-product-categories** ours: layout, columns, nest, hide empty, count, thumbnail, order, limit. Missing: include and exclude IDs, parent filter, image ratio, hover overlay, card style, per-device columns.
- **woo-product-reviews** ours: number, order, heading, title toggle, rating, avatar, date, verified label. Missing: product choice, rating filter, review form toggle, helpful votes, pagination, card styling, rating summary bars.
- **woo-product-filters** ours: title, categories, limit, counts, price filter, min and max, button text. Missing: attribute, rating, stock and sale filters, AJAX apply, clear all, collapsible groups, active filter chips.
- **woo-product-search** ours: label, placeholder, button text, show button. Missing: live search with thumbnails, category dropdown, SKU search, results limit, styling.
- **woo-mini-cart** ours: a settings panel (title, toggle, toggle text, item count, open by default) and a registry entry, but no folder in `blocks/`, so it never registers. Missing: the block itself, plus cart icon, drawer vs dropdown, subtotal, checkout and cart buttons, empty state.
- Comparable Woo sets exist in Spectra, Kadence Pro and Otter. Stackable's is very limited.

---

## 4. Suggested priority order

1. **Wire up what already exists**: add Background, Border, Shadow and Text Color panels to the 50 blocks that lack them. Render Date Range visibility. Fill the empty Layout tabs on `section`, `columns`, `carousel`, `icon`. Fix `advanced-header` and `woo-mini-cart`.
2. **Responsive controls and typography** (gaps 1 and 2). They affect every block.
3. **Hover states** (gap 3).
4. **Buttons block**: no General panel today.
5. **Accordion, FAQ, tabs**: icons, colors per state, FAQ schema, tab styles.
6. **Query blocks**: taxonomy filters, pagination, card styles.
7. **Dynamic content and custom CSS** (gaps 6 and 7).
8. Remaining per-block items in section 3.

## 5. Inconsistencies found while reading

- `advanced-header` (registry) vs `advance-header` (folder), and no matching `block.json`.
- `woo-mini-cart` has a registry entry and a settings panel but no block folder.
- Stray copies: `src/hooks/AdvanceOptions copy.js`, `src/constants/layoutOptionsAttributes copy.js`.
- `LayoutOptions.js` has a leftover `console.log(blockOptions)`.
- `GeneralOptions.js` and `AdvanceOptions.js` read `blockOptions[blockName].general` and `.advanced` without a guard, so an unknown block name throws. `LayoutOptions.js` uses `?.`.
- `KRITI_BLOCKS_VERSION` is 1.0.4 while the plugin header says 1.0.7.

---

## 6. Implemented so far (shared Design layer)

Every `kriti-blocks/*` block now has a set of **Design** panels in the sidebar. They are separate from the older General / Layout / Advanced tabs.

**Why a new layer.** The older Layout and Advanced panels are not functional: their attributes are declared as strings with default `"normal"` but the panels pass objects, most blocks never register the attributes, and `save` / render code never applies them. Rather than patch that, the Design layer stores everything in one object attribute, `kbStyle`, and renders it on the server. The attribute lives in the block comment, so no block's saved markup changes and existing content stays valid.

| Report gap | Added |
|---|---|
| 1. Responsive controls | Font size, padding, margin and min height per desktop / tablet (≤1024px) / mobile (≤767px) |
| 2. Typography | Size, weight, transform, align, line height, letter spacing |
| 3. Hover states | Background, text and border color, box shadow, scale, rotate, lift, transition time |
| 4. Border, radius, shadow, background on every block | Width, style, radius, color, two shadows, background color |
| 5. Gradients | Background gradient picker |
| 6. Custom CSS | Per-block, with `selector` placeholder |
| 10. Opacity | Opacity, hover transform |
| 11. Scroll effects | Entrance animations (fade, fade up / down / left / right, zoom, flip) with duration and delay; respects reduced motion |
| 12. Conditional display | Logged-in / logged-out, date range, hide per device. Hidden blocks are removed from the HTML |
| 15. Accessibility | ARIA label, landmark role |

Also done: `DateRangeVisibility` equivalent now works (via the Design visibility panel), the `KRITI_BLOCKS_VERSION` constant matches the plugin header (1.0.7), `GeneralOptions` / `AdvanceOptions` no longer throw on an unknown block name, and the stray `console.log` was removed from `LayoutOptions.js` source.

**Files:** `includes/class-kriti-blocks-design.php` (validation and CSS output), `src/extensions/*` (editor panels and preview), `assets/extensions/*` (built JS), `assets/css/design.css`, `assets/js/design-frontend.js`, `package.json` (new `build:extensions` script).

**Security:** every value is validated server-side before it reaches CSS or HTML (colors, lengths, gradients and enums are matched against allow-lists; custom CSS drops `url()`, `@import`, `expression()` and `javascript:`). A test with malicious values produced no output for any of them.

### Not done

- Per-block options from section 3 (button controls, accordion icons, tab styles, FAQ schema, query filters, WooCommerce filters, and so on). They need changes inside each block's `edit`, `save` or `render` code.
- Gap 7 (dynamic content), 9 (aspect ratio), 13 (global styles), 14 (copy and paste styles), 16, 17, 18.
- `woo-mini-cart` and `advanced-header` blocks.
- The compiled `blocks/` build is unchanged. A full rebuild changed compiled CSS in many blocks, so the committed build is older than `src`. Review that before running `build:blocks`.
- Editor preview does not follow the editor's device preview toggle. It uses the editor window width for responsive rules.

## 7. Buttons block (per-block work, first block done)

`kriti-blocks/buttons` was rebuilt from `src/blocks/buttons/`:

- **Per button:** text edited in place, URL, open in new tab, `nofollow`, `sponsored` (with `noopener noreferrer` added for new tabs), aria-label, style (solid, outline, ghost, link), size (small, medium, large), full width, corner radius, five colors (main, text, border, hover background, hover text), and a built-in icon (arrow, download, external, check, cart, mail, phone, play) before or after the text.
- **Group:** alignment (left, center, right, space between), direction, gap, stack on mobile. Add, remove and reorder buttons from the sidebar.
- **Compatibility:** `deprecated.js` keeps the old markup valid and upgrades it. Tests in `src/blocks/buttons/test/` check the old markup, the migration and the new output, including that unknown icon, style and size values never reach the HTML. They test `save()` with the editor package mocked; they do not run the block in a real editor.
- **Attribute name:** the group alignment attribute is `justify`, because `supports.align` already owns `align`.
- **Icons** are CSS masks, so WordPress HTML filtering (for users without `unfiltered_html`) does not strip them. Colors are CSS variables on the link; a `wp_kses_post` check confirmed they survive filtering.
- **Build:** only `blocks/buttons/` was updated in the compiled output.

**Content note:** pages 180 and 774 on this site still contain `blockwriter/buttons` markup, so they do not use the new block until that content is migrated to `kriti-blocks/buttons`.

## 8. Accordion, FAQ and Tabs

Rebuilt from `src/blocks/{accordion,accordion-item,faq,tabs}/`. Only those four folders were updated in the compiled `blocks/` output.

**Compatibility rule:** every new option adds nothing to the markup at its default, so content saved before these options existed stays valid without a deprecation. `src/shared/test/disclosure-blocks.test.js` renders the original `save()` functions (kept unchanged in `src/shared/test/legacy/`) next to the new ones and checks the HTML is identical.

| Block | Added |
|---|---|
| Accordion | Icon (chevron, plus / minus, triangle, none) and its side, space between items, corner radius, six colors (title, item background, open background, title hover, border, icon), FAQ structured data toggle, link to an item by its ID in the URL hash |
| Accordion item | Title element (h2 to h6, div) |
| FAQ | Same icon, spacing and color options, "only one open at a time" (uses the native `name` attribute on `<details>`), FAQ structured data toggle |
| Tabs | Style (underline, pills, boxed), orientation (horizontal, vertical, switching to a row under 600px), tab alignment (left, center, right, fill width), tab shown first, panel padding, six colors |

- **FAQ structured data** is built in PHP (`includes/class-kriti-blocks-schema.php`). Every opted-in Accordion and FAQ block on a page is merged into one `FAQPage` printed in the footer, because search engines expect one per URL. Tags are removed from questions, answers keep a short allow-list of tags, and `</script>` cannot end the tag early.
- **Bug fixed:** the accordion's front-end script looked for a class (`.bw-accordion-item`) that the block never outputs, so items did not toggle. A jsdom test now opens and closes real saved markup.

**Not done here**
- Accordion open / close all, smooth height animation, search.
- Tab icons and per-tab anchors. Adding `aria-controls` and IDs to tabs changes the saved markup, so it needs a deprecation entry.
- In the Pills tab style, the active tab text is white unless you change the active background. Pick an active background to control the contrast.

## 9. All remaining blocks (five parallel passes)

Every remaining block was worked on in five groups, then built together. The compiled `blocks/` folder is now a full build of `src/` (62 folders, including `woo-mini-cart`). The earlier backup of the old build is not kept in the plugin.

**Checks run:** 55 Jest suites, 382 tests, all passing; `php -l` on every PHP file; a clean full webpack build; every server-rendered block rendered with default and hostile attributes with no PHP warnings; front page returns 200. **Not checked:** none of the new editor panels, front-end scripts (modal, offcanvas, sliders, carousels, mini-cart) or CSS were opened in a real browser.

**Compatibility rule held for static blocks:** each has a copy of its original `save()` under `test/legacy/` and a test that the HTML is identical at default attributes. No block needed a `deprecated` entry beyond Buttons.

### Important bug found and fixed
Core ignores the string a block's `render.php` returns and prints only what it echoes. 18 server-rendered blocks (post-grid, post-carousel, related-posts, term-list, search, pagination, archive-header, author-box and ten WooCommerce blocks) build their markup in a buffer and **return** it, so they printed nothing on the site. The original Blockwriter code did the same. `kriti-blocks.php` now wraps each block's render callback and uses the returned string when there is one, so no `render.php` needed rewriting. This has not been tested with WooCommerce active, because it is inactive on this site.

### What each group added
- **Query blocks** (post-grid, post-carousel, related-posts, term-list, pagination, search, archive-header, author-box): taxonomy and term filters, include / exclude IDs, offset, sticky handling, card styles, image ratio, hover, title tag, reading time, comment count, per-device columns, no-results message, relate-by choices, pagination styles and first / last links, search icon button and category dropdown, breadcrumbs, post count, social links and more.
- **WooCommerce** (11 blocks): product filters (tags, stock, price, include / exclude), card and button styles, hover image swap, badge types and shapes, rating icons, quantity form, redirect after add, category filters, review summary and pagination, attribute and rating filters, mini-cart inline / dropdown / drawer.
- **Marketing and cards** (12 blocks): card layouts and badge, feature variants, CTA background and layout, pricing column icons / badge / currency / old price, comparison table sticky header and striping, steps markers and connector, timeline layouts, team-member socials, testimonial rating and logo, slider settings.
- **Content and media** (16 blocks): heading (font family, text shadow, gradient text, highlight, decoration, accent bar, subheading), text (font family, shadow, columns, max width), quote (border side, quote mark, colors, author image), list (start number, marker size, gap, columns, dividers, per-item links), alert (title, custom icon, accent color, dismiss with cookie), stat (start value, duration, decimals, separator, easing, colors, progress bar), rating (icon shapes, round to half, spacing, label position, schema markup), image (link, lightbox, hover, ratio, focal point, shape mask, caption overlay), video (YouTube / Vimeo embeds with privacy mode, click-to-play preview, background mode, poster, ratio, start / end), icon (hover colors, rotation, per-device size, label, link), cover and hero (parallax, background video, gradient overlay, focal point, vertical align, per-device height, scroll arrow), logo grid (per-device columns, size, gap, carousel mode, per-logo links), carousel (autoplay, pause, loop, touch, speed, image height, dark controls, thumbnails, vertical, slide alt text), divider (text / icon, shapes, responsive width), spacer (units, per-device height). All options add nothing to saved markup at their defaults; each static block has a legacy-markup test. Not built: nothing in dynamic content.
- **Interactive and layout** (10 blocks): modal and offcanvas triggers (page load, exit intent, scroll, CSS selector, show once) with focus handling, back-to-top, sticky section, section backgrounds including video, columns, column, row, grid, advance-header.

### Needs your decision or action
- `src/constants/blockOptions.js` has the key `advanced-header` but the folder is `advance-header`. The block ignores the registry now, so it only affects the legacy tabs. Rename the key if you keep those tabs.
- The `row` registry entry still lists the legacy `DisplayTypePanel`, whose controls do nothing. It sits next to the new working flex panel; remove it from the registry.
- `row` and `grid` still put `minHeight`, `positionType` and `zindex` into inline style as raw strings. Validating them could invalidate existing content, so I left them.
- `archive-header` prints the author archive title as escaped HTML (`<span class="vcard">`). Existing bug, not changed.
- `icon/render.php` is dead code (it was also extended with the new icon options): the block has no `render` key, so `save.js` is what runs.
- Mini-cart count and subtotal update only on reload (needs a WooCommerce fragments filter).
- Not built (most were done later, see section 10): masonry. (Pricing-table toggle, comparison-table cell text and tooltips, and copy / paste styles were done later: see section 10.)

## 10. Follow-up work

Done after section 9. Unit tests pass (55 suites, 401 tests) and `build:blocks` / `build:extensions` were run. None of it was opened in a real browser.

**Shared Design layer** (`src/extensions/`, `includes/class-kriti-blocks-design.php`)
- Text align is now per device. Older content with a single alignment still works and counts as desktop.
- New per-device gap.
- New tablet and mobile grid column count and row direction (stack, reverse). They use `!important` to beat the inline styles `grid` and `row` set.
- New "Copy & paste styles" panel (gap 14). Pasted values are sanitized again on the server.

**Fixes**
- `SpacingPanel` wrote all four fields into `margin`, and crashed on blocks without the attributes. Each field now saves to its own attribute. The four attributes in `layoutOptionsAttributes.js` are now `object` instead of `string`.
- Removed the stray `copy` files, renamed the registry key `advanced-header` to `advance-header`, removed the dead `DisplayTypePanel` from `row`.

**Per-block**
- `pricing-table`: optional monthly / yearly toggle, with yearly price and period on each `pricing-column`. The toggle is hidden without JavaScript. New `view.js`.
- `column`: Design panel styles (background, border, padding, shadow) now go on an inner `kb-col-inner` wrapper added at render time, so they no longer replace or cover the grid gutters that sit on the outer `.col-*` element. Saved markup is unchanged. The editor preview still styles the outer element. `columns` stacking (`stackOn`, `stackReverse`) was already done in section 9.
- Gap: the shared Design Gap control is hidden on `row`, `grid` and `columns`, which have their own gap controls (`row` has `gap`, `gapTablet`, `gapMobile`). Those write to saved markup, so I kept them as the single source instead of migrating them. Content that already holds a shared gap value still renders it.
- **Duplicate options and the tabs** (General / Layout / Advanced):
  - **Finding:** every legacy Layout and Advanced panel (Background, Border, Box Shadow, Text Color, Display, Position, Z-index, Shape Divider, Spacing, Animation, Device and User visibility, Date range) saved attributes that no block, `save()` or PHP code rendered, except where `row` and `grid` have their own. Several wrote into `margin` by mistake and `columns`' Border panel kept its values in local state only. They repeated what the Design panels do, and the Design panels actually work.
  - **Change:** the Layout tab now shows the Design panels for spacing and size, colors, typography, and border and shadow. The Advanced tab shows copy / paste styles, effects and animation, visibility (devices, logged-in state, date range), and accessibility and custom CSS. The "Design:" prefix is gone from panel titles. The General tab is unchanged. Blocks without tabs (`advance-header`, `buttons`, `carousel`, `column`, `columns`, `icon`) still get the same panels in their own sidebar.
  - **Removed:** the legacy panels, their registry entries (`layout` and `advanced` in `blockOptions.js`), and the components only they used (`StylingComponent`, `AdvanceComponent`, `DimensionComponent`, `DeviceTabButton`, `ResponsiveDeviceheader`, `constants/animations.js`, `constants/borderOptions.js`). Also removed a leftover `console.log` in the tab component and two ghost panel names in the `advance-header` entry.
  - **Duplicates hidden:** where a block already has a control in its General tab, the Design copy is hidden (`NATIVE_CONTROLS` in `src/extensions/DesignPanels.js`): heading and text typography; font size on four WooCommerce blocks; border radius on card, image and icon; icon padding; archive-header minimum height; border width and style on advance-header and back-to-top; gap on row, grid, columns, logo-grid and buttons.
  - **Flagged but kept (not real duplicates):** quote's left border width, modal's delay, stat's duration, and buttons' per-button colors, which style different things.
  - **Tooltips:** the three tab buttons have a small tooltip (editor only). It is the browser's own `title` tooltip, on a title that fills the whole tab.
  - **Lost:** the legacy Position, Z-index, Display Type and Shape Divider controls are gone. They never had any effect. Position and z-index as real Design options is a possible follow-up.
  - **Left alone:** `layoutOptionsAttributes.js` and `advancedOptionsAttributes.js` are still spread into about 55 blocks' attributes. They are unused but harmless, and removing them is a wide change with no gain.
  - **Notes:** the tabs read the shared panels from `window.kritiBlocksDesign`, set by the extensions bundle, so each block bundle does not carry its own copy. Not opened in a real editor.
- Global styles (gap 13): new page **Settings > Kriti Global Styles** (`includes/class-kriti-blocks-global-styles.php`) for up to 12 named colors, font sizes and spacing values each. They are printed as CSS variables (`--kb-color-*`, `--kb-font-*`, `--kb-space-*`) on the site, in the editor and inside the editor iframe. The Design panels offer them: the color pickers show them as swatches, and there are font size, gap, and padding / margin (all sides) preset selectors. A block stores the variable, not the value, so changing a preset updates every block that uses it. Colors are hex only. Values are checked on save and again on read, and the Design layer only accepts `var(--kb-space-*)` and `var(--kb-font-*)` for lengths.
  - **Limits:** presets are applied to all four sides at once, so per-side padding still uses the normal box control. Deleting a preset leaves blocks pointing at an undefined variable (they fall back to the browser default). Typography families, borders and shadows are not preset. The editor panels were not opened in a browser; the saved CSS was checked on the front page and in PHP.
- **WooCommerce product grid: Load more, filter bar, sorting and pagination** (tested with WooCommerce active). Two optional settings on the grid block: a "Load more" button that adds the next page without reloading, and a filter bar with any of search, category, sort (newest, price both ways, popularity, rating, name), price range and in-stock only. New `includes/class-kriti-blocks-shop.php` adds a public REST route `kriti-blocks/v1/products`. It finds the grid block in the post content by an id the editor makes (`gridId`), keeps all of the block's own settings, and adds the visitor's choices on top, so a visitor can only narrow what the block already allows. The block template renders the items, so the markup matches the first load. The filter bar and button appear only with JavaScript.
  - **Checks:** the post must be published, public and not password protected; the block must have the feature turned on; sort, category, price and search values are validated (anything invalid is ignored); at most 600 requests per 10 minutes per address (only a hash is kept; `kriti_blocks_rating_client_ip` works here too).
  - **Tested on 8 temporary products** (deleted afterwards): three pages with no overlap, each sort, category, in-stock, price range (both ends and one end), search, bad and hostile values, past the last page, a grid without the feature, an unknown or malformed id, a draft, a password-protected post, a missing post, the rate limit, and the initial markup. Seven DOM tests cover the script (append, replace, debounce, empty message, errors, creating the button).
  - **Limits:** without "Load more", filtering shows only the first page of results. It works for blocks in the post content, not in patterns or template parts. The separate Product Filters block still builds classic shop-page links and is not connected to the grid.
- **Second bug-fix pass:**
  - `archive-header` printed an author archive's title as escaped text with the tags showing (`<span class="vcard">`). The tags are now removed before it is escaped.
  - **Mini cart** showed a stale count and subtotal until the page was reloaded. `includes/class-kriti-blocks-minicart.php` adds the count (badge and text style) and the subtotal to WooCommerce's cart fragments, the number in the text style now has its own element, the subtotal element is always printed, and `wc-cart-fragments` is enqueued by the block (WooCommerce only loads it on some pages). Checked in a browser: adding two items takes both styles from 0 to 2 and shows the subtotal, the toggle still works, the panel lists the items, and removing one sends the count back to 0.
    - **A regression of my own, found and fixed in the same pass:** once WooCommerce's script ran, it replaced the whole panel element (which carried the `widget_shopping_cart_content` class), so the panel lost its own class and id and its toggle button pointed at nothing. Only an inner element carries that class now, so the panel keeps its class, id and close button.
    - Small difference: after the last item is removed, WooCommerce's own "No products in the cart" text replaces the custom empty message until the page is reloaded.
  - `row` and `grid` wrote `minHeight`, `positionType`, `zindex` (and row's `displayType`) into inline styles as typed. `src/shared/layout-values.js` now checks them (lengths and simple `calc()`, position keywords, whole-number layers, display keywords). Ordinary values pass unchanged and existing content stays valid; only malformed values are left out.
  - `package.json` said 1.0.4 while the plugin is 1.0.7, and `lint:php` used a Windows path (`vendor\\bin\\phpcs`) so it could not run on this machine. Both fixed.
  - Twelve groups of controls had a visible label that was not tied to anything (the `BaseControl` accessibility warning). They now use `BaseControl.VisualLabel`, the WordPress way to label a group.
  - Checked and **not** a bug: the `console.log('Public Rendered')` in `src/public/public.js` is only in `public/js/dist/public.js`, which WordPress never loads.
  - **Not changed:** `icon/render.php` is unused, and the theme's missing `font-awesome.css` is the theme's.
- **Lint config settled: two spaces.** The code and `.prettierrc` were already two spaces and WordPress's lint preset expects tabs, which gave about 33,000 formatting errors. Converting everything to tabs would have rewritten every file, so the lint rule was changed instead. New `.eslintrc.js` is WordPress's default setup (same rules, test rules and parser) with Prettier's options **read from `.prettierrc`**, so the two cannot drift. New `.eslintignore` skips generated and third-party files (with leading slashes, so `src/blocks` is still linted). The editor-only settings that sat in `.prettierrc` (and made Prettier warn about unknown options) moved to `.vscode/settings.json`. Result: 0 formatting errors, `npm run lint:js` finishes in a reasonable time on just your own code, and 278 real findings remain (listed above, none of them formatting). Checked that a tab-indented file is flagged.
- **Per-account wishlist.** For a logged-in visitor the wishlist is also saved on their account, so it follows them to other devices. Guests are unchanged.
  - **Server:** `includes/class-kriti-blocks-wishlist.php` adds `GET` and `POST kriti-blocks/v1/wishlist`. Both need a logged-in user **and** WordPress's REST nonce, so another site cannot read or change a list. Only IDs of published products are stored (duplicates, junk, drafts, pages and unknown IDs are dropped, in the order sent), at most 100, in user meta `kb_wishlist`. A product that is later trashed drops out. WordPress's personal data **export and erase** tools include it.
  - **Browser:** `src/shared/kbwishlist.js` syncs when a block with hearts or the Wishlist block loads, and saves changes after a short pause. Rules: the first time a browser syncs, the guest list and the account list are merged; the same account again, the account list wins (so a removal on one device is not undone by an old copy on another) unless this browser has unsaved changes (made as a guest, or offline), which are then merged; a **different** account on the same browser gets its own list only, so one person's leftovers never go into another person's account.
  - **Bug found by the browser test and fixed:** the grid and the Wishlist block are separate scripts, each with its own copy of the shared code, so two syncs ran at once and the second overwrote the first's result. The sync state now lives on `window`, so only one of them syncs.
  - **Tested:** 17 unit tests (all the rules above, including a failed save, being offline and two script copies); the endpoints with temporary accounts (login required, junk cleaned, isolation between users, the 100 cap, privacy tools); and a real browser with real login cookies and nonces (a guest makes no account requests; the first login merges the guest list; a heart clicked on one device appears on another with no clicks; a removal on one device is kept after the other reloads; a second account on the same browser does not receive the first's list; requests with no or a wrong nonce are refused). All 8 browser checks pass with no page errors.
  - **Limits:** two devices changing the list at the same moment: the last save wins. Someone who logs out and a guest then adds items on the same browser, then a *different* person logs in: the guest's items are not carried over (privacy first).
- **Cross-browser check: Firefox and Safari's engine (WebKit), as well as Chrome.** Everything had only been tested in Chrome. The Firefox and WebKit builds on the machine were older than the project's Playwright and hung when launched, so Playwright 1.65's own builds were downloaded (`npx playwright install firefox webkit`, about 100 MB into `~/Library/Caches/ms-playwright`; nothing in the project or the site changed). Versions tested: Chrome (system), Firefox 159, WebKit 27.2.
  - **Front-end suite: 17 of 17 in Firefox and in WebKit**, no page errors, no failed requests (grid, filters, Load more, quick view, variations, add to cart, hearts, Wishlist block, live search, rating votes, pricing toggle, carousel at three widths).
  - **Block editor suite: 15 of 15 in Chrome, Firefox and WebKit**, no page errors.
  - **Also 100% in Firefox and WebKit:** the account wishlist (8 of 8, including the shared-computer case and the nonce refusals), the live mini cart (identical counts, subtotal, toggle and removal), grouped products and stock limits against the real cart (4 of 4), and the comparison table popover and its tooltips (6 of 6).
  - **Result: no browser-specific bug was found in the plugin.** The only failure was in my own test: WebKit's editor takes longer to finish starting up, so a block inserted by the test while it was still loading was wiped by the editor's own start-up reset. The tests now wait for the editor to report it is ready.
  - **Not covered:** touch devices and phones (only a narrow desktop viewport was used for the carousel), Safari on iOS itself, Internet Explorer and old browser versions.
- **Quick view for grouped products and stock limits on quantity** (tested with WooCommerce active).
  - **Stock limit:** the server now sends how many can be bought when stock is managed (a variation has its own limit). The quantity box stops there, says "Up to N per order", and an amount typed above it is brought down, including before it is sent to the cart. A sold-individually product is limited to 1. No limit (stock not managed, or backorders allowed) keeps the usual cap of 99 and shows no note.
  - **Grouped products:** the dialog lists the group's items, each with its price and its own quantity box (sold-out items show "Out of stock" with no box), and one Add to cart button that stays disabled until a quantity is set. They are added through WooCommerce's own grouped-product address (`?add-to-cart=ID&quantity[child]=n`), like variable products. Items that are hidden from the shop on their own are included, because grouped products often use them; unpublished and password-protected items are left out. A group with nothing buyable, or no items, links to the product page as before.
  - **A bug found on the way:** WooCommerce does not treat a grouped product as purchasable itself (only its items), so the first version never offered the grouped dialog. It now decides from the items.
  - **Tested:** server data for stock 3, unlimited, backorders, sold individually, a limited variation, and grouped products with sold-out, hidden, draft and locked items; 8 new DOM tests (clamping, variation limits, the grouped list shown as text, the address sent, disabled when nothing is chosen); and a real browser against the real cart: typing 9 stops at 3 and 3 reach the cart, Small is limited to 5 and Large is not, the grouped list shows, and Add puts Part A (capped at 4) and the hidden Part C into the cart while the sold-out Part B is left out. All 4 pass. The full front-end suite (17) still passes.
  - **Limits:** the limit is read when the dialog opens; if stock changes meanwhile WooCommerce still checks it when adding. Only simple items of a group can be bought from the dialog.
- **Comparison table checked in a browser** (the last editor feature that had only been unit-tested). 6 checks pass, no page errors: adding a feature row from the block, the per-cell popover (text instead of the tick, and a tooltip), the feature tooltip field, clearing a cell value removes the field instead of leaving an empty one, save and reload (the block is valid and keeps its values), and the saved page (the cell text shows; both tooltips appear on hover and on keyboard focus and are readable by a screen reader). A screenshot showed one flaw, now fixed: the feature label and its "?" icon wrapped onto two lines. The tooltip bubble stays inside the table's scroll area.
- **PHP coding-standards pass** (`npm run lint:php` now runs here after the path fix). Run on the seven `includes/` classes written in this work and the templates edited.
  - **Security sniffs (escaping, nonces, input validation, SQL): no findings** in any of them. One old template (`carousel/render.php`) had two unescaped echoes that are safe by construction; they now carry justified ignore comments.
  - **Real problems found and fixed:**
    - `WP_HTML_Tag_Processor` is used in six places (Design layer, dynamic content, rating votes), but the plugin header says "Requires at least: 6.0" and that class arrived in WordPress 6.2. On 6.0 or 6.1 a page with a styled block would have hit a fatal error. Each place now checks the class exists and otherwise shows the block as saved, so nothing crashes. **Recommendation:** raise "Requires at least" to 6.2 (blocks with `apiVersion` 3 also want 6.3), because on older versions the Design styling, dynamic content and voting silently do nothing. That is your call, so the header and `README.txt` are unchanged.
    - Visibility dates (show from / until) used `current_time( 'timestamp' )`, a discouraged call that is easy to get wrong across timezones. They now compare `Y-m-d` text against `wp_date()` in the site's timezone. Checked in four timezones, including one where "today" is a different calendar day: 10 of 10 cases correct in each.
    - `phpcs.xml` had two stale settings: the allowed text domain was `gutenstar` (leftover boilerplate; the plugin's is `kriti-blocks`) and the compatibility check targeted PHP 5.4 while the plugin requires PHP 7.0. Both corrected, which removed about 150 false findings.
  - **Formatting:** `phpcbf` re-aligned the seven classes (no logic change). **Findings went from 295 to 108.** What remains is documentation-comment style (missing function docblocks and `@param` tags), the file-name convention `class-kriti-blocks-*.php`, a class-final rule, a parameter named `$class` and two short ternaries. Those were left as style and need a convention decision, not a fix.
  - **Re-checked after the changes:** all earlier PHP behaviour tests (heading and text, image, buttons, slots, links, list, rating votes, Design styles, global styles, grid endpoint, search, quick view data, wishlist) give the same results with no PHP warnings. The rate limits were re-tested at their current values (600 grid, 600 quick view and wishlist data, 900 search): each answers 429 right after the last allowed request.
- **Real browser check of the front end** (headless Google Chrome driven by the project's Playwright, on a temporary page with temporary WooCommerce products, all deleted afterwards). 17 checks pass, with no page errors and no failed requests:
  - **Product grid:** Load more through every page with no duplicates, price sort both ways, category, search, no-results message, in-stock only and price range.
  - **Quick view:** the dialog is labelled, Escape closes it and returns focus, add to cart really adds the product (confirmed in the cart), and the variable-product menu needs a choice and updates the price.
  - **Wishlist:** a heart survives a reload, shows in the Wishlist block, and removing it updates both.
  - **Live search:** suggestions, arrow keys, Escape, and Enter opens the product.
  - **Rating voting:** the stars become a radio group, hover previews, and a click saves the vote.
  - **Pricing table:** the Annual toggle swaps prices and leaves plans without a yearly price alone.
  - **Carousel:** three slides per view on desktop, two at tablet width and one at phone width, with arrows, dots and the right dot counts.
  - **Screenshots were looked at.** Not covered: the block editor itself (it needs a login, so the new sidebar panels are still only unit-tested and build-checked), other browsers, and touch devices.
  - **Bugs this found and fixed:**
    - `public/class-kriti-blocks-public.php` asked for `bootstrap..bundle.min.js` (double dot), which does not exist, so every front-end page made a request that returned 404. **Correction:** an earlier note here said Bootstrap's script never loaded and the carousel arrows did nothing. That was wrong: the admin class already loads the same file under the handle `bootstrap-bundle` on `enqueue_block_assets`, which also runs on the front end, so Bootstrap always worked. Simply fixing the file name made it load twice. The public class now enqueues that same `bootstrap-bundle` handle (WordPress prints it once) and keeps `bootstrap` registered as an alias without a file, so the 404 and the duplicate are both gone.
    - The standard carousel showed no dots at all, because the code counted inner blocks instead of slides (`src/blocks/carousel/render.php`).
    - `public/js/kriti-blocks-public.js` forced a 2 second interval on every carousel, overriding the block's own interval, and printed a "Carousel plugin not loaded" warning on every page. It now leaves the carousels to Bootstrap's data attributes.
    - The request limits were low enough that a shared office or school address could hit them (120 grid requests per 10 minutes). They are now 600 for the grid, 600 for quick view and wishlist data, and 900 for search.
    - The quick view left an empty half when a product had no picture, and the filter bar fields wrapped unevenly.
  - **Note:** the rating check also confirmed that each new browser counts as a new voter, as designed.
- **Real browser check of the block editor** (same headless Chrome, a short-lived login session for an existing administrator made with WP-CLI, destroyed afterwards; the temporary pages it saved were deleted). 15 checks pass: the three tabs with tooltips, the Layout and Advanced Design sections, the dynamic content panels, per-device text align and gap, copy and paste styles, position and layer, rating voting, carousel slides per view, the grid's Load more, filters, quick view and wishlist settings, search live suggestions, the wishlist block, the pricing toggle and team member slots. The page was then saved and reloaded: **every block is still valid and the values persisted.**
  - **Bugs this found and fixed:**
    - **Editor previews broken for 19 server-rendered blocks** (product grid, search, post grid, term list and others) with an HTTP 400 `animations is not a valid property of Object`. The blocks register an old list of attributes (`src/constants/advancedOptionsAttributes.js`, `layoutOptionsAttributes.js`) in JavaScript only, and the editor sends every attribute to the server to preview a block. The server now accepts those names (`LEGACY_ATTRIBUTES` in `includes/class-kriti-blocks-design.php`, empty definitions that change nothing else).
    - **The old lists replaced real attributes** in 10 blocks (`text` and `pricing-table` `columnGap`, `textColor` on three WooCommerce blocks, `linkColor` and `hoverColor` on `pagination` and `term-list`, and others), because they were spread after `block.json`. Their `index.js` now spreads them first, so `block.json` wins. This matters most for `text` and `pricing-table`: a saved column gap (a number) did not match the replaced definition (an object), so the value was dropped on reload and the block could show as invalid. A block saved with a column gap before this change may still need "Attempt recovery" once.
    - **The sidebar jumped back to the General tab, and the block was rebuilt, the first time any style was set.** The editor preview wrapper returned a different element structure with and without a style. Its structure is now constant.
    - **An empty "Typography" panel** appeared on blocks that already have every typography control themselves (heading, text). The panel is now hidden when all its controls are.
    - **Tab tooltips did not appear.** The `Tooltip` component does not attach to a tab title in this WordPress version (7.1.4). The tabs now use the browser's native `title` tooltip on a title that fills the whole tab button.
  - **Fixed afterwards:** the Bootstrap error in the editor. WordPress also gave the editor canvas (an iframe) a copy of Bootstrap's script, which crashed at start because the iframe has no `<body>` yet and never set itself up, so it gave nothing but an error. `admin/class-kriti-blocks-admin.php` no longer adds it to the canvas. The main editor page and the front end each still have exactly one copy. The editor suite now reports no page errors.
  - **Still there, not from this plugin:** the theme requests a missing `font-awesome.css`. Also not covered: the quick-view and filter UI inside the editor canvas, other browsers.
- **Bug-fix pass:**
  - `admin/css/kriti-blocks-editor.css` had a comment inside a comment, which CSS does not allow. The first inner `*/` ended the "switched off" block early, so a dashed border on every selected and highlighted block, plus a stray `padding: 10px; }` and a dangling `*/`, were live. The comment is fixed so it is off, as its author intended. Checked with a real CSS parser. (`src/admin/editor.css` is an unused copy and was left alone.)
  - The `columns` layout chooser was a list of clickable `<li>` elements with no keyboard support, so a keyboard user could not choose a column layout. They are now buttons (checked: Enter on "Column 2" sets the layout and creates two columns). Also removed a stray `9;` statement and moved the layout table out of the component, so the effect's dependencies are complete.
  - `IconPickerModal` used `key={name}`, an undefined name (it fell back to `window.name`, an empty string), so every icon had the same key. Fixed; the picker opens with all 2,860 icons and no key warnings.
  - The carousel's slide preview image had no `alt`, two components had duplicate imports, two `if`s had no braces, a `==` is now `===`, a test mock had a duplicate key, and browser globals were undeclared in three test files.
  - Removed `src/components/virtualIconGrid.js`: nothing imported it and it imports `react-window`, which is not installed, so it could never have built.
  - **Left alone, because they are not bugs or need a decision:** about 280 lint findings in older code (unused variables, JSDoc tags, `import/no-extraneous-dependencies` for WordPress packages, accessibility hints for `BaseControl` labels on grouped controls, shadowed parameter names, two constructors that only call `super`) and the tab-versus-space formatting mismatch described above.
- **Position and layer** (Design, Layout tab): a "Position & layer" section with position (relative, absolute, fixed, sticky), top / right / bottom / left offsets per device (negative values and `auto` allowed), and a z-index from -9999 to 9999. This brings back what the removed legacy Position and Z-index panels never actually did. Checked on the server (anything else is dropped), previewed in the editor. `row` and `grid` still honour old saved `positionType` and `zindex` values, but nothing in the editor sets those any more, so they use this section too.
- **Code quality pass:** ran the project's ESLint on the files added in this work and fixed what was real (unused variables, object shorthand, nested ternaries, missing browser globals in tests, the tab component now uses a map). Alignment logic that was written twice is now two small helpers in `style-utils.js`, with unit tests for the style helpers and the editor preview CSS, which had none. **Not changed:** the lint config expects tab indentation while the repo's own `.prettierrc` uses two spaces, so about 33,000 `prettier/prettier` errors show up across the whole repo, including files not touched here. That mismatch needs a decision (switch the config or the formatter) and was left alone. About 290 other lint findings in older files were also left alone.
- **WooCommerce quick view, variation selector and wishlist** (tested with WooCommerce active).
  - **Quick view:** a setting on the product grid adds a "Quick view" button to each product. It opens a native dialog with the pictures (up to four, with thumbnails), price, short description, quantity and add to cart, with focus handling, Escape and click-outside to close, and focus returned to the button. Everything from the server is plain data put on the page as text.
  - **Variation selector:** variable products show one menu per attribute. The price and picture follow the chosen combination, and an unavailable or sold-out combination blocks the button with a message. A product with more than 60 variations, or one that is out of stock, links to the product page instead. Simple products are added through WooCommerce's own AJAX endpoint (and its mini cart updates); variable products are added through the product-page address, because WooCommerce's AJAX endpoint refuses them.
  - **Wishlist:** a "Wishlist heart" setting on the grid, and a new **BW Wishlist** block (`woo-wishlist`) that lists the saved products with add to cart and remove buttons. Saved products are kept in the visitor's own browser (localStorage, or in memory if the browser blocks it), up to 100. The block asks the site for the current details of those products, so prices and stock are live, and products that were hidden or removed simply drop out. Hearts update everywhere on the page and across tabs.
  - **Server** (`includes/class-kriti-blocks-shop.php`): two public routes, `product-card` and `product-list`. They return only products the shop shows to anyone (published, not hidden, not password protected), as plain data with no HTML. At most 24 products per list, 600 requests per 10 minutes per address.
  - **Tested over real HTTP** on temporary products (deleted afterwards): the card for a simple and a variable product, the list with a missing product, WooCommerce's add to cart for a simple product, and a variable product added through the product-page address (the Large variant, quantity 2, subtotal 50.00 confirmed in the cart). Also hidden, draft and password-protected products, a product with 61 variations (falls back to the product page), a sold-out product, short descriptions with script tags, 60 or hostile ids, and the rate limits. 29 DOM tests cover the dialog, the variation logic, the hearts, the wishlist storage and the wishlist block.
  - **Bugs found and fixed while testing:** price text glued the hidden screen-reader text onto the price ("20.00 through 22.00"), and a sale price had no space between the old and new price. A variation's picture was never shown when the product had no gallery.
  - **Limits:** for a guest the wishlist is per browser and clears when the visitor clears site data (logged-in visitors also keep it on their account, see below). Quick view and hearts need JavaScript and are hidden without it. Grouped and external products open their product page.
- **WooCommerce live search:** the Product Search block has a "Live suggestions" setting. The new public route `kriti-blocks/v1/product-search` returns up to six products the site's own search would show (published, visible in search, not password protected), with title, link, price text and picture, optionally limited to the chosen category. The page script builds the list with text nodes, never HTML, and ignores any link or picture that is not http or https. It is an accessible combobox (arrow keys, Escape, "View all results"). At most 900 searches per 10 minutes per address.
  - **Tested** with 10 temporary products: hidden, catalog-only, draft and password-protected products are not returned; a category, an unknown category (ignored), a one-letter search, no match, a hostile search, the rate limit and the markup. Five DOM tests cover the script, including that server text is never inserted as HTML. A bug was found and fixed: `sanitize_title` used as a REST sanitize callback received the request object as an extra argument and crashed.
  - **Also verified** now that WooCommerce could be run: the 18 server-rendered blocks that return their HTML (see section 9) print correctly.
- **Dynamic links and list items:** the same panel now also offers a live link for `card` (whole-card link), `feature` (link), `pricing-column` (button) and `team-member` (profile link), stored in an optional `kbDynamicLinks` attribute (`LINK_SLOTS` in the PHP class). The `list` block gets a "Dynamic Items" panel with live text for each item and a live link for items that already have one. Items are matched to the saved list in order, skipping items with no text, exactly as the block does when saving. Links use the same sources and checks as the image and buttons blocks, so `javascript:` values are dropped.
  - **Gotcha:** a link can only be replaced where an anchor already exists, so a URL has to be set in the block first (the pricing column renders a plain span, not a link, until it has a URL).
  - **Tested:** each block above, an anchor that is missing, a second unrelated link next to the profile link (left alone), a `javascript:` field value, an unknown slot, a bad source, a password-protected post, a list with a blank item between others, a list item without an anchor, and a list with no dynamic settings (unchanged).
- **Dynamic text slots** for `team-member` (name, role, bio), `testimonial` (quote, author, role), `feature` (title, description), `quote` (quote, citation), `stat` (label), `alert` (title, message) and `pricing-column` (plan name). One "Dynamic content" panel is added to these blocks from the shared extensions bundle (`src/extensions/DynamicSlots.js`), so no block inspector was edited. The choice is stored in an optional `kbDynamicSlots` attribute and `includes/class-kriti-blocks-dynamic.php` swaps the text inside the element with the matching class when the block renders (a map of slot to class, `SLOTS`). A name inside a profile link keeps its link. The same sources and safety rules as heading and text apply.
  - **`card` and `cta`** need nothing: their text lives in inner blocks (heading, text, buttons), which already support dynamic content.
  - **Gotcha:** a slot only works when its element is in the saved markup, so some placeholder text has to be typed first (for example, an alert with an empty title has no title element). The panel says so. The class names in `SLOTS` must be kept in step with each block's `save.js`.
  - **Tested:** every block above with real-shaped markup, a name inside a link, a look-alike class (`bw-quote-content-extra`), an empty value, a private field, an unknown slot, a bad source, a password-protected post, hostile field content, and a block with no configuration (unchanged). The editor panel was built but not opened in a browser.
- **Dynamic content for `image` and `buttons`** (extends the class below): the image block can take its picture from the featured image, a custom field (image ID or URL), an ACF image field, the site logo or the author's picture, and its link from the post, the author's posts, the home page, or a custom or ACF field holding a web address, email or phone number. Each button in the buttons block can do the same for its link, and take its text from any of the heading and text sources. The saved picture, link and text stay in the markup and are the fallback when the live value is empty. The editor keeps showing the saved values. Shared field components are in `src/shared/DynamicFields.js` (the heading and text panel now uses them too).
  - **Safety:** links must be web, mail or phone links, so `javascript:` and `data:` values are dropped. Image URLs from fields must be http or https, and attachment IDs must be real images. The same field rules as heading and text apply (no private fields, scalar values only, no data from password-protected or unreadable posts, the `kriti_blocks_dynamic_field_allowed` filter). A lightbox link opens the live picture. If no picture was chosen in the editor, the site builds a minimal one from the live source, and the Design styles still apply to it. Alt text comes from the saved alt first, then the media library.
  - **Tested** on a temporary post and image (deleted afterwards): each image source, an image ID and a URL in a field, a bad URL, a private field, a password-protected post, no saved picture, each link source, a field with an email and with a phone number, a `javascript:` value, a lightbox link, an unknown source, three buttons mixing dynamic and fixed ones, and a buttons block with no dynamic settings (output unchanged). A PHP warning about a missing key was found and fixed. ACF was not tested because it is not installed here.
  - **Limits:** the other blocks are not covered. The author picture is the Gravatar for the author's email, and shows the default picture when there is none.
- `heading` and `text` dynamic content: a "Dynamic content" panel (shared component `src/shared/DynamicContentPanel.js`) with post title, excerpt, date, modified date, author, categories or tags, site title, tagline, current year, a custom field, or an ACF field, plus text before and after and a date format. New `includes/class-kriti-blocks-dynamic.php` swaps the text at render time. The text typed in the editor stays in the saved markup and is the fallback when the value is empty, so existing content and the block's saved HTML do not change. The editor keeps showing the fallback text, not a live preview.
  - **Safety:** output is plain text and escaped. Custom field names are limited to letters, numbers, dashes and underscores, and names starting with an underscore are refused. Arrays and objects are skipped. Post data is not shown for password-protected posts or unpublished posts the visitor cannot read. The tag name is checked against a list. Sites can block fields with the `kriti_blocks_dynamic_field_allowed` filter.
  - **Tested** on a temporary post (deleted afterwards): each source, prefix and suffix, a hostile custom field value, private, array, missing and malformed fields, an unknown source, a bad tag, a password-protected post, a heading with a subheading, and a block with no configuration. ACF was not tested because it is not installed here.
- `rating` voting: an optional "Let visitors vote" switch. Stars become clickable (keyboard and screen reader friendly) and show the visitors' average once there are votes. New `includes/class-kriti-blocks-rating.php` adds a public REST route `kriti-blocks/v1/rating-vote` and injects the live average when the block renders. Votes are stored as a running total in post meta (`_kb_rating_<id>`), not one row per vote.
  - **Checks on the server:** the post must be published, public and not password protected; the post content must contain a rating block with voting on and that exact id; the value must be within the block's maximum; at most 20 votes per hour per address (only a hash is kept; sites behind a proxy can supply the real address through the `kriti_blocks_rating_client_ip` filter).
  - **Limits:** a visitor is recognised by a token in their browser, so someone determined can vote more than once. Concurrent votes can rarely overwrite each other. It works only for blocks in the post content (not patterns or template parts). Page caches show the average from when the page was cached until the visitor votes. The search engine markup is switched off while voting is on, because the saved numbers would not match.
  - **Tested:** valid votes, a repeat vote, a second visitor, out-of-range values, a block with voting off, an unknown id, a malformed id and a draft post, against a temporary post that was deleted afterwards. The click behavior in `view.js` was not run in a browser.
- `carousel` per-slide background: each slide can have a background color and a color overlay with a strength of 0 to 90% (hex colors only, checked on the server). The overlay sits between the image and the caption. Works in both the standard and slides-per-view modes. The slide editor also no longer changes slide objects in place.
- `carousel`: slides per view (desktop 1 to 6, plus tablet, mobile and gap). At 1 or unset the Bootstrap output is unchanged. Above 1 it renders a scroll-snap track driven by the shared `initCarousel` (new `view.js`, new `visibleColumns` and `syncDots` helpers in `src/shared/carousel.js`). Arrows and dots appear only with JavaScript. Fade, vertical and thumbnails do not apply in this mode, and the editor preview still shows one slide.
- `comparison-table`: per-cell text in place of the tick, per-cell tooltips and per-feature tooltips. Tooltip text is in the HTML and shows on hover and focus.
- Both add nothing to saved markup unless used, and have tests for that.

**Still not done:** nothing from the original list. Considered and dropped: a per-user rate limit, because the product endpoints are public and WordPress cannot tell who a logged-in visitor is on a REST request without a nonce, so those requests would still be counted by address. `README.txt` now has a 1.0.7 changelog entry and upgrade notice (stable tag 1.0.7) covering the work in this file; there are no entries for 1.0.5 and 1.0.6, because what shipped as those versions is not recorded here. "Tested up to" still says 6.9 although everything here was tested on WordPress 7.1.4: change it when you decide to claim that.
