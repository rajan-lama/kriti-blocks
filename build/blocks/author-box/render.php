<?php
/**
 * Server render for the BW Author Box block.
 *
 * @package Kriti Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$author_id = isset( $attributes['authorId'] ) ? absint( $attributes['authorId'] ) : 0;

/*
 * Resolve the author. Front end rendering uses block context; the editor
 * preview passes a post_id hint so the current entry's author is shown.
 */
if ( ! $author_id ) {
	$current_id = 0;

	if ( ! empty( $block->context['postId'] ) ) {
		$current_id = absint( $block->context['postId'] );
	} elseif ( isset( $_GET['post_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$current_id = absint( wp_unslash( $_GET['post_id'] ) );
	} elseif ( get_the_ID() ) {
		$current_id = absint( get_the_ID() );
	}

	if ( $current_id ) {
		$author_id = absint( get_post_field( 'post_author', $current_id ) );
	}
}

$author = $author_id ? get_userdata( $author_id ) : false;

if ( ! $author ) {
	return '';
}

$layout        = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'horizontal';
$layout        = in_array( $layout, array( 'horizontal', 'stacked' ), true ) ? $layout : 'horizontal';
$heading_level = isset( $attributes['headingLevel'] ) ? absint( $attributes['headingLevel'] ) : 3;
$heading_level = min( max( $heading_level, 2 ), 6 );
$avatar_size   = isset( $attributes['avatarSize'] ) ? absint( $attributes['avatarSize'] ) : 96;
$avatar_size   = min( max( $avatar_size, 24 ), 256 );

$show_avatar = ! isset( $attributes['showAvatar'] ) || (bool) $attributes['showAvatar'];
$show_bio    = ! isset( $attributes['showBio'] ) || (bool) $attributes['showBio'];
$show_link   = ! isset( $attributes['showArchiveLink'] ) || (bool) $attributes['showArchiveLink'];

$archive_link_text = isset( $attributes['archiveLinkText'] ) ? (string) $attributes['archiveLinkText'] : '';

if ( '' === $archive_link_text ) {
	$archive_link_text = __( 'View all posts', 'kriti-blocks' );
}

/*
 * Extra options. Each value is validated; the defaults reproduce the original output.
 */
$show_role       = ! empty( $attributes['showRole'] );
$show_post_count = ! empty( $attributes['showPostCount'] );
$show_website    = ! empty( $attributes['showWebsite'] );
$show_social     = ! empty( $attributes['showSocial'] );
$avatar_shape    = isset( $attributes['avatarShape'] ) ? sanitize_key( $attributes['avatarShape'] ) : 'circle';
$avatar_shape    = in_array( $avatar_shape, array( 'circle', 'rounded', 'square' ), true ) ? $avatar_shape : 'circle';
$link_style      = isset( $attributes['linkStyle'] ) ? sanitize_key( $attributes['linkStyle'] ) : 'link';
$link_style      = in_array( $link_style, array( 'link', 'button' ), true ) ? $link_style : 'link';
$bio_length      = isset( $attributes['bioLength'] ) ? min( absint( $attributes['bioLength'] ), 200 ) : 0;

$role_label = '';

if ( $show_role && ! empty( $author->roles ) ) {
	$role_names = wp_roles()->get_names();
	$role_slug  = reset( $author->roles );

	if ( isset( $role_names[ $role_slug ] ) ) {
		$role_label = translate_user_role( $role_names[ $role_slug ] );
	}
}

$post_count_text = '';

if ( $show_post_count ) {
	$post_total = (int) count_user_posts( $author->ID, 'post', true );
	/* translators: %s: number of posts. */
	$post_count_text = sprintf( _n( '%s post', '%s posts', $post_total, 'kriti-blocks' ), number_format_i18n( $post_total ) );
}

// Links shown under the bio: the website plus social profiles saved in the user profile.
$profile_links = array();

if ( $show_website && '' !== $author->user_url ) {
	$website = esc_url_raw( $author->user_url, array( 'http', 'https' ) );

	if ( '' !== $website ) {
		$profile_links[] = array( __( 'Website', 'kriti-blocks' ), $website );
	}
}

if ( $show_social ) {
	$networks = array(
		'twitter'   => array( 'X', 'https://x.com/' ),
		'facebook'  => array( 'Facebook', '' ),
		'instagram' => array( 'Instagram', 'https://www.instagram.com/' ),
		'linkedin'  => array( 'LinkedIn', '' ),
		'youtube'   => array( 'YouTube', '' ),
		'github'    => array( 'GitHub', 'https://github.com/' ),
		'pinterest' => array( 'Pinterest', '' ),
	);

	foreach ( $networks as $meta_key => $network ) {
		$value = trim( (string) get_user_meta( $author->ID, $meta_key, true ) );

		if ( '' === $value ) {
			continue;
		}

		$profile_url = '';

		if ( preg_match( '#^https?://#i', $value ) ) {
			$profile_url = esc_url_raw( $value, array( 'http', 'https' ) );
		} elseif ( '' !== $network[1] && preg_match( '/^@?[A-Za-z0-9_.-]{1,40}$/', $value ) ) {
			$profile_url = $network[1] . ltrim( $value, '@' );
		}

		if ( '' !== $profile_url ) {
			$profile_links[] = array( $network[0], $profile_url );
		}
	}
}

$bio          = $show_bio ? $author->description : '';

if ( '' !== $bio && $bio_length > 0 ) {
	$bio = wp_trim_words( $bio, $bio_length );
}

$display_name = $author->display_name;
$author_link  = get_author_posts_url( $author->ID );
$extra_class  = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id      = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';
$heading_tag  = 'h' . (int) $heading_level;

$modifier_class = '';

if ( 'circle' !== $avatar_shape ) {
	$modifier_class .= ' bw-author-box--avatar-' . $avatar_shape;
}

if ( 'button' === $link_style ) {
	$modifier_class .= ' bw-author-box--link-button';
}

$extra_attributes = array(
	'class' => trim( 'bw-author-box bw-author-box--' . $layout . $modifier_class . ' ' . $extra_class ),
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $show_avatar ) : ?>
		<div class="bw-author-box__avatar">
			<?php echo get_avatar( $author->ID, $avatar_size, '', $display_name ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
	<?php endif; ?>

	<div class="bw-author-box__body">
		<?php echo '<' . $heading_tag . ' class="bw-author-box__name">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php echo esc_html( $display_name ); ?>
		<?php echo '</' . $heading_tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

		<?php if ( '' !== $role_label || '' !== $post_count_text ) : ?>
			<p class="bw-author-box__meta">
				<?php if ( '' !== $role_label ) : ?>
					<span class="bw-author-box__role"><?php echo esc_html( $role_label ); ?></span>
				<?php endif; ?>
				<?php if ( '' !== $post_count_text ) : ?>
					<span class="bw-author-box__post-count"><?php echo esc_html( $post_count_text ); ?></span>
				<?php endif; ?>
			</p>
		<?php endif; ?>

		<?php if ( '' !== $bio ) : ?>
			<p class="bw-author-box__bio"><?php echo esc_html( $bio ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $profile_links ) ) : ?>
			<ul class="bw-author-box__social">
				<?php foreach ( $profile_links as $profile_link ) : ?>
					<li>
						<a href="<?php echo esc_url( $profile_link[1] ); ?>" rel="me nofollow noopener noreferrer" target="_blank">
							<?php echo esc_html( $profile_link[0] ); ?>
							<span class="screen-reader-text"><?php esc_html_e( '(opens in a new tab)', 'kriti-blocks' ); ?></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>

		<?php if ( $show_link ) : ?>
			<a class="bw-author-box__archive-link" href="<?php echo esc_url( $author_link ); ?>">
				<?php echo esc_html( $archive_link_text ); ?>
			</a>
		<?php endif; ?>
	</div>
</div>
<?php
return ob_get_clean();
