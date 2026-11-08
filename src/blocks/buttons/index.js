/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
  edit: Edit,
  save,
  deprecated,
});
