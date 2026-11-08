import { InspectorControls } from '@wordpress/block-editor';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';
import metadata from './block.json';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
      <PanelBody title={__('Title', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          label={__('Title element', 'kriti-blocks')}
          help={__(
            'Pick the heading level that fits the page outline.',
            'kriti-blocks',
          )}
          value={attributes.titleTag || 'h3'}
          options={['h2', 'h3', 'h4', 'h5', 'h6', 'div'].map((v) => ({
            value: v,
            label: v,
          }))}
          onChange={(titleTag) => setAttributes({ titleTag })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
    </InspectorControls>
  );
}
