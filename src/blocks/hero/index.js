/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import advancedOptionsAttributes from '../../constants/advancedOptionsAttributes';
import layoutOptionsAttributes from '../../constants/layoutOptionsAttributes';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

const heroIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 4h18v6H3V4zm0 8h9v8H3v-8zm11 0h7v8h-7v-8z"></path>
  </svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
  icon: heroIcon,

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
