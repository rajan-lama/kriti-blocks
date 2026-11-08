import {
  PanelBody,
  Button,
  SelectControl,
  ColorPalette,
  ToggleControl,
  RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
  addProduct,
  removeProduct,
} from '../../blocks/comparison-table/helpers';

const ComparisonTableSettingsPanel = ({ attributes, setAttributes }) => {
  const { products, rows, highlightIndex, accentColor } = attributes;

  const handleAddProduct = () => {
    const { products: nextProducts, rows: nextRows } = addProduct(
      products,
      rows,
    );

    setAttributes({
      products: nextProducts,
      rows: nextRows,
    });
  };

  const handleRemoveProduct = () => {
    if (products.length <= 1) {
      return;
    }

    const { products: nextProducts, rows: nextRows } = removeProduct(
      products,
      rows,
    );

    setAttributes({
      products: nextProducts,
      rows: nextRows,
      highlightIndex:
        highlightIndex >= nextProducts.length
          ? nextProducts.length - 1
          : highlightIndex,
    });
  };

  const highlightOptions = [
    { label: __('None', 'kriti-blocks'), value: '-1' },
    ...products.map((product, index) => ({
      label: product.name || `${__('Product', 'kriti-blocks')} ${index + 1}`,
      value: String(index),
    })),
  ];

  const colors = [
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Rose', color: '#e11d48' },
  ];

  return (
    <>
      <PanelBody
        title={__('Comparison Table Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <Button variant="secondary" onClick={handleAddProduct}>
          {__('Add Column', 'kriti-blocks')}
        </Button>
        <Button
          variant="secondary"
          disabled={products.length <= 1}
          onClick={handleRemoveProduct}
        >
          {__('Remove Column', 'kriti-blocks')}
        </Button>

        <SelectControl
          label={__('Highlight Column', 'kriti-blocks')}
          value={String(highlightIndex)}
          options={highlightOptions}
          onChange={(value) =>
            setAttributes({ highlightIndex: parseInt(value, 10) })
          }
          __nextHasNoMarginBottom
        />

        <ColorPalette
          asButtons="true"
          colors={colors}
          value={accentColor}
          onChange={(color) => setAttributes({ accentColor: color })}
          headingLevel="3"
        />
      </PanelBody>

      <PanelBody title={__('Table style', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          label={__('Cell alignment', 'kriti-blocks')}
          value={attributes.cellAlign || 'center'}
          options={[
            { label: __('Left', 'kriti-blocks'), value: 'left' },
            { label: __('Center', 'kriti-blocks'), value: 'center' },
            { label: __('Right', 'kriti-blocks'), value: 'right' },
          ]}
          onChange={(value) => setAttributes({ cellAlign: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Row spacing', 'kriti-blocks')}
          value={attributes.density || 'default'}
          options={[
            { label: __('Compact', 'kriti-blocks'), value: 'compact' },
            { label: __('Default', 'kriti-blocks'), value: 'default' },
            { label: __('Comfortable', 'kriti-blocks'), value: 'comfortable' },
          ]}
          onChange={(value) => setAttributes({ density: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Striped rows', 'kriti-blocks')}
          checked={!!attributes.striped}
          onChange={(value) => setAttributes({ striped: value || undefined })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Highlight row on hover', 'kriti-blocks')}
          checked={!!attributes.rowHover}
          onChange={(value) => setAttributes({ rowHover: value || undefined })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Hide the cross for excluded features', 'kriti-blocks')}
          help={__('Screen readers still hear "Not included".', 'kriti-blocks')}
          checked={!!attributes.hideNo}
          onChange={(value) => setAttributes({ hideNo: value || undefined })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Sticky header', 'kriti-blocks')}
          help={__(
            'Keeps the header visible while scrolling. Turns off the horizontal scroll from tablet width up.',
            'kriti-blocks',
          )}
          checked={!!attributes.stickyHeader}
          onChange={(value) =>
            setAttributes({ stickyHeader: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        {attributes.stickyHeader && (
          <RangeControl
            label={__('Sticky header offset (px)', 'kriti-blocks')}
            help={__('Use this to clear a fixed site header.', 'kriti-blocks')}
            value={attributes.stickyOffset || 0}
            min={0}
            max={200}
            onChange={(value) =>
              setAttributes({ stickyOffset: value || undefined })
            }
          />
        )}
        <ToggleControl
          label={__('Sticky first column', 'kriti-blocks')}
          help={__(
            'Keeps the feature names visible when the table scrolls sideways.',
            'kriti-blocks',
          )}
          checked={!!attributes.stickyFirstCol}
          onChange={(value) =>
            setAttributes({ stickyFirstCol: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <p>{__('Header background', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.headerBg}
          onChange={(color) => setAttributes({ headerBg: color })}
          headingLevel="3"
        />
        <p>{__('Header text', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.headerColor}
          onChange={(color) => setAttributes({ headerColor: color })}
          headingLevel="3"
        />
        <p>{__('Check mark color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.yesColor}
          onChange={(color) => setAttributes({ yesColor: color })}
          headingLevel="3"
        />
        <p>{__('Cross color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.noColor}
          onChange={(color) => setAttributes({ noColor: color })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default ComparisonTableSettingsPanel;
