import { __ } from '@wordpress/i18n';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import metadata from './block.json';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
      <PanelBody title={__('Tabs layout', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          label={__('Style', 'kriti-blocks')}
          value={attributes.tabsStyle}
          options={[
            { value: 'underline', label: __('Underline', 'kriti-blocks') },
            { value: 'pills', label: __('Pills', 'kriti-blocks') },
            { value: 'boxed', label: __('Boxed', 'kriti-blocks') },
          ]}
          onChange={(tabsStyle) => setAttributes({ tabsStyle })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Orientation', 'kriti-blocks')}
          value={attributes.orientation}
          options={[
            { value: 'horizontal', label: __('Horizontal', 'kriti-blocks') },
            {
              value: 'vertical',
              label: __('Vertical (tabs at the side)', 'kriti-blocks'),
            },
          ]}
          onChange={(orientation) => setAttributes({ orientation })}
          help={__(
            'Vertical tabs switch back to horizontal on small screens.',
            'kriti-blocks',
          )}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Tab alignment', 'kriti-blocks')}
          value={attributes.tabAlign}
          options={[
            { value: 'left', label: __('Left', 'kriti-blocks') },
            { value: 'center', label: __('Center', 'kriti-blocks') },
            { value: 'right', label: __('Right', 'kriti-blocks') },
            { value: 'stretch', label: __('Fill the width', 'kriti-blocks') },
          ]}
          onChange={(tabAlign) => setAttributes({ tabAlign })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Tab shown first', 'kriti-blocks')}
          value={String(attributes.defaultTab || 0)}
          options={(attributes.tabItems || []).map((t, i) => ({
            value: String(i),
            label: `${i + 1}`,
          }))}
          onChange={(v) => setAttributes({ defaultTab: Number(v) })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Panel padding (px)', 'kriti-blocks')}
          value={attributes.panelPadding}
          min={0}
          max={80}
          allowReset
          onChange={(panelPadding) => setAttributes({ panelPadding })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
      <PanelColorSettings
        title={__('Tab colors', 'kriti-blocks')}
        initialOpen={false}
        colorSettings={[
          {
            label: __('Tab text', 'kriti-blocks'),
            value: attributes.tabColor,
            onChange: (v) => setAttributes({ tabColor: v }),
          },
          {
            label: __('Tab text on hover', 'kriti-blocks'),
            value: attributes.hoverColor,
            onChange: (v) => setAttributes({ hoverColor: v }),
          },
          {
            label: __('Active tab text and accent', 'kriti-blocks'),
            value: attributes.activeColor,
            onChange: (v) => setAttributes({ activeColor: v }),
          },
          {
            label: __('Active tab background', 'kriti-blocks'),
            value: attributes.activeBg,
            onChange: (v) => setAttributes({ activeBg: v }),
          },
          {
            label: __('Divider line', 'kriti-blocks'),
            value: attributes.lineColor,
            onChange: (v) => setAttributes({ lineColor: v }),
          },
          {
            label: __('Panel background', 'kriti-blocks'),
            value: attributes.panelBg,
            onChange: (v) => setAttributes({ panelBg: v }),
          },
        ]}
      />
    </InspectorControls>
  );
}
