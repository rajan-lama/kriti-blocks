import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const AlertSettingsPanel = ({ attributes, setAttributes }) => {
  const { alertType, showIcon } = attributes;

  return (
    <PanelBody title={__('Alert Settings', 'kriti-blocks')} initialOpen={true}>
      <SelectControl
        label={__('Type', 'kriti-blocks')}
        value={alertType}
        options={[
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
        ]}
        onChange={(value) => setAttributes({ alertType: value })}
      />

      <ToggleControl
        label={__('Show Icon', 'kriti-blocks')}
        checked={showIcon}
        onChange={(value) => setAttributes({ showIcon: value })}
      />
    </PanelBody>
  );
};

export default AlertSettingsPanel;
