import {
  PanelBody,
  ButtonGroup,
  Button,
  ToggleControl,
  TextareaControl,
  TextControl,
  SelectControl,
  ColorPalette,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const PricingColumnSettingsPanel = ({ attributes, setAttributes }) => {
  const { planAlign, isHighlight } = attributes;

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <>
      <PanelBody
        title={__('Pricing Column Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <TextControl
          label={__('Yearly price', 'kriti-blocks')}
          help={__(
            "Shown when the table's billing toggle is set to yearly.",
            'kriti-blocks',
          )}
          value={attributes.yearlyPrice || ''}
          onChange={(value) => setAttributes({ yearlyPrice: value })}
        />
        <TextControl
          label={__('Yearly period', 'kriti-blocks')}
          value={attributes.yearlyPeriod || ''}
          placeholder="/year"
          onChange={(value) => setAttributes({ yearlyPeriod: value })}
        />
        <SelectControl
          label={__('HTML Tag', 'kriti-blocks')}
          value={attributes.tagType}
          options={[
            { label: 'Div', value: 'div' },
            { label: 'Article', value: 'article' },
            { label: 'Aside', value: 'aside' },
            { label: 'Section', value: 'section' },
          ]}
          onChange={(value) => setAttributes({ tagType: value })}
        />

        <ButtonGroup aria-label={__('Content Alignment', 'kriti-blocks')}>
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              isSmall
              onClick={() => setAttributes({ planAlign: option.value })}
              isPressed={planAlign === option.value}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>

        <TextareaControl
          label={__('Features (one per line)', 'kriti-blocks')}
          help={__(
            'Each line becomes a bullet point in the plan.',
            'kriti-blocks',
          )}
          value={attributes.features}
          onChange={(value) => setAttributes({ features: value })}
          rows={6}
        />

        <TextControl
          label={__('Button Text', 'kriti-blocks')}
          value={attributes.buttonText}
          onChange={(value) => setAttributes({ buttonText: value })}
        />

        <TextControl
          type="url"
          label={__('Button URL', 'kriti-blocks')}
          value={attributes.buttonUrl}
          onChange={(value) => setAttributes({ buttonUrl: value })}
        />

        <ToggleControl
          label={__('Highlight this plan', 'kriti-blocks')}
          help={__('Marks the column as the featured option.', 'kriti-blocks')}
          checked={!!isHighlight}
          onChange={(value) => setAttributes({ isHighlight: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Pricing extras', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          label={__('Currency symbol', 'kriti-blocks')}
          help={__('Shown before the price, for example $.', 'kriti-blocks')}
          value={attributes.currencySymbol || ''}
          onChange={(value) =>
            setAttributes({ currencySymbol: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <TextControl
          label={__('Original price (struck through)', 'kriti-blocks')}
          help={__('For a sale, for example $49.', 'kriti-blocks')}
          value={attributes.originalPrice || ''}
          onChange={(value) =>
            setAttributes({ originalPrice: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <TextControl
          label={__('Badge text', 'kriti-blocks')}
          help={__(
            'Shows a badge even when the plan is not highlighted.',
            'kriti-blocks',
          )}
          value={attributes.badgeText || ''}
          onChange={(value) => setAttributes({ badgeText: value || undefined })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Feature icon', 'kriti-blocks')}
          value={attributes.featureIconStyle || 'check'}
          options={[
            { label: __('Check', 'kriti-blocks'), value: 'check' },
            { label: __('Cross', 'kriti-blocks'), value: 'cross' },
            { label: __('Dot', 'kriti-blocks'), value: 'dot' },
            { label: __('Arrow', 'kriti-blocks'), value: 'arrow' },
            { label: __('None', 'kriti-blocks'), value: 'none' },
          ]}
          onChange={(value) => setAttributes({ featureIconStyle: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__(
            'Allow "[x] " to mark a feature as not included',
            'kriti-blocks',
          )}
          help={__(
            'Start a line with [x] to show it with a cross and muted text.',
            'kriti-blocks',
          )}
          checked={!!attributes.featureMarkers}
          onChange={(value) =>
            setAttributes({ featureMarkers: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Button style', 'kriti-blocks')}
          value={attributes.buttonStyle || 'solid'}
          options={[
            { label: __('Solid', 'kriti-blocks'), value: 'solid' },
            { label: __('Outline', 'kriti-blocks'), value: 'outline' },
            { label: __('Ghost (text only)', 'kriti-blocks'), value: 'ghost' },
          ]}
          onChange={(value) => setAttributes({ buttonStyle: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Open button link in a new tab', 'kriti-blocks')}
          checked={!!attributes.buttonNewTab}
          onChange={(value) =>
            setAttributes({ buttonNewTab: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Add rel="nofollow" to the button link', 'kriti-blocks')}
          checked={!!attributes.buttonNofollow}
          onChange={(value) =>
            setAttributes({ buttonNofollow: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <p>
          {__('Accent color (badge and highlighted border)', 'kriti-blocks')}
        </p>
        <ColorPalette
          value={attributes.accentColor}
          onChange={(color) => setAttributes({ accentColor: color })}
          headingLevel="3"
        />
        <p>{__('Feature icon color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.featureIconColor}
          onChange={(color) => setAttributes({ featureIconColor: color })}
          headingLevel="3"
        />
        <p>{__('Button background', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.buttonBg}
          onChange={(color) => setAttributes({ buttonBg: color })}
          headingLevel="3"
        />
        <p>{__('Button text color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.buttonColor}
          onChange={(color) => setAttributes({ buttonColor: color })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default PricingColumnSettingsPanel;
