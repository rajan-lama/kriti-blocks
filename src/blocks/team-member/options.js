import { pick, safeNumber, safeUrl } from '../../shared/marketing-options';

/**
 * Team member options. Each one adds nothing to the markup at its default, so
 * members saved before these options existed stay valid.
 */
export const PHOTO_POSITIONS = ['top', 'left', 'right'];
export const NAME_TAGS = ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];
export const SOCIAL_NETWORKS = {
  website: 'Website',
  email: 'Email',
  linkedin: 'LinkedIn',
  x: 'X',
  facebook: 'Facebook',
  instagram: 'Instagram',
  github: 'GitHub',
  youtube: 'YouTube',
};
export const MAX_SOCIALS = 8;

const EMAIL_PATTERN =
  /^[^\s@<>"'()\\,;:]+@[^\s@<>"'()\\,;:]+\.[^\s@<>"'()\\,;:]+$/;

/**
 * Turn the saved social entries into safe links. Unknown networks and unsafe
 * or empty addresses are dropped.
 *
 * @param {*} socials Saved list of { network, url }.
 * @return {Array<{network: string, label: string, href: string}>} Links.
 */
export function getSocialLinks(socials) {
  if (!Array.isArray(socials)) {
    return [];
  }
  return socials
    .slice(0, MAX_SOCIALS)
    .map((item) => {
      const network = item && item.network;
      if (!SOCIAL_NETWORKS[network]) {
        return null;
      }
      const raw = String((item && item.url) || '').trim();
      let href = '';
      if (network === 'email') {
        href = EMAIL_PATTERN.test(raw) ? `mailto:${raw}` : '';
      } else {
        // Social profiles must be web addresses.
        href = /^https?:\/\//i.test(raw) ? safeUrl(raw) : '';
      }
      return href ? { network, label: SOCIAL_NETWORKS[network], href } : null;
    })
    .filter(Boolean);
}

/**
 * Classes, CSS variables and extra values for the team member.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Options for save() and edit().
 */
export function getTeamMemberOptions(attributes) {
  const {
    photoPosition,
    photoSize,
    photoGrayscale,
    nameTag,
    profileUrl,
    profileNewTab,
    socials,
    socialNewTab,
  } = attributes;
  const classes = [];
  const style = {};

  const position = pick(photoPosition, PHOTO_POSITIONS, 'top');
  if (position !== 'top') {
    classes.push(`bw-team-member--photo-${position}`);
  }
  const size = safeNumber(photoSize, 40, 400);
  if (size !== undefined) {
    style['--kb-tm-photo'] = `${size}px`;
  }
  if (photoGrayscale) {
    classes.push('bw-team-member--grayscale');
  }

  const href = safeUrl(profileUrl);

  return {
    classes,
    style,
    nameTag: pick(nameTag, NAME_TAGS, 'h3'),
    profile: href
      ? {
          href,
          target: profileNewTab ? '_blank' : undefined,
          rel: profileNewTab ? 'noreferrer noopener' : undefined,
        }
      : null,
    socials: getSocialLinks(socials),
    socialTarget: socialNewTab ? '_blank' : undefined,
    socialRel: socialNewTab ? 'noreferrer noopener' : 'noopener',
  };
}
