import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getStatStyles } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const {
    statNumber,
    statLabel,
    statPrefix,
    statSuffix,
    enableCount,
    htmlId,
    extraClass,
  } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getStatStyles(attributes),
    'data-bw-count': enableCount ? 'true' : 'false',
  });

  return (
    <div {...blockProps}>
      <div className="bw-stat-value">
        {statPrefix && <span className="bw-stat-prefix">{statPrefix}</span>}
        {statNumber && (
          <RichText.Content
            tagName="span"
            className="bw-stat-num"
            value={statNumber}
          />
        )}
        {statSuffix && <span className="bw-stat-suffix">{statSuffix}</span>}
      </div>
      {statLabel && (
        <RichText.Content
          tagName="p"
          className="bw-stat-label"
          value={statLabel}
        />
      )}
    </div>
  );
}
