import {
  PanelBody,
  SelectControl,
  TextControl,
  TextareaControl,
  Button,
  ToggleControl,
  RangeControl,
  ColorPalette,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

const StepsSettingsPanel = ({ attributes, setAttributes }) => {
  const { steps, stepsLayout } = attributes;

  const items = Array.isArray(steps) ? steps : [];

  const updateStep = (index, field, value) => {
    const updated = items.map((step, stepIndex) => {
      if (stepIndex !== index) {
        return step;
      }

      return {
        ...step,
        [field]: value,
      };
    });

    setAttributes({ steps: updated });
  };

  const removeStep = (index) => {
    setAttributes({ steps: items.filter((step, i) => i !== index) });
  };

  const addStep = () => {
    setAttributes({
      steps: [...items, { title: '', description: '' }],
    });
  };

  return (
    <>
      <PanelBody
        title={__('Steps Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <SelectControl
          label={__('Layout', 'kriti-blocks')}
          value={stepsLayout}
          options={[
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
          ]}
          onChange={(value) => setAttributes({ stepsLayout: value })}
        />

        {items.map((step, index) => (
          <div className="bw-step-settings" key={index}>
            <h4>
              {
                /* translators: %d: Step number. */
                sprintf(__('Step %d', 'kriti-blocks'), index + 1)
              }
            </h4>

            <TextControl
              label={__('Title', 'kriti-blocks')}
              value={String(step.title || '')}
              onChange={(value) => updateStep(index, 'title', value)}
            />

            <TextareaControl
              label={__('Description', 'kriti-blocks')}
              value={String(step.description || '')}
              onChange={(value) => updateStep(index, 'description', value)}
              rows={3}
            />

            <TextControl
              label={__('Title link (optional)', 'kriti-blocks')}
              type="url"
              value={String(step.url || '')}
              onChange={(value) => updateStep(index, 'url', value)}
            />

            <Button
              variant="link"
              isDestructive
              isSmall
              onClick={() => removeStep(index)}
            >
              {__('Remove step', 'kriti-blocks')}
            </Button>
          </div>
        ))}

        <Button
          variant="secondary"
          isSmall
          onClick={addStep}
          className="bw-steps-add"
        >
          {__('Add Step', 'kriti-blocks')}
        </Button>
      </PanelBody>

      <PanelBody title={__('Step style', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          label={__('Marker shape', 'kriti-blocks')}
          value={attributes.numberStyle || 'circle'}
          options={[
            { label: __('Circle', 'kriti-blocks'), value: 'circle' },
            { label: __('Square', 'kriti-blocks'), value: 'square' },
            { label: __('Rounded square', 'kriti-blocks'), value: 'rounded' },
            { label: __('Plain number', 'kriti-blocks'), value: 'plain' },
          ]}
          onChange={(value) => setAttributes({ numberStyle: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Marker text', 'kriti-blocks')}
          value={attributes.numberFormat || 'decimal'}
          options={[
            { label: '1, 2, 3', value: 'decimal' },
            { label: '01, 02, 03', value: 'zero' },
            { label: 'A, B, C', value: 'alpha' },
          ]}
          onChange={(value) => setAttributes({ numberFormat: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Marker size (px)', 'kriti-blocks')}
          value={attributes.numberSize || 40}
          min={20}
          max={120}
          onChange={(value) => setAttributes({ numberSize: value })}
        />
        <SelectControl
          label={__('Alignment', 'kriti-blocks')}
          value={attributes.stepAlign || 'left'}
          options={[
            { label: __('Left', 'kriti-blocks'), value: 'left' },
            {
              label: __('Centered, marker above text', 'kriti-blocks'),
              value: 'center',
            },
          ]}
          onChange={(value) => setAttributes({ stepAlign: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Connector line between steps', 'kriti-blocks')}
          help={__(
            'In the horizontal layout the marker moves above the text.',
            'kriti-blocks',
          )}
          checked={!!attributes.connector}
          onChange={(value) => setAttributes({ connector: value || undefined })}
          __nextHasNoMarginBottom
        />
        <p>{__('Marker color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.numberBg}
          onChange={(color) => setAttributes({ numberBg: color })}
          headingLevel="3"
        />
        <p>{__('Marker text color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.numberColor}
          onChange={(color) => setAttributes({ numberColor: color })}
          headingLevel="3"
        />
        <p>{__('Connector color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.connectorColor}
          onChange={(color) => setAttributes({ connectorColor: color })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default StepsSettingsPanel;
