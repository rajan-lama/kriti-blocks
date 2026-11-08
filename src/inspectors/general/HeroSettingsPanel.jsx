import {
  PanelBody,
  SelectControl,
  RangeControl,
  ButtonGroup,
  Button,
  ColorPalette,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const HeroSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    backgroundUrl,
    backgroundId,
    overlayColor,
    overlayOpacity,
    heroHeight,
    contentWidth,
    contentAlign,
  } = attributes;

  const colors = [
    { name: 'Black', color: '#000000' },
    { name: 'Dark Gray', color: '#111827' },
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Slate', color: '#334155' },
  ];

  const widthOptions = [
    { label: 'Narrow', value: 'narrow' },
    { label: 'Wide', value: 'wide' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody title={__('Hero Settings', 'kriti-blocks')} initialOpen={true}>
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
      {backgroundUrl && (
        <Button
          variant="link"
          isDestructive
          onClick={() =>
            setAttributes({
              backgroundUrl: '',
              backgroundId: 0,
            })
          }
        >
          {__('Remove Background', 'kriti-blocks')}
        </Button>
      )}

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

      <SelectControl
        label={__('Height', 'kriti-blocks')}
        value={heroHeight}
        options={[
          { label: 'Short', value: 'short' },
          { label: 'Medium', value: 'medium' },
          { label: 'Tall', value: 'tall' },
          { label: 'Full Screen', value: 'full' },
        ]}
        onChange={(value) => setAttributes({ heroHeight: value })}
      />

      <ButtonGroup aria-label={__('Content Width', 'kriti-blocks')}>
        {widthOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ contentWidth: option.value })}
            isPressed={contentWidth === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

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

export default HeroSettingsPanel;
