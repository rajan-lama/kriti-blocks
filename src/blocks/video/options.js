import { oneOf, safeUrl } from '../../shared/kbsb-options';
import { getEmbedSrc, parseEmbed } from './embed';

export const ASPECT_RATIOS = ['16/9', '4/3', '1/1', '21/9', '9/16'];

const seconds = (value) => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 && n < 86400 * 3 ? n : undefined;
};

/**
 * Extra attributes and styles for the native <video> element.
 *
 * @param {Object} attributes Block attributes.
 * @return {{src: string, props: Object, style: Object}} Additions.
 */
export const getFileExtras = (attributes) => {
  const props = {};
  const style = {};
  let src = attributes.url;

  const poster = safeUrl(attributes.poster);
  if (poster) {
    props.poster = poster;
  }
  if (attributes.playsInline === true) {
    props.playsInline = true;
  }
  if (attributes.noDownload === true) {
    props.controlsList = 'nodownload';
  }

  const ratio = oneOf(attributes.aspectRatio, ASPECT_RATIOS);
  if (ratio) {
    style.aspectRatio = ratio.replace('/', ' / ');
  }

  const start = seconds(attributes.startTime);
  const end = seconds(attributes.endTime);
  if ((start || end) && !String(src).includes('#')) {
    src = `${src}#t=${start || 0}${end ? `,${end}` : ''}`;
  }

  return { src, props, style };
};

/**
 * Props for the embed wrapper and the iframe, or null for a file video.
 *
 * @param {Object} attributes Block attributes.
 * @return {{src: string, style: (Object|undefined)}|null} Embed props.
 */
export const getEmbed = (attributes) => {
  const src = getEmbedSrc(withBackgroundMode(attributes));
  if (!src) {
    return null;
  }
  const ratio = oneOf(attributes.aspectRatio, ASPECT_RATIOS);
  return {
    src,
    style: ratio ? { aspectRatio: ratio.replace('/', ' / ') } : undefined,
  };
};

/**
 * Attributes with background mode applied: muted, looping autoplay without
 * controls.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Effective attributes.
 */
export const withBackgroundMode = (attributes) =>
  attributes.backgroundMode === true
    ? {
        ...attributes,
        autoplay: true,
        loop: true,
        muted: true,
        controls: false,
        playsInline: true,
      }
    : attributes;

/**
 * Click-to-play facade for an embed: the iframe is only created after a click.
 *
 * @param {Object} attributes Block attributes.
 * @return {{src: string, thumb: (string|undefined)}|null} Facade data.
 */
export const getFacade = (attributes) => {
  if (attributes.embedFacade !== true || attributes.backgroundMode === true) {
    return null;
  }
  const video = parseEmbed(attributes.embedUrl);
  const src = getEmbedSrc(attributes, { play: true });
  if (!video || !src) {
    return null;
  }
  const rawPoster = safeUrl(attributes.poster);
  // A poster used in CSS url() must not contain characters that end it.
  const poster = /[()"'\\\s;]/.test(rawPoster) ? '' : rawPoster;
  const thumb =
    poster ||
    (video.provider === 'youtube'
      ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
      : undefined);
  return { src, thumb };
};
