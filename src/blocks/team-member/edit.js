import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getTeamMemberStyles } from './helpers';
import { getTeamMemberOptions } from './options';
import SocialList from './social-list';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const {
    memberName,
    memberRole,
    memberBio,
    avatarUrl,
    avatarAlt,
    avatarShape,
    tagType,
    htmlId,
    extraClass,
  } = attributes;

  const options = getTeamMemberOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getTeamMemberStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <Tag {...blockProps}>
        {avatarUrl && (
          <div className="bw-team-member-photo-wrap">
            <img
              className={
                avatarShape === 'square'
                  ? 'bw-team-member-photo bw-team-member-photo-square'
                  : 'bw-team-member-photo'
              }
              src={avatarUrl}
              alt={avatarAlt || ''}
              loading="lazy"
            />
          </div>
        )}
        <RichText
          tagName={options.nameTag}
          className="bw-team-member-name"
          value={memberName}
          onChange={(value) => setAttributes({ memberName: value })}
          placeholder={__('Member name', 'kriti-blocks')}
        />
        <RichText
          tagName="div"
          className="bw-team-member-role"
          value={memberRole}
          onChange={(value) => setAttributes({ memberRole: value })}
          placeholder={__('Role', 'kriti-blocks')}
        />
        <RichText
          tagName="p"
          className="bw-team-member-bio"
          value={memberBio}
          onChange={(value) => setAttributes({ memberBio: value })}
          placeholder={__('Write a short bio…', 'kriti-blocks')}
        />
        <SocialList options={options} />
      </Tag>
    </>
  );
}
