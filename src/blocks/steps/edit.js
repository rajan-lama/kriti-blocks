import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getVisibleSteps } from './helpers';
import { getStepsOptions, formatStepNumber } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { steps, stepsLayout, htmlId, extraClass } = attributes;

  const items = Array.isArray(steps) ? steps : [];
  const visibleSteps = getVisibleSteps(steps);
  const options = getStepsOptions(attributes);

  const blockProps = useBlockProps({
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
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        {items.map((step, index) => (
          <div className="bw-step" key={index}>
            <span className="bw-step-number" aria-hidden="true">
              {formatStepNumber(index, attributes.numberFormat)}
            </span>
            <div className="bw-step-content">
              {String(step.title || '').trim() ? (
                <h3 className="bw-step-title">{step.title}</h3>
              ) : (
                <h3 className="bw-step-title bw-step-placeholder">
                  {__('Step title', 'kriti-blocks')}
                </h3>
              )}
              {String(step.description || '').trim() ? (
                <p className="bw-step-description">{step.description}</p>
              ) : (
                <p className="bw-step-description bw-step-placeholder">
                  {__('Step description', 'kriti-blocks')}
                </p>
              )}
            </div>
          </div>
        ))}
        {visibleSteps.length === 0 && (
          <p className="bw-steps-hint">
            {__('Add your steps in the block settings.', 'kriti-blocks')}
          </p>
        )}
      </div>
    </>
  );
}
