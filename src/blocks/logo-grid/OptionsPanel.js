import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    logos,
    colsTablet,
    colsMobile,
    logoHeight,
    logoGap,
    logoOpacity,
    logoAlign,
    carouselMode,
  } = attributes;

  const items = Array.isArray(logos) ? logos : [];

  const updateLogo = (index, patch) =>
    setAttributes({
      logos: items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    });

  const columnOptions = (max) => [
    { label: __('Automatic', 'kriti-blocks'), value: '' },
    ...Array.from({ length: max }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1),
    })),
  ];

  return (
    <>
      <PanelBody title={__('Logo Layout', 'kriti-blocks')} initialOpen={false}>
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Carousel mode (swipe or scroll sideways)', 'kriti-blocks')}
          help={__(
            'Logos stay on one row and scroll with snapping. Columns set how many show at once.',
            'kriti-blocks',
          )}
          checked={!!carouselMode}
          onChange={(value) =>
            setAttributes({ carouselMode: value || undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Columns on tablet', 'kriti-blocks')}
          value={colsTablet ? String(colsTablet) : ''}
          options={columnOptions(6)}
          onChange={(value) =>
            setAttributes({ colsTablet: value ? Number(value) : undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Columns on mobile', 'kriti-blocks')}
          value={colsMobile ? String(colsMobile) : ''}
          options={columnOptions(4)}
          onChange={(value) =>
            setAttributes({ colsMobile: value ? Number(value) : undefined })
          }
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Logo Height (px)', 'kriti-blocks')}
          value={logoHeight ?? 52}
          onChange={(value) => setAttributes({ logoHeight: value })}
          min={16}
          max={200}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Gap (px)', 'kriti-blocks')}
          value={logoGap ?? 20}
          onChange={(value) => setAttributes({ logoGap: value })}
          min={0}
          max={100}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Logo Opacity before hover (%)', 'kriti-blocks')}
          value={logoOpacity ?? 75}
          onChange={(value) => setAttributes({ logoOpacity: value })}
          min={10}
          max={100}
          allowReset
          resetFallbackValue={undefined}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Logo Alignment', 'kriti-blocks')}
          value={logoAlign || ''}
          options={[
            { label: __('Center', 'kriti-blocks'), value: '' },
            { label: __('Left', 'kriti-blocks'), value: 'left' },
            { label: __('Right', 'kriti-blocks'), value: 'right' },
          ]}
          onChange={(value) => setAttributes({ logoAlign: value || undefined })}
        />
      </PanelBody>

      <PanelBody title={__('Logo Links', 'kriti-blocks')} initialOpen={false}>
        {items.length === 0 && (
          <p>{__('Add logos to the grid first.', 'kriti-blocks')}</p>
        )}
        {items.map((item, index) => (
          <div key={item.id || index}>
            <TextControl
              __nextHasNoMarginBottom
              label={item.alt || `${__('Logo', 'kriti-blocks')} ${index + 1}`}
              type="url"
              placeholder="https://"
              value={item.link || ''}
              onChange={(value) =>
                updateLogo(index, { link: value || undefined })
              }
            />
            {item.link && (
              <>
                <ToggleControl
                  __nextHasNoMarginBottom
                  label={__('Open in new tab', 'kriti-blocks')}
                  checked={!!item.newTab}
                  onChange={(value) =>
                    updateLogo(index, { newTab: value || undefined })
                  }
                />
                <ToggleControl
                  __nextHasNoMarginBottom
                  label={__('Add nofollow', 'kriti-blocks')}
                  checked={!!item.nofollow}
                  onChange={(value) =>
                    updateLogo(index, { nofollow: value || undefined })
                  }
                />
              </>
            )}
          </div>
        ))}
      </PanelBody>
    </>
  );
}
