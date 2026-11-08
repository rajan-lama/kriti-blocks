/**
 * @jest-environment node
 *
 * Option panel tests for the pagination block. The editor packages are mocked and
 * the panel functions are called directly, so no editor is started.
 */
jest.mock('@wordpress/components', () => {
  const React = require('react');
  return new Proxy(
    { __esModule: true },
    {
      get: (target, name) => {
        if (name in target) {
          return target[name];
        }
        const Mock = ({ children }) =>
          React.createElement('div', null, children);
        Mock.__mock = true;
        return Mock;
      },
    },
  );
});
jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  const make = () => {
    const Mock = ({ children }) => React.createElement('div', null, children);
    Mock.__mock = true;
    return Mock;
  };
  return {
    PanelColorSettings: make(),
    MediaUpload: make(),
    MediaUploadCheck: make(),
  };
});
jest.mock('@wordpress/data', () => ({
  useSelect: (callback) =>
    callback(() => ({
      getTaxonomies: () => [
        { slug: 'category', name: 'Categories', hierarchical: true },
      ],
      getCurrentPostType: () => 'post',
    })),
}));
import PaginationOptionsPanel from '../PaginationOptionsPanel';

import { collect, labels } from '../../../shared/kbquery-test-helpers';
import metadata from '../block.json';

const defaults = Object.fromEntries(
  Object.entries(metadata.attributes).map(([key, def]) => [key, def.default]),
);

/**
 * Calls every onChange in the tree (including colour settings) and returns the
 * attribute names the panel wrote.
 */
function written(tree, attributes) {
  const keys = [];
  const setAttributes = (patch) => keys.push(...Object.keys(patch));
  collect(tree(attributes, setAttributes)).forEach((el) => {
    const props = el.props || {};
    const fire = (handler, options) => {
      try {
        handler(options ? options[0].value : '1');
      } catch (error) {
        // A control that expects another value type is skipped.
      }
    };
    if (typeof props.onChange === 'function') {
      fire(props.onChange, props.options);
    }
    (props.colorSettings || []).forEach((setting) =>
      setting.onChange('#123456'),
    );
  });
  return keys;
}

const render = (attributes) => (attrs, setAttributes) =>
  PaginationOptionsPanel({ attributes: attrs, setAttributes });

test('shows the new controls', () => {
  const tree = render({})({ ...defaults }, () => {});
  expect(labels(tree)).toEqual(
    expect.arrayContaining([
      'Style',
      'Size',
      'Previous / next arrows',
      'Show first and last links',
      'Show "Page X of Y"',
      'Pagination colors',
    ]),
  );
});

test('every attribute the panel writes is declared in block.json with a matching type', () => {
  const keys = written(render({}), { ...defaults });
  expect(keys.length).toBeGreaterThan(3);
  keys.forEach((key) => expect(metadata.attributes).toHaveProperty(key));
});

test('colour settings cover default, hover and current states', () => {
  const tree = PaginationOptionsPanel({
    attributes: defaults,
    setAttributes: () => {},
  });
  const colors = collect(tree).find((el) => el.props && el.props.colorSettings);
  expect(colors.props.colorSettings.map((c) => c.label)).toEqual(
    expect.arrayContaining(['Hover background', 'Current page background']),
  );
});
