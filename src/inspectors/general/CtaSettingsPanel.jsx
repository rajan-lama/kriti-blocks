import {
  PanelBody,
  ButtonGroup,
  Button,
  ColorPalette,
  SelectControl,
  TextControl,
  ToggleControl,
  RangeControl,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const CtaSettingsPanel = ({ attributes, setAttributes }) => {
  const { ctaAlign, ctaBackground, ctaTextColor } = attributes;

  const colors = [
    { name: 'Accent', color: '#4f46e5' },
    { name: 'Dark', color: '#111827' },
    { name: 'Green', color: '#059669' },
    { name: 'Orange', color: '#ea580c' },
  ];

  const textColors = [
    { name: 'White', color: '#ffffff' },
    { name: 'Black', color: '#111111' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <>
      <PanelBody title={__('CTA Settings', 'kriti-blocks')} initialOpen={true}>
        <SelectControl
          label={__('HTML Tag', 'kriti-blocks')}
          value={attributes.tagType}
          options={[
            { label: 'Div', value: 'div' },
            { label: 'Section', value: 'section' },
            { label: 'Aside', value: 'aside' },
          ]}
          onChange={(value) => setAttributes({ tagType: value })}
        />

        <ButtonGroup aria-label={__('Content Alignment', 'kriti-blocks')}>
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              isSmall
              onClick={() => setAttributes({ ctaAlign: option.value })}
              isPressed={ctaAlign === option.value}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>

        <ColorPalette
          asButtons="true"
          colors={colors}
          value={ctaBackground}
          onChange={(color) => setAttributes({ ctaBackground: color })}
          headingLevel="3"
        />

        <ColorPalette
          asButtons="true"
          colors={textColors}
          value={ctaTextColor}
          onChange={(color) => setAttributes({ ctaTextColor: color })}
          headingLevel="3"
        />
      </PanelBody>

      <PanelBody
        title={__('CTA background and layout', 'kriti-blocks')}
        initialOpen={false}
      >
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) =>
              setAttributes({
                ctaBgImageUrl: media.url,
                ctaBgImageId: media.id,
              })
            }
            allowedTypes={['image']}
            value={attributes.ctaBgImageId}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {attributes.ctaBgImageUrl
                  ? __('Replace background image', 'kriti-blocks')
                  : __('Choose background image', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {attributes.ctaBgImageUrl && (
          <>
            <Button
              variant="link"
              isDestructive
              onClick={() =>
                setAttributes({
                  ctaBgImageUrl: undefined,
                  ctaBgImageId: undefined,
                })
              }
            >
              {__('Remove background image', 'kriti-blocks')}
            </Button>
            <ToggleControl
              label={__('Fixed background (parallax)', 'kriti-blocks')}
              checked={!!attributes.ctaBgFixed}
              onChange={(value) =>
                setAttributes({ ctaBgFixed: value || undefined })
              }
              __nextHasNoMarginBottom
            />
          </>
        )}
        <p>{__('Overlay color', 'kriti-blocks')}</p>
        <ColorPalette
          colors={[
            { name: 'Black', color: '#000000' },
            { name: 'Dark', color: '#111827' },
            { name: 'Accent', color: '#4f46e5' },
          ]}
          value={attributes.ctaOverlayColor}
          onChange={(color) => setAttributes({ ctaOverlayColor: color })}
          headingLevel="3"
        />
        {attributes.ctaOverlayColor && (
          <RangeControl
            label={__('Overlay opacity (%)', 'kriti-blocks')}
            value={attributes.ctaOverlayOpacity ?? 50}
            min={0}
            max={100}
            onChange={(value) => setAttributes({ ctaOverlayOpacity: value })}
          />
        )}
        <SelectControl
          label={__('Layout', 'kriti-blocks')}
          value={attributes.ctaLayout || 'stacked'}
          options={[
            { label: __('Stacked', 'kriti-blocks'), value: 'stacked' },
            {
              label: __(
                'Side by side (last block on the right)',
                'kriti-blocks',
              ),
              value: 'split',
            },
          ]}
          onChange={(value) => setAttributes({ ctaLayout: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Content width (px)', 'kriti-blocks')}
          value={attributes.ctaContentWidth}
          min={300}
          max={1400}
          step={10}
          allowReset
          onChange={(value) => setAttributes({ ctaContentWidth: value })}
        />
      </PanelBody>
    </>
  );
};

export default CtaSettingsPanel;
