import { num, safeColor, safeMediaUrl } from './kbsb-options';

/**
 * Background of the layer drawn over the background video: the gradient
 * overlay when set, otherwise the solid overlay color and opacity.
 *
 * @param {Object} attributes Block attributes.
 * @return {string} CSS background value, or an empty string.
 */
const getVideoOverlay = (attributes) => {
  const from = safeColor(attributes.overlayGradFrom);
  const to = safeColor(attributes.overlayGradTo);
  if (from && to) {
    const angle = num(attributes.overlayGradAngle, 0, 360) ?? 180;
    return `linear-gradient( ${angle}deg, ${from}, ${to} )`;
  }
  const color = String(attributes.overlayColor || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const alpha = Math.round(((attributes.overlayOpacity ?? 50) / 100) * 255)
      .toString(16)
      .padStart(2, '0');
    return `${color}${alpha}`;
  }
  return '';
};

/**
 * Looping, muted background video with the overlay on top. Renders nothing
 * when no video URL is set.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {Element|null} Video layers.
 */
export const CoverVideo = ({ attributes }) => {
  const src = safeMediaUrl(attributes.bgVideoUrl);
  if (!src) {
    return null;
  }
  const overlay = getVideoOverlay(attributes);
  return (
    <>
      <video
        className="kb-cover-video"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />
      {overlay && (
        <span
          className="kb-cover-video-overlay"
          style={{ background: overlay }}
        ></span>
      )}
    </>
  );
};

/**
 * Down-arrow button that scrolls to the next block. Renders nothing unless
 * the option is on. The click handler lives in kbsb-scroll.js.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {Element|null} Button.
 */
export const ScrollDown = ({ attributes }) =>
  attributes.scrollIndicator === true ? (
    <button
      type="button"
      className="kb-scroll-down"
      aria-label="Scroll down"
      data-kb-scroll="1"
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
      </svg>
    </button>
  ) : null;
