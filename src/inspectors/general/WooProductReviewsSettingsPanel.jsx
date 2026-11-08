import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const WooProductReviewsSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    perPage,
    order,
    headingLevel,
    showTitle,
    showRating,
    showAvatar,
    showDate,
    showVerified,
    productId,
    minRating,
    showSummary,
    pagination,
    showWriteLink,
    writeLinkText,
    cardStyle,
    avatarSize,
  } = attributes;

  const products = useSelect((select) => {
    return (
      select('core').getEntityRecords('postType', 'product', {
        per_page: 100,
        _fields: 'id,title',
      }) || []
    );
  }, []);

  const productOptions = [
    { label: __('Current product (automatic)', 'kriti-blocks'), value: '0' },
    ...products.map((item) => ({
      label: (item.title?.rendered || String(item.id)).replace(/<[^>]*>/g, ''),
      value: String(item.id),
    })),
  ];

  if (productId && !products.some((item) => item.id === productId)) {
    productOptions.push({ label: `#${productId}`, value: String(productId) });
  }

  return (
    <>
      <PanelBody
        title={__('Product Reviews Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Product', 'kriti-blocks')}
          value={String(productId || 0)}
          options={productOptions}
          onChange={(value) => setAttributes({ productId: Number(value) })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Minimum rating', 'kriti-blocks')}
          value={String(minRating || 0)}
          options={[
            { label: __('All reviews', 'kriti-blocks'), value: '0' },
            { label: __('4 stars and up', 'kriti-blocks'), value: '4' },
            { label: __('3 stars and up', 'kriti-blocks'), value: '3' },
            { label: __('2 stars and up', 'kriti-blocks'), value: '2' },
            { label: __('5 stars only', 'kriti-blocks'), value: '5' },
          ]}
          onChange={(value) => setAttributes({ minRating: Number(value) })}
        />

        <RangeControl
          label={__('Number of reviews', 'kriti-blocks')}
          help={__('0 shows all reviews.', 'kriti-blocks')}
          value={perPage}
          min={0}
          max={50}
          step={1}
          onChange={(value) => setAttributes({ perPage: value })}
        />

        <SelectControl
          label={__('Order', 'kriti-blocks')}
          value={order}
          options={[
            {
              label: __('Newest first', 'kriti-blocks'),
              value: 'DESC',
            },
            {
              label: __('Oldest first', 'kriti-blocks'),
              value: 'ASC',
            },
          ]}
          onChange={(value) => setAttributes({ order: value })}
        />

        <SelectControl
          label={__('Heading level', 'kriti-blocks')}
          value={headingLevel}
          options={[
            { label: 'H2', value: 2 },
            { label: 'H3', value: 3 },
            { label: 'H4', value: 4 },
            { label: 'H5', value: 5 },
            { label: 'H6', value: 6 },
          ]}
          onChange={(value) =>
            setAttributes({ headingLevel: parseInt(value, 10) })
          }
        />

        <ToggleControl
          label={__('Show review count heading', 'kriti-blocks')}
          checked={!!showTitle}
          onChange={(value) => setAttributes({ showTitle: value })}
        />

        <ToggleControl
          label={__('Show rating', 'kriti-blocks')}
          checked={!!showRating}
          onChange={(value) => setAttributes({ showRating: value })}
        />

        <ToggleControl
          label={__('Show avatar', 'kriti-blocks')}
          checked={!!showAvatar}
          onChange={(value) => setAttributes({ showAvatar: value })}
        />

        <ToggleControl
          label={__('Show date', 'kriti-blocks')}
          checked={!!showDate}
          onChange={(value) => setAttributes({ showDate: value })}
        />

        <ToggleControl
          label={__('Show verified owner label', 'kriti-blocks')}
          checked={!!showVerified}
          onChange={(value) => setAttributes({ showVerified: value })}
        />
      </PanelBody>

      <PanelBody title={__('Extras', 'kriti-blocks')} initialOpen={false}>
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show rating summary', 'kriti-blocks')}
          help={__(
            'Average rating with a bar for each star level.',
            'kriti-blocks',
          )}
          checked={!!showSummary}
          onChange={(value) => setAttributes({ showSummary: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Paginate reviews', 'kriti-blocks')}
          help={__(
            'Adds previous and next links. Needs a number of reviews above 0.',
            'kriti-blocks',
          )}
          checked={!!pagination}
          onChange={(value) => setAttributes({ pagination: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show "Write a review" link', 'kriti-blocks')}
          help={__(
            'Links to the review form on the product page.',
            'kriti-blocks',
          )}
          checked={!!showWriteLink}
          onChange={(value) => setAttributes({ showWriteLink: value })}
        />

        {showWriteLink && (
          <TextControl
            __nextHasNoMarginBottom
            label={__('Link text', 'kriti-blocks')}
            value={writeLinkText || ''}
            onChange={(value) => setAttributes({ writeLinkText: value })}
          />
        )}

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Card style', 'kriti-blocks')}
          value={cardStyle || 'default'}
          options={[
            {
              label: __('Bordered (default)', 'kriti-blocks'),
              value: 'default',
            },
            { label: __('Plain', 'kriti-blocks'), value: 'plain' },
            { label: __('Shadow', 'kriti-blocks'), value: 'shadow' },
            { label: __('Filled', 'kriti-blocks'), value: 'filled' },
          ]}
          onChange={(value) => setAttributes({ cardStyle: value })}
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Avatar size (px)', 'kriti-blocks')}
          value={avatarSize || 48}
          min={24}
          max={96}
          step={4}
          onChange={(value) => setAttributes({ avatarSize: value || 48 })}
        />
      </PanelBody>
    </>
  );
};

export default WooProductReviewsSettingsPanel;
