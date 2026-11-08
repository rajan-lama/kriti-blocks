import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
  ColorField,
  FontFamilyFields,
  TEXT_SHADOW_CHOICES,
} from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    textShadow,
    textDecoration,
    decorationStyle,
    decorationColor,
    gradientFrom,
    gradientTo,
    gradientAngle,
    highlightColor,
    accentBar,
    barAlign,
    barColor,
    barWidth,
    barHeight,
    showSubheading,
    subheading,
    subheadingPosition,
  } = attributes;

  return (
    <>
      <PanelBody title={__('Subheading', 'kriti-blocks')} initialOpen={false}>
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show subheading', 'kriti-blocks')}
          checked={!!(showSubheading || subheading)}
          onChange={(value) =>
            setAttributes({
              showSubheading: value || undefined,
              subheading: value ? subheading : undefined,
            })
          }
        />
        {(showSubheading || subheading) && (
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Position', 'kriti-blocks')}
            value={subheadingPosition || 'below'}
            options={[
              {
                label: __('Below the heading', 'kriti-blocks'),
                value: 'below',
              },
              {
                label: __('Above the heading', 'kriti-blocks'),
                value: 'above',
              },
            ]}
            onChange={(value) =>
              setAttributes({
                subheadingPosition: value === 'below' ? undefined : value,
              })
            }
          />
        )}
      </PanelBody>

      <PanelBody
        title={__('Heading Typography', 'kriti-blocks')}
        initialOpen={false}
      >
        <FontFamilyFields
          attributes={attributes}
          setAttributes={setAttributes}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Text Shadow', 'kriti-blocks')}
          value={textShadow || ''}
          options={TEXT_SHADOW_CHOICES}
          onChange={(value) =>
            setAttributes({ textShadow: value || undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Text Decoration', 'kriti-blocks')}
          value={textDecoration || ''}
          options={[
            { label: __('None', 'kriti-blocks'), value: '' },
            { label: __('Underline', 'kriti-blocks'), value: 'underline' },
            {
              label: __('Strikethrough', 'kriti-blocks'),
              value: 'line-through',
            },
          ]}
          onChange={(value) =>
            setAttributes({ textDecoration: value || undefined })
          }
        />
        {textDecoration && (
          <>
            <SelectControl
              __nextHasNoMarginBottom
              label={__('Decoration Style', 'kriti-blocks')}
              value={decorationStyle || 'solid'}
              options={[
                { label: __('Solid', 'kriti-blocks'), value: 'solid' },
                { label: __('Dotted', 'kriti-blocks'), value: 'dotted' },
                { label: __('Dashed', 'kriti-blocks'), value: 'dashed' },
                { label: __('Wavy', 'kriti-blocks'), value: 'wavy' },
              ]}
              onChange={(value) => setAttributes({ decorationStyle: value })}
            />
            <ColorField
              label={__('Decoration Color', 'kriti-blocks')}
              value={decorationColor}
              onChange={(value) => setAttributes({ decorationColor: value })}
            />
          </>
        )}
      </PanelBody>

      <PanelBody
        title={__('Heading Effects', 'kriti-blocks')}
        initialOpen={false}
      >
        <ColorField
          label={__('Gradient Text: Start', 'kriti-blocks')}
          value={gradientFrom}
          onChange={(value) => setAttributes({ gradientFrom: value })}
        />
        <ColorField
          label={__('Gradient Text: End', 'kriti-blocks')}
          value={gradientTo}
          onChange={(value) => setAttributes({ gradientTo: value })}
        />
        {gradientFrom && gradientTo && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Gradient Angle', 'kriti-blocks')}
            value={gradientAngle ?? 90}
            onChange={(value) => setAttributes({ gradientAngle: value })}
            min={0}
            max={360}
          />
        )}
        <ColorField
          label={__('Highlight Color', 'kriti-blocks')}
          value={highlightColor}
          onChange={(value) => setAttributes({ highlightColor: value })}
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Accent bar under heading', 'kriti-blocks')}
          checked={!!accentBar}
          onChange={(value) => setAttributes({ accentBar: value || undefined })}
        />
        {accentBar && (
          <>
            <SelectControl
              __nextHasNoMarginBottom
              label={__('Bar Alignment', 'kriti-blocks')}
              value={barAlign || 'left'}
              options={[
                { label: __('Left', 'kriti-blocks'), value: 'left' },
                { label: __('Center', 'kriti-blocks'), value: 'center' },
                { label: __('Right', 'kriti-blocks'), value: 'right' },
              ]}
              onChange={(value) => setAttributes({ barAlign: value })}
            />
            <ColorField
              label={__('Bar Color', 'kriti-blocks')}
              value={barColor}
              onChange={(value) => setAttributes({ barColor: value })}
            />
            <RangeControl
              __nextHasNoMarginBottom
              label={__('Bar Width (px)', 'kriti-blocks')}
              value={barWidth ?? 60}
              onChange={(value) => setAttributes({ barWidth: value })}
              min={10}
              max={400}
            />
            <RangeControl
              __nextHasNoMarginBottom
              label={__('Bar Height (px)', 'kriti-blocks')}
              value={barHeight ?? 4}
              onChange={(value) => setAttributes({ barHeight: value })}
              min={1}
              max={20}
            />
          </>
        )}
      </PanelBody>
    </>
  );
}
