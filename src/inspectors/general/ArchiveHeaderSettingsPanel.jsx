import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ArchiveHeaderSettingsPanel = ({ attributes, setAttributes }) => {
  const { showTitle, headingLevel, showPrefix, showDescription } = attributes;

  return (
    <PanelBody
      title={__('Archive Header Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <ToggleControl
        label={__('Show title', 'kriti-blocks')}
        checked={!!showTitle}
        onChange={(value) => setAttributes({ showTitle: value })}
      />

      {showTitle && (
        <>
          <SelectControl
            label={__('Heading level', 'kriti-blocks')}
            value={String(headingLevel)}
            options={[
              { label: 'H1', value: '1' },
              { label: 'H2', value: '2' },
              { label: 'H3', value: '3' },
              { label: 'H4', value: '4' },
              { label: 'H5', value: '5' },
              { label: 'H6', value: '6' },
            ]}
            onChange={(value) =>
              setAttributes({
                headingLevel: parseInt(value, 10),
              })
            }
          />

          <ToggleControl
            label={__('Show archive prefix', 'kriti-blocks')}
            help={__('For example "Category:" or "Tag:".', 'kriti-blocks')}
            checked={!!showPrefix}
            onChange={(value) => setAttributes({ showPrefix: value })}
          />
        </>
      )}

      <ToggleControl
        label={__('Show description', 'kriti-blocks')}
        checked={!!showDescription}
        onChange={(value) => setAttributes({ showDescription: value })}
      />
    </PanelBody>
  );
};

export default ArchiveHeaderSettingsPanel;
