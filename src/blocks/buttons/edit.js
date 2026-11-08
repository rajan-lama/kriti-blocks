import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

import Inspector from './inspector';
import { getGroupProps, getButtonProps, newButton } from './helpers';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { buttons = [] } = attributes;
  const [selected, setSelected] = useState(0);
  const current = Math.min(selected, Math.max(buttons.length - 1, 0));

  const update = (index, patch) =>
    setAttributes({
      buttons: buttons.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    });

  const add = () => {
    setAttributes({ buttons: [...buttons, newButton()] });
    setSelected(buttons.length);
  };

  const remove = (index) => {
    setAttributes({ buttons: buttons.filter((_, i) => i !== index) });
    setSelected(Math.max(0, index - 1));
  };

  const move = (index, dir) => {
    const to = index + dir;
    if (to < 0 || to >= buttons.length) {
      return;
    }
    const next = [...buttons];
    [next[index], next[to]] = [next[to], next[index]];
    setAttributes({ buttons: next });
    setSelected(to);
  };

  const group = getGroupProps(attributes);

  return (
    <>
      <Inspector
        attributes={attributes}
        setAttributes={setAttributes}
        selected={current}
        onSelect={setSelected}
        onUpdate={update}
        onAdd={add}
        onRemove={remove}
        onMove={move}
      />
      <div {...useBlockProps(group)}>
        {buttons.map((btn, index) => {
          const p = getButtonProps(btn);
          const icon = p.icon && (
            <span
              className={`kb-btn__icon kb-btn__icon--${p.icon}`}
              aria-hidden="true"
            />
          );
          return (
            <span
              key={index}
              className={`${p.className}${
                index === current ? ' is-selected' : ''
              }`}
              style={p.style}
              onClick={() => setSelected(index)}
              role="presentation"
            >
              {!p.iconRight && icon}
              <RichText
                tagName="span"
                className="kb-btn__label"
                value={btn.text}
                allowedFormats={[]}
                placeholder={__('Button text', 'kriti-blocks')}
                onChange={(text) => update(index, { text })}
              />
              {p.iconRight && icon}
            </span>
          );
        })}
        <Button variant="secondary" size="small" onClick={add}>
          {__('+ Add button', 'kriti-blocks')}
        </Button>
      </div>
    </>
  );
}
