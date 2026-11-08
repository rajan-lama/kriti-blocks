import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const PaginationSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    showPrevNext,
    prevText,
    nextText,
    showNumbers,
    midSize,
    endSize,
    justify,
  } = attributes;

  return (
    <PanelBody
      title={__('Pagination Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <ToggleControl
        label={__('Show previous and next', 'kriti-blocks')}
        checked={!!showPrevNext}
        onChange={(value) => setAttributes({ showPrevNext: value })}
      />

      {showPrevNext && (
        <>
          <TextControl
            label={__('Previous label', 'kriti-blocks')}
            help={__('Leave empty to use the default label.', 'kriti-blocks')}
            value={prevText}
            onChange={(value) => setAttributes({ prevText: value })}
          />

          <TextControl
            label={__('Next label', 'kriti-blocks')}
            help={__('Leave empty to use the default label.', 'kriti-blocks')}
            value={nextText}
            onChange={(value) => setAttributes({ nextText: value })}
          />
        </>
      )}

      <ToggleControl
        label={__('Show page numbers', 'kriti-blocks')}
        checked={!!showNumbers}
        onChange={(value) => setAttributes({ showNumbers: value })}
      />

      {showNumbers && (
        <>
          <RangeControl
            label={__('Links beside current page', 'kriti-blocks')}
            value={midSize}
            min={0}
            max={3}
            step={1}
            onChange={(value) => setAttributes({ midSize: value })}
          />

          <RangeControl
            label={__('Links at each end', 'kriti-blocks')}
            value={endSize}
            min={0}
            max={3}
            step={1}
            onChange={(value) => setAttributes({ endSize: value })}
          />
        </>
      )}

      <SelectControl
        label={__('Alignment', 'kriti-blocks')}
        value={justify}
        options={[
          { label: __('Left', 'kriti-blocks'), value: 'left' },
          { label: __('Center', 'kriti-blocks'), value: 'center' },
          { label: __('Right', 'kriti-blocks'), value: 'right' },
        ]}
        onChange={(value) => setAttributes({ justify: value })}
      />
    </PanelBody>
  );
};

export default PaginationSettingsPanel;
