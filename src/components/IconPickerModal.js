import { useState } from '@wordpress/element';
import { Modal, Button, TextControl } from '@wordpress/components';

export default function IconPickerModal({ isOpen, onClose, icons, onSelect }) {
  const [search, setSearch] = useState('');

  const filtered = icons.filter((icon) => {
    return icon.name.toLowerCase().includes(search.toLowerCase());
  });

  if (!isOpen) {
    return null;
  }

  return (
    <Modal title="Select Icon" onRequestClose={onClose}>
      <TextControl
        placeholder="Search icons..."
        value={search}
        onChange={(val) => setSearch(val)}
      />

      <div className="bw-icon-grid">
        {filtered.map((icon) => (
          <div key={icon.name} className="icon-item">
            <Button
              onClick={() => {
                onSelect(icon);
                onClose();
              }}
            >
              <div
                className="icon"
                dangerouslySetInnerHTML={{ __html: icon.svg }}
              />
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
