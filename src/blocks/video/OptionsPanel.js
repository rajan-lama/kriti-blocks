import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { parseEmbed } from './embed';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    embedUrl,
    privacyMode,
    startTime,
    endTime,
    poster,
    aspectRatio,
    playsInline,
    noDownload,
    embedFacade,
    backgroundMode,
  } = attributes;

  const embedInvalid = !!embedUrl && !parseEmbed(embedUrl);

  const secondsField = (label, key, value) => (
    <NumberControl
      label={label}
      value={value ?? ''}
      min={0}
      onChange={(next) =>
        setAttributes({
          [key]: next === '' || Number(next) <= 0 ? undefined : Number(next),
        })
      }
    />
  );

  return (
    <>
      <PanelBody
        title={__('YouTube and Vimeo', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          __nextHasNoMarginBottom
          label={__('Video address', 'kriti-blocks')}
          help={
            embedInvalid
              ? __(
                  'This is not a recognised YouTube or Vimeo address.',
                  'kriti-blocks',
                )
              : __(
                  'Paste a YouTube or Vimeo link. It replaces the uploaded file. Autoplay, loop, muted and controls above apply.',
                  'kriti-blocks',
                )
          }
          type="url"
          value={embedUrl || ''}
          onChange={(value) => setAttributes({ embedUrl: value || undefined })}
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Privacy mode', 'kriti-blocks')}
          help={__(
            'Uses youtube-nocookie.com, and the do-not-track flag for Vimeo.',
            'kriti-blocks',
          )}
          checked={!!privacyMode}
          onChange={(value) =>
            setAttributes({ privacyMode: value || undefined })
          }
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Click-to-play preview', 'kriti-blocks')}
          help={__(
            'Shows a thumbnail and play button, and loads the player only after a click. Uses the poster image, or the YouTube thumbnail.',
            'kriti-blocks',
          )}
          checked={!!embedFacade}
          onChange={(value) =>
            setAttributes({ embedFacade: value || undefined })
          }
        />
      </PanelBody>

      <PanelBody
        title={__('Video Options', 'kriti-blocks')}
        initialOpen={false}
      >
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Background video mode', 'kriti-blocks')}
          help={__(
            'Muted, looping autoplay without controls, for decorative video.',
            'kriti-blocks',
          )}
          checked={!!backgroundMode}
          onChange={(value) =>
            setAttributes({ backgroundMode: value || undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Aspect Ratio', 'kriti-blocks')}
          value={aspectRatio || ''}
          options={[
            { label: __('Default', 'kriti-blocks'), value: '' },
            { label: '16:9', value: '16/9' },
            { label: '4:3', value: '4/3' },
            { label: '1:1', value: '1/1' },
            { label: '21:9', value: '21/9' },
            { label: '9:16', value: '9/16' },
          ]}
          onChange={(value) =>
            setAttributes({ aspectRatio: value || undefined })
          }
        />
        {secondsField(
          __('Start at (seconds)', 'kriti-blocks'),
          'startTime',
          startTime,
        )}
        {secondsField(
          __('End at (seconds)', 'kriti-blocks'),
          'endTime',
          endTime,
        )}
        <MediaUploadCheck>
          <MediaUpload
            allowedTypes={['image']}
            onSelect={(media) => setAttributes({ poster: media.url })}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {poster
                  ? __('Replace poster image', 'kriti-blocks')
                  : __('Add poster image', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {poster && (
          <Button
            variant="link"
            isDestructive
            onClick={() => setAttributes({ poster: undefined })}
          >
            {__('Remove poster image', 'kriti-blocks')}
          </Button>
        )}
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Play inline on mobile', 'kriti-blocks')}
          checked={!!playsInline}
          onChange={(value) =>
            setAttributes({ playsInline: value || undefined })
          }
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Hide the download button', 'kriti-blocks')}
          checked={!!noDownload}
          onChange={(value) =>
            setAttributes({ noDownload: value || undefined })
          }
        />
      </PanelBody>
    </>
  );
}
