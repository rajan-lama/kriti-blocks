import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import ViewBlockController from '../../controls/ViewBlockController';

const BlockController = ({ attributes, setAttributes }) => {
  return (
    <BlockControls key="custom-controls">
      <ViewBlockController
        attributes={attributes}
        setAttributes={setAttributes}
      />
    </BlockControls>
  );
};
export default BlockController;
