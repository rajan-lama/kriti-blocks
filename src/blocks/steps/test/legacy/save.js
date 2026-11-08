import { useBlockProps } from '@wordpress/block-editor';
import { getVisibleSteps } from '../../helpers';

export default function save({ attributes }) {
  const { steps, stepsLayout, htmlId, extraClass } = attributes;

  const visibleSteps = getVisibleSteps(steps);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, `bw-steps-layout-${stepsLayout || 'vertical'}`]
        .filter(Boolean)
        .join(' ') || undefined,
  });

  return (
    <div {...blockProps}>
      {visibleSteps.map((step, index) => (
        <div className="bw-step" key={index}>
          <span className="bw-step-number" aria-hidden="true">
            {index + 1}
          </span>
          <div className="bw-step-content">
            {String(step.title || '').trim() && (
              <h3 className="bw-step-title">{step.title}</h3>
            )}
            {String(step.description || '').trim() && (
              <p className="bw-step-description">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
