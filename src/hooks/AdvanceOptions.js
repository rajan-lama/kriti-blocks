/*
 * Advanced tab: effects and animation, visibility, accessibility, custom CSS
 * and copy / paste styles. Shared Design panels, see LayoutOptions.
 */
export const AdvanceOptions = ({ attributes, setAttributes, blockName }) => {
  const Sections = window.kritiBlocksDesign?.DesignSections;
  if (!Sections) {
    return null;
  }
  return (
    <div className="kriti-blocks-styling-section">
      <Sections
        part="advanced"
        blockName={`kriti-blocks/${blockName}`}
        value={attributes.kbStyle || {}}
        onChange={(kbStyle) => setAttributes({ kbStyle })}
      />
    </div>
  );
};

export default AdvanceOptions;
