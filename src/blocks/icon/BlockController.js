import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarButton } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';

import { pencil, seen, unseen } from '@wordpress/icons';
import PopUpBlockController from '../../controls/PopUpBlockController';

const BlockController = ({
  attributes,
  setAttributes,
  selectedIcon,
  setOpen,
}) => {
  return (
    <BlockControls key="custom-controls">
      <PopUpBlockController
        attributes={attributes}
        setAttributes={setAttributes}
        selectedIcon={selectedIcon}
        setOpen={setOpen}
      />
    </BlockControls>
  );
};
export default BlockController;
