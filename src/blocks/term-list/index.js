/**
 * Registers the term list block.
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

registerBlockType(metadata.name, {
  attributes: {
    // The older lists come first, so the real definitions in block.json win.
    ...advancedOptionsAttributes,
    ...layoutOptionsAttributes,
    ...metadata.attributes,
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
