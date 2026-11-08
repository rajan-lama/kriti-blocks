import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const LogoSettingsPanel = ({ attributes, setAttributes }) => {
  const { logoColumns, grayscale } = attributes;

  const columnOptions = [2, 3, 4, 5, 6].map((number) => ({
    label: String(number),
    value: number,
  }));

  return (
    <PanelBody
      title={__('Logo Grid Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <SelectControl
        label={__('Columns', 'kriti-blocks')}
        value={logoColumns}
        options={columnOptions}
        onChange={(value) => setAttributes({ logoColumns: Number(value) })}
      />

      <ToggleControl
        label={__('Grayscale until hover', 'kriti-blocks')}
        help={__(
          'Logos display in grayscale and gain color on hover.',
          'kriti-blocks',
        )}
        checked={!!grayscale}
        onChange={(value) => setAttributes({ grayscale: value })}
      />
    </PanelBody>
  );
};

export default LogoSettingsPanel;
