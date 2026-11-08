import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Extra author box options: role, post count, website and social links,
 * avatar shape, link style and bio length.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export default function AuthorBoxOptionsPanel({ attributes, setAttributes }) {
  const {
    showRole = false,
    showPostCount = false,
    showWebsite = false,
    showSocial = false,
    avatarShape = 'circle',
    linkStyle = 'link',
    bioLength = 0,
    showBio = true,
    showAvatar = true,
    showArchiveLink = true,
  } = attributes;

  return (
    <PanelBody title={__('Look & extras', 'kriti-blocks')} initialOpen={false}>
      <ToggleControl
        label={__('Show role label', 'kriti-blocks')}
        checked={!!showRole}
        onChange={(value) => setAttributes({ showRole: value })}
        __nextHasNoMarginBottom
      />
      <ToggleControl
        label={__('Show post count', 'kriti-blocks')}
        checked={!!showPostCount}
        onChange={(value) => setAttributes({ showPostCount: value })}
        __nextHasNoMarginBottom
      />
      <ToggleControl
        label={__('Show website link', 'kriti-blocks')}
        checked={!!showWebsite}
        onChange={(value) => setAttributes({ showWebsite: value })}
        __nextHasNoMarginBottom
      />
      <ToggleControl
        label={__('Show social links', 'kriti-blocks')}
        help={__(
          'Uses profile fields named twitter, facebook, instagram, linkedin, youtube, github and pinterest (for example from an SEO plugin).',
          'kriti-blocks',
        )}
        checked={!!showSocial}
        onChange={(value) => setAttributes({ showSocial: value })}
        __nextHasNoMarginBottom
      />
      {showAvatar && (
        <SelectControl
          label={__('Avatar shape', 'kriti-blocks')}
          value={avatarShape}
          options={[
            { value: 'circle', label: __('Circle', 'kriti-blocks') },
            { value: 'rounded', label: __('Rounded square', 'kriti-blocks') },
            { value: 'square', label: __('Square', 'kriti-blocks') },
          ]}
          onChange={(value) => setAttributes({ avatarShape: value })}
          __nextHasNoMarginBottom
        />
      )}
      {showBio && (
        <RangeControl
          label={__('Limit biography (words)', 'kriti-blocks')}
          help={__('0 shows the full biography.', 'kriti-blocks')}
          value={bioLength}
          min={0}
          max={200}
          step={5}
          onChange={(value) => setAttributes({ bioLength: value || 0 })}
          __nextHasNoMarginBottom
        />
      )}
      {showArchiveLink && (
        <SelectControl
          label={__('Archive link looks like', 'kriti-blocks')}
          value={linkStyle}
          options={[
            { value: 'link', label: __('Text link', 'kriti-blocks') },
            { value: 'button', label: __('Button', 'kriti-blocks') },
          ]}
          onChange={(value) => setAttributes({ linkStyle: value })}
          __nextHasNoMarginBottom
        />
      )}
    </PanelBody>
  );
}
