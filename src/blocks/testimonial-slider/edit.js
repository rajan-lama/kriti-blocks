import {
  useBlockProps,
  RichText,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { chevronUp, chevronDown, trash, plus } from '@wordpress/icons';
import Inspector from './inspector';
import { getSliderOptions } from './options';
import { addSlide, removeSlide, updateSlide, moveSlide } from './helpers';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { slides, htmlId, extraClass } = attributes;

  const options = getSliderOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
  });

  const setField = (index, field, value) =>
    setAttributes({ slides: updateSlide(slides, index, field, value) });

  const setAvatar = (index, media) =>
    setAttributes({
      slides: slides.map((slide, i) =>
        i === index
          ? {
              ...slide,
              avatarUrl: media.url,
              avatarId: media.id,
              avatarAlt: media.alt || '',
            }
          : slide,
      ),
    });

  const clearAvatar = (index) =>
    setAttributes({
      slides: slides.map((slide, i) =>
        i === index
          ? { ...slide, avatarUrl: '', avatarId: 0, avatarAlt: '' }
          : slide,
      ),
    });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <p className="bw-ts__hint">
          {__(
            'Slides are shown one at a time on the front end. Edit each testimonial below.',
            'kriti-blocks',
          )}
        </p>
        <div className="bw-ts__slides">
          {slides.map((slide, index) => (
            <div className="bw-ts__slide-editor" key={slide.id}>
              <div className="bw-ts__slide-toolbar">
                <span className="bw-ts__slide-number">
                  {sprintf(
                    /* translators: %d: slide number. */
                    __('Slide %d', 'kriti-blocks'),
                    index + 1,
                  )}
                </span>
                <div className="bw-ts__slide-actions">
                  <Button
                    icon={chevronUp}
                    label={__('Move slide up', 'kriti-blocks')}
                    size="small"
                    disabled={index === 0}
                    onClick={() =>
                      setAttributes({
                        slides: moveSlide(slides, index, -1),
                      })
                    }
                  />
                  <Button
                    icon={chevronDown}
                    label={__('Move slide down', 'kriti-blocks')}
                    size="small"
                    disabled={index === slides.length - 1}
                    onClick={() =>
                      setAttributes({
                        slides: moveSlide(slides, index, 1),
                      })
                    }
                  />
                  <Button
                    icon={trash}
                    label={__('Remove testimonial', 'kriti-blocks')}
                    size="small"
                    isDestructive
                    disabled={slides.length <= 1}
                    onClick={() =>
                      setAttributes({
                        slides: removeSlide(slides, index),
                      })
                    }
                  />
                </div>
              </div>
              <div className="bw-ts__slide-body">
                <div className="bw-ts__avatar-control">
                  {slide.avatarUrl ? (
                    <>
                      <img
                        className="bw-ts__avatar"
                        src={slide.avatarUrl}
                        alt={slide.avatarAlt || ''}
                      />
                      <Button
                        variant="link"
                        isDestructive
                        onClick={() => clearAvatar(index)}
                      >
                        {__('Remove', 'kriti-blocks')}
                      </Button>
                    </>
                  ) : (
                    <MediaUploadCheck>
                      <MediaUpload
                        onSelect={(media) => setAvatar(index, media)}
                        allowedTypes={['image']}
                        value={slide.avatarId}
                        render={({ open }) => (
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={open}
                          >
                            {__('Add avatar', 'kriti-blocks')}
                          </Button>
                        )}
                      />
                    </MediaUploadCheck>
                  )}
                </div>
                <RichText
                  tagName="p"
                  className="bw-ts__quote"
                  value={slide.quote}
                  onChange={(value) => setField(index, 'quote', value)}
                  placeholder={__('Write a testimonial quote…', 'kriti-blocks')}
                />
                <RichText
                  tagName="div"
                  className="bw-ts__author"
                  value={slide.authorName}
                  onChange={(value) => setField(index, 'authorName', value)}
                  placeholder={__('Author name', 'kriti-blocks')}
                />
                <RichText
                  tagName="div"
                  className="bw-ts__role"
                  value={slide.authorRole}
                  onChange={(value) => setField(index, 'authorRole', value)}
                  placeholder={__('Role, company', 'kriti-blocks')}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          icon={plus}
          onClick={() => setAttributes({ slides: addSlide(slides) })}
        >
          {__('Add testimonial', 'kriti-blocks')}
        </Button>
      </div>
    </>
  );
}
