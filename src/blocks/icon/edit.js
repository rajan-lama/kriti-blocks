import { useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

import IconPickerModal from '../../components/IconPickerModal';
import ICONS from './../../../assets/icons/icons-all.json';
import './editor.scss';
import Inspector from './inspector';
import BlockController from './BlockController';
import { getIconExtras, getIconProps } from './options';

export default function Edit({ attributes, setAttributes }) {
  const { icon } = attributes;
  const [open, setOpen] = useState(false);

  const selectedIcon = ICONS.find((i) => i.name === icon);

  const style = {
    '--bw-icon-size': `${attributes.size}px`,
    '--bw-icon-color': attributes.color,
    '--bw-icon-bg': attributes.bgColor,
    '--bw-icon-padding': `${attributes.padding}px`,
    '--bw-icon-radius': `${attributes.borderRadius}px`,
  };

  return (
    <div {...useBlockProps(getIconProps(attributes, style))}>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <BlockController
        attributes={attributes}
        setAttributes={setAttributes}
        selectedIcon={selectedIcon}
        setOpen={setOpen}
      />
      <IconPickerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        icons={ICONS}
        onSelect={(icon) =>
          setAttributes({
            icon: icon.name,
            svg: icon.svg,
            category: icon.category,
          })
        }
      />

      {selectedIcon && (
        <div
          dangerouslySetInnerHTML={{ __html: selectedIcon.svg }}
          style={{ marginTop: '15px' }}
        />
      )}
      {getIconExtras(attributes).label && (
        <span className="bw-icon-label">{getIconExtras(attributes).label}</span>
      )}
    </div>
  );
}
