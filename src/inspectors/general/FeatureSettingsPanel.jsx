import {
  PanelBody,
  ButtonGroup,
  Button,
  ColorPalette,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { FEATURE_ICON_OPTIONS } from '../../blocks/feature/icons';

const FeatureSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    icon,
    showIcon,
    iconColor,
    iconBackground,
    iconSize,
    iconPosition,
    iconShape,
    contentAlign,
    linkText,
    linkUrl,
    linkNewTab,
  } = attributes;

  const colors = [
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Amber', color: '#d97706' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'Slate', color: '#334155' },
  ];

  const positionOptions = [
    { label: __('Top', 'kriti-blocks'), value: 'top' },
    { label: __('Left', 'kriti-blocks'), value: 'left' },
  ];

  const alignmentOptions = [
    { label: __('Left', 'kriti-blocks'), value: 'left' },
    { label: __('Center', 'kriti-blocks'), value: 'center' },
    { label: __('Right', 'kriti-blocks'), value: 'right' },
  ];

  return (
    <>
      <PanelBody
        title={__('Feature Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <ToggleControl
          label={__('Show icon', 'kriti-blocks')}
          checked={!!showIcon}
          onChange={(value) => setAttributes({ showIcon: value })}
        />

        {showIcon && (
          <>
            <SelectControl
              label={__('Icon', 'kriti-blocks')}
              value={icon}
              options={FEATURE_ICON_OPTIONS}
              onChange={(value) => setAttributes({ icon: value })}
              __nextHasNoMarginBottom
            />

            <p>{__('Icon color', 'kriti-blocks')}</p>
            <ColorPalette
              asButtons="true"
              colors={colors}
              value={iconColor}
              onChange={(color) => setAttributes({ iconColor: color })}
              headingLevel="3"
            />

            <p>{__('Icon background', 'kriti-blocks')}</p>
            <ColorPalette
              asButtons="true"
              colors={colors}
              value={iconBackground}
              onChange={(color) => setAttributes({ iconBackground: color })}
              headingLevel="3"
            />

            <RangeControl
              label={__('Icon size (px)', 'kriti-blocks')}
              value={iconSize}
              min={16}
              max={64}
              step={2}
              onChange={(value) => setAttributes({ iconSize: value })}
            />

            <ButtonGroup aria-label={__('Icon position', 'kriti-blocks')}>
              {positionOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="secondary"
                  isSmall
                  onClick={() =>
                    setAttributes({
                      iconPosition: option.value,
                    })
                  }
                  isPressed={iconPosition === option.value}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>

            <SelectControl
              label={__('Icon shape', 'kriti-blocks')}
              value={iconShape}
              options={[
                {
                  label: __('Rounded', 'kriti-blocks'),
                  value: 'rounded',
                },
                {
                  label: __('Circle', 'kriti-blocks'),
                  value: 'circle',
                },
                {
                  label: __('Square', 'kriti-blocks'),
                  value: 'square',
                },
                { label: __('None', 'kriti-blocks'), value: 'none' },
              ]}
              onChange={(value) => setAttributes({ iconShape: value })}
            />
          </>
        )}

        <ButtonGroup aria-label={__('Content alignment', 'kriti-blocks')}>
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              isSmall
              onClick={() => setAttributes({ contentAlign: option.value })}
              isPressed={contentAlign === option.value}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>

        <TextControl
          label={__('Link text', 'kriti-blocks')}
          value={linkText}
          onChange={(value) => setAttributes({ linkText: value })}
        />

        <TextControl
          label={__('Link URL', 'kriti-blocks')}
          type="url"
          value={linkUrl}
          onChange={(value) => setAttributes({ linkUrl: value })}
        />

        <ToggleControl
          label={__('Open link in new tab', 'kriti-blocks')}
          checked={!!linkNewTab}
          onChange={(value) => setAttributes({ linkNewTab: value })}
        />
      </PanelBody>
      <PanelBody
        title={__('Feature extras', 'kriti-blocks')}
        initialOpen={false}
      >
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) =>
              setAttributes({
                featureImageUrl: media.url,
                featureImageId: media.id,
                featureImageAlt: media.alt || '',
              })
            }
            allowedTypes={['image']}
            value={attributes.featureImageId}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {attributes.featureImageUrl
                  ? __('Replace image', 'kriti-blocks')
                  : __('Use an image instead of the icon', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {attributes.featureImageUrl && (
          <>
            <Button
              variant="link"
              isDestructive
              onClick={() =>
                setAttributes({
                  featureImageUrl: undefined,
                  featureImageId: undefined,
                  featureImageAlt: undefined,
                })
              }
            >
              {__('Remove image', 'kriti-blocks')}
            </Button>
            <RangeControl
              label={__('Image size (px)', 'kriti-blocks')}
              value={attributes.featureImageSize || 64}
              min={16}
              max={240}
              onChange={(value) => setAttributes({ featureImageSize: value })}
            />
          </>
        )}
        <TextControl
          label={__('Number badge', 'kriti-blocks')}
          help={__(
            'Short text shown above the title, such as 01.',
            'kriti-blocks',
          )}
          value={attributes.numberText || ''}
          onChange={(value) =>
            setAttributes({ numberText: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Title element', 'kriti-blocks')}
          value={attributes.titleTag || 'h3'}
          options={['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].map((v) => ({
            label: v,
            value: v,
          }))}
          onChange={(value) => setAttributes({ titleTag: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Link style', 'kriti-blocks')}
          value={attributes.linkStyle || 'link'}
          options={[
            { label: __('Text link', 'kriti-blocks'), value: 'link' },
            { label: __('Solid button', 'kriti-blocks'), value: 'button' },
            { label: __('Outline button', 'kriti-blocks'), value: 'outline' },
          ]}
          onChange={(value) => setAttributes({ linkStyle: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Icon hover effect', 'kriti-blocks')}
          value={attributes.iconHover || 'none'}
          options={[
            { label: __('None', 'kriti-blocks'), value: 'none' },
            { label: __('Grow', 'kriti-blocks'), value: 'scale' },
            { label: __('Lift', 'kriti-blocks'), value: 'lift' },
            { label: __('Tilt', 'kriti-blocks'), value: 'rotate' },
          ]}
          onChange={(value) => setAttributes({ iconHover: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Show divider below', 'kriti-blocks')}
          checked={!!attributes.showDivider}
          onChange={(value) =>
            setAttributes({ showDivider: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Stack icon above text on mobile', 'kriti-blocks')}
          help={__('Applies when the icon position is Left.', 'kriti-blocks')}
          checked={!!attributes.stackOnMobile}
          onChange={(value) =>
            setAttributes({ stackOnMobile: value || undefined })
          }
          __nextHasNoMarginBottom
        />
      </PanelBody>
    </>
  );
};

export default FeatureSettingsPanel;
