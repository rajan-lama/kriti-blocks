import {
  CheckboxControl,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  __experimentalNumberControl as NumberControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { KbWooEntityTokenField } from '../../shared/kbwoo-controls';

const WooProductGridSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    perPage,
    columns,
    layout,
    orderBy,
    order,
    categoryIds,
    featuredOnly,
    onSaleOnly,
    showImage,
    showCategory,
    showRating,
    showPrice,
    showAddToCart,
    tagIds,
    stockStatus,
    minPrice,
    maxPrice,
    includeIds,
    excludeIds,
    offset,
    noResultsMessage,
    cardStyle,
    imageRatio,
    imageHover,
    buttonStyle,
    columnsTablet,
    columnsMobile,
    showTitle,
    showSaleBadge,
    quickView,
    wishlist,
    loadMore,
    loadMoreLabel,
    filterControls,
    gridId,
  } = attributes;

  const categories = useSelect((select) => {
    return (
      select('core').getEntityRecords('taxonomy', 'product_cat', {
        per_page: 100,
        _fields: 'id,name',
      }) || []
    );
  }, []);

  const toggleCategory = (id) => {
    const next = categoryIds.includes(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id];

    setAttributes({ categoryIds: next });
  };

  const FILTER_CHOICES = [
    ['search', __('Search box', 'kriti-blocks')],
    ['category', __('Category menu', 'kriti-blocks')],
    ['sort', __('Sort menu', 'kriti-blocks')],
    ['price', __('Price range', 'kriti-blocks')],
    ['stock', __('In stock only', 'kriti-blocks')],
  ];
  const activeFilters = Array.isArray(filterControls) ? filterControls : [];

  // The id lets the site find this block again when it loads more products.
  const withId = (patch) =>
    setAttributes({
      ...patch,
      gridId: gridId || Math.random().toString(36).slice(2, 10).padEnd(8, '0'),
    });

  const toggleFilter = (key) => {
    const next = activeFilters.includes(key)
      ? activeFilters.filter((value) => value !== key)
      : [...activeFilters, key];
    withId({ filterControls: next.length ? next : undefined });
  };

  return (
    <>
      <PanelBody title={__('Product Query', 'kriti-blocks')} initialOpen={true}>
        <RangeControl
          label={__('Number of products', 'kriti-blocks')}
          value={perPage}
          min={1}
          max={50}
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
          label={__('Layout', 'kriti-blocks')}
          value={layout}
          options={[
            { label: __('Grid', 'kriti-blocks'), value: 'grid' },
            { label: __('List', 'kriti-blocks'), value: 'list' },
          ]}
          onChange={(value) => setAttributes({ layout: value })}
        />

        <SelectControl
          label={__('Order by', 'kriti-blocks')}
          value={orderBy}
          options={[
            { label: __('Date', 'kriti-blocks'), value: 'date' },
            { label: __('Title', 'kriti-blocks'), value: 'title' },
            { label: __('Price', 'kriti-blocks'), value: 'price' },
            {
              label: __('Popularity', 'kriti-blocks'),
              value: 'popularity',
            },
            { label: __('Rating', 'kriti-blocks'), value: 'rating' },
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

        <ToggleControl
          label={__('Featured products only', 'kriti-blocks')}
          checked={!!featuredOnly}
          onChange={(value) => setAttributes({ featuredOnly: value })}
        />

        <ToggleControl
          label={__('Products on sale only', 'kriti-blocks')}
          checked={!!onSaleOnly}
          onChange={(value) => setAttributes({ onSaleOnly: value })}
        />

        {categories.length > 0 && (
          <>
            <p>{__('Product categories', 'kriti-blocks')}</p>
            <div
              className="bw-woo-product-grid-categories"
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
        title={__('Product Filters', 'kriti-blocks')}
        initialOpen={false}
      >
        <KbWooEntityTokenField
          label={__('Product tags', 'kriti-blocks')}
          kind="taxonomy"
          name="product_tag"
          value={tagIds}
          onChange={(value) => setAttributes({ tagIds: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Stock status', 'kriti-blocks')}
          value={stockStatus || ''}
          options={[
            { label: __('Any', 'kriti-blocks'), value: '' },
            { label: __('In stock', 'kriti-blocks'), value: 'instock' },
            { label: __('Out of stock', 'kriti-blocks'), value: 'outofstock' },
            { label: __('On backorder', 'kriti-blocks'), value: 'onbackorder' },
          ]}
          onChange={(value) => setAttributes({ stockStatus: value })}
        />

        <NumberControl
          label={__('Minimum price', 'kriti-blocks')}
          help={__('0 means no minimum.', 'kriti-blocks')}
          value={minPrice || 0}
          min={0}
          onChange={(value) => setAttributes({ minPrice: Number(value) || 0 })}
        />

        <NumberControl
          label={__('Maximum price', 'kriti-blocks')}
          help={__('0 means no maximum.', 'kriti-blocks')}
          value={maxPrice || 0}
          min={0}
          onChange={(value) => setAttributes({ maxPrice: Number(value) || 0 })}
        />

        <KbWooEntityTokenField
          label={__('Only these products', 'kriti-blocks')}
          kind="postType"
          name="product"
          value={includeIds}
          onChange={(value) => setAttributes({ includeIds: value })}
        />

        <KbWooEntityTokenField
          label={__('Exclude products', 'kriti-blocks')}
          kind="postType"
          name="product"
          value={excludeIds}
          onChange={(value) => setAttributes({ excludeIds: value })}
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Skip first products (offset)', 'kriti-blocks')}
          value={offset || 0}
          min={0}
          max={50}
          step={1}
          onChange={(value) => setAttributes({ offset: value || 0 })}
        />

        <TextControl
          __nextHasNoMarginBottom
          label={__('No products message', 'kriti-blocks')}
          help={__(
            'Shown when nothing matches. Leave empty to hide the block.',
            'kriti-blocks',
          )}
          value={noResultsMessage || ''}
          onChange={(value) => setAttributes({ noResultsMessage: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Load more and filter bar', 'kriti-blocks')}
        initialOpen={false}
      >
        <ToggleControl
          label={__('Load more button', 'kriti-blocks')}
          help={__(
            'Shows a button that adds the next page of products without reloading. The number of products above is the page size. Works for blocks in the post content, not in patterns or template parts.',
            'kriti-blocks',
          )}
          checked={!!loadMore}
          onChange={(value) => withId({ loadMore: value || undefined })}
        />
        {loadMore && (
          <TextControl
            label={__('Button text', 'kriti-blocks')}
            placeholder={__('Load more', 'kriti-blocks')}
            value={loadMoreLabel || ''}
            onChange={(value) =>
              setAttributes({ loadMoreLabel: value || undefined })
            }
          />
        )}
        <p className="components-base-control__help">
          {__(
            'Filter bar: visitors narrow the products shown here. They can only narrow what the block already allows. Without "Load more", only the first page of the results is shown.',
            'kriti-blocks',
          )}
        </p>
        {FILTER_CHOICES.map(([key, label]) => (
          <CheckboxControl
            key={key}
            label={label}
            checked={activeFilters.includes(key)}
            onChange={() => toggleFilter(key)}
          />
        ))}
      </PanelBody>

      <PanelBody
        title={__('Quick view and wishlist', 'kriti-blocks')}
        initialOpen={false}
      >
        <ToggleControl
          label={__('Quick view button', 'kriti-blocks')}
          help={__(
            'Opens the product in a pop-up with its pictures, price, variation choices and add to cart.',
            'kriti-blocks',
          )}
          checked={!!quickView}
          onChange={(value) => setAttributes({ quickView: value || undefined })}
        />
        <ToggleControl
          label={__('Wishlist heart', 'kriti-blocks')}
          help={__(
            'Visitors save products in their own browser. Show them with the Wishlist block.',
            'kriti-blocks',
          )}
          checked={!!wishlist}
          onChange={(value) => setAttributes({ wishlist: value || undefined })}
        />
      </PanelBody>

      <PanelBody title={__('Card Style', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Card style', 'kriti-blocks')}
          value={cardStyle || 'default'}
          options={[
            {
              label: __('Bordered (default)', 'kriti-blocks'),
              value: 'default',
            },
            { label: __('Flat', 'kriti-blocks'), value: 'flat' },
            { label: __('Shadow', 'kriti-blocks'), value: 'shadow' },
          ]}
          onChange={(value) => setAttributes({ cardStyle: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Image ratio', 'kriti-blocks')}
          value={imageRatio || 'square'}
          options={[
            { label: __('Square', 'kriti-blocks'), value: 'square' },
            { label: __('Landscape 4:3', 'kriti-blocks'), value: '4-3' },
            { label: __('Landscape 16:9', 'kriti-blocks'), value: '16-9' },
            { label: __('Portrait 3:4', 'kriti-blocks'), value: '3-4' },
          ]}
          onChange={(value) => setAttributes({ imageRatio: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Swap to second image on hover', 'kriti-blocks')}
          help={__(
            'Uses the first image of the product gallery.',
            'kriti-blocks',
          )}
          checked={!!imageHover}
          onChange={(value) => setAttributes({ imageHover: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Button style', 'kriti-blocks')}
          value={buttonStyle || 'default'}
          options={[
            { label: __('Filled (default)', 'kriti-blocks'), value: 'default' },
            { label: __('Outline', 'kriti-blocks'), value: 'outline' },
            { label: __('Link', 'kriti-blocks'), value: 'link' },
          ]}
          onChange={(value) => setAttributes({ buttonStyle: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Columns on tablet', 'kriti-blocks')}
          value={String(columnsTablet || 0)}
          options={[
            { label: __('Automatic (2)', 'kriti-blocks'), value: '0' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ]}
          onChange={(value) => setAttributes({ columnsTablet: Number(value) })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Columns on mobile', 'kriti-blocks')}
          value={String(columnsMobile || 0)}
          options={[
            { label: __('Automatic (1)', 'kriti-blocks'), value: '0' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
          ]}
          onChange={(value) => setAttributes({ columnsMobile: Number(value) })}
        />
      </PanelBody>

      <PanelBody
        title={__('Product Display', 'kriti-blocks')}
        initialOpen={false}
      >
        <ToggleControl
          label={__('Show image', 'kriti-blocks')}
          checked={!!showImage}
          onChange={(value) => setAttributes({ showImage: value })}
        />

        <ToggleControl
          label={__('Show categories', 'kriti-blocks')}
          checked={!!showCategory}
          onChange={(value) => setAttributes({ showCategory: value })}
        />

        <ToggleControl
          label={__('Show rating', 'kriti-blocks')}
          checked={!!showRating}
          onChange={(value) => setAttributes({ showRating: value })}
        />

        <ToggleControl
          label={__('Show price', 'kriti-blocks')}
          checked={!!showPrice}
          onChange={(value) => setAttributes({ showPrice: value })}
        />

        <ToggleControl
          label={__('Show add to cart', 'kriti-blocks')}
          checked={!!showAddToCart}
          onChange={(value) => setAttributes({ showAddToCart: value })}
        />

        <ToggleControl
          label={__('Show title', 'kriti-blocks')}
          checked={showTitle !== false}
          onChange={(value) => setAttributes({ showTitle: value })}
        />

        <ToggleControl
          label={__('Show sale badge', 'kriti-blocks')}
          checked={showSaleBadge !== false}
          onChange={(value) => setAttributes({ showSaleBadge: value })}
        />
      </PanelBody>
    </>
  );
};

export default WooProductGridSettingsPanel;
