import {
  PanelBody,
  ColorPalette,
  SelectControl,
  RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TimelineSettingsPanel = ({ attributes, setAttributes }) => {
  const { timelineColor } = attributes;

  const colors = [
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Amber', color: '#d97706' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'Slate', color: '#334155' },
  ];

  return (
    <>
      <PanelBody
        title={__('Timeline Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={timelineColor}
          onChange={(color) => setAttributes({ timelineColor: color })}
          headingLevel="3"
        />
      </PanelBody>

      <PanelBody
        title={__('Timeline style', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          label={__('Layout', 'kriti-blocks')}
          help={__(
            'Alternating falls back to one side on small screens.',
            'kriti-blocks',
          )}
          value={attributes.timelineLayout || 'left'}
          options={[
            { label: __('Line on the left', 'kriti-blocks'), value: 'left' },
            { label: __('Line on the right', 'kriti-blocks'), value: 'right' },
            { label: __('Alternating', 'kriti-blocks'), value: 'alternate' },
          ]}
          onChange={(value) => setAttributes({ timelineLayout: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Line style', 'kriti-blocks')}
          value={attributes.lineStyle || 'solid'}
          options={[
            { label: __('Solid', 'kriti-blocks'), value: 'solid' },
            { label: __('Dashed', 'kriti-blocks'), value: 'dashed' },
            { label: __('Dotted', 'kriti-blocks'), value: 'dotted' },
          ]}
          onChange={(value) => setAttributes({ lineStyle: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Line thickness (px)', 'kriti-blocks')}
          value={attributes.lineWidth}
          min={1}
          max={10}
          allowReset
          onChange={(value) => setAttributes({ lineWidth: value })}
        />
        <p>{__('Line color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.lineColor}
          onChange={(color) => setAttributes({ lineColor: color })}
          headingLevel="3"
        />
        <SelectControl
          label={__('Marker style', 'kriti-blocks')}
          value={attributes.markerStyle || 'dot'}
          options={[
            { label: __('Dot', 'kriti-blocks'), value: 'dot' },
            { label: __('Ring', 'kriti-blocks'), value: 'ring' },
            { label: __('Square', 'kriti-blocks'), value: 'square' },
          ]}
          onChange={(value) => setAttributes({ markerStyle: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Marker size (px)', 'kriti-blocks')}
          value={attributes.markerSize}
          min={8}
          max={32}
          allowReset
          onChange={(value) => setAttributes({ markerSize: value })}
        />
        <SelectControl
          label={__('Date style', 'kriti-blocks')}
          value={attributes.dateStyle || 'plain'}
          options={[
            { label: __('Plain text', 'kriti-blocks'), value: 'plain' },
            { label: __('Badge', 'kriti-blocks'), value: 'badge' },
          ]}
          onChange={(value) => setAttributes({ dateStyle: value })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
    </>
  );
};

export default TimelineSettingsPanel;
