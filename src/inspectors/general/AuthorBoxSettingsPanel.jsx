import {
  ComboboxControl,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const AuthorBoxSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    authorId,
    layout,
    headingLevel,
    showAvatar,
    avatarSize,
    showBio,
    showArchiveLink,
    archiveLinkText,
  } = attributes;

  const authorOptions = useSelect((select) => {
    const users =
      select('core').getUsers({
        per_page: 100,
        who: 'authors',
        _fields: 'id,name',
      }) || [];

    return [
      {
        label: __('Current entry author', 'kriti-blocks'),
        value: '',
      },
      ...users.map((user) => ({
        label: user.name,
        value: String(user.id),
      })),
    ];
  }, []);

  return (
    <PanelBody
      title={__('Author Box Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <ComboboxControl
        label={__('Author', 'kriti-blocks')}
        help={__(
          'Leave as current entry author to follow the viewed entry.',
          'kriti-blocks',
        )}
        value={authorId ? String(authorId) : ''}
        options={authorOptions}
        onChange={(value) =>
          setAttributes({ authorId: value ? parseInt(value, 10) : 0 })
        }
      />

      <SelectControl
        label={__('Layout', 'kriti-blocks')}
        value={layout}
        options={[
          {
            label: __('Avatar beside text', 'kriti-blocks'),
            value: 'horizontal',
          },
          {
            label: __('Avatar above text', 'kriti-blocks'),
            value: 'stacked',
          },
        ]}
        onChange={(value) => setAttributes({ layout: value })}
      />

      <SelectControl
        label={__('Heading level', 'kriti-blocks')}
        value={String(headingLevel)}
        options={[
          { label: 'H2', value: '2' },
          { label: 'H3', value: '3' },
          { label: 'H4', value: '4' },
          { label: 'H5', value: '5' },
          { label: 'H6', value: '6' },
        ]}
        onChange={(value) =>
          setAttributes({ headingLevel: parseInt(value, 10) })
        }
      />

      <ToggleControl
        label={__('Show avatar', 'kriti-blocks')}
        checked={!!showAvatar}
        onChange={(value) => setAttributes({ showAvatar: value })}
      />

      {showAvatar && (
        <RangeControl
          label={__('Avatar size (px)', 'kriti-blocks')}
          value={avatarSize}
          min={24}
          max={256}
          step={8}
          onChange={(value) => setAttributes({ avatarSize: value })}
        />
      )}

      <ToggleControl
        label={__('Show biography', 'kriti-blocks')}
        checked={!!showBio}
        onChange={(value) => setAttributes({ showBio: value })}
      />

      <ToggleControl
        label={__('Show archive link', 'kriti-blocks')}
        checked={!!showArchiveLink}
        onChange={(value) => setAttributes({ showArchiveLink: value })}
      />

      {showArchiveLink && (
        <TextControl
          label={__('Archive link text', 'kriti-blocks')}
          help={__('Leave empty to use the default label.', 'kriti-blocks')}
          value={archiveLinkText}
          onChange={(value) => setAttributes({ archiveLinkText: value })}
        />
      )}
    </PanelBody>
  );
};

export default AuthorBoxSettingsPanel;
