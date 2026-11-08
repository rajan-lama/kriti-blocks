import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const SearchSettingsPanel = ({ attributes, setAttributes }) => {
  const { label, placeholder, buttonText, showButton, layout, postType } =
    attributes;

  const postTypeOptions = useSelect((select) => {
    const types = select('core').getPostTypes({ per_page: -1 }) || [];

    return [
      {
        label: __('All content', 'kriti-blocks'),
        value: '',
      },
      ...types
        .filter((type) => type.viewable && type.slug !== 'attachment')
        .map((type) => ({
          label: type.labels?.singular_name || type.slug,
          value: type.slug,
        })),
    ];
  }, []);

  return (
    <PanelBody title={__('Search Settings', 'kriti-blocks')} initialOpen={true}>
      <TextControl
        label={__('Field label', 'kriti-blocks')}
        help={__('Visually hidden, used by screen readers.', 'kriti-blocks')}
        value={label}
        onChange={(value) => setAttributes({ label: value })}
      />

      <TextControl
        label={__('Placeholder', 'kriti-blocks')}
        value={placeholder}
        onChange={(value) => setAttributes({ placeholder: value })}
      />

      <ToggleControl
        label={__('Show submit button', 'kriti-blocks')}
        checked={!!showButton}
        onChange={(value) => setAttributes({ showButton: value })}
      />

      {showButton && (
        <TextControl
          label={__('Button text', 'kriti-blocks')}
          value={buttonText}
          onChange={(value) => setAttributes({ buttonText: value })}
        />
      )}

      <SelectControl
        label={__('Layout', 'kriti-blocks')}
        value={layout}
        options={[
          {
            label: __('Inline', 'kriti-blocks'),
            value: 'inline',
          },
          {
            label: __('Stacked', 'kriti-blocks'),
            value: 'stacked',
          },
        ]}
        onChange={(value) => setAttributes({ layout: value })}
      />

      <SelectControl
        label={__('Limit to post type', 'kriti-blocks')}
        value={postType}
        options={postTypeOptions}
        onChange={(value) => setAttributes({ postType: value })}
      />
    </PanelBody>
  );
};

export default SearchSettingsPanel;
