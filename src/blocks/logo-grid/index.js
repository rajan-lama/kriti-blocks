import { registerBlockType } from '@wordpress/blocks';
import advancedOptionsAttributes from '../../constants/advancedOptionsAttributes';
import layoutOptionsAttributes from '../../constants/layoutOptionsAttributes';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

const logoGridIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h4v-6h-4v6zm0-14v6h4V5h-4zm-6 6h5V5h-5v6z"></path>
  </svg>
);

registerBlockType(metadata.name, {
  icon: logoGridIcon,

  attributes: {
    ...metadata.attributes,
    ...advancedOptionsAttributes,
    ...layoutOptionsAttributes,
  },

  edit: Edit,

  save,
});
