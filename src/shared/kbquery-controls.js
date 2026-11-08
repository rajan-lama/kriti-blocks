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
import {
  CARD_STYLE_OPTIONS,
  HOVER_OPTIONS,
  RATIO_OPTIONS,
  STICKY_OPTIONS,
  TITLE_TAG_OPTIONS,
  normalizeIdList,
  toggleId,
} from './kbquery-options';

/**
 * Extra query filters: taxonomy terms, include / exclude IDs, offset, sticky.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export function QueryFilterPanel({ attributes, setAttributes }) {
  const {
    postType = 'post',
    filterTaxonomy = '',
    filterTermIds = [],
    includeIds = '',
    excludeIds = '',
    offset = 0,
    stickyPosts = 'ignore',
  } = attributes;

  const taxonomies = useSelect(
    (select) =>
      select('core').getTaxonomies({ type: postType, per_page: -1 }) || [],
    [postType],
  );

  const terms = useSelect(
    (select) =>
      filterTaxonomy
        ? select('core').getEntityRecords('taxonomy', filterTaxonomy, {
            per_page: 100,
            _fields: 'id,name',
          }) || []
        : [],
    [filterTaxonomy],
  );

  const taxonomyOptions = [
    { value: '', label: __('None', 'kriti-blocks') },
    ...taxonomies
      .filter((item) => item.visibility?.publicly_queryable !== false)
      .map((item) => ({
        value: item.slug,
        label: item.name || item.slug,
      })),
  ];

  return (
    <PanelBody
      title={__('Filters & order', 'kriti-blocks')}
      initialOpen={false}
    >
      <SelectControl
        label={__('Filter by taxonomy', 'kriti-blocks')}
        help={__(
          'Show only items in the selected terms, for example tags.',
          'kriti-blocks',
        )}
        value={filterTaxonomy}
        options={taxonomyOptions}
        onChange={(value) =>
          setAttributes({ filterTaxonomy: value, filterTermIds: [] })
        }
        __nextHasNoMarginBottom
      />

      {filterTaxonomy && terms.length > 0 && (
        <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 12 }}>
          {terms.map((term) => (
            <CheckboxControl
              key={term.id}
              label={term.name}
              checked={filterTermIds.includes(term.id)}
              onChange={() =>
                setAttributes({
                  filterTermIds: toggleId(filterTermIds, term.id),
                })
              }
              __nextHasNoMarginBottom
            />
          ))}
        </div>
      )}

      <TextControl
        label={__('Only these IDs', 'kriti-blocks')}
        help={__(
          'Comma separated post IDs. Leave empty for no restriction.',
          'kriti-blocks',
        )}
        value={includeIds}
        onChange={(value) =>
          setAttributes({ includeIds: normalizeIdList(value) })
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

      <RangeControl
        label={__('Skip the first items (offset)', 'kriti-blocks')}
        value={offset}
        min={0}
        max={50}
        onChange={(value) => setAttributes({ offset: value || 0 })}
        __nextHasNoMarginBottom
      />

      {postType === 'post' && (
        <SelectControl
          label={__('Sticky posts', 'kriti-blocks')}
          value={stickyPosts}
          options={STICKY_OPTIONS()}
          onChange={(value) => setAttributes({ stickyPosts: value })}
          __nextHasNoMarginBottom
        />
      )}
    </PanelBody>
  );
}

/**
 * Card look: style, image ratio, hover, title tag, extra meta and per-device
 * columns.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {boolean}  props.showAuthor    Offer an author toggle (related posts).
 * @param {boolean}  props.carousel      Use the "slides" wording.
 * @param {boolean}  props.noResults     Offer the no results message field.
 */
export function QueryCardPanel({
  attributes,
  setAttributes,
  showAuthor = false,
  carousel = false,
  noResults = true,
}) {
  const {
    cardStyle = 'boxed',
    hoverEffect = 'none',
    imageRatio = 'default',
    titleTag = 'h3',
    columnsTablet = 0,
    columnsMobile = 0,
    showReadingTime = false,
    showComments = false,
    showAuthor: authorOn = false,
    slideGap = 24,
    noResultsText = '',
  } = attributes;

  const unit = carousel
    ? __('Slides on tablet', 'kriti-blocks')
    : __('Columns on tablet', 'kriti-blocks');
  const unitMobile = carousel
    ? __('Slides on mobile', 'kriti-blocks')
    : __('Columns on mobile', 'kriti-blocks');

  return (
    <PanelBody
      title={__('Card style & responsive', 'kriti-blocks')}
      initialOpen={false}
    >
      <SelectControl
        label={__('Card style', 'kriti-blocks')}
        value={cardStyle}
        options={CARD_STYLE_OPTIONS()}
        onChange={(value) => setAttributes({ cardStyle: value })}
        __nextHasNoMarginBottom
      />

      <SelectControl
        label={__('Image ratio', 'kriti-blocks')}
        value={imageRatio}
        options={RATIO_OPTIONS()}
        onChange={(value) => setAttributes({ imageRatio: value })}
        __nextHasNoMarginBottom
      />

      <SelectControl
        label={__('Hover effect', 'kriti-blocks')}
        value={hoverEffect}
        options={HOVER_OPTIONS()}
        onChange={(value) => setAttributes({ hoverEffect: value })}
        __nextHasNoMarginBottom
      />

      <SelectControl
        label={__('Title element', 'kriti-blocks')}
        value={titleTag}
        options={TITLE_TAG_OPTIONS()}
        onChange={(value) => setAttributes({ titleTag: value })}
        __nextHasNoMarginBottom
      />

      {showAuthor && (
        <ToggleControl
          label={__('Show author', 'kriti-blocks')}
          checked={!!authorOn}
          onChange={(value) => setAttributes({ showAuthor: value })}
          __nextHasNoMarginBottom
        />
      )}

      <ToggleControl
        label={__('Show reading time', 'kriti-blocks')}
        checked={!!showReadingTime}
        onChange={(value) => setAttributes({ showReadingTime: value })}
        __nextHasNoMarginBottom
      />

      <ToggleControl
        label={__('Show comment count', 'kriti-blocks')}
        checked={!!showComments}
        onChange={(value) => setAttributes({ showComments: value })}
        __nextHasNoMarginBottom
      />

      <RangeControl
        label={unit}
        help={__('0 uses the default (2).', 'kriti-blocks')}
        value={columnsTablet}
        min={0}
        max={4}
        onChange={(value) => setAttributes({ columnsTablet: value || 0 })}
        __nextHasNoMarginBottom
      />

      <RangeControl
        label={unitMobile}
        help={__('0 uses the default (1).', 'kriti-blocks')}
        value={columnsMobile}
        min={0}
        max={2}
        onChange={(value) => setAttributes({ columnsMobile: value || 0 })}
        __nextHasNoMarginBottom
      />

      {carousel && (
        <RangeControl
          label={__('Space between slides (px)', 'kriti-blocks')}
          value={slideGap}
          min={0}
          max={64}
          onChange={(value) => setAttributes({ slideGap: value ?? 24 })}
          __nextHasNoMarginBottom
        />
      )}

      {noResults && (
        <TextControl
          label={__('Message when nothing matches', 'kriti-blocks')}
          help={__('Leave empty to hide the block.', 'kriti-blocks')}
          value={noResultsText}
          onChange={(value) => setAttributes({ noResultsText: value })}
          __nextHasNoMarginBottom
        />
      )}
    </PanelBody>
  );
}
