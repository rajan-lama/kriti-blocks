import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const TermListSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    taxonomy,
    layout,
    hierarchical,
    hideEmpty,
    showCount,
    orderBy,
    order,
    limit,
  } = attributes;

  const taxonomies = useSelect((select) => {
    return select('core').getTaxonomies({ per_page: -1 }) || [];
  }, []);

  const taxonomyOptions = taxonomies
    .filter((item) => item.visibility?.publicly_queryable !== false)
    .map((item) => ({
      label: item.name || item.slug,
      value: item.slug,
    }));

  const currentTaxonomy = taxonomies.find((item) => item.slug === taxonomy);
  const isHierarchical = !!currentTaxonomy?.hierarchical;

  return (
    <PanelBody
      title={__('Term List Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <SelectControl
        label={__('Taxonomy', 'kriti-blocks')}
        value={taxonomy}
        options={taxonomyOptions}
        onChange={(value) =>
          setAttributes({ taxonomy: value, hierarchical: false })
        }
      />

      <SelectControl
        label={__('Layout', 'kriti-blocks')}
        value={layout}
        options={[
          { label: __('List', 'kriti-blocks'), value: 'list' },
          { label: __('Inline', 'kriti-blocks'), value: 'inline' },
        ]}
        onChange={(value) => setAttributes({ layout: value })}
      />

      {isHierarchical && (
        <ToggleControl
          label={__('Nest child terms', 'kriti-blocks')}
          checked={!!hierarchical}
          onChange={(value) => setAttributes({ hierarchical: value })}
        />
      )}

      <ToggleControl
        label={__('Hide empty terms', 'kriti-blocks')}
        checked={!!hideEmpty}
        onChange={(value) => setAttributes({ hideEmpty: value })}
      />

      <ToggleControl
        label={__('Show count', 'kriti-blocks')}
        checked={!!showCount}
        onChange={(value) => setAttributes({ showCount: value })}
      />

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
        label={__('Maximum terms', 'kriti-blocks')}
        help={__('0 shows all terms.', 'kriti-blocks')}
        value={limit}
        min={0}
        max={100}
        step={1}
        onChange={(value) => setAttributes({ limit: value })}
      />
    </PanelBody>
  );
};

export default TermListSettingsPanel;
