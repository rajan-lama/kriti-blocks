/**
 * Parse a YouTube or Vimeo address and build an embed URL from the parsed ID.
 *
 * The embed URL is always constructed here from a validated ID, so nothing
 * the author typed (other than the ID, hash and numbers) reaches the markup.
 */
const YOUTUBE_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
];
const VIMEO_HOSTS = ['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'];
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{1,12}$/;
const VIMEO_HASH = /^[a-f0-9]{6,20}$/i;

/**
 * Identify the provider and video ID of an address.
 *
 * @param {string} input Address typed by the author.
 * @return {{provider: string, id: string, hash: (string|undefined)}|null} Parsed video or null.
 */
export const parseEmbed = (input) => {
  if (typeof input !== 'string' || input.length > 500) {
    return null;
  }
  let url;
  try {
    url = new URL(input.trim());
  } catch (e) {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split('/').filter(Boolean);

  if (YOUTUBE_HOSTS.includes(host)) {
    let id = '';
    if (host.endsWith('youtu.be')) {
      id = parts[0] || '';
    } else if (parts[0] === 'watch') {
      id = url.searchParams.get('v') || '';
    } else if (['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
      id = parts[1] || '';
    }
    return YOUTUBE_ID.test(id) ? { provider: 'youtube', id } : null;
  }

  if (VIMEO_HOSTS.includes(host)) {
    const segments = parts[0] === 'video' ? parts.slice(1) : parts;
    const id = segments[0] || '';
    if (!VIMEO_ID.test(id)) {
      return null;
    }
    const candidate = segments[1] || url.searchParams.get('h') || '';
    return {
      provider: 'vimeo',
      id,
      hash: VIMEO_HASH.test(candidate) ? candidate : undefined,
    };
  }

  return null;
};

const seconds = (value) => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 && n < 86400 * 3 ? n : undefined;
};

/**
 * Build the iframe URL for an embed.
 *
 * @param {Object}  attributes   Block attributes.
 * @param {Object}  options      Options.
 * @param {boolean} options.play Add autoplay for click-to-play.
 * @return {string} Embed URL, or an empty string when there is no valid embed.
 */
export const getEmbedSrc = (attributes, { play = false } = {}) => {
  const video = parseEmbed(attributes.embedUrl);
  if (!video) {
    return '';
  }
  const { loop, muted, controls, privacyMode } = attributes;
  // A facade starts playback after a click, so sound is allowed then.
  const autoplay = attributes.autoplay || play;
  const mute = muted || (attributes.autoplay && !play);
  const start = seconds(attributes.startTime);
  const end = seconds(attributes.endTime);
  const params = [];

  if (video.provider === 'youtube') {
    const host = privacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    if (autoplay) {
      params.push('autoplay=1');
    }
    if (mute) {
      params.push('mute=1');
    }
    if (loop) {
      params.push('loop=1', `playlist=${video.id}`);
    }
    if (controls === false) {
      params.push('controls=0');
    }
    if (start) {
      params.push(`start=${start}`);
    }
    if (end) {
      params.push(`end=${end}`);
    }
    params.push('rel=0', 'playsinline=1');
    return `https://${host}/embed/${video.id}?${params.join('&')}`;
  }

  if (video.hash) {
    params.push(`h=${video.hash}`);
  }
  if (autoplay) {
    params.push('autoplay=1');
  }
  if (mute) {
    params.push('muted=1');
  }
  if (loop) {
    params.push('loop=1');
  }
  if (controls === false) {
    params.push('controls=0');
  }
  if (privacyMode) {
    params.push('dnt=1');
  }
  const query = params.length ? `?${params.join('&')}` : '';
  const fragment = start ? `#t=${start}s` : '';
  return `https://player.vimeo.com/video/${video.id}${query}${fragment}`;
};
