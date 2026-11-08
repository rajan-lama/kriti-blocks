import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getGroupProps, getButtonProps } from './helpers';

export default function save({ attributes }) {
  const { buttons = [] } = attributes;
  const group = getGroupProps(attributes);

  return (
    <div {...useBlockProps.save(group)}>
      {buttons.map((btn, index) => {
        const p = getButtonProps(btn);
        const icon = p.icon && (
          <span
            className={`kb-btn__icon kb-btn__icon--${p.icon}`}
            aria-hidden="true"
          />
        );
        return (
          <a
            key={index}
            className={p.className}
            style={p.style}
            {...p.linkProps}
          >
            {!p.iconRight && icon}
            <RichText.Content
              tagName="span"
              className="kb-btn__label"
              value={btn.text}
            />
            {p.iconRight && icon}
          </a>
        );
      })}
    </div>
  );
}
