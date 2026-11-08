import CoverOptionsPanel from '../../shared/kbsb-cover-panel';

export default function OptionsPanel({ attributes, setAttributes }) {
  return (
    <CoverOptionsPanel
      attributes={attributes}
      setAttributes={setAttributes}
      customHeight
    />
  );
}
