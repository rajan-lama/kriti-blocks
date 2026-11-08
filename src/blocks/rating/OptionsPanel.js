import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    iconShape,
    roundHalf,
    customSize,
    starGap,
    labelPosition,
    showValue,
    showMax,
    valueColor,
    labelColor,
    schemaMarkup,
    schemaName,
    ratingCount,
    allowVoting,
    voteId,
  } = attributes;

  return (
    <PanelBody title={__('Rating Options', 'kriti-blocks')} initialOpen={false}>
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Icon', 'kriti-blocks')}
        value={iconShape || 'star'}
        options={[
          { label: __('Star', 'kriti-blocks'), value: 'star' },
          { label: __('Heart', 'kriti-blocks'), value: 'heart' },
          { label: __('Circle', 'kriti-blocks'), value: 'circle' },
          { label: __('Bolt', 'kriti-blocks'), value: 'bolt' },
        ]}
        onChange={(value) =>
          setAttributes({ iconShape: value === 'star' ? undefined : value })
        }
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Round to half icons', 'kriti-blocks')}
        help={__('Shows 4.3 as 4.5 filled icons.', 'kriti-blocks')}
        checked={!!roundHalf}
        onChange={(value) => setAttributes({ roundHalf: value || undefined })}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Custom Icon Size (px)', 'kriti-blocks')}
        value={customSize ?? 22}
        onChange={(value) => setAttributes({ customSize: value })}
        min={10}
        max={96}
        allowReset
        resetFallbackValue={undefined}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Icon Spacing (px)', 'kriti-blocks')}
        value={starGap ?? 2}
        onChange={(value) => setAttributes({ starGap: value })}
        min={0}
        max={24}
        allowReset
        resetFallbackValue={undefined}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Label Position', 'kriti-blocks')}
        value={labelPosition || ''}
        options={[
          { label: __('After the icons', 'kriti-blocks'), value: '' },
          { label: __('Before the icons', 'kriti-blocks'), value: 'before' },
          { label: __('Below the icons', 'kriti-blocks'), value: 'below' },
        ]}
        onChange={(value) =>
          setAttributes({ labelPosition: value || undefined })
        }
      />
      {showValue && (
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show the maximum (4.5 / 5)', 'kriti-blocks')}
          checked={!!showMax}
          onChange={(value) => setAttributes({ showMax: value || undefined })}
        />
      )}
      <ColorField
        label={__('Value Color', 'kriti-blocks')}
        value={valueColor}
        onChange={(value) => setAttributes({ valueColor: value })}
      />
      <ColorField
        label={__('Label Color', 'kriti-blocks')}
        value={labelColor}
        onChange={(value) => setAttributes({ labelColor: value })}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Let visitors vote', 'kriti-blocks')}
        help={__(
          'Visitors click the stars to rate. The average of their votes replaces the value above once there are votes. It works for blocks in the post content, not in patterns or template parts. A visitor is recognised by their browser, so this suits light-hearted ratings, not trusted reviews. Turns off the search engine markup.',
          'kriti-blocks',
        )}
        checked={!!allowVoting}
        onChange={(value) =>
          setAttributes({
            allowVoting: value || undefined,
            voteId:
              value && !voteId
                ? Math.random().toString(36).slice(2, 10).padEnd(8, '0')
                : voteId,
          })
        }
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Search engine rating markup', 'kriti-blocks')}
        help={__(
          'Adds schema.org AggregateRating microdata. Only use it for real reviews.',
          'kriti-blocks',
        )}
        checked={!!schemaMarkup}
        onChange={(value) =>
          setAttributes({ schemaMarkup: value || undefined })
        }
      />
      {schemaMarkup && (
        <>
          <TextControl
            __nextHasNoMarginBottom
            label={__('Name of the rated item', 'kriti-blocks')}
            value={schemaName || ''}
            onChange={(value) =>
              setAttributes({ schemaName: value || undefined })
            }
          />
          <NumberControl
            label={__('Number of ratings', 'kriti-blocks')}
            value={ratingCount ?? ''}
            min={1}
            onChange={(value) =>
              setAttributes({
                ratingCount: value === '' ? undefined : Number(value),
              })
            }
          />
        </>
      )}
    </PanelBody>
  );
}
