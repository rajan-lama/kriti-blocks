import {
  PanelBody,
  RangeControl,
  TextControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from '../../shared/kbsb-controls';
import { LinkSourceFields, TextSourceFields } from '../../shared/DynamicFields';

const stripTags = (html) => String(html || '').replace(/<[^>]*>/g, '');

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    items,
    markerStyle,
    numberStart,
    markerSize,
    itemGap,
    columns,
    dividers,
    dividerColor,
  } = attributes;

  const listItems = Array.isArray(items) ? items : [];

  const updateItem = (index, patch) =>
    setAttributes({
      items: listItems.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });

  // Keeps only the parts that are set, and drops `dynamic` when both are empty.
  const setItemDynamic = (index, patch) => {
    const next = { ...(listItems[index]?.dynamic || {}), ...patch };
    Object.keys(next).forEach((key) => {
      if (!next[key]) {
        delete next[key];
      }
    });
    updateItem(index, {
      dynamic: Object.keys(next).length ? next : undefined,
    });
  };

  return (
    <>
      <PanelBody title={__('List Layout', 'kriti-blocks')} initialOpen={false}>
        {markerStyle === 'number' && (
          <NumberControl
            label={__('Start numbering at', 'kriti-blocks')}
            value={numberStart ?? 1}
            min={0}
            onChange={(value) =>
              setAttributes({
                numberStart:
                  value === '' || Number(value) === 1
                    ? undefined
                    : Number(value),
              })
            }
          />
        )}
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Marker Size (px)', 'kriti-blocks')}
          value={markerSize ?? 20}
          onChange={(value) => setAttributes({ markerSize: value })}
          min={10}
          max={64}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Space Between Items (px)', 'kriti-blocks')}
          value={itemGap ?? 10}
          onChange={(value) => setAttributes({ itemGap: value })}
          min={0}
          max={80}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Columns', 'kriti-blocks')}
          value={columns || 1}
          onChange={(value) =>
            setAttributes({ columns: value > 1 ? value : undefined })
          }
          min={1}
          max={3}
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Divider between items', 'kriti-blocks')}
          checked={!!dividers}
          onChange={(value) => setAttributes({ dividers: value || undefined })}
        />
        {dividers && (
          <ColorField
            label={__('Divider Color', 'kriti-blocks')}
            value={dividerColor}
            onChange={(value) => setAttributes({ dividerColor: value })}
          />
        )}
      </PanelBody>

      <PanelBody title={__('Item Links', 'kriti-blocks')} initialOpen={false}>
        {listItems.map((item, index) => (
          <div key={index}>
            <TextControl
              __nextHasNoMarginBottom
              label={
                stripTags(item.text).slice(0, 40) ||
                __('Item', 'kriti-blocks') + ' ' + (index + 1)
              }
              type="url"
              placeholder="https://"
              value={item.url || ''}
              onChange={(value) =>
                updateItem(index, { url: value || undefined })
              }
            />
            {item.url && (
              <ToggleControl
                __nextHasNoMarginBottom
                label={__('Open in new tab', 'kriti-blocks')}
                checked={!!item.newTab}
                onChange={(value) =>
                  updateItem(index, { newTab: value || undefined })
                }
              />
            )}
          </div>
        ))}
      </PanelBody>

      <PanelBody
        title={__('Dynamic Items', 'kriti-blocks')}
        initialOpen={false}
      >
        <p className="components-base-control__help">
          {__(
            'Items need some text. The live value replaces it on the site, and the text is used when the value is empty. A link only changes if the item already has a link above.',
            'kriti-blocks',
          )}
        </p>
        {listItems.map((item, index) =>
          stripTags(item.text).trim() === '' ? null : (
            <div key={index} style={{ marginBottom: 16 }}>
              <strong>{stripTags(item.text).slice(0, 40)}</strong>
              <TextSourceFields
                label={__('Text from', 'kriti-blocks')}
                value={item.dynamic?.text}
                onChange={(text) => setItemDynamic(index, { text })}
              />
              {item.url && (
                <LinkSourceFields
                  label={__('Link to', 'kriti-blocks')}
                  value={item.dynamic?.link}
                  onChange={(link) => setItemDynamic(index, { link })}
                />
              )}
            </div>
          ),
        )}
      </PanelBody>
    </>
  );
}
