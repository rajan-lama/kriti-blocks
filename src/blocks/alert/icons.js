import { CUSTOM_ICONS } from './options';

/**
 * Icon chosen in the "Icon" setting, or null to use the type icon.
 *
 * @param {string} name Key of CUSTOM_ICONS.
 * @return {Element|null} SVG element.
 */
export const getCustomIcon = (name) => {
  if (!Object.prototype.hasOwnProperty.call(CUSTOM_ICONS, name)) {
    return null;
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={CUSTOM_ICONS[name]}></path>
    </svg>
  );
};
