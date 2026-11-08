# BW Search

## Description
A site search form that submits to the WordPress search results page. The form
is rendered on the server so the search field always reflects the current
query.

## Features
- Customizable field label, placeholder, and button text
- Optional submit button (icon-only or button-less via keyboard submit)
- Inline or stacked layout
- Optionally restrict results to a single public post type
- Accessible label and search input

## Attributes
- `label` (string) — Screen reader label for the field
- `placeholder` (string) — Field placeholder text
- `buttonText` (string) — Submit button label
- `showButton` (boolean) — Show the submit button
- `layout` (string) — inline | stacked
- `postType` (string) — Optional post type slug to restrict results
- `htmlId` (string) — Custom HTML id attribute
- `extraClass` (string) — Custom CSS class name

## Usage
Insert the block wherever search should be available, such as a header, sidebar,
or a search template. Leave the label empty to use the default accessible
label.

## Accessibility
The field uses a real `label` associated by id. The label is visually hidden by
default using the WordPress `screen-reader-text` class, and the form uses
`role="search"`.

## Notes
The optional post type value is validated against registered post types before
being output.

## Browser Support
All browsers supported by the modern WordPress block editor.
