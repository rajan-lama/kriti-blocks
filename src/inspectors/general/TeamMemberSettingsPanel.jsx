import {
  PanelBody,
  ButtonGroup,
  Button,
  ToggleControl,
  SelectControl,
  TextControl,
  RangeControl,
} from '@wordpress/components';
import { SOCIAL_NETWORKS, MAX_SOCIALS } from '../../blocks/team-member/options';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const AVATAR_ALLOWED_TYPES = ['image'];

const TeamMemberSettingsPanel = ({ attributes, setAttributes }) => {
  const { memberAlign, avatarShape, hasShadow } = attributes;

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  const onSelectAvatar = (media) => {
    setAttributes({
      avatarUrl: media.url,
      avatarId: media.id,
      avatarAlt: media.alt || '',
    });
  };

  const onRemoveAvatar = () => {
    setAttributes({
      avatarUrl: '',
      avatarId: 0,
      avatarAlt: '',
    });
  };

  return (
    <>
      <PanelBody
        title={__('Team Member Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelectAvatar}
            allowedTypes={AVATAR_ALLOWED_TYPES}
            value={attributes.avatarId}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {attributes.avatarUrl
                  ? __('Replace Photo', 'kriti-blocks')
                  : __('Choose Photo', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>

        {attributes.avatarUrl && (
          <Button variant="link" isDestructive onClick={onRemoveAvatar}>
            {__('Remove Photo', 'kriti-blocks')}
          </Button>
        )}

        <SelectControl
          label={__('HTML Tag', 'kriti-blocks')}
          value={attributes.tagType}
          options={[
            { label: 'Div', value: 'div' },
            { label: 'Article', value: 'article' },
            { label: 'Aside', value: 'aside' },
            { label: 'Section', value: 'section' },
          ]}
          onChange={(value) => setAttributes({ tagType: value })}
        />

        <ButtonGroup aria-label={__('Content Alignment', 'kriti-blocks')}>
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              isSmall
              onClick={() => setAttributes({ memberAlign: option.value })}
              isPressed={memberAlign === option.value}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>

        <SelectControl
          label={__('Photo Shape', 'kriti-blocks')}
          value={avatarShape}
          options={[
            { label: 'Round', value: 'round' },
            { label: 'Square', value: 'square' },
          ]}
          onChange={(value) => setAttributes({ avatarShape: value })}
        />

        <ToggleControl
          label={__('Shadow', 'kriti-blocks')}
          checked={!!hasShadow}
          onChange={(value) => setAttributes({ hasShadow: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Team member extras', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          label={__('Photo position', 'kriti-blocks')}
          value={attributes.photoPosition || 'top'}
          options={[
            { label: __('Top', 'kriti-blocks'), value: 'top' },
            { label: __('Left of the text', 'kriti-blocks'), value: 'left' },
            { label: __('Right of the text', 'kriti-blocks'), value: 'right' },
          ]}
          onChange={(value) => setAttributes({ photoPosition: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Photo size (px)', 'kriti-blocks')}
          value={attributes.photoSize}
          min={40}
          max={300}
          allowReset
          initialPosition={112}
          onChange={(value) => setAttributes({ photoSize: value })}
        />
        <ToggleControl
          label={__('Grayscale photo, color on hover', 'kriti-blocks')}
          checked={!!attributes.photoGrayscale}
          onChange={(value) =>
            setAttributes({ photoGrayscale: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Name element', 'kriti-blocks')}
          value={attributes.nameTag || 'h3'}
          options={['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].map((v) => ({
            label: v,
            value: v,
          }))}
          onChange={(value) => setAttributes({ nameTag: value })}
          __nextHasNoMarginBottom
        />
        <TextControl
          label={__('Link the name to a profile page', 'kriti-blocks')}
          type="url"
          value={attributes.profileUrl || ''}
          onChange={(value) =>
            setAttributes({ profileUrl: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        {attributes.profileUrl && (
          <ToggleControl
            label={__('Open profile in a new tab', 'kriti-blocks')}
            checked={!!attributes.profileNewTab}
            onChange={(value) =>
              setAttributes({ profileNewTab: value || undefined })
            }
            __nextHasNoMarginBottom
          />
        )}
        <h4>{__('Social links', 'kriti-blocks')}</h4>
        {(Array.isArray(attributes.socials) ? attributes.socials : []).map(
          (item, index) => {
            const list = attributes.socials;
            const update = (field, value) =>
              setAttributes({
                socials: list.map((entry, i) =>
                  i === index ? { ...entry, [field]: value } : entry,
                ),
              });
            return (
              <div key={index}>
                <SelectControl
                  label={__('Network', 'kriti-blocks')}
                  value={item.network || 'website'}
                  options={Object.keys(SOCIAL_NETWORKS).map((key) => ({
                    label: SOCIAL_NETWORKS[key],
                    value: key,
                  }))}
                  onChange={(value) => update('network', value)}
                  __nextHasNoMarginBottom
                />
                <TextControl
                  label={
                    item.network === 'email'
                      ? __('Email address', 'kriti-blocks')
                      : __('Profile URL (https://…)', 'kriti-blocks')
                  }
                  value={item.url || ''}
                  onChange={(value) => update('url', value)}
                  __nextHasNoMarginBottom
                />
                <Button
                  variant="link"
                  isDestructive
                  onClick={() => {
                    const next = list.filter((entry, i) => i !== index);
                    setAttributes({ socials: next.length ? next : undefined });
                  }}
                >
                  {__('Remove link', 'kriti-blocks')}
                </Button>
              </div>
            );
          },
        )}
        <Button
          variant="secondary"
          disabled={(attributes.socials || []).length >= MAX_SOCIALS}
          onClick={() =>
            setAttributes({
              socials: [
                ...(Array.isArray(attributes.socials)
                  ? attributes.socials
                  : []),
                { network: 'website', url: '' },
              ],
            })
          }
        >
          {__('Add social link', 'kriti-blocks')}
        </Button>
        {(attributes.socials || []).length > 0 && (
          <ToggleControl
            label={__('Open social links in a new tab', 'kriti-blocks')}
            checked={!!attributes.socialNewTab}
            onChange={(value) =>
              setAttributes({ socialNewTab: value || undefined })
            }
            __nextHasNoMarginBottom
          />
        )}
      </PanelBody>
    </>
  );
};

export default TeamMemberSettingsPanel;
