import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTeamMemberStyles } from './helpers';
import { getTeamMemberOptions } from './options';
import SocialList from './social-list';

import './style.scss';

export default function save({ attributes }) {
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
  const NameTag = options.nameTag;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getTeamMemberStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
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
      {memberName && !options.profile && (
        <RichText.Content
          tagName={NameTag}
          className="bw-team-member-name"
          value={memberName}
        />
      )}
      {memberName && options.profile && (
        <NameTag className="bw-team-member-name">
          <a
            href={options.profile.href}
            target={options.profile.target}
            rel={options.profile.rel}
          >
            <RichText.Content value={memberName} />
          </a>
        </NameTag>
      )}
      {memberRole && (
        <RichText.Content
          tagName="div"
          className="bw-team-member-role"
          value={memberRole}
        />
      )}
      {memberBio && (
        <RichText.Content
          tagName="p"
          className="bw-team-member-bio"
          value={memberBio}
        />
      )}
      <SocialList options={options} />
    </Tag>
  );
}
