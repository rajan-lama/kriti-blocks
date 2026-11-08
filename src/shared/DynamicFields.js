import { SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Field groups for the dynamic content options. Each takes a value object and
 * an `onChange` that receives the new object (or undefined when cleared).
 *
 * Text:  { source, key, format, prefix, suffix }
 * Link:  { source, key, scheme }
 * Image: { source, key }
 */

export const TEXT_SOURCES = [
  { value: 'post_title', label: __('Post title', 'kriti-blocks') },
  { value: 'post_excerpt', label: __('Post excerpt', 'kriti-blocks') },
  { value: 'post_date', label: __('Post date', 'kriti-blocks') },
  { value: 'post_modified', label: __('Post modified date', 'kriti-blocks') },
  { value: 'post_author', label: __('Post author name', 'kriti-blocks') },
  { value: 'post_terms', label: __('Post categories or tags', 'kriti-blocks') },
  { value: 'site_title', label: __('Site title', 'kriti-blocks') },
  { value: 'site_tagline', label: __('Site tagline', 'kriti-blocks') },
  { value: 'current_year', label: __('Current year', 'kriti-blocks') },
  { value: 'meta', label: __('Custom field', 'kriti-blocks') },
  { value: 'acf', label: __('ACF field', 'kriti-blocks') },
];

const LINK_SOURCES = [
  { value: 'post_permalink', label: __('Link to this post', 'kriti-blocks') },
  {
    value: 'author_posts',
    label: __("Link to the author's posts", 'kriti-blocks'),
  },
  { value: 'home', label: __('Link to the home page', 'kriti-blocks') },
  { value: 'meta', label: __('Custom field (URL)', 'kriti-blocks') },
  { value: 'acf', label: __('ACF field (URL)', 'kriti-blocks') },
];

const IMAGE_SOURCES = [
  { value: 'featured_image', label: __('Featured image', 'kriti-blocks') },
  {
    value: 'meta_image',
    label: __('Custom field (image ID or URL)', 'kriti-blocks'),
  },
  { value: 'acf_image', label: __('ACF image field', 'kriti-blocks') },
  { value: 'site_logo', label: __('Site logo', 'kriti-blocks') },
  { value: 'author_avatar', label: __('Author picture', 'kriti-blocks') },
];

const NONE = {
  value: '',
  label: __('None (use what is saved)', 'kriti-blocks'),
};

// Drops empty values, and the whole object when no source is chosen.
const clean = (config, patch) => {
  const next = { ...config, ...patch };
  Object.keys(next).forEach((key) => {
    if (!next[key]) {
      delete next[key];
    }
  });
  return next.source ? next : undefined;
};

const FIELD_HELP = __(
  'Letters, numbers, dashes and underscores. Names that start with an underscore are private and cannot be used.',
  'kriti-blocks',
);

export function TextSourceFields({ value, onChange, label }) {
  const config = value || {};
  const source = config.source || '';
  const update = (patch) => onChange(clean(config, patch));
  return (
    <>
      <SelectControl
        __nextHasNoMarginBottom
        label={label || __('Show', 'kriti-blocks')}
        value={source}
        options={[NONE, ...TEXT_SOURCES]}
        onChange={(v) => update({ source: v })}
      />
      {(source === 'meta' || source === 'acf') && (
        <TextControl
          __nextHasNoMarginBottom
          label={__('Field name', 'kriti-blocks')}
          help={FIELD_HELP}
          value={config.key || ''}
          onChange={(v) => update({ key: v })}
        />
      )}
      {source === 'post_terms' && (
        <TextControl
          __nextHasNoMarginBottom
          label={__('Taxonomy', 'kriti-blocks')}
          placeholder="category"
          value={config.key || ''}
          onChange={(v) => update({ key: v })}
        />
      )}
      {(source === 'post_date' || source === 'post_modified') && (
        <TextControl
          __nextHasNoMarginBottom
          label={__('Date format', 'kriti-blocks')}
          placeholder="F j, Y"
          help={__('Leave empty to use the site format.', 'kriti-blocks')}
          value={config.format || ''}
          onChange={(v) => update({ format: v })}
        />
      )}
      {source && (
        <>
          <TextControl
            __nextHasNoMarginBottom
            label={__('Text before', 'kriti-blocks')}
            value={config.prefix || ''}
            onChange={(v) => update({ prefix: v })}
          />
          <TextControl
            __nextHasNoMarginBottom
            label={__('Text after', 'kriti-blocks')}
            value={config.suffix || ''}
            onChange={(v) => update({ suffix: v })}
          />
        </>
      )}
    </>
  );
}

export function LinkSourceFields({ value, onChange, label }) {
  const config = value || {};
  const source = config.source || '';
  const update = (patch) => onChange(clean(config, patch));
  return (
    <>
      <SelectControl
        __nextHasNoMarginBottom
        label={label || __('Link to', 'kriti-blocks')}
        value={source}
        options={[NONE, ...LINK_SOURCES]}
        onChange={(v) => update({ source: v })}
      />
      {(source === 'meta' || source === 'acf') && (
        <>
          <TextControl
            __nextHasNoMarginBottom
            label={__('Field name', 'kriti-blocks')}
            help={FIELD_HELP}
            value={config.key || ''}
            onChange={(v) => update({ key: v })}
          />
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Field holds', 'kriti-blocks')}
            value={config.scheme || ''}
            options={[
              { value: '', label: __('A web address', 'kriti-blocks') },
              {
                value: 'mailto:',
                label: __('An email address', 'kriti-blocks'),
              },
              { value: 'tel:', label: __('A phone number', 'kriti-blocks') },
            ]}
            onChange={(v) => update({ scheme: v })}
          />
        </>
      )}
    </>
  );
}

export function ImageSourceFields({ value, onChange, label }) {
  const config = value || {};
  const source = config.source || '';
  const update = (patch) => onChange(clean(config, patch));
  return (
    <>
      <SelectControl
        __nextHasNoMarginBottom
        label={label || __('Picture from', 'kriti-blocks')}
        value={source}
        options={[NONE, ...IMAGE_SOURCES]}
        onChange={(v) => update({ source: v })}
      />
      {(source === 'meta_image' || source === 'acf_image') && (
        <TextControl
          __nextHasNoMarginBottom
          label={__('Field name', 'kriti-blocks')}
          help={FIELD_HELP}
          value={config.key || ''}
          onChange={(v) => update({ key: v })}
        />
      )}
    </>
  );
}
