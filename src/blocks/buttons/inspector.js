import { __ } from '@wordpress/i18n';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
  RangeControl,
  Button,
  ButtonGroup,
  __experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { ICONS } from './helpers';
import { LinkSourceFields, TextSourceFields } from '../../shared/DynamicFields';

export default function Inspector({
  attributes,
  setAttributes,
  selected,
  onSelect,
  onUpdate,
  onAdd,
  onRemove,
  onMove,
}) {
  const { buttons = [], justify, gap, direction, stackMobile } = attributes;
  const btn = buttons[selected];
  const set = (patch) => onUpdate(selected, patch);
  // Keeps only the parts that are set, and drops `dynamic` when both are empty.
  const setDynamic = (patch) => {
    const next = { ...(btn?.dynamic || {}), ...patch };
    Object.keys(next).forEach((key) => {
      if (!next[key]) {
        delete next[key];
      }
    });
    set({ dynamic: Object.keys(next).length ? next : undefined });
  };

  return (
    <InspectorControls>
      <PanelBody title={__('Buttons', 'kriti-blocks')}>
        <ButtonGroup className="kb-buttons-picker">
          {buttons.map((b, i) => (
            <Button
              key={i}
              size="small"
              variant={i === selected ? 'primary' : 'secondary'}
              onClick={() => onSelect(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button size="small" variant="tertiary" onClick={onAdd}>
            +
          </Button>
        </ButtonGroup>
        {btn && (
          <div style={{ marginTop: 12 }}>
            <Button
              size="small"
              disabled={selected === 0}
              onClick={() => onMove(selected, -1)}
            >
              {__('Move left', 'kriti-blocks')}
            </Button>
            <Button
              size="small"
              disabled={selected === buttons.length - 1}
              onClick={() => onMove(selected, 1)}
            >
              {__('Move right', 'kriti-blocks')}
            </Button>
            <Button
              size="small"
              isDestructive
              onClick={() => onRemove(selected)}
            >
              {__('Remove', 'kriti-blocks')}
            </Button>
          </div>
        )}
      </PanelBody>

      {btn && (
        <>
          <PanelBody
            title={`${__('Link', 'kriti-blocks')} (${selected + 1})`}
            initialOpen
          >
            <TextControl
              label={__('URL', 'kriti-blocks')}
              type="url"
              value={btn.url || ''}
              onChange={(url) => set({ url })}
              __nextHasNoMarginBottom
            />
            <ToggleControl
              label={__('Open in new tab', 'kriti-blocks')}
              checked={!!btn.newTab}
              onChange={(newTab) => set({ newTab })}
              __nextHasNoMarginBottom
            />
            <ToggleControl
              label={__('Add rel="nofollow"', 'kriti-blocks')}
              checked={!!btn.nofollow}
              onChange={(nofollow) => set({ nofollow })}
              __nextHasNoMarginBottom
            />
            <ToggleControl
              label={__('Add rel="sponsored"', 'kriti-blocks')}
              checked={!!btn.sponsored}
              onChange={(sponsored) => set({ sponsored })}
              __nextHasNoMarginBottom
            />
            <TextControl
              label={__('Accessible label (aria-label)', 'kriti-blocks')}
              help={__(
                'Only needed when the visible text is not descriptive.',
                'kriti-blocks',
              )}
              value={btn.ariaLabel || ''}
              onChange={(ariaLabel) => set({ ariaLabel })}
              __nextHasNoMarginBottom
            />
          </PanelBody>

          <PanelBody
            title={`${__('Dynamic', 'kriti-blocks')} (${selected + 1})`}
            initialOpen={false}
          >
            <LinkSourceFields
              label={__('Link to', 'kriti-blocks')}
              value={btn.dynamic?.link}
              onChange={(link) => setDynamic({ link })}
            />
            <TextSourceFields
              label={__('Button text from', 'kriti-blocks')}
              value={btn.dynamic?.text}
              onChange={(text) => setDynamic({ text })}
            />
            <p className="components-base-control__help">
              {__(
                'The live values appear on the site. The URL and text above are used when a value is empty.',
                'kriti-blocks',
              )}
            </p>
          </PanelBody>

          <PanelBody
            title={`${__('Style', 'kriti-blocks')} (${selected + 1})`}
            initialOpen={false}
          >
            <SelectControl
              label={__('Style', 'kriti-blocks')}
              value={btn.variant || 'solid'}
              options={[
                { value: 'solid', label: __('Solid', 'kriti-blocks') },
                { value: 'outline', label: __('Outline', 'kriti-blocks') },
                { value: 'ghost', label: __('Ghost', 'kriti-blocks') },
                { value: 'link', label: __('Link', 'kriti-blocks') },
              ]}
              onChange={(variant) => set({ variant })}
              __nextHasNoMarginBottom
            />
            <SelectControl
              label={__('Size', 'kriti-blocks')}
              value={btn.size || 'md'}
              options={[
                { value: 'sm', label: __('Small', 'kriti-blocks') },
                { value: 'md', label: __('Medium', 'kriti-blocks') },
                { value: 'lg', label: __('Large', 'kriti-blocks') },
              ]}
              onChange={(size) => set({ size })}
              __nextHasNoMarginBottom
            />
            <ToggleControl
              label={__('Full width', 'kriti-blocks')}
              checked={!!btn.fullWidth}
              onChange={(fullWidth) => set({ fullWidth })}
              __nextHasNoMarginBottom
            />
            <UnitControl
              label={__('Corner radius', 'kriti-blocks')}
              value={btn.radius || ''}
              onChange={(radius) => set({ radius: radius || '' })}
            />
            <PanelColorSettings
              title={__('Colors', 'kriti-blocks')}
              colorSettings={[
                {
                  label: __('Background / main color', 'kriti-blocks'),
                  value: btn.bg || undefined,
                  onChange: (bg) => set({ bg }),
                },
                {
                  label: __('Text', 'kriti-blocks'),
                  value: btn.color || undefined,
                  onChange: (color) => set({ color }),
                },
                {
                  label: __('Border', 'kriti-blocks'),
                  value: btn.border || undefined,
                  onChange: (border) => set({ border }),
                },
                {
                  label: __('Background on hover', 'kriti-blocks'),
                  value: btn.hoverBg || undefined,
                  onChange: (hoverBg) => set({ hoverBg }),
                },
                {
                  label: __('Text on hover', 'kriti-blocks'),
                  value: btn.hoverColor || undefined,
                  onChange: (hoverColor) => set({ hoverColor }),
                },
              ]}
            />
          </PanelBody>

          <PanelBody
            title={`${__('Icon', 'kriti-blocks')} (${selected + 1})`}
            initialOpen={false}
          >
            <SelectControl
              label={__('Icon', 'kriti-blocks')}
              value={btn.icon || ''}
              options={ICONS}
              onChange={(icon) => set({ icon })}
              __nextHasNoMarginBottom
            />
            {btn.icon && (
              <SelectControl
                label={__('Icon position', 'kriti-blocks')}
                value={btn.iconPosition || 'left'}
                options={[
                  { value: 'left', label: __('Before text', 'kriti-blocks') },
                  { value: 'right', label: __('After text', 'kriti-blocks') },
                ]}
                onChange={(iconPosition) => set({ iconPosition })}
                __nextHasNoMarginBottom
              />
            )}
          </PanelBody>
        </>
      )}

      <PanelBody title={__('Group layout', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          label={__('Alignment', 'kriti-blocks')}
          value={justify}
          options={[
            { value: 'left', label: __('Left', 'kriti-blocks') },
            { value: 'center', label: __('Center', 'kriti-blocks') },
            { value: 'right', label: __('Right', 'kriti-blocks') },
            { value: 'between', label: __('Space between', 'kriti-blocks') },
          ]}
          onChange={(v) => setAttributes({ justify: v })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Direction', 'kriti-blocks')}
          value={direction}
          options={[
            { value: 'row', label: __('Row', 'kriti-blocks') },
            { value: 'column', label: __('Column', 'kriti-blocks') },
          ]}
          onChange={(v) => setAttributes({ direction: v })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Gap (px)', 'kriti-blocks')}
          value={gap}
          min={0}
          max={80}
          onChange={(v) => setAttributes({ gap: v ?? 12 })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Stack on mobile', 'kriti-blocks')}
          checked={!!stackMobile}
          onChange={(v) => setAttributes({ stackMobile: v })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
    </InspectorControls>
  );
}
