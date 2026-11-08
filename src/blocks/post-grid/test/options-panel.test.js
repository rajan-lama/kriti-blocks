/**
 * @jest-environment node
 *
 * Checks the shared query panels used by the Post Grid block: that the new
 * controls are present and that they write the attribute names block.json
 * declares.
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
jest.mock('@wordpress/data', () => ({
  useSelect: (callback) =>
    callback(() => ({
      getTaxonomies: () => [{ slug: 'post_tag', name: 'Tags' }],
      getEntityRecords: () => [{ id: 7, name: 'News' }],
    })),
}));

import {
  QueryFilterPanel,
  QueryCardPanel,
} from '../../../shared/kbquery-controls';
import { byLabel, labels } from '../../../shared/kbquery-test-helpers';
import metadata from '../block.json';

const attributes = Object.fromEntries(
  Object.entries(metadata.attributes).map(([key, def]) => [key, def.default]),
);

const setup = (panel, extra = {}) => {
  const setAttributes = jest.fn();
  const tree = panel({
    attributes: { ...attributes, ...extra },
    setAttributes,
    ...extra.props,
  });
  return { tree, setAttributes };
};

test('every attribute the panels write is declared in block.json', () => {
  const written = [];
  const spy = (patch) => written.push(...Object.keys(patch));

  [QueryFilterPanel, QueryCardPanel].forEach((panel) => {
    const tree = panel({
      attributes: {
        ...attributes,
        postType: 'post',
        filterTaxonomy: 'post_tag',
      },
      setAttributes: spy,
    });
    const { collect } = require('../../../shared/kbquery-test-helpers');
    collect(tree).forEach((el) => {
      if (el.props && typeof el.props.onChange === 'function') {
        const value = el.props.options ? el.props.options[0].value : '1';
        try {
          el.props.onChange(value);
        } catch (error) {
          // Controls that expect a different value type are ignored.
        }
      }
    });
  });

  expect(written.length).toBeGreaterThan(8);
  written.forEach((key) =>
    expect(Object.keys(metadata.attributes)).toContain(key),
  );
});

test('filter panel offers taxonomy, id lists, offset and sticky posts', () => {
  const { tree } = setup(QueryFilterPanel);
  expect(labels(tree)).toEqual(
    expect.arrayContaining([
      'Filter by taxonomy',
      'Only these IDs',
      'Exclude IDs',
      'Skip the first items (offset)',
      'Sticky posts',
    ]),
  );
});

test('picking a taxonomy resets the chosen terms', () => {
  const { tree, setAttributes } = setup(QueryFilterPanel, {
    filterTermIds: [3],
  });
  byLabel(tree, 'Filter by taxonomy').props.onChange('post_tag');
  expect(setAttributes).toHaveBeenCalledWith({
    filterTaxonomy: 'post_tag',
    filterTermIds: [],
  });
});

test('typed ID lists are cleaned before they are stored', () => {
  const { tree, setAttributes } = setup(QueryFilterPanel);
  byLabel(tree, 'Exclude IDs').props.onChange('4, x, 4, 9');
  expect(setAttributes).toHaveBeenCalledWith({ excludeIds: '4, 9' });
});

test('card panel offers style, ratio, hover, title tag and per-device columns', () => {
  const { tree } = setup(QueryCardPanel);
  expect(labels(tree)).toEqual(
    expect.arrayContaining([
      'Card style',
      'Image ratio',
      'Hover effect',
      'Title element',
      'Show reading time',
      'Show comment count',
      'Columns on tablet',
      'Columns on mobile',
      'Message when nothing matches',
    ]),
  );
  expect(labels(tree)).not.toContain('Space between slides (px)');
});
