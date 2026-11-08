import { PanelBody, SelectControl, ColorPalette } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ListSettingsPanel = ({ attributes, setAttributes }) => {
  const { markerStyle, markerColor } = attributes;

  const colors = [
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Amber', color: '#d97706' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'Slate', color: '#334155' },
  ];

  return (
    <PanelBody title={__('List Settings', 'kriti-blocks')} initialOpen={true}>
      <SelectControl
        label={__('Marker Style', 'kriti-blocks')}
        value={markerStyle}
        options={[
          { label: __('Check', 'kriti-blocks'), value: 'check' },
          { label: __('Arrow', 'kriti-blocks'), value: 'arrow' },
          { label: __('Disc', 'kriti-blocks'), value: 'disc' },
          { label: __('Dash', 'kriti-blocks'), value: 'dash' },
          { label: __('Numbered', 'kriti-blocks'), value: 'number' },
        ]}
        onChange={(value) => setAttributes({ markerStyle: value })}
        __nextHasNoMarginBottom
      />

      <p>{__('Marker Color', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={colors}
        value={markerColor}
        onChange={(color) => setAttributes({ markerColor: color })}
        headingLevel="3"
      />
    </PanelBody>
  );
};

export default ListSettingsPanel;
