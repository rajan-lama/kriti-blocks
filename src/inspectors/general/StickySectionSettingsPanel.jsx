import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const StickySectionSettingsPanel = ({ attributes, setAttributes }) => {
  const { stickyOffset, zIndex, showShadow } = attributes;

  return (
    <PanelBody title={__('Sticky Settings', 'kriti-blocks')} initialOpen={true}>
      <RangeControl
        label={__('Offset from top (px)', 'kriti-blocks')}
        value={stickyOffset}
        min={0}
        max={300}
        step={4}
        onChange={(value) => setAttributes({ stickyOffset: value })}
      />

      <RangeControl
        label={__('Z-index', 'kriti-blocks')}
        value={zIndex}
        min={0}
        max={1000}
        step={1}
        onChange={(value) => setAttributes({ zIndex: value })}
      />

      <ToggleControl
        label={__('Add shadow when stuck', 'kriti-blocks')}
        checked={!!showShadow}
        onChange={(value) => setAttributes({ showShadow: value })}
      />
    </PanelBody>
  );
};

export default StickySectionSettingsPanel;
