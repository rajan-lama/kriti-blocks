import {
  CheckboxControl,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const PostCarouselSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    postType,
    perPage,
    columns,
    orderBy,
    order,
    categoryIds,
    showFeaturedImage,
    imageSize,
    showExcerpt,
    excerptLength,
    showDate,
    showAuthor,
    showCategory,
    readMoreText,
    autoplay,
    interval,
    showArrows,
    showDots,
  } = attributes;

  const postTypeOptions = useSelect((select) => {
    const types = select('core').getPostTypes({ per_page: -1 }) || [];

    return types
      .filter((type) => type.viewable && type.slug !== 'attachment')
      .map((type) => ({
        label: type.labels?.singular_name || type.slug,
        value: type.slug,
      }));
  }, []);

  const categories = useSelect(
    (select) => {
      if (postType !== 'post') {
        return [];
      }

      return (
        select('core').getEntityRecords('taxonomy', 'category', {
          per_page: 100,
          _fields: 'id,name',
        }) || []
      );
    },
    [postType],
  );

  const toggleCategory = (id) => {
    const next = categoryIds.includes(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id];

    setAttributes({ categoryIds: next });
  };

  return (
    <>
      <PanelBody
        title={__('Carousel Query', 'kriti-blocks')}
        initialOpen={true}
      >
        <SelectControl
          label={__('Post type', 'kriti-blocks')}
          value={postType}
          options={postTypeOptions}
          onChange={(value) =>
            setAttributes({ postType: value, categoryIds: [] })
          }
        />

        <RangeControl
          label={__('Number of slides', 'kriti-blocks')}
          value={perPage}
          min={1}
          max={24}
          step={1}
          onChange={(value) => setAttributes({ perPage: value })}
        />

        <RangeControl
          label={__('Slides visible at once', 'kriti-blocks')}
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
            {
              label: __('Menu order', 'kriti-blocks'),
              value: 'menu_order',
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

        {postType === 'post' && categories.length > 0 && (
          <>
            <p>{__('Categories', 'kriti-blocks')}</p>
            <div
              className="bw-post-carousel-categories"
              style={{
                maxHeight: 180,
                overflowY: 'auto',
                marginBottom: 12,
              }}
            >
              {categories.map((category) => (
                <CheckboxControl
                  key={category.id}
                  label={category.name}
                  checked={categoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          </>
        )}
      </PanelBody>

      <PanelBody
        title={__('Carousel Display', 'kriti-blocks')}
        initialOpen={false}
      >
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
              {
                label: __('Medium', 'kriti-blocks'),
                value: 'medium',
              },
              {
                label: __('Medium large', 'kriti-blocks'),
                value: 'medium_large',
              },
              {
                label: __('Large', 'kriti-blocks'),
                value: 'large',
              },
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

        <ToggleControl
          label={__('Show author', 'kriti-blocks')}
          checked={!!showAuthor}
          onChange={(value) => setAttributes({ showAuthor: value })}
        />

        <ToggleControl
          label={__('Show categories', 'kriti-blocks')}
          checked={!!showCategory}
          onChange={(value) => setAttributes({ showCategory: value })}
        />

        <TextControl
          label={__('Read more text', 'kriti-blocks')}
          help={__('Leave empty to hide the read more link.', 'kriti-blocks')}
          value={readMoreText}
          onChange={(value) => setAttributes({ readMoreText: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Carousel Controls', 'kriti-blocks')}
        initialOpen={false}
      >
        <ToggleControl
          label={__('Autoplay', 'kriti-blocks')}
          help={__(
            'Disabled automatically for visitors who prefer reduced motion.',
            'kriti-blocks',
          )}
          checked={!!autoplay}
          onChange={(value) => setAttributes({ autoplay: value })}
        />

        {autoplay && (
          <RangeControl
            label={__('Interval (ms)', 'kriti-blocks')}
            value={interval}
            min={2000}
            max={15000}
            step={500}
            onChange={(value) => setAttributes({ interval: value })}
          />
        )}

        <ToggleControl
          label={__('Show arrows', 'kriti-blocks')}
          checked={!!showArrows}
          onChange={(value) => setAttributes({ showArrows: value })}
        />

        <ToggleControl
          label={__('Show dots', 'kriti-blocks')}
          checked={!!showDots}
          onChange={(value) => setAttributes({ showDots: value })}
        />
      </PanelBody>
    </>
  );
};

export default PostCarouselSettingsPanel;
