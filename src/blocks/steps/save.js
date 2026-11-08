import { useBlockProps } from '@wordpress/block-editor';
import { getVisibleSteps } from './helpers';
import { getStepsOptions, formatStepNumber, getStepUrl } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { steps, stepsLayout, htmlId, extraClass } = attributes;

  const visibleSteps = getVisibleSteps(steps);
  const options = getStepsOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [
        extraClass,
        `bw-steps-layout-${stepsLayout || 'vertical'}`,
        ...options.classes,
      ]
        .filter(Boolean)
        .join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
  });

  return (
    <div {...blockProps}>
      {visibleSteps.map((step, index) => (
        <div className="bw-step" key={index}>
          <span className="bw-step-number" aria-hidden="true">
            {formatStepNumber(index, attributes.numberFormat)}
          </span>
          <div className="bw-step-content">
            {String(step.title || '').trim() && (
              <h3 className="bw-step-title">
                {getStepUrl(step) ? (
                  <a href={getStepUrl(step)}>{step.title}</a>
                ) : (
                  step.title
                )}
              </h3>
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
