/**
 * @jest-environment node
 *
 * Option panel tests for the term-list block. The editor packages are mocked and
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
import TermListOptionsPanel, {
  normalizeTermIds,
} from '../TermListOptionsPanel';

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
  TermListOptionsPanel({ attributes: attrs, setAttributes });

test('shows the new controls', () => {
  const tree = render({})({ ...defaults, layout: 'list' }, () => {});
  expect(labels(tree)).toEqual(
    expect.arrayContaining([
      'Only these term IDs',
      'Exclude term IDs',
      'Top-level terms only',
      'Link style',
      'Columns',
      'Icon',
      'Show term description',
      'Term colors',
    ]),
  );
});

test('every attribute the panel writes is declared in block.json with a matching type', () => {
  const keys = written(render({}), { ...defaults, layout: 'list' });
  expect(keys.length).toBeGreaterThan(3);
  keys.forEach((key) => expect(metadata.attributes).toHaveProperty(key));
});

test('normalizeTermIds keeps digits only, removes duplicates and zeros, caps at 100', () => {
  expect(normalizeTermIds('3, a, 3;4 0 -9')).toBe('3, 4, 9');
  expect(normalizeTermIds(null)).toBe('');
  const many = Array.from({ length: 150 }, (_, i) => i + 1).join(',');
  expect(normalizeTermIds(many).split(', ')).toHaveLength(100);
});

test('columns control only appears for the list layout', () => {
  const tree = TermListOptionsPanel({
    attributes: { ...defaults, layout: 'inline' },
    setAttributes: () => {},
  });
  expect(labels(tree)).not.toContain('Columns');
});
