<?php
/**
 * Server render for the BW Archive Header block.
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

$is_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;

$show_title     = ! isset( $attributes['showTitle'] ) || (bool) $attributes['showTitle'];
$show_prefix    = ! isset( $attributes['showPrefix'] ) || (bool) $attributes['showPrefix'];
$show_desc      = ! isset( $attributes['showDescription'] ) || (bool) $attributes['showDescription'];
$heading_level  = isset( $attributes['headingLevel'] ) ? absint( $attributes['headingLevel'] ) : 1;
$heading_level  = min( max( $heading_level, 1 ), 6 );
$heading_tag    = 'h' . $heading_level;
$title          = '';
$description    = '';

if ( $is_preview ) {
	$title       = __( 'Archive Title', 'kriti-blocks' );
	$description = __( 'This is a sample archive description used for preview.', 'kriti-blocks' );
} elseif ( is_search() ) {
	$query = get_search_query();

	$title = $show_prefix
		/* translators: %s: search query. */
		? sprintf( __( 'Search results for: %s', 'kriti-blocks' ), $query )
		: $query;
} elseif ( is_home() ) {
	$page_for_posts = (int) get_option( 'page_for_posts' );

	$title = $page_for_posts
		? get_the_title( $page_for_posts )
		: __( 'Latest Posts', 'kriti-blocks' );
} elseif ( is_archive() ) {
	if ( ! $show_prefix ) {
		add_filter( 'get_the_archive_title_prefix', '__return_empty_string' );
	}

	$title = get_the_archive_title();

	if ( ! $show_prefix ) {
		remove_filter( 'get_the_archive_title_prefix', '__return_empty_string' );
	}

	$description = get_the_archive_description();
}

if ( '' === $title && '' === $description ) {
	return '';
}

/*
 * Extra options. Each value is validated; the defaults reproduce the original output.
 */
$text_align       = isset( $attributes['textAlign'] ) ? sanitize_key( $attributes['textAlign'] ) : 'left';
$text_align       = in_array( $text_align, array( 'left', 'center', 'right' ), true ) ? $text_align : 'left';
$show_breadcrumbs = ! empty( $attributes['showBreadcrumbs'] );
$show_count       = ! empty( $attributes['showPostCount'] );
$image_id         = isset( $attributes['bgImageId'] ) ? absint( $attributes['bgImageId'] ) : 0;
$overlay          = isset( $attributes['overlayOpacity'] ) ? min( absint( $attributes['overlayOpacity'] ), 90 ) : 50;
$min_height       = isset( $attributes['minHeight'] ) ? min( absint( $attributes['minHeight'] ), 800 ) : 0;

$image_url = '';

if ( $image_id && wp_attachment_is_image( $image_id ) ) {
	$image_url = (string) wp_get_attachment_image_url( $image_id, 'full' );
}

$breadcrumbs = array();

if ( $show_breadcrumbs ) {
	$breadcrumbs[] = array( __( 'Home', 'kriti-blocks' ), home_url( '/' ) );

	if ( $is_preview ) {
		$breadcrumbs[] = array( __( 'Archive', 'kriti-blocks' ), '' );
	} elseif ( is_category() || is_tag() || is_tax() ) {
		$queried = get_queried_object();

		if ( $queried instanceof WP_Term ) {
			foreach ( array_reverse( get_ancestors( $queried->term_id, $queried->taxonomy, 'taxonomy' ) ) as $ancestor_id ) {
				$ancestor      = get_term( $ancestor_id, $queried->taxonomy );
				$ancestor_link = $ancestor instanceof WP_Term ? get_term_link( $ancestor ) : '';

				if ( $ancestor instanceof WP_Term && ! is_wp_error( $ancestor_link ) ) {
					$breadcrumbs[] = array( $ancestor->name, $ancestor_link );
				}
			}

			$breadcrumbs[] = array( $queried->name, '' );
		}
	} elseif ( is_author() ) {
		$breadcrumbs[] = array( get_the_author_meta( 'display_name', (int) get_queried_object_id() ), '' );
	} elseif ( is_post_type_archive() ) {
		$breadcrumbs[] = array( post_type_archive_title( '', false ), '' );
	} elseif ( is_search() ) {
		$breadcrumbs[] = array( __( 'Search results', 'kriti-blocks' ), '' );
	} elseif ( '' !== $title ) {
		$breadcrumbs[] = array( wp_strip_all_tags( $title ), '' );
	}
}

$post_count_text = '';

if ( $show_count ) {
	global $wp_query;

	if ( $is_preview ) {
		$found = 12;
	} elseif ( ( is_archive() || is_search() ) && $wp_query instanceof WP_Query ) {
		$found = (int) $wp_query->found_posts;
	} else {
		$found = -1;
	}

	if ( $found >= 0 ) {
		/* translators: %s: number of posts. */
		$post_count_text = sprintf( _n( '%s post', '%s posts', $found, 'kriti-blocks' ), number_format_i18n( $found ) );
	}
}

$modifier_class = '';
$inline_style   = '';

if ( 'left' !== $text_align ) {
	$modifier_class .= ' bw-archive-header--align-' . $text_align;
}

if ( '' !== $image_url ) {
	$modifier_class .= ' bw-archive-header--has-image';
	$inline_style   .= '--bw-ah-image:url("' . esc_url( $image_url ) . '");--bw-ah-overlay:' . ( $overlay / 100 ) . ';';
}

if ( $min_height > 0 ) {
	$modifier_class .= ' bw-archive-header--min-height';
	$inline_style   .= '--bw-ah-min-height:' . $min_height . 'px;';
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$extra_attributes = array(
	'class' => trim( 'bw-archive-header' . $modifier_class . ' ' . $extra_class ),
);

if ( '' !== $inline_style ) {
	$extra_attributes['style'] = $inline_style;
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( count( $breadcrumbs ) > 1 ) : ?>
		<nav class="bw-archive-header__breadcrumbs" aria-label="<?php esc_attr_e( 'Breadcrumb', 'kriti-blocks' ); ?>">
			<ol>
				<?php foreach ( $breadcrumbs as $index => $crumb ) : ?>
					<?php if ( '' !== $crumb[1] && $index < count( $breadcrumbs ) - 1 ) : ?>
						<li><a href="<?php echo esc_url( $crumb[1] ); ?>"><?php echo esc_html( $crumb[0] ); ?></a></li>
					<?php else : ?>
						<li aria-current="page"><?php echo esc_html( $crumb[0] ); ?></li>
					<?php endif; ?>
				<?php endforeach; ?>
			</ol>
		</nav>
	<?php endif; ?>

	<?php if ( $show_title && '' !== $title ) : ?>
		<?php echo '<' . $heading_tag . ' class="bw-archive-header__title">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php echo esc_html( $title ); ?>
		<?php echo '</' . $heading_tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php if ( '' !== $post_count_text ) : ?>
		<p class="bw-archive-header__count"><?php echo esc_html( $post_count_text ); ?></p>
	<?php endif; ?>

	<?php if ( $show_desc && '' !== $description ) : ?>
		<div class="bw-archive-header__description">
			<?php echo wp_kses_post( $description ); ?>
		</div>
	<?php endif; ?>
</div>
<?php
return ob_get_clean();
