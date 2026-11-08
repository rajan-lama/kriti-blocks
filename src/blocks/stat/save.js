import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getStatStyles } from './helpers';
import { getProgress, getStatProps } from './options';
import ProgressBar from './bar';

import './style.scss';

export default function save({ attributes }) {
  const { statNumber, statLabel, statPrefix, statSuffix, enableCount, htmlId } =
    attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getStatProps(attributes, getStatStyles(attributes)),
    'data-bw-count': enableCount ? 'true' : 'false',
  });

  const progress = getProgress(attributes);

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
      {progress !== undefined && <ProgressBar percent={progress} />}
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
