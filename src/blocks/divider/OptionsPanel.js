import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    dividerText,
    dividerIcon,
    labelColor,
    widthTablet,
    widthMobile,
    weightMobile,
    dividerShape,
    shapeHeight,
    shapeFlip,
  } = attributes;

  return (
    <>
      <PanelBody
        title={__('Divider Content', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          __nextHasNoMarginBottom
          label={__('Text in the middle', 'kriti-blocks')}
          value={dividerText || ''}
          onChange={(value) =>
            setAttributes({ dividerText: value || undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Icon in the middle', 'kriti-blocks')}
          value={dividerIcon || ''}
          options={[
            { label: __('None', 'kriti-blocks'), value: '' },
            { label: __('Star', 'kriti-blocks'), value: 'star' },
            { label: __('Diamond', 'kriti-blocks'), value: 'diamond' },
            { label: __('Dot', 'kriti-blocks'), value: 'dot' },
            { label: __('Heart', 'kriti-blocks'), value: 'heart' },
          ]}
          onChange={(value) =>
            setAttributes({ dividerIcon: value || undefined })
          }
        />
        {(dividerText || dividerIcon) && (
          <ColorField
            label={__('Text and Icon Color', 'kriti-blocks')}
            value={labelColor}
            onChange={(value) => setAttributes({ labelColor: value })}
          />
        )}
      </PanelBody>

      <PanelBody
        title={__('Shape Divider', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Shape (uses the divider color)', 'kriti-blocks')}
          value={dividerShape || ''}
          options={[
            { label: __('None (line)', 'kriti-blocks'), value: '' },
            { label: __('Wave', 'kriti-blocks'), value: 'wave' },
            { label: __('Curve', 'kriti-blocks'), value: 'curve' },
            { label: __('Triangle', 'kriti-blocks'), value: 'triangle' },
            { label: __('Zigzag', 'kriti-blocks'), value: 'zigzag' },
          ]}
          onChange={(value) =>
            setAttributes({ dividerShape: value || undefined })
          }
        />
        {dividerShape && (
          <>
            <RangeControl
              __nextHasNoMarginBottom
              label={__('Shape Height (px)', 'kriti-blocks')}
              value={shapeHeight ?? 40}
              onChange={(value) => setAttributes({ shapeHeight: value })}
              min={10}
              max={240}
            />
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Flip vertically', 'kriti-blocks')}
              checked={!!shapeFlip}
              onChange={(value) =>
                setAttributes({ shapeFlip: value || undefined })
              }
            />
          </>
        )}
      </PanelBody>

      <PanelBody
        title={__('Responsive Divider', 'kriti-blocks')}
        initialOpen={false}
      >
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Width on tablet (%)', 'kriti-blocks')}
          value={widthTablet ?? attributes.dividerWidth ?? 100}
          onChange={(value) => setAttributes({ widthTablet: value })}
          min={5}
          max={100}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Width on mobile (%)', 'kriti-blocks')}
          value={widthMobile ?? attributes.dividerWidth ?? 100}
          onChange={(value) => setAttributes({ widthMobile: value })}
          min={5}
          max={100}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Thickness on mobile (px)', 'kriti-blocks')}
          value={weightMobile ?? attributes.dividerWeight ?? 2}
          onChange={(value) => setAttributes({ weightMobile: value })}
          min={1}
          max={40}
          allowReset
          resetFallbackValue={undefined}
        />
      </PanelBody>
    </>
  );
}
