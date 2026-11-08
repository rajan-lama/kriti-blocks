import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { KbWooEntityTokenField } from '../../shared/kbwoo-controls';

const WooProductCategoriesSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    layout,
    columns,
    hierarchical,
    hideEmpty,
    showCount,
    showThumbnail,
    orderBy,
    order,
    limit,
    includeIds,
    excludeIds,
    parentFilter,
    parentId,
    hideUncategorized,
    imageRatio,
    cardStyle,
    imageZoom,
    columnsTablet,
    columnsMobile,
  } = attributes;

  const categories = useSelect((select) => {
    return (
      select('core').getEntityRecords('taxonomy', 'product_cat', {
        per_page: 100,
        _fields: 'id,name',
      }) || []
    );
  }, []);

  return (
    <>
      <PanelBody
        title={__('Product Categories Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <SelectControl
          label={__('Layout', 'kriti-blocks')}
          value={layout}
          options={[
            { label: __('Grid', 'kriti-blocks'), value: 'grid' },
            { label: __('List', 'kriti-blocks'), value: 'list' },
            { label: __('Inline', 'kriti-blocks'), value: 'inline' },
          ]}
          onChange={(value) => setAttributes({ layout: value })}
        />

        {layout === 'grid' && (
          <RangeControl
            label={__('Columns', 'kriti-blocks')}
            value={columns}
            min={1}
            max={6}
            step={1}
            onChange={(value) => setAttributes({ columns: value })}
          />
        )}

        <ToggleControl
          label={__('Nest child categories', 'kriti-blocks')}
          checked={!!hierarchical}
          onChange={(value) => setAttributes({ hierarchical: value })}
        />

        <ToggleControl
          label={__('Hide empty categories', 'kriti-blocks')}
          checked={!!hideEmpty}
          onChange={(value) => setAttributes({ hideEmpty: value })}
        />

        <ToggleControl
          label={__('Show product count', 'kriti-blocks')}
          checked={!!showCount}
          onChange={(value) => setAttributes({ showCount: value })}
        />

        {layout !== 'inline' && (
          <ToggleControl
            label={__('Show thumbnail', 'kriti-blocks')}
            checked={!!showThumbnail}
            onChange={(value) => setAttributes({ showThumbnail: value })}
          />
        )}

        <SelectControl
          label={__('Order by', 'kriti-blocks')}
          value={orderBy}
          options={[
            { label: __('Name', 'kriti-blocks'), value: 'name' },
            { label: __('Count', 'kriti-blocks'), value: 'count' },
            { label: __('Slug', 'kriti-blocks'), value: 'slug' },
            { label: __('Term ID', 'kriti-blocks'), value: 'term_id' },
          ]}
          onChange={(value) => setAttributes({ orderBy: value })}
        />

        <SelectControl
          label={__('Order', 'kriti-blocks')}
          value={order}
          options={[
            { label: __('Ascending', 'kriti-blocks'), value: 'ASC' },
            { label: __('Descending', 'kriti-blocks'), value: 'DESC' },
          ]}
          onChange={(value) => setAttributes({ order: value })}
        />

        <RangeControl
          label={__('Maximum categories', 'kriti-blocks')}
          help={__('0 shows all categories.', 'kriti-blocks')}
          value={limit}
          min={0}
          max={100}
          step={1}
          onChange={(value) => setAttributes({ limit: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Category Filters', 'kriti-blocks')}
        initialOpen={false}
      >
        <KbWooEntityTokenField
          label={__('Only these categories', 'kriti-blocks')}
          kind="taxonomy"
          name="product_cat"
          value={includeIds}
          onChange={(value) => setAttributes({ includeIds: value })}
        />

        <KbWooEntityTokenField
          label={__('Exclude categories', 'kriti-blocks')}
          kind="taxonomy"
          name="product_cat"
          value={excludeIds}
          onChange={(value) => setAttributes({ excludeIds: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Hide "Uncategorized"', 'kriti-blocks')}
          checked={!!hideUncategorized}
          onChange={(value) => setAttributes({ hideUncategorized: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Parent filter', 'kriti-blocks')}
          value={parentFilter || 'all'}
          options={[
            { label: __('All categories', 'kriti-blocks'), value: 'all' },
            { label: __('Top-level only', 'kriti-blocks'), value: 'top' },
            { label: __('Children of…', 'kriti-blocks'), value: 'children' },
          ]}
          onChange={(value) => setAttributes({ parentFilter: value })}
        />

        {parentFilter === 'children' && (
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Parent category', 'kriti-blocks')}
            value={String(parentId || 0)}
            options={[
              { label: __('Select a category', 'kriti-blocks'), value: '0' },
              ...categories.map((item) => ({
                label: item.name,
                value: String(item.id),
              })),
            ]}
            onChange={(value) => setAttributes({ parentId: Number(value) })}
          />
        )}
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
            { label: __('Name over image', 'kriti-blocks'), value: 'overlay' },
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
          label={__('Zoom image on hover', 'kriti-blocks')}
          checked={!!imageZoom}
          onChange={(value) => setAttributes({ imageZoom: value })}
        />

        {layout === 'grid' && (
          <>
            <SelectControl
              __nextHasNoMarginBottom
              label={__('Columns on tablet', 'kriti-blocks')}
              value={String(columnsTablet || 0)}
              options={[
                { label: __('Automatic (2)', 'kriti-blocks'), value: '0' },
                ...[1, 2, 3, 4, 5, 6].map((n) => ({
                  label: String(n),
                  value: String(n),
                })),
              ]}
              onChange={(value) =>
                setAttributes({ columnsTablet: Number(value) })
              }
            />

            <SelectControl
              __nextHasNoMarginBottom
              label={__('Columns on mobile', 'kriti-blocks')}
              value={String(columnsMobile || 0)}
              options={[
                { label: __('Automatic (1)', 'kriti-blocks'), value: '0' },
                ...[1, 2, 3, 4, 5, 6].map((n) => ({
                  label: String(n),
                  value: String(n),
                })),
              ]}
              onChange={(value) =>
                setAttributes({ columnsMobile: Number(value) })
              }
            />
          </>
        )}
      </PanelBody>
    </>
  );
};

export default WooProductCategoriesSettingsPanel;
