import { MediaUpload } from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  ButtonGroup,
  Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const VideoSettingsPanel = ({ attributes, setAttributes }) => {
  const { videoWidth, videoAlign, controls, autoplay, loop, muted, preload } =
    attributes;

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody title={__('Video Settings', 'kriti-blocks')} initialOpen={true}>
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Width (%)', 'kriti-blocks')}
        value={videoWidth || 100}
        onChange={(value) => setAttributes({ videoWidth: value || 100 })}
        min={10}
        max={100}
        step={1}
        allowReset
        resetFallbackValue={100}
      />

      <ButtonGroup aria-label={__('Video Alignment', 'kriti-blocks')}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ videoAlign: option.value })}
            isPressed={videoAlign === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <ToggleControl
        label={__('Show Controls', 'kriti-blocks')}
        checked={controls}
        onChange={(value) => setAttributes({ controls: value })}
      />

      <ToggleControl
        label={__('Autoplay', 'kriti-blocks')}
        checked={autoplay}
        onChange={(value) => setAttributes({ autoplay: value })}
      />

      <ToggleControl
        label={__('Loop', 'kriti-blocks')}
        checked={loop}
        onChange={(value) => setAttributes({ loop: value })}
      />

      <ToggleControl
        label={__('Muted', 'kriti-blocks')}
        checked={muted}
        onChange={(value) => setAttributes({ muted: value })}
      />

      <SelectControl
        label={__('Preload', 'kriti-blocks')}
        value={preload}
        options={[
          { label: 'Metadata', value: 'metadata' },
          { label: 'Auto', value: 'auto' },
          { label: 'None', value: 'none' },
        ]}
        onChange={(value) => setAttributes({ preload: value })}
      />

      <div style={{ marginTop: '12px' }}>
        <MediaUpload
          allowedTypes={['video']}
          value={attributes.id}
          onSelect={(media) =>
            setAttributes({
              url: media.url,
              id: media.id,
            })
          }
          render={({ open }) => (
            <Button variant="secondary" onClick={open}>
              {__('Replace Video', 'kriti-blocks')}
            </Button>
          )}
        />
      </div>
    </PanelBody>
  );
};

export default VideoSettingsPanel;
