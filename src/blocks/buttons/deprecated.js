import { useBlockProps } from '@wordpress/block-editor';

/**
 * The markup the block produced before it had any options. Content saved
 * with it is recognised and upgraded to the current format automatically.
 */
const v1 = {
  attributes: {
    buttons: { type: 'array', default: [] },
    buttonLabel: { type: 'string', default: '' },
  },
  save({ attributes }) {
    const { buttons = [] } = attributes;
    return (
      <div {...useBlockProps.save()}>
        {buttons.map((btn, index) => (
          <a
            key={index}
            href={btn.url}
            className="my-button"
            style={{ marginRight: '10px' }}
          >
            {btn.text}
          </a>
        ))}
      </div>
    );
  },
  migrate(attributes) {
    return {
      ...attributes,
      buttons: (attributes.buttons || []).map((b) => ({
        variant: 'solid',
        size: 'md',
        ...b,
      })),
    };
  },
};

export default [v1];
