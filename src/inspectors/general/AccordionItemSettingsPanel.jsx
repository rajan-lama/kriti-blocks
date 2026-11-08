import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const AccordionItemSettingsPanel = ({ attributes, setAttributes }) => {
  const { itemOpen } = attributes;

  return (
    <PanelBody
      title={__('Accordion Item Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <ToggleControl
        label={__('Open by default', 'kriti-blocks')}
        help={__('Shows the panel content on page load.', 'kriti-blocks')}
        checked={!!itemOpen}
        onChange={(value) => setAttributes({ itemOpen: value })}
      />
    </PanelBody>
  );
};

export default AccordionItemSettingsPanel;
