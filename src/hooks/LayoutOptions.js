/*
 * Layout tab: spacing, colors, typography, borders and shadows.
 *
 * These are the shared Design panels, which are loaded by the extensions
 * bundle and write to the `kbStyle` attribute that the site actually renders.
 * Blocks that already have one of these controls in their General tab have
 * the duplicate hidden (see NATIVE_CONTROLS in src/extensions/DesignPanels.js).
 */
export const LayoutOptions = ({ attributes, setAttributes, blockName }) => {
  const Sections = window.kritiBlocksDesign?.DesignSections;
  if (!Sections) {
    return null;
  }
  return (
    <div className="kriti-blocks-styling-section">
      <Sections
        part="layout"
        blockName={`kriti-blocks/${blockName}`}
        value={attributes.kbStyle || {}}
        onChange={(kbStyle) => setAttributes({ kbStyle })}
      />
    </div>
  );
};

export default LayoutOptions;
