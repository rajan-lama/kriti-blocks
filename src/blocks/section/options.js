/**
 * Optional section settings. Every option is unset by default and adds
 * nothing to the markup until it is used, so sections saved before these
 * options existed stay valid.
 */
import {
  safeColor,
  safeUrl,
  clampNum,
  clampPos,
  oneOf,
  compact,
} from '../../shared/kbi-safe';

export const WIDTH_UNITS = ['px', '%', 'rem', 'vw'];
export const VALIGN = ['center', 'end'];
export const OVERFLOWS = ['hidden', 'clip'];
export const IMAGE_RE = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
export const VIDEO_RE = /\.(mp4|m4v|webm|ogv)$/i;

const percent = (value) => `${Math.round(clampNum(value, 0, 1) * 100)}%`;

/**
 * Everything the options add to the section wrapper and its content.
 *
 * @param {Object}  attributes Block attributes.
 * @param {boolean} editor     True inside the editor (video does not autoplay).
 * @return {{classes: string[], style: Object, bgLayer: (Object|null)}} Additions.
 */
export const getSectionOptions = (attributes, editor = false) => {
  const image = safeUrl(attributes.bgImage, IMAGE_RE);
  const video = safeUrl(attributes.bgVideo, VIDEO_RE);
  const overlay = safeColor(attributes.bgOverlayColor);
  const classes = [];
  const style = {};

  const width = clampPos(attributes.contentWidth, 1, 5000);
  if (width) {
    const unit = oneOf(attributes.contentWidthUnit, WIDTH_UNITS) || 'px';
    classes.push('kb-section--content-w');
    style['--kb-section-w'] = `${width}${unit}`;
  }

  const valign = oneOf(attributes.verticalAlign, VALIGN);
  if (valign) {
    classes.push(`kb-section--valign-${valign}`);
  }

  const overflow = oneOf(attributes.overflow, OVERFLOWS);
  if (overflow) {
    classes.push(`kb-section--overflow-${overflow}`);
  }

  if (!image && !video && !overlay) {
    return { classes, style: compact(style), bgLayer: null };
  }

  classes.push('kb-section--has-bg');
  if (image && attributes.bgFixed === true) {
    classes.push('kb-section--parallax');
  }
  if (video && attributes.bgVideoHideMobile === true) {
    classes.push('kb-section--video-no-mobile');
  }

  const focal = attributes.bgFocal;
  const layerStyle = {};
  if (image) {
    layerStyle.backgroundImage = `url("${image}")`;
    if (
      focal &&
      typeof focal.x === 'number' &&
      typeof focal.y === 'number' &&
      (focal.x !== 0.5 || focal.y !== 0.5)
    ) {
      layerStyle.backgroundPosition = `${percent(focal.x)} ${percent(focal.y)}`;
    }
  }

  const opacity = clampNum(attributes.bgOverlayOpacity, 0, 100);

  return {
    classes,
    style: compact(style),
    bgLayer: {
      style: layerStyle,
      video,
      poster: image,
      autoPlay: !editor,
      overlay: overlay
        ? {
            backgroundColor: overlay,
            ...(opacity === undefined ? {} : { opacity: opacity / 100 }),
          }
        : null,
    },
  };
};

/**
 * Background layer element (image, video, overlay). Rendered as the first
 * child of the section, behind the content.
 *
 * @param {Object|null} layer Value of getSectionOptions().bgLayer.
 * @return {Element|null} The layer.
 */
export const BackgroundLayer = ({ layer }) => {
  if (!layer) {
    return null;
  }

  return (
    <div
      className="kb-section__bg"
      aria-hidden="true"
      style={Object.keys(layer.style).length ? layer.style : undefined}
    >
      {layer.video && (
        <video
          className="kb-section__video"
          src={layer.video}
          poster={layer.poster}
          autoPlay={layer.autoPlay}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      )}
      {layer.overlay && (
        <span className="kb-section__overlay" style={layer.overlay} />
      )}
    </div>
  );
};

export const joinClasses = (base, extra) =>
  [base, ...extra].filter(Boolean).join(' ');
