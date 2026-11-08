import { useBlockProps, MediaUpload, RichText } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getFigureStyles } from './helpers';
import { getEmbed } from './options';
import VideoElement from './video-element';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { url, caption, htmlId, extraClass } = attributes;

  const placeholderClass = url ? '' : 'bw-video-placeholder';

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [
        extraClass,
        attributes.backgroundMode === true && 'bw-video--bg',
        placeholderClass,
      ]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getFigureStyles(attributes),
  });

  const onSelectVideo = (media) => {
    setAttributes({
      url: media.url,
      id: media.id,
    });
  };

  if (!url && !getEmbed(attributes)) {
    return (
      <>
        <Inspector attributes={attributes} setAttributes={setAttributes} />
        <div {...blockProps}>
          <MediaUpload
            allowedTypes={['video']}
            onSelect={onSelectVideo}
            render={({ open }) => (
              <Button
                className="bw-video-select-button"
                variant="secondary"
                onClick={open}
              >
                {__('Select Video', 'kriti-blocks')}
              </Button>
            )}
          />
          <TextControl
            __nextHasNoMarginBottom
            label={__('Or paste a YouTube or Vimeo link', 'kriti-blocks')}
            type="url"
            value={attributes.embedUrl || ''}
            onChange={(value) =>
              setAttributes({ embedUrl: value || undefined })
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <figure {...blockProps}>
        <VideoElement attributes={attributes} />
        <RichText
          tagName="figcaption"
          className="bw-video-caption"
          value={caption}
          onChange={(value) => setAttributes({ caption: value })}
          placeholder={__('Write caption…', 'kriti-blocks')}
        />
      </figure>
    </>
  );
}
