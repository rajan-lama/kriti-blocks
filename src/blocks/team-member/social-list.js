/**
 * The list of social links shown under a team member's bio.
 */
export default function SocialList({ options }) {
  if (!options.socials.length) {
    return null;
  }
  return (
    <ul className="bw-team-member-social">
      {options.socials.map((link) => (
        <li key={link.network}>
          <a
            className={`bw-team-member-social__link bw-team-member-social__link--${link.network}`}
            href={link.href}
            target={options.socialTarget}
            rel={options.socialRel}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
