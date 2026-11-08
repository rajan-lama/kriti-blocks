import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Extra archive header options: alignment, breadcrumbs, post count and a
 * background image with overlay.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export default function ArchiveHeaderOptionsPanel({
  attributes,
  setAttributes,
}) {
  const {
    textAlign = 'left',
    showBreadcrumbs = false,
    showPostCount = false,
    bgImageId = 0,
    overlayOpacity = 50,
    minHeight = 0,
  } = attributes;

  return (
    <PanelBody title={__('Look & extras', 'kriti-blocks')} initialOpen={false}>
      <SelectControl
        label={__('Text alignment', 'kriti-blocks')}
        value={textAlign}
        options={[
          { value: 'left', label: __('Left', 'kriti-blocks') },
          { value: 'center', label: __('Center', 'kriti-blocks') },
          { value: 'right', label: __('Right', 'kriti-blocks') },
        ]}
        onChange={(value) => setAttributes({ textAlign: value })}
        __nextHasNoMarginBottom
      />
      <ToggleControl
        label={__('Show breadcrumbs', 'kriti-blocks')}
        checked={!!showBreadcrumbs}
        onChange={(value) => setAttributes({ showBreadcrumbs: value })}
        __nextHasNoMarginBottom
      />
      <ToggleControl
        label={__('Show post count', 'kriti-blocks')}
        checked={!!showPostCount}
        onChange={(value) => setAttributes({ showPostCount: value })}
        __nextHasNoMarginBottom
      />
      <MediaUploadCheck>
        <MediaUpload
          allowedTypes={['image']}
          value={bgImageId || undefined}
          onSelect={(media) => setAttributes({ bgImageId: media?.id || 0 })}
          render={({ open }) => (
            <div style={{ marginBottom: 12 }}>
              <Button variant="secondary" onClick={open}>
                {bgImageId
                  ? __('Replace background image', 'kriti-blocks')
                  : __('Choose background image', 'kriti-blocks')}
              </Button>{' '}
              {!!bgImageId && (
                <Button
                  variant="tertiary"
                  isDestructive
                  onClick={() => setAttributes({ bgImageId: 0 })}
                >
                  {__('Remove', 'kriti-blocks')}
                </Button>
              )}
            </div>
          )}
        />
      </MediaUploadCheck>
      {!!bgImageId && (
        <RangeControl
          label={__('Image overlay darkness (%)', 'kriti-blocks')}
          value={overlayOpacity}
          min={0}
          max={90}
          step={5}
          onChange={(value) => setAttributes({ overlayOpacity: value ?? 50 })}
          __nextHasNoMarginBottom
        />
      )}
      <RangeControl
        label={__('Minimum height (px)', 'kriti-blocks')}
        help={__('0 sizes the header to its content.', 'kriti-blocks')}
        value={minHeight}
        min={0}
        max={800}
        step={10}
        onChange={(value) => setAttributes({ minHeight: value || 0 })}
        __nextHasNoMarginBottom
      />
    </PanelBody>
  );
}
