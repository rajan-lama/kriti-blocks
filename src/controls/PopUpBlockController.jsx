import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarButton } from '@wordpress/components';

import { pencil } from '@wordpress/icons';

const PopUpBlockController = ({
  attributes,
  setAttributes,
  selectedIcon,
  setOpen,
}) => {
  const { preview } = attributes;

  const togglePreview = () => {
    setAttributes({ preview: !preview });
  };

  return (
    <>
      <Toolbar label="Options">
        <ToolbarButton
          icon={pencil}
          onClick={() => setOpen(true)}
          label={selectedIcon ? __('Change Icon') : __('Select Icon')}
        />
      </Toolbar>
    </>
  );
};
export default PopUpBlockController;
