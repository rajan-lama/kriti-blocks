import { PanelColorSettings } from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Keeps only digits and separators from a typed list of term IDs.
 *
 * @param {string} value Raw input.
 * @return {string} Comma separated IDs.
 */
export function normalizeTermIds(value) {
  const ids = String(value || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map((id) => String(parseInt(id, 10)))
    .filter((id) => id !== '0');

  return Array.from(new Set(ids)).slice(0, 100).join(', ');
}

export const ICON_OPTIONS = () => [
  { value: 'none', label: __('None', 'kriti-blocks') },
  { value: 'folder', label: __('Folder', 'kriti-blocks') },
  { value: 'tag', label: __('Tag', 'kriti-blocks') },
  { value: 'hash', label: __('Hash', 'kriti-blocks') },
  { value: 'arrow', label: __('Arrow', 'kriti-blocks') },
  { value: 'dot', label: __('Dot', 'kriti-blocks') },
];

export const LINK_STYLE_OPTIONS = () => [
  { value: 'auto', label: __('Follow layout', 'kriti-blocks') },
  { value: 'plain', label: __('Plain link', 'kriti-blocks') },
  { value: 'pill', label: __('Pill', 'kriti-blocks') },
  { value: 'outline', label: __('Outline pill', 'kriti-blocks') },
];

/**
 * Extra term list options: filters, link style, columns, description, icon
 * and colours.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export default function TermListOptionsPanel({ attributes, setAttributes }) {
  const {
    taxonomy = 'category',
    layout = 'list',
    includeIds = '',
    excludeIds = '',
    topLevelOnly = false,
    linkStyle = 'auto',
    columns = 1,
    showDescription = false,
    termIcon = 'none',
  } = attributes;

  const isHierarchical = useSelect(
    (select) =>
      !!select('core')
        .getTaxonomies({ per_page: -1 })
        ?.find((item) => item.slug === taxonomy)?.hierarchical,
    [taxonomy],
  );

  const colors = [
    ['linkColor', __('Link text', 'kriti-blocks')],
    ['linkBg', __('Link background', 'kriti-blocks')],
    ['hoverColor', __('Hover text', 'kriti-blocks')],
    ['hoverBg', __('Hover background', 'kriti-blocks')],
    ['countColor', __('Count', 'kriti-blocks')],
  ].map(([name, label]) => ({
    value: attributes[name] || undefined,
    onChange: (value) => setAttributes({ [name]: value || '' }),
    label,
  }));

  return (
    <>
      <PanelBody
        title={__('Filters & look', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          label={__('Only these term IDs', 'kriti-blocks')}
          help={__('Comma separated. Leave empty to show all.', 'kriti-blocks')}
          value={includeIds}
          onChange={(value) =>
            setAttributes({ includeIds: normalizeTermIds(value) })
          }
          __nextHasNoMarginBottom
        />
        <TextControl
          label={__('Exclude term IDs', 'kriti-blocks')}
          value={excludeIds}
          onChange={(value) =>
            setAttributes({ excludeIds: normalizeTermIds(value) })
          }
          __nextHasNoMarginBottom
        />
        {isHierarchical && (
          <ToggleControl
            label={__('Top-level terms only', 'kriti-blocks')}
            checked={!!topLevelOnly}
            onChange={(value) => setAttributes({ topLevelOnly: value })}
            __nextHasNoMarginBottom
          />
        )}
        <SelectControl
          label={__('Link style', 'kriti-blocks')}
          value={linkStyle}
          options={LINK_STYLE_OPTIONS()}
          onChange={(value) => setAttributes({ linkStyle: value })}
          __nextHasNoMarginBottom
        />
        {layout === 'list' && (
          <RangeControl
            label={__('Columns', 'kriti-blocks')}
            value={columns}
            min={1}
            max={4}
            onChange={(value) => setAttributes({ columns: value || 1 })}
            __nextHasNoMarginBottom
          />
        )}
        <SelectControl
          label={__('Icon', 'kriti-blocks')}
          value={termIcon}
          options={ICON_OPTIONS()}
          onChange={(value) => setAttributes({ termIcon: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Show term description', 'kriti-blocks')}
          checked={!!showDescription}
          onChange={(value) => setAttributes({ showDescription: value })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
      <PanelColorSettings
        title={__('Term colors', 'kriti-blocks')}
        initialOpen={false}
        colorSettings={colors}
      />
    </>
  );
}
