/**
 * @jest-environment node
 *
 * Output tests for the Buttons block.
 *
 * `@wordpress/block-editor` is mocked so the real save() functions can be
 * rendered to HTML without loading the editor.
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({
        className: `wp-block-kriti-blocks-buttons ${p.className || ''}`.trim(),
        style: p.style,
      }),
    },
    RichText: {
      Content: ({ tagName: Tag, className, value }) =>
        React.createElement(Tag, { className }, value),
    },
  };
});

import save from '../save';
import deprecated from '../deprecated';

const OLD_MARKUP =
  '<div class="wp-block-kriti-blocks-buttons"><a href="gmail.com" class="my-button" style="margin-right:10px">Button 1</a><a href="x.com" class="my-button" style="margin-right:10px">Two</a></div>';

const old = deprecated[0];
const oldAttrs = {
  buttons: [
    { text: 'Button 1', url: 'gmail.com' },
    { text: 'Two', url: 'x.com' },
  ],
};

test('deprecated save reproduces the markup saved before the options existed', () => {
  expect(renderToStaticMarkup(old.save({ attributes: oldAttrs }))).toBe(
    OLD_MARKUP,
  );
});

test('old markup differs from the new save, so WordPress will run the deprecation', () => {
  expect(
    renderToStaticMarkup(save({ attributes: { buttons: oldAttrs.buttons } })),
  ).not.toBe(OLD_MARKUP);
});

test('migration fills in defaults and keeps text and url', () => {
  const migrated = old.migrate(oldAttrs);
  expect(migrated.buttons[0]).toEqual({
    variant: 'solid',
    size: 'md',
    text: 'Button 1',
    url: 'gmail.com',
  });
});

test('new save carries link, icon and color options', () => {
  const html = renderToStaticMarkup(
    save({
      attributes: {
        justify: 'center',
        gap: 20,
        stackMobile: true,
        buttons: [
          {
            text: 'Buy',
            url: 'https://example.com',
            variant: 'outline',
            size: 'lg',
            newTab: true,
            nofollow: true,
            icon: 'cart',
            iconPosition: 'right',
            bg: '#ff0000',
            hoverBg: '#00ff00',
            ariaLabel: 'Buy now',
          },
        ],
      },
    }),
  );
  [
    'kb-buttons--center',
    'kb-buttons--stack',
    '--kb-btn-gap:20px',
    'kb-btn--outline',
    'kb-btn--lg',
    'target="_blank"',
    'rel="nofollow noopener noreferrer"',
    'aria-label="Buy now"',
    'kb-btn__icon--cart',
    '--kb-btn-bg:#ff0000',
    '--kb-btn-hover-bg:#00ff00',
  ].forEach((part) => expect(html).toContain(part));
  // The icon comes after the label when positioned right.
  expect(html.indexOf('kb-btn__label')).toBeLessThan(
    html.indexOf('kb-btn__icon'),
  );
});

test('unknown icon, variant and size values never reach the markup', () => {
  const html = renderToStaticMarkup(
    save({
      attributes: {
        buttons: [
          { text: 'x', icon: '"><script>', variant: 'evil', size: 'huge' },
        ],
      },
    }),
  );
  expect(html).not.toContain('script');
  expect(html).toContain('kb-btn--solid');
  expect(html).toContain('kb-btn--md');
});
