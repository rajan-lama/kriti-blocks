import { registerBlockType } from '@wordpress/blocks';
import advancedOptionsAttributes from '../../constants/advancedOptionsAttributes';
import layoutOptionsAttributes from '../../constants/layoutOptionsAttributes';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

const statIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"></path>
  </svg>
);

registerBlockType(metadata.name, {
  icon: statIcon,

  attributes: {
    ...metadata.attributes,
    ...advancedOptionsAttributes,
    ...layoutOptionsAttributes,
  },

  edit: Edit,

  save,
});
