import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
  TITLE_TAG_OPTIONS,
  normalizeIdList,
} from '../../shared/kbquery-options';

/**
 * Related posts only options: what "related" means, manual picks, fallback and
 * an optional heading.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export default function RelatedOptionsPanel({ attributes, setAttributes }) {
  const {
    relateBy = 'all',
    manualIds = '',
    excludeIds = '',
    fallbackRecent = true,
    headingText = '',
    headingTag = 'h2',
  } = attributes;

  const taxonomies = useSelect((select) => {
    const type = select('core/editor')?.getCurrentPostType?.() || 'post';

    return select('core').getTaxonomies({ type, per_page: -1 }) || [];
  }, []);

  const relateOptions = [
    { value: 'all', label: __('Any shared taxonomy term', 'kriti-blocks') },
    ...taxonomies
      .filter((item) => item.visibility?.publicly_queryable !== false)
      .map((item) => ({ value: item.slug, label: item.name || item.slug })),
  ];

  return (
    <PanelBody title={__('Related by', 'kriti-blocks')} initialOpen={false}>
      <SelectControl
        label={__('Relate by', 'kriti-blocks')}
        value={relateBy}
        options={relateOptions}
        onChange={(value) => setAttributes({ relateBy: value })}
        __nextHasNoMarginBottom
      />

      <TextControl
        label={__('Pick posts manually', 'kriti-blocks')}
        help={__(
          'Comma separated post IDs, shown in this order. Replaces the automatic selection.',
          'kriti-blocks',
        )}
        value={manualIds}
        onChange={(value) =>
          setAttributes({ manualIds: normalizeIdList(value) })
        }
        __nextHasNoMarginBottom
      />

      <TextControl
        label={__('Exclude IDs', 'kriti-blocks')}
        help={__('Comma separated post IDs to leave out.', 'kriti-blocks')}
        value={excludeIds}
        onChange={(value) =>
          setAttributes({ excludeIds: normalizeIdList(value) })
        }
        __nextHasNoMarginBottom
      />

      <ToggleControl
        label={__('Show recent posts when nothing is shared', 'kriti-blocks')}
        checked={!!fallbackRecent}
        onChange={(value) => setAttributes({ fallbackRecent: value })}
        __nextHasNoMarginBottom
      />

      <TextControl
        label={__('Heading', 'kriti-blocks')}
        help={__('Optional, for example "You may also like".', 'kriti-blocks')}
        value={headingText}
        onChange={(value) => setAttributes({ headingText: value })}
        __nextHasNoMarginBottom
      />

      {headingText && (
        <SelectControl
          label={__('Heading element', 'kriti-blocks')}
          value={headingTag}
          options={TITLE_TAG_OPTIONS()}
          onChange={(value) => setAttributes({ headingTag: value })}
          __nextHasNoMarginBottom
        />
      )}
    </PanelBody>
  );
}
