import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getStatStyles } from './helpers';
import { getProgress, getStatProps } from './options';
import ProgressBar from './bar';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { statNumber, statLabel, statPrefix, statSuffix, htmlId } = attributes;
  const progress = getProgress(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getStatProps(attributes, getStatStyles(attributes)),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="bw-stat-value">
          {statPrefix && <span className="bw-stat-prefix">{statPrefix}</span>}
          <RichText
            tagName="span"
            className="bw-stat-num"
            value={statNumber}
            onChange={(value) => setAttributes({ statNumber: value })}
            placeholder={__('Add number', 'kriti-blocks')}
          />
          {statSuffix && <span className="bw-stat-suffix">{statSuffix}</span>}
        </div>
        {progress !== undefined && <ProgressBar percent={progress} />}
        <RichText
          tagName="p"
          className="bw-stat-label"
          value={statLabel}
          onChange={(value) => setAttributes({ statLabel: value })}
          placeholder={__('Stat label', 'kriti-blocks')}
        />
      </div>
    </>
  );
}
