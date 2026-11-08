import {
  CheckboxControl,
  PanelBody,
  RangeControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const WooProductFiltersSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    title,
    showCategories,
    categoryLimit,
    showCounts,
    showPrice,
    priceMin,
    priceMax,
    buttonText,
    attributeSlugs,
    attributeTermLimit,
    showRating,
    collapsible,
    startCollapsed,
    showActiveFilters,
    showClearAll,
  } = attributes;

  const [productAttributes, setProductAttributes] = useState([]);

  useEffect(() => {
    let active = true;

    apiFetch({ path: '/wc/v3/products/attributes?per_page=100' })
      .then((items) => {
        if (active && Array.isArray(items)) {
          setProductAttributes(
            items.map((item) => ({
              slug: String(item.slug || '').replace(/^pa_/, ''),
              name: item.name,
            })),
          );
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const selectedAttributes = Array.isArray(attributeSlugs)
    ? attributeSlugs
    : [];

  const toggleAttribute = (slug) => {
    const next = selectedAttributes.includes(slug)
      ? selectedAttributes.filter((value) => value !== slug)
      : [...selectedAttributes, slug].slice(0, 5);

    setAttributes({ attributeSlugs: next });
  };

  return (
    <>
      <PanelBody
        title={__('Product Filters Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <TextControl
          label={__('Title', 'kriti-blocks')}
          value={title}
          onChange={(value) => setAttributes({ title: value })}
        />

        <ToggleControl
          label={__('Show product categories', 'kriti-blocks')}
          checked={!!showCategories}
          onChange={(value) => setAttributes({ showCategories: value })}
        />

        {showCategories && (
          <>
            <RangeControl
              label={__('Maximum categories', 'kriti-blocks')}
              value={categoryLimit}
              min={1}
              max={50}
              onChange={(value) => setAttributes({ categoryLimit: value })}
            />

            <ToggleControl
              label={__('Show product counts', 'kriti-blocks')}
              checked={!!showCounts}
              onChange={(value) => setAttributes({ showCounts: value })}
            />
          </>
        )}

        <ToggleControl
          label={__('Show price filter', 'kriti-blocks')}
          checked={!!showPrice}
          onChange={(value) => setAttributes({ showPrice: value })}
        />

        {showPrice && (
          <>
            <TextControl
              label={__('Minimum price', 'kriti-blocks')}
              type="number"
              min={0}
              value={priceMin}
              onChange={(value) =>
                setAttributes({
                  priceMin: parseInt(value, 10) || 0,
                })
              }
            />

            <TextControl
              label={__('Maximum price', 'kriti-blocks')}
              type="number"
              min={0}
              value={priceMax}
              onChange={(value) =>
                setAttributes({
                  priceMax: parseInt(value, 10) || 0,
                })
              }
            />

            <TextControl
              label={__('Button text', 'kriti-blocks')}
              value={buttonText}
              onChange={(value) => setAttributes({ buttonText: value })}
            />
          </>
        )}
      </PanelBody>

      <PanelBody
        title={__('More Filters & Display', 'kriti-blocks')}
        initialOpen={false}
      >
        {productAttributes.length > 0 && (
          <>
            <p>{__('Attribute filters (up to 5)', 'kriti-blocks')}</p>
            {productAttributes.map((item) => (
              <CheckboxControl
                __nextHasNoMarginBottom
                key={item.slug}
                label={item.name}
                checked={selectedAttributes.includes(item.slug)}
                onChange={() => toggleAttribute(item.slug)}
              />
            ))}
          </>
        )}

        {selectedAttributes.length > 0 && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Maximum terms per attribute', 'kriti-blocks')}
            value={attributeTermLimit || 12}
            min={1}
            max={50}
            onChange={(value) =>
              setAttributes({ attributeTermLimit: value || 12 })
            }
          />
        )}

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show rating filter', 'kriti-blocks')}
          checked={!!showRating}
          onChange={(value) => setAttributes({ showRating: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show active filters', 'kriti-blocks')}
          help={__(
            'Removable chips for the filters currently applied.',
            'kriti-blocks',
          )}
          checked={!!showActiveFilters}
          onChange={(value) => setAttributes({ showActiveFilters: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Collapsible groups', 'kriti-blocks')}
          checked={!!collapsible}
          onChange={(value) => setAttributes({ collapsible: value })}
        />

        {collapsible && (
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Start collapsed', 'kriti-blocks')}
            checked={!!startCollapsed}
            onChange={(value) => setAttributes({ startCollapsed: value })}
          />
        )}

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show "Clear filters" link', 'kriti-blocks')}
          checked={showClearAll !== false}
          onChange={(value) => setAttributes({ showClearAll: value })}
        />
      </PanelBody>
    </>
  );
};

export default WooProductFiltersSettingsPanel;
