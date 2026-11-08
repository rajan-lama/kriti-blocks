import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const FaqSettingsPanel = ({ attributes, setAttributes }) => {
  const { firstOpen } = attributes;

  return (
    <PanelBody title={__('FAQ Settings', 'kriti-blocks')} initialOpen={true}>
      <ToggleControl
        label={__('Open first item by default', 'kriti-blocks')}
        help={__(
          'Expands the first FAQ item when the page loads.',
          'kriti-blocks',
        )}
        checked={!!firstOpen}
        onChange={(value) => setAttributes({ firstOpen: value })}
      />
    </PanelBody>
  );
};

export default FaqSettingsPanel;
