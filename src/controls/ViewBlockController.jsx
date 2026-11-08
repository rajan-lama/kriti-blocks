import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarButton } from '@wordpress/components';

import { seen, unseen } from '@wordpress/icons';

const ViewBlockController = ({ attributes, setAttributes }) => {
  const { preview } = attributes;

  const togglePreview = () => {
    setAttributes({ preview: !preview });
  };

  return (
    <>
      <Toolbar label="Options">
        <ToolbarButton
          icon={preview ? seen : unseen}
          onClick={togglePreview}
          label={preview ? __('Slider Mode') : __('Table Mode')}
        />
      </Toolbar>
    </>
  );
};
export default ViewBlockController;
