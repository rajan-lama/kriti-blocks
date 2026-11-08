import { registerBlockType } from '@wordpress/blocks';
import advancedOptionsAttributes from '../../constants/advancedOptionsAttributes';
import layoutOptionsAttributes from '../../constants/layoutOptionsAttributes';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

const accordionIcon = (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 5h18v2H3V5zm0 4h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"></path>
  </svg>
);

registerBlockType(metadata.name, {
  icon: accordionIcon,

  attributes: {
    ...metadata.attributes,
    ...advancedOptionsAttributes,
    ...layoutOptionsAttributes,
  },

  edit: Edit,

  save,
});
