import { MediaUpload } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  RangeControl,
  ButtonGroup,
  Button,
  ColorPalette,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const CoverSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    backgroundUrl,
    backgroundId,
    overlayColor,
    overlayOpacity,
    minHeight,
    backgroundPosition,
    contentAlign,
  } = attributes;

  const colors = [
    { name: 'Black', color: '#111111' },
    { name: 'Gray', color: '#374151' },
    { name: 'White', color: '#ffffff' },
    { name: 'Accent', color: '#4f46e5' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody title={__('Cover Settings', 'kriti-blocks')} initialOpen={true}>
      <MediaUpload
        allowedTypes={['image']}
        value={backgroundId}
        onSelect={(media) =>
          setAttributes({
            backgroundUrl: media.url,
            backgroundId: media.id,
          })
        }
        render={({ open }) => (
          <Button variant="secondary" onClick={open}>
            {backgroundUrl
              ? __('Replace Background', 'kriti-blocks')
              : __('Select Background', 'kriti-blocks')}
          </Button>
        )}
      />

      <ColorPalette
        asButtons="true"
        colors={colors}
        value={overlayColor}
        onChange={(color) => setAttributes({ overlayColor: color })}
        headingLevel="3"
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Overlay Opacity (%)', 'kriti-blocks')}
        value={overlayOpacity || 0}
        onChange={(value) => setAttributes({ overlayOpacity: value || 0 })}
        min={0}
        max={100}
        step={1}
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Min Height (px)', 'kriti-blocks')}
        value={minHeight || 400}
        onChange={(value) => setAttributes({ minHeight: value || 400 })}
        min={100}
        max={1200}
        step={10}
      />

      <SelectControl
        label={__('Background Position', 'kriti-blocks')}
        value={backgroundPosition}
        options={[
          { label: 'Center', value: 'center' },
          { label: 'Top Left', value: 'top left' },
          { label: 'Top Center', value: 'top center' },
          { label: 'Top Right', value: 'top right' },
          { label: 'Center Left', value: 'left center' },
          { label: 'Center Right', value: 'right center' },
          { label: 'Bottom Left', value: 'bottom left' },
          { label: 'Bottom Center', value: 'bottom center' },
          { label: 'Bottom Right', value: 'bottom right' },
        ]}
        onChange={(value) => setAttributes({ backgroundPosition: value })}
      />

      <ButtonGroup aria-label={__('Content Alignment', 'kriti-blocks')}>
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
    </PanelBody>
  );
};

export default CoverSettingsPanel;
