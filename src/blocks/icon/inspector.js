import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, ColorPalette } from '@wordpress/components';
import OptionsPanel from './OptionsPanel';

export default function Inspector({ attributes, setAttributes }) {
  const { size, color, bgColor, padding, borderRadius } = attributes;

  return (
    <InspectorControls>
      <PanelBody title={__('Icon Settings')}>
        <RangeControl
          label={__('Size')}
          value={size}
          onChange={(val) => setAttributes({ size: val })}
          min={10}
          max={500}
        />

        <p>{__('Icon Color')}</p>
        <ColorPalette
          value={color}
          onChange={(val) => setAttributes({ color: val })}
        />

        <p>{__('Background Color')}</p>
        <ColorPalette
          value={bgColor}
          onChange={(val) => setAttributes({ bgColor: val })}
        />

        <RangeControl
          label={__('Padding')}
          value={padding}
          onChange={(val) => setAttributes({ padding: val })}
          min={0}
          max={100}
        />

        <RangeControl
          label={__('Border Radius')}
          value={borderRadius}
          onChange={(val) => setAttributes({ borderRadius: val })}
          min={0}
          max={100}
        />
      </PanelBody>
      <OptionsPanel attributes={attributes} setAttributes={setAttributes} />
    </InspectorControls>
  );
}
