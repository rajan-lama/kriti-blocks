import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTeamMemberStyles } from '../../helpers';

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

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getTeamMemberStyles(attributes),
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
      {memberName && (
        <RichText.Content
          tagName="h3"
          className="bw-team-member-name"
          value={memberName}
        />
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
    </Tag>
  );
}
