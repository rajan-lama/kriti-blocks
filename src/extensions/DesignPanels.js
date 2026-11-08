import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import * as Components from '@wordpress/components';

import { setIn, getIn, alignAt, alignMap } from './style-utils';

const {
  PanelBody,
  SelectControl,
  RangeControl,
  ToggleControl,
  TextControl,
  TextareaControl,
  GradientPicker,
  Button,
  ButtonGroup,
  BaseControl,
  __experimentalUnitControl: UnitControl,
  __experimentalBoxControl,
  BoxControl: StableBoxControl,
} = Components;
const BoxControl = StableBoxControl || __experimentalBoxControl;

// Presets from Settings > Kriti Global Styles, passed in by PHP.
const GLOBAL =
  (typeof window !== 'undefined' && window.kritiBlocksGlobal) || {};
const GLOBAL_COLORS = (GLOBAL.colors || []).map(({ name, color }) => ({
  name,
  color,
}));
const withNone = (list) =>
  list.length
    ? [
        { value: '', label: __('Custom', 'kriti-blocks') },
        ...list.map((i) => ({ value: i.value, label: i.name })),
      ]
    : [];
const FONT_PRESETS = withNone(GLOBAL.fontSizes || []);
const SPACE_PRESETS = withNone(GLOBAL.spacing || []);
const isPreset = (v) => typeof v === 'string' && v.startsWith('var(--kb-');

const DEVICE_LABELS = {
  d: __('Desktop', 'kriti-blocks'),
  t: __('Tablet', 'kriti-blocks'),
  m: __('Mobile', 'kriti-blocks'),
};

const WEIGHTS = [
  '',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
].map((v) => ({ value: v, label: v || __('Default', 'kriti-blocks') }));

const ANIMATIONS = [
  ['', __('None', 'kriti-blocks')],
  ['fade', __('Fade in', 'kriti-blocks')],
  ['fade-up', __('Fade up', 'kriti-blocks')],
  ['fade-down', __('Fade down', 'kriti-blocks')],
  ['fade-left', __('Fade in from right', 'kriti-blocks')],
  ['fade-right', __('Fade in from left', 'kriti-blocks')],
  ['zoom-in', __('Zoom in', 'kriti-blocks')],
  ['flip', __('Flip', 'kriti-blocks')],
].map(([value, label]) => ({ value, label }));

function DeviceSwitcher({ device, onChange }) {
  return (
    <ButtonGroup className="kb-device-switcher">
      {Object.keys(DEVICE_LABELS).map((d) => (
        <Button
          key={d}
          size="small"
          variant={device === d ? 'primary' : 'secondary'}
          onClick={() => onChange(d)}
        >
          {DEVICE_LABELS[d]}
        </Button>
      ))}
    </ButtonGroup>
  );
}

function ShadowEditor({ label, value, onChange }) {
  const s = value || {};
  const set = (key, v) => onChange({ ...s, [key]: v });
  return (
    <BaseControl __nextHasNoMarginBottom>
      <BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
      {[
        ['x', __('Horizontal', 'kriti-blocks'), -50, 50],
        ['y', __('Vertical', 'kriti-blocks'), -50, 50],
        ['blur', __('Blur', 'kriti-blocks'), 0, 100],
        ['spread', __('Spread', 'kriti-blocks'), -50, 50],
      ].map(([key, text, min, max]) => (
        <RangeControl
          key={key}
          label={text}
          value={s[key] ?? 0}
          min={min}
          max={max}
          onChange={(v) => set(key, v)}
          __nextHasNoMarginBottom
        />
      ))}
      <TextControl
        label={__('Color (hex, rgb, rgba)', 'kriti-blocks')}
        value={s.color || ''}
        placeholder="rgba(0,0,0,.25)"
        onChange={(v) => set('color', v)}
        __nextHasNoMarginBottom
      />
      <Button variant="link" isDestructive onClick={() => onChange(undefined)}>
        {__('Clear', 'kriti-blocks')}
      </Button>
    </BaseControl>
  );
}

const CLIPBOARD_KEY = 'kriti-blocks-style-clipboard';

// Session storage can throw (private windows, blocked site data), so keep an
// in-memory copy as the fallback.
let memoryClipboard = null;

function readClipboard() {
  try {
    const raw = window.sessionStorage.getItem(CLIPBOARD_KEY);
    return raw ? JSON.parse(raw) : memoryClipboard;
  } catch (e) {
    return memoryClipboard;
  }
}

function writeClipboard(style) {
  memoryClipboard = style;
  try {
    window.sessionStorage.setItem(CLIPBOARD_KEY, JSON.stringify(style));
  } catch (e) {
    // Memory copy is enough.
  }
}

// Design controls that a block already has in its own General tab. Those
// controls write to the saved markup, so showing the Design one as well would
// give two controls for one setting.
const NATIVE_CONTROLS = {
  'kriti-blocks/heading': [
    'fontSize',
    'fontWeight',
    'transform',
    'align',
    'lineHeight',
    'letterSpacing',
  ],
  'kriti-blocks/text': [
    'fontSize',
    'fontWeight',
    'transform',
    'align',
    'lineHeight',
    'letterSpacing',
  ],
  'kriti-blocks/woo-product-price': ['fontSize'],
  'kriti-blocks/woo-sale-badge': ['fontSize'],
  'kriti-blocks/woo-product-rating': ['fontSize'],
  'kriti-blocks/woo-add-to-cart': ['fontSize'],
  'kriti-blocks/card': ['borderRadius'],
  'kriti-blocks/image': ['borderRadius'],
  'kriti-blocks/icon': ['borderRadius', 'padding'],
  'kriti-blocks/archive-header': ['minHeight'],
  'kriti-blocks/advance-header': ['borderWidth', 'borderStyle'],
  'kriti-blocks/back-to-top': ['borderWidth', 'borderStyle'],
  'kriti-blocks/row': ['gap'],
  'kriti-blocks/grid': ['gap'],
  'kriti-blocks/columns': ['gap'],
  'kriti-blocks/logo-grid': ['gap'],
  'kriti-blocks/buttons': ['gap'],
};

// Every control in the Typography panel. When a block already has all of them in its
// own General tab, the panel would be empty, so it is not shown at all.
const TYPOGRAPHY_CONTROLS = [
  'fontSize',
  'fontWeight',
  'transform',
  'align',
  'lineHeight',
  'letterSpacing',
];

export function DesignSections({ value, onChange, blockName, part = 'all' }) {
  const [hasCopy, setHasCopy] = useState(() => !!readClipboard());
  const show = (key) => !(NATIVE_CONTROLS[blockName] || []).includes(key);
  const [device, setDevice] = useState('d');
  const set = (path, v) => onChange(setIn(value, path, v));
  const get = (path, fallback) => getIn(value, path, fallback);

  const boxValue = (prop) => {
    const v = get([prop, device], {});
    return {
      top: v.top ?? undefined,
      right: v.right ?? undefined,
      bottom: v.bottom ?? undefined,
      left: v.left ?? undefined,
    };
  };
  const setBox = (prop, v) =>
    onChange(
      ['top', 'right', 'bottom', 'left'].reduce(
        (acc, side) => setIn(acc, [prop, device, side], v?.[side]),
        value,
      ),
    );
  const layout = (
    <>
      <PanelBody
        title={__('Spacing & size', 'kriti-blocks')}
        initialOpen={false}
      >
        <DeviceSwitcher device={device} onChange={setDevice} />
        {SPACE_PRESETS.length > 0 && (
          <>
            {['padding', 'margin']
              .filter((prop) => show(prop))
              .map((prop) => (
                <SelectControl
                  key={prop}
                  __nextHasNoMarginBottom
                  label={`${prop === 'padding' ? __('Padding preset (all sides)', 'kriti-blocks') : __('Margin preset (all sides)', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
                  value={
                    isPreset(get([prop, device, 'top']))
                      ? get([prop, device, 'top'])
                      : ''
                  }
                  options={SPACE_PRESETS}
                  onChange={(v) =>
                    setBox(
                      prop,
                      v
                        ? { top: v, right: v, bottom: v, left: v }
                        : {
                            top: undefined,
                            right: undefined,
                            bottom: undefined,
                            left: undefined,
                          },
                    )
                  }
                />
              ))}
          </>
        )}
        {BoxControl && (
          <>
            {show('padding') && (
              <BoxControl
                label={`${__('Padding', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
                values={boxValue('padding')}
                onChange={(v) => setBox('padding', v)}
              />
            )}
            <BoxControl
              label={`${__('Margin', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
              values={boxValue('margin')}
              onChange={(v) => setBox('margin', v)}
            />
          </>
        )}
        {show('gap') && SPACE_PRESETS.length > 0 && (
          <SelectControl
            __nextHasNoMarginBottom
            label={`${__('Gap preset', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
            value={isPreset(get(['gap', device])) ? get(['gap', device]) : ''}
            options={SPACE_PRESETS}
            onChange={(v) => set(['gap', device], v)}
          />
        )}
        {show('gap') && (
          <UnitControl
            label={`${__('Gap', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
            value={isPreset(get(['gap', device])) ? '' : get(['gap', device])}
            onChange={(v) => set(['gap', device], v)}
          />
        )}
        {device !== 'd' && (
          <>
            <RangeControl
              label={`${__('Grid columns', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
              help={__(
                'Grid blocks only. Overrides the block setting.',
                'kriti-blocks',
              )}
              value={get(['cols', device], undefined)}
              min={1}
              max={12}
              allowReset
              onChange={(v) => set(['cols', device], v)}
              __nextHasNoMarginBottom
            />
            <SelectControl
              label={`${__('Row direction', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
              help={__(
                'Row and flex blocks only. Use "Column" to stack.',
                'kriti-blocks',
              )}
              value={get(['stack', device])}
              options={[
                { value: '', label: __('Default', 'kriti-blocks') },
                { value: 'row', label: __('Row', 'kriti-blocks') },
                {
                  value: 'column',
                  label: __('Column (stack)', 'kriti-blocks'),
                },
                {
                  value: 'column-reverse',
                  label: __('Column, reversed', 'kriti-blocks'),
                },
                {
                  value: 'row-reverse',
                  label: __('Row, reversed', 'kriti-blocks'),
                },
              ]}
              onChange={(v) => set(['stack', device], v)}
              __nextHasNoMarginBottom
            />
          </>
        )}
        {show('minHeight') && (
          <UnitControl
            label={`${__('Minimum height', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
            value={get(['minHeight', device])}
            onChange={(v) => set(['minHeight', device], v)}
          />
        )}
      </PanelBody>

      <PanelBody title={__('Colors', 'kriti-blocks')} initialOpen={false}>
        <PanelColorSettings
          title={__('Colors', 'kriti-blocks')}
          className="kb-design-colors"
          colorSettings={[
            {
              label: __('Background', 'kriti-blocks'),
              colors: GLOBAL_COLORS,
              value: get(['bg', 'color']) || undefined,
              onChange: (v) => set(['bg', 'color'], v),
            },
            {
              label: __('Background on hover', 'kriti-blocks'),
              colors: GLOBAL_COLORS,
              value: get(['bg', 'hover']) || undefined,
              onChange: (v) => set(['bg', 'hover'], v),
            },
            {
              label: __('Text', 'kriti-blocks'),
              colors: GLOBAL_COLORS,
              value: get(['color', 'text']) || undefined,
              onChange: (v) => set(['color', 'text'], v),
            },
            {
              label: __('Text on hover', 'kriti-blocks'),
              colors: GLOBAL_COLORS,
              value: get(['color', 'hover']) || undefined,
              onChange: (v) => set(['color', 'hover'], v),
            },
          ]}
        />
        <BaseControl __nextHasNoMarginBottom>
          <BaseControl.VisualLabel>
            {__('Background gradient', 'kriti-blocks')}
          </BaseControl.VisualLabel>
          <GradientPicker
            value={get(['bg', 'gradient']) || undefined}
            onChange={(v) => set(['bg', 'gradient'], v)}
            clearable
            gradients={[]}
          />
        </BaseControl>
      </PanelBody>

      {TYPOGRAPHY_CONTROLS.some(show) && (
        <PanelBody title={__('Typography', 'kriti-blocks')} initialOpen={false}>
          <DeviceSwitcher device={device} onChange={setDevice} />
          {show('fontSize') && FONT_PRESETS.length > 0 && (
            <SelectControl
              __nextHasNoMarginBottom
              label={`${__('Font size preset', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
              value={
                isPreset(get(['font', 'size', device]))
                  ? get(['font', 'size', device])
                  : ''
              }
              options={FONT_PRESETS}
              onChange={(v) => set(['font', 'size', device], v)}
            />
          )}
          {show('fontSize') && (
            <UnitControl
              label={`${__('Font size', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
              value={
                isPreset(get(['font', 'size', device]))
                  ? ''
                  : get(['font', 'size', device])
              }
              onChange={(v) => set(['font', 'size', device], v)}
            />
          )}
          {show('fontWeight') && (
            <SelectControl
              label={__('Font weight', 'kriti-blocks')}
              value={get(['font', 'weight'])}
              options={WEIGHTS}
              onChange={(v) => set(['font', 'weight'], v)}
              __nextHasNoMarginBottom
            />
          )}
          {show('transform') && (
            <SelectControl
              label={__('Text transform', 'kriti-blocks')}
              value={get(['font', 'transform'])}
              options={[
                { value: '', label: __('Default', 'kriti-blocks') },
                { value: 'none', label: __('None', 'kriti-blocks') },
                { value: 'uppercase', label: __('Uppercase', 'kriti-blocks') },
                { value: 'lowercase', label: __('Lowercase', 'kriti-blocks') },
                {
                  value: 'capitalize',
                  label: __('Capitalize', 'kriti-blocks'),
                },
              ]}
              onChange={(v) => set(['font', 'transform'], v)}
              __nextHasNoMarginBottom
            />
          )}
          {show('align') && (
            <SelectControl
              label={`${__('Text align', 'kriti-blocks')} (${DEVICE_LABELS[device]})`}
              value={alignAt(get(['font', 'align']), device)}
              options={[
                { value: '', label: __('Default', 'kriti-blocks') },
                { value: 'left', label: __('Left', 'kriti-blocks') },
                { value: 'center', label: __('Center', 'kriti-blocks') },
                { value: 'right', label: __('Right', 'kriti-blocks') },
                { value: 'justify', label: __('Justify', 'kriti-blocks') },
              ]}
              onChange={(v) => {
                // Converts the older single string into a per-device map first.
                const next = {
                  ...alignMap(get(['font', 'align'])),
                  [device]: v,
                };
                if (!v) {
                  delete next[device];
                }
                set(['font', 'align'], next);
              }}
              __nextHasNoMarginBottom
            />
          )}
          {show('lineHeight') && (
            <RangeControl
              label={__('Line height', 'kriti-blocks')}
              value={get(['font', 'lineHeight'], undefined)}
              min={0.8}
              max={3}
              step={0.05}
              allowReset
              onChange={(v) => set(['font', 'lineHeight'], v)}
              __nextHasNoMarginBottom
            />
          )}
          {show('letterSpacing') && (
            <UnitControl
              label={__('Letter spacing', 'kriti-blocks')}
              value={get(['font', 'letterSpacing'])}
              units={[
                { value: 'px', label: 'px' },
                { value: 'em', label: 'em' },
              ]}
              onChange={(v) => set(['font', 'letterSpacing'], v)}
            />
          )}
        </PanelBody>
      )}

      <PanelBody
        title={__('Border & shadow', 'kriti-blocks')}
        initialOpen={false}
      >
        {show('borderWidth') && (
          <UnitControl
            label={__('Border width', 'kriti-blocks')}
            value={get(['border', 'width'])}
            onChange={(v) => set(['border', 'width'], v)}
          />
        )}
        {show('borderStyle') && (
          <SelectControl
            label={__('Border style', 'kriti-blocks')}
            value={get(['border', 'style'])}
            options={[
              { value: '', label: __('Solid', 'kriti-blocks') },
              { value: 'dashed', label: __('Dashed', 'kriti-blocks') },
              { value: 'dotted', label: __('Dotted', 'kriti-blocks') },
              { value: 'double', label: __('Double', 'kriti-blocks') },
            ]}
            onChange={(v) => set(['border', 'style'], v)}
            __nextHasNoMarginBottom
          />
        )}
        {show('borderRadius') && (
          <UnitControl
            label={__('Border radius', 'kriti-blocks')}
            value={get(['border', 'radius'])}
            onChange={(v) => set(['border', 'radius'], v)}
          />
        )}
        <PanelColorSettings
          title={__('Border colors', 'kriti-blocks')}
          colorSettings={[
            {
              label: __('Border', 'kriti-blocks'),
              colors: GLOBAL_COLORS,
              value: get(['border', 'color']) || undefined,
              onChange: (v) => set(['border', 'color'], v),
            },
            {
              label: __('Border on hover', 'kriti-blocks'),
              colors: GLOBAL_COLORS,
              value: get(['border', 'hover']) || undefined,
              onChange: (v) => set(['border', 'hover'], v),
            },
          ]}
        />
        <ShadowEditor
          label={__('Box shadow', 'kriti-blocks')}
          value={get(['shadow'], undefined)}
          onChange={(v) => set(['shadow'], v)}
        />
        <ShadowEditor
          label={__('Box shadow on hover', 'kriti-blocks')}
          value={get(['shadowHover'], undefined)}
          onChange={(v) => set(['shadowHover'], v)}
        />
      </PanelBody>

      {show('position') && (
        <PanelBody
          title={__('Position & layer', 'kriti-blocks')}
          initialOpen={false}
        >
          <SelectControl
            label={__('Position', 'kriti-blocks')}
            value={get(['position'])}
            options={[
              { value: '', label: __('Default', 'kriti-blocks') },
              { value: 'relative', label: __('Relative', 'kriti-blocks') },
              { value: 'absolute', label: __('Absolute', 'kriti-blocks') },
              {
                value: 'fixed',
                label: __('Fixed to the screen', 'kriti-blocks'),
              },
              { value: 'sticky', label: __('Sticky', 'kriti-blocks') },
            ]}
            help={__(
              'Absolute and fixed blocks leave the normal flow of the page and are placed with the offsets below.',
              'kriti-blocks',
            )}
            onChange={(v) => set(['position'], v)}
            __nextHasNoMarginBottom
          />
          {get(['position']) && (
            <>
              <DeviceSwitcher device={device} onChange={setDevice} />
              {['top', 'right', 'bottom', 'left'].map((side) => (
                <UnitControl
                  key={side}
                  label={`${side.charAt(0).toUpperCase()}${side.slice(1)} (${DEVICE_LABELS[device]})`}
                  value={get(['inset', device, side])}
                  onChange={(v) => set(['inset', device, side], v)}
                />
              ))}
            </>
          )}
          <TextControl
            type="number"
            label={__('Layer (z-index)', 'kriti-blocks')}
            help={__(
              'Higher numbers sit on top of lower ones. From -9999 to 9999.',
              'kriti-blocks',
            )}
            min={-9999}
            max={9999}
            value={get(['zIndex'], '')}
            onChange={(v) => {
              const n = parseInt(v, 10);
              set(['zIndex'], Number.isNaN(n) ? undefined : n);
            }}
            __nextHasNoMarginBottom
          />
        </PanelBody>
      )}
    </>
  );

  const advanced = (
    <>
      <PanelBody
        title={__('Copy & paste styles', 'kriti-blocks')}
        initialOpen={false}
      >
        <ButtonGroup>
          <Button
            variant="secondary"
            disabled={!Object.keys(value || {}).length}
            onClick={() => {
              writeClipboard(value);
              setHasCopy(true);
            }}
          >
            {__('Copy styles', 'kriti-blocks')}
          </Button>
          <Button
            variant="secondary"
            disabled={!hasCopy}
            onClick={() => {
              const copied = readClipboard();
              if (copied) {
                onChange(copied);
              }
            }}
          >
            {__('Paste styles', 'kriti-blocks')}
          </Button>
        </ButtonGroup>
        <p className="components-base-control__help">
          {__(
            "Pasting replaces this block's design options. Values are checked again on the site, so pasted styles are always sanitized.",
            'kriti-blocks',
          )}
        </p>
      </PanelBody>

      <PanelBody
        title={__('Effects & animation', 'kriti-blocks')}
        initialOpen={false}
      >
        <RangeControl
          label={__('Opacity', 'kriti-blocks')}
          value={get(['opacity'], undefined)}
          min={0}
          max={1}
          step={0.05}
          allowReset
          onChange={(v) => set(['opacity'], v)}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Scale on hover', 'kriti-blocks')}
          value={get(['hoverFx', 'scale'], undefined)}
          min={0.5}
          max={2}
          step={0.01}
          allowReset
          onChange={(v) => set(['hoverFx', 'scale'], v)}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Rotate on hover (deg)', 'kriti-blocks')}
          value={get(['hoverFx', 'rotate'], undefined)}
          min={-180}
          max={180}
          allowReset
          onChange={(v) => set(['hoverFx', 'rotate'], v)}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Lift on hover (px)', 'kriti-blocks')}
          value={get(['hoverFx', 'lift'], undefined)}
          min={0}
          max={50}
          allowReset
          onChange={(v) => set(['hoverFx', 'lift'], v)}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Hover transition (ms)', 'kriti-blocks')}
          value={get(['hoverFx', 'duration'], undefined)}
          min={0}
          max={3000}
          step={50}
          allowReset
          onChange={(v) => set(['hoverFx', 'duration'], v)}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Entrance animation', 'kriti-blocks')}
          value={get(['anim', 'type'])}
          options={ANIMATIONS}
          onChange={(v) => set(['anim', 'type'], v)}
          help={__(
            'Plays once when the block scrolls into view on the site.',
            'kriti-blocks',
          )}
          __nextHasNoMarginBottom
        />
        {get(['anim', 'type']) && (
          <>
            <RangeControl
              label={__('Duration (ms)', 'kriti-blocks')}
              value={get(['anim', 'duration'], undefined)}
              min={100}
              max={3000}
              step={50}
              allowReset
              onChange={(v) => set(['anim', 'duration'], v)}
              __nextHasNoMarginBottom
            />
            <RangeControl
              label={__('Delay (ms)', 'kriti-blocks')}
              value={get(['anim', 'delay'], undefined)}
              min={0}
              max={3000}
              step={50}
              allowReset
              onChange={(v) => set(['anim', 'delay'], v)}
              __nextHasNoMarginBottom
            />
          </>
        )}
      </PanelBody>

      <PanelBody title={__('Visibility', 'kriti-blocks')} initialOpen={false}>
        {Object.keys(DEVICE_LABELS).map((d) => (
          <ToggleControl
            key={d}
            label={`${__('Hide on', 'kriti-blocks')} ${DEVICE_LABELS[d].toLowerCase()}`}
            checked={!!get(['hide', d], false)}
            onChange={(v) => set(['hide', d], v || undefined)}
            __nextHasNoMarginBottom
          />
        ))}
        <SelectControl
          label={__('Show to', 'kriti-blocks')}
          value={get(['vis', 'login'])}
          options={[
            { value: '', label: __('Everyone', 'kriti-blocks') },
            { value: 'in', label: __('Logged-in users only', 'kriti-blocks') },
            {
              value: 'out',
              label: __('Logged-out visitors only', 'kriti-blocks'),
            },
          ]}
          onChange={(v) => set(['vis', 'login'], v)}
          __nextHasNoMarginBottom
        />
        <TextControl
          type="date"
          label={__('Show from', 'kriti-blocks')}
          value={get(['vis', 'from'])}
          onChange={(v) => set(['vis', 'from'], v)}
          __nextHasNoMarginBottom
        />
        <TextControl
          type="date"
          label={__('Show until (inclusive)', 'kriti-blocks')}
          value={get(['vis', 'to'])}
          onChange={(v) => set(['vis', 'to'], v)}
          help={__(
            'Dates use the site timezone. Hidden blocks are removed from the page, not just hidden with CSS.',
            'kriti-blocks',
          )}
          __nextHasNoMarginBottom
        />
      </PanelBody>

      <PanelBody
        title={__('Accessibility & custom CSS', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          label={__('ARIA label', 'kriti-blocks')}
          value={get(['aria', 'label'])}
          onChange={(v) => set(['aria', 'label'], v)}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Landmark role', 'kriti-blocks')}
          value={get(['aria', 'role'])}
          options={[
            '',
            'region',
            'navigation',
            'complementary',
            'banner',
            'contentinfo',
            'main',
            'search',
            'group',
            'presentation',
          ].map((r) => ({
            value: r,
            label: r || __('Default', 'kriti-blocks'),
          }))}
          onChange={(v) => set(['aria', 'role'], v)}
          __nextHasNoMarginBottom
        />
        <TextareaControl
          label={__('Custom CSS', 'kriti-blocks')}
          value={get(['customCss'])}
          rows={6}
          help={__(
            'Use "selector" for this block, e.g. selector a { color: red; }. url(), @import and scripts are removed on the site.',
            'kriti-blocks',
          )}
          onChange={(v) => set(['customCss'], v)}
        />
        <Button variant="link" isDestructive onClick={() => onChange({})}>
          {__('Reset all design options', 'kriti-blocks')}
        </Button>
      </PanelBody>
    </>
  );

  return (
    <>
      {part !== 'advanced' && layout}
      {part !== 'layout' && advanced}
    </>
  );
}

/**
 * Design panels in the block's own sidebar, for blocks that do not use the
 * General / Layout / Advanced tabs.
 *
 * @param {Object} props Same props as DesignSections.
 * @return {Element} The panels.
 */
export default function DesignPanels(props) {
  return (
    <InspectorControls>
      <DesignSections {...props} part="all" />
    </InspectorControls>
  );
}
