import {
  PanelBody,
  ColorPalette,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const OffcanvasSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    triggerText,
    triggerBackground,
    triggerColor,
    side,
    drawerWidth,
    drawerBackground,
    showCloseButton,
    closeOnBackdrop,
  } = attributes;

  const colors = [
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Amber', color: '#d97706' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'White', color: '#ffffff' },
    { name: 'Slate', color: '#334155' },
  ];

  return (
    <PanelBody
      title={__('Off-canvas Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <TextControl
        label={__('Trigger text', 'kriti-blocks')}
        value={triggerText}
        onChange={(value) => setAttributes({ triggerText: value })}
      />

      <SelectControl
        label={__('Slide in from', 'kriti-blocks')}
        value={side}
        options={[
          { label: __('Right', 'kriti-blocks'), value: 'right' },
          { label: __('Left', 'kriti-blocks'), value: 'left' },
        ]}
        onChange={(value) => setAttributes({ side: value })}
      />

      <RangeControl
        label={__('Drawer width (px)', 'kriti-blocks')}
        value={drawerWidth}
        min={240}
        max={640}
        step={20}
        onChange={(value) => setAttributes({ drawerWidth: value })}
      />

      <p>{__('Trigger background', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={colors}
        value={triggerBackground}
        onChange={(color) => setAttributes({ triggerBackground: color })}
        headingLevel="3"
      />

      <p>{__('Trigger text color', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={colors}
        value={triggerColor}
        onChange={(color) => setAttributes({ triggerColor: color })}
        headingLevel="3"
      />

      <p>{__('Drawer background', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={colors}
        value={drawerBackground}
        onChange={(color) => setAttributes({ drawerBackground: color })}
        headingLevel="3"
      />

      <ToggleControl
        label={__('Show close button', 'kriti-blocks')}
        checked={!!showCloseButton}
        onChange={(value) => setAttributes({ showCloseButton: value })}
      />

      <ToggleControl
        label={__('Close when clicking the backdrop', 'kriti-blocks')}
        checked={!!closeOnBackdrop}
        onChange={(value) => setAttributes({ closeOnBackdrop: value })}
      />
    </PanelBody>
  );
};

export default OffcanvasSettingsPanel;
