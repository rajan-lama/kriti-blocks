import { getVideoProps } from './helpers';
import {
  getEmbed,
  getFacade,
  getFileExtras,
  withBackgroundMode,
} from './options';

/**
 * The playable element: an iframe for a YouTube or Vimeo address, otherwise
 * the native video element. Markup for a plain video file is unchanged.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {Element} Media element.
 */
export default function VideoElement({ attributes: original }) {
  const attributes = withBackgroundMode(original);
  const embed = getEmbed(attributes);
  const facade = getFacade(attributes);

  if (embed && facade) {
    return (
      <div className="bw-video-embed" style={embed.style}>
        <button
          type="button"
          className="bw-video-facade"
          data-bw-embed={facade.src}
          aria-label="Play video"
          style={
            facade.thumb
              ? { backgroundImage: `url(${facade.thumb})` }
              : undefined
          }
        >
          <span className="bw-video-play" aria-hidden="true"></span>
        </button>
      </div>
    );
  }

  if (embed) {
    return (
      <div className="bw-video-embed" style={embed.style}>
        <iframe
          className="bw-video-frame"
          src={embed.src}
          title="Embedded video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  const extras = getFileExtras(attributes);

  return (
    <video
      className="bw-video"
      src={extras.src}
      style={{ width: '100%', display: 'block', ...extras.style }}
      {...getVideoProps(attributes)}
      {...extras.props}
    />
  );
}
