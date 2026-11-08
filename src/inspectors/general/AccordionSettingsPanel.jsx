import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const AccordionSettingsPanel = ({ attributes, setAttributes }) => {
  const { closeOthers } = attributes;

  return (
    <PanelBody
      title={__('Accordion Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <ToggleControl
        label={__('Only one open at a time', 'kriti-blocks')}
        help={__('Opening a panel closes the other panels.', 'kriti-blocks')}
        checked={!!closeOthers}
        onChange={(value) => setAttributes({ closeOthers: value })}
      />
    </PanelBody>
  );
};

export default AccordionSettingsPanel;
