import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
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
      <PanelBody
        title={__('Pricing table layout', 'kriti-blocks')}
        initialOpen={false}
      >
        <RangeControl
          label={__('Columns per row', 'kriti-blocks')}
          help={__(
            'Leave unset to fit as many as the width allows.',
            'kriti-blocks',
          )}
          value={attributes.columns}
          min={1}
          max={6}
          allowReset
          onChange={(value) => setAttributes({ columns: value })}
        />
        <RangeControl
          label={__('Gap between columns (px)', 'kriti-blocks')}
          value={attributes.columnGap}
          min={0}
          max={80}
          allowReset
          onChange={(value) => setAttributes({ columnGap: value })}
        />
        <ToggleControl
          label={__('Natural column height', 'kriti-blocks')}
          help={__(
            'Off: all columns are as tall as the tallest one.',
            'kriti-blocks',
          )}
          checked={!!attributes.naturalHeight}
          onChange={(value) =>
            setAttributes({ naturalHeight: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Stack columns on', 'kriti-blocks')}
          value={attributes.stackBelow || 'none'}
          options={[
            { label: __('Automatic', 'kriti-blocks'), value: 'none' },
            { label: __('Tablet and mobile', 'kriti-blocks'), value: 'tablet' },
            { label: __('Mobile only', 'kriti-blocks'), value: 'mobile' },
          ]}
          onChange={(value) => setAttributes({ stackBelow: value })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
      <PanelBody
        title={__('Billing toggle', 'kriti-blocks')}
        initialOpen={false}
      >
        <ToggleControl
          label={__('Show monthly / yearly toggle', 'kriti-blocks')}
          help={__(
            'Set a yearly price on each column. Columns without one keep their normal price.',
            'kriti-blocks',
          )}
          checked={!!attributes.billingToggle}
          onChange={(value) =>
            setAttributes({ billingToggle: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        {attributes.billingToggle && (
          <>
            <TextControl
              label={__('Monthly label', 'kriti-blocks')}
              value={attributes.monthlyLabel || ''}
              placeholder="Monthly"
              onChange={(value) => setAttributes({ monthlyLabel: value })}
            />
            <TextControl
              label={__('Yearly label', 'kriti-blocks')}
              value={attributes.yearlyLabel || ''}
              placeholder="Yearly"
              onChange={(value) => setAttributes({ yearlyLabel: value })}
            />
            <ToggleControl
              label={__('Start on yearly', 'kriti-blocks')}
              checked={!!attributes.yearlyDefault}
              onChange={(value) =>
                setAttributes({ yearlyDefault: value || undefined })
              }
              __nextHasNoMarginBottom
            />
          </>
        )}
      </PanelBody>
    </InspectorControls>
  );
}
