/**
 * Shared editor controls for the WooCommerce blocks.
 *
 * Only used inside inspector panels, never on the front end.
 */
import { FormTokenField } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Converts a list of record IDs to the labels FormTokenField displays.
 *
 * @param {Array<number>} ids     Selected IDs.
 * @param {Array<Object>} records Known records ({ id, label }).
 * @return {Array<string>} Labels for the IDs that could be resolved.
 */
export function idsToTokens(ids, records) {
  const list = Array.isArray(ids) ? ids : [];

  return list
    .map((id) => records.find((record) => record.id === id))
    .filter(Boolean)
    .map((record) => record.label);
}

/**
 * Converts FormTokenField tokens back to a de-duplicated list of IDs.
 * Tokens that do not match a known record are dropped.
 *
 * @param {Array<string|Object>} tokens  Tokens from the field.
 * @param {Array<Object>}        records Known records ({ id, label }).
 * @return {Array<number>} Record IDs.
 */
export function tokensToIds(tokens, records) {
  const ids = [];

  (tokens || []).forEach((token) => {
    const label = typeof token === 'string' ? token : token?.value;
    const match = records.find((record) => record.label === label);

    if (match && !ids.includes(match.id)) {
      ids.push(match.id);
    }
  });

  return ids;
}

/**
 * Token field that stores record IDs (terms or products).
 *
 * @param {Object}   props
 * @param {string}   props.label    Field label.
 * @param {string}   props.kind     Entity kind: 'taxonomy' or 'postType'.
 * @param {string}   props.name     Entity name, such as 'product_tag' or 'product'.
 * @param {number[]} props.value    Selected IDs.
 * @param {Function} props.onChange Called with the new ID list.
 * @param {string}   props.help     Optional help text.
 */
export function KbWooEntityTokenField({
  label,
  kind,
  name,
  value,
  onChange,
  help,
}) {
  const ids = Array.isArray(value) ? value : [];

  const records = useSelect(
    (select) => {
      const core = select('core');
      const toRecord = (record) => ({
        id: record.id,
        label: String(
          (record.name ?? record.title?.rendered ?? record.title) || record.id,
        ).replace(/<[^>]*>/g, ''),
      });
      const all = (
        core.getEntityRecords(kind, name, {
          per_page: 100,
          _fields: 'id,name,title',
        }) || []
      ).map(toRecord);

      const missing = ids.length
        ? (
            core.getEntityRecords(kind, name, {
              include: ids,
              per_page: 100,
              _fields: 'id,name,title',
            }) || []
          ).map(toRecord)
        : [];

      missing.forEach((record) => {
        if (!all.some((item) => item.id === record.id)) {
          all.push(record);
        }
      });

      return all;
    },
    [kind, name, ids.join(',')],
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <FormTokenField
        __nextHasNoMarginBottom
        __next40pxDefaultSize
        label={label}
        value={idsToTokens(ids, records)}
        suggestions={records.map((record) => record.label)}
        onChange={(tokens) => onChange(tokensToIds(tokens, records))}
        tokenizeOnBlur
        placeholder={__('Start typing…', 'kriti-blocks')}
        __experimentalExpandOnFocus
        __experimentalShowHowTo={false}
      />
      {help && <p className="components-base-control__help">{help}</p>}
    </div>
  );
}
