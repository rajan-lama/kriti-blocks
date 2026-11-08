import {
  PanelBody,
  SelectControl,
  RangeControl,
  TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const RowSettingsPanel = ({ attributes, setAttributes }) => {
  const { tagType, gap, minHeight } = attributes;

  return (
    <PanelBody title={__('Row Settings', 'kriti-blocks')} initialOpen={true}>
      <SelectControl
        label={__('HTML Tag', 'kriti-blocks')}
        value={tagType}
        options={[
          { label: 'Div', value: 'div' },
          { label: 'Section', value: 'section' },
          { label: 'Article', value: 'article' },
          { label: 'Aside', value: 'aside' },
          { label: 'Main', value: 'main' },
          { label: 'Header', value: 'header' },
          { label: 'Footer', value: 'footer' },
          { label: 'Figure', value: 'figure' },
          { label: 'Nav', value: 'nav' },
        ]}
        onChange={(value) => setAttributes({ tagType: value })}
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Gap', 'kriti-blocks')}
        help={__('Spacing between the items in the row.', 'kriti-blocks')}
        value={gap}
        onChange={(value) => setAttributes({ gap: value })}
        min={0}
        max={200}
        step={1}
        allowReset
        resetFallbackValue={0}
      />

      <TextControl
        label={__('Min Height', 'kriti-blocks')}
        help={__('e.g. 300px or 30vh', 'kriti-blocks')}
        value={minHeight}
        onChange={(value) => setAttributes({ minHeight: value })}
      />
    </PanelBody>
  );
};

export default RowSettingsPanel;
