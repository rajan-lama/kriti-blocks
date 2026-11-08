/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import advancedOptionsAttributes from '../../constants/advancedOptionsAttributes';
import layoutOptionsAttributes from '../../constants/layoutOptionsAttributes';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const rowIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 7h16a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1zm.5 2v6h15V9h-15z"></path>
    <rect x="5.5" y="10.5" width="3" height="3" rx="0.5"></rect>
    <rect x="10.5" y="10.5" width="3" height="3" rx="0.5"></rect>
    <rect x="15.5" y="10.5" width="3" height="3" rx="0.5"></rect>
  </svg>
);

const stackIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 5h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 6h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1zm0 6h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z"></path>
  </svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
  icon: rowIcon,

  // Merge attributes from block.json and the shared option constants.
  attributes: {
    ...metadata.attributes,
    ...advancedOptionsAttributes,
    ...layoutOptionsAttributes,
  },

  /**
   * @see ./edit.js
   */
  edit: Edit,

  /**
   * @see ./save.js
   */
  save,
});

/**
 * The Stack block is a variation of the Row block that stacks its children
 * vertically. Keeping it as a variation avoids a near-duplicate block while
 * giving users a dedicated inserter entry.
 */
registerBlockVariation(metadata.name, {
  name: 'stack',
  title: __('BW Stack', 'kriti-blocks'),
  description: __(
    'Stack blocks vertically with consistent spacing.',
    'kriti-blocks',
  ),
  icon: stackIcon,
  category: 'kriti-blocks',
  keywords: ['stack', 'vertical', 'column'],
  attributes: {
    displayType: 'flex',
    rowDirection: 'column',
  },
  isActive: (blockAttributes) => blockAttributes.rowDirection === 'column',
});
