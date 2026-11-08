import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const RelatedPostsSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    perPage,
    columns,
    orderBy,
    order,
    showFeaturedImage,
    imageSize,
    showExcerpt,
    excerptLength,
    showDate,
    readMoreText,
  } = attributes;

  return (
    <PanelBody
      title={__('Related Posts Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <p>
        {__(
          'Posts sharing taxonomy terms with the current entry. When no shared terms exist, the most recent entries are shown.',
          'kriti-blocks',
        )}
      </p>

      <RangeControl
        label={__('Number of items', 'kriti-blocks')}
        value={perPage}
        min={1}
        max={12}
        step={1}
        onChange={(value) => setAttributes({ perPage: value })}
      />

      <RangeControl
        label={__('Columns', 'kriti-blocks')}
        value={columns}
        min={1}
        max={4}
        step={1}
        onChange={(value) => setAttributes({ columns: value })}
      />

      <SelectControl
        label={__('Order by', 'kriti-blocks')}
        value={orderBy}
        options={[
          { label: __('Date', 'kriti-blocks'), value: 'date' },
          { label: __('Title', 'kriti-blocks'), value: 'title' },
          {
            label: __('Last modified', 'kriti-blocks'),
            value: 'modified',
          },
          { label: __('Random', 'kriti-blocks'), value: 'rand' },
        ]}
        onChange={(value) => setAttributes({ orderBy: value })}
      />

      <SelectControl
        label={__('Order', 'kriti-blocks')}
        value={order}
        options={[
          {
            label: __('Descending', 'kriti-blocks'),
            value: 'DESC',
          },
          { label: __('Ascending', 'kriti-blocks'), value: 'ASC' },
        ]}
        onChange={(value) => setAttributes({ order: value })}
      />

      <ToggleControl
        label={__('Show featured image', 'kriti-blocks')}
        checked={!!showFeaturedImage}
        onChange={(value) => setAttributes({ showFeaturedImage: value })}
      />

      {showFeaturedImage && (
        <SelectControl
          label={__('Image size', 'kriti-blocks')}
          value={imageSize}
          options={[
            {
              label: __('Thumbnail', 'kriti-blocks'),
              value: 'thumbnail',
            },
            { label: __('Medium', 'kriti-blocks'), value: 'medium' },
            {
              label: __('Medium large', 'kriti-blocks'),
              value: 'medium_large',
            },
            { label: __('Large', 'kriti-blocks'), value: 'large' },
            { label: __('Full', 'kriti-blocks'), value: 'full' },
          ]}
          onChange={(value) => setAttributes({ imageSize: value })}
        />
      )}

      <ToggleControl
        label={__('Show excerpt', 'kriti-blocks')}
        checked={!!showExcerpt}
        onChange={(value) => setAttributes({ showExcerpt: value })}
      />

      {showExcerpt && (
        <RangeControl
          label={__('Excerpt length (words)', 'kriti-blocks')}
          value={excerptLength}
          min={5}
          max={60}
          step={1}
          onChange={(value) => setAttributes({ excerptLength: value })}
        />
      )}

      <ToggleControl
        label={__('Show date', 'kriti-blocks')}
        checked={!!showDate}
        onChange={(value) => setAttributes({ showDate: value })}
      />

      <TextControl
        label={__('Read more text', 'kriti-blocks')}
        help={__('Leave empty to hide the read more link.', 'kriti-blocks')}
        value={readMoreText}
        onChange={(value) => setAttributes({ readMoreText: value })}
      />
    </PanelBody>
  );
};

export default RelatedPostsSettingsPanel;
