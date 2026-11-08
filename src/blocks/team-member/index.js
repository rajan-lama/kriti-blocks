import { registerBlockType } from '@wordpress/blocks';
import advancedOptionsAttributes from '../../constants/advancedOptionsAttributes';
import layoutOptionsAttributes from '../../constants/layoutOptionsAttributes';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

const teamMemberIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
  </svg>
);

registerBlockType(metadata.name, {
  icon: teamMemberIcon,

  attributes: {
    ...metadata.attributes,
    ...advancedOptionsAttributes,
    ...layoutOptionsAttributes,
  },

  edit: Edit,

  save,
});
