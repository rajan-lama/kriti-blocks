<?php
/**
 * Server render for the BW Related Posts block.
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

$allowed_orderby = array( 'date', 'title', 'modified', 'rand' );
$allowed_order   = array( 'ASC', 'DESC' );

$per_page  = isset( $attributes['perPage'] ) ? absint( $attributes['perPage'] ) : 3;
$per_page  = $per_page > 0 ? min( $per_page, 12 ) : 3;
$columns   = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
$columns   = min( max( $columns, 1 ), 4 );
$order_by  = isset( $attributes['orderBy'] ) ? sanitize_key( $attributes['orderBy'] ) : 'date';
$order_by  = in_array( $order_by, $allowed_orderby, true ) ? $order_by : 'date';
$order     = isset( $attributes['order'] ) ? strtoupper( (string) $attributes['order'] ) : 'DESC';
$order     = in_array( $order, $allowed_order, true ) ? $order : 'DESC';

$show_image     = ! isset( $attributes['showFeaturedImage'] ) || (bool) $attributes['showFeaturedImage'];
$show_excerpt   = ! empty( $attributes['showExcerpt'] );
$show_date      = ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'];
$show_author    = ! empty( $attributes['showAuthor'] );
$excerpt_length = isset( $attributes['excerptLength'] ) ? absint( $attributes['excerptLength'] ) : 20;
$excerpt_length = min( max( $excerpt_length, 5 ), 60 );
$image_size     = isset( $attributes['imageSize'] ) ? sanitize_key( $attributes['imageSize'] ) : 'medium_large';
$read_more      = isset( $attributes['readMoreText'] ) ? (string) $attributes['readMoreText'] : '';

/*
 * Resolve the current entry. Front end rendering uses block context; the
 * editor preview passes a post_id hint so related items can be previewed.
 */
$current_id = 0;

if ( ! empty( $block->context['postId'] ) ) {
	$current_id = absint( $block->context['postId'] );
} elseif ( isset( $_GET['post_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$current_id = absint( wp_unslash( $_GET['post_id'] ) );
} elseif ( get_the_ID() ) {
	$current_id = absint( get_the_ID() );
}

$post_type = 'post';

if ( $current_id && get_post( $current_id ) ) {
	$post_type = get_post_type( $current_id );
} elseif ( ! empty( $block->context['postType'] ) ) {
	$candidate = sanitize_key( $block->context['postType'] );

	if ( post_type_exists( $candidate ) ) {
		$post_type = $candidate;
	}
}

$post_type_object = get_post_type_object( $post_type );

if ( ! $post_type_object || empty( $post_type_object->public ) ) {
	return '';
}

/*
 * Extra options. Every value is validated here; the defaults reproduce the
 * original output.
 */
$parse_ids = static function ( $value ) {
	if ( is_array( $value ) ) {
		$value = implode( ',', array_map( 'strval', array_filter( $value, 'is_scalar' ) ) );
	}

	$parts = preg_split( '/[\s,]+/', (string) $value, -1, PREG_SPLIT_NO_EMPTY );

	return array_slice( array_values( array_unique( array_filter( array_map( 'absint', $parts ) ) ) ), 0, 50 );
};

$manual_ids = $parse_ids( $attributes['manualIds'] ?? '' );
$exclude_ids = $parse_ids( $attributes['excludeIds'] ?? '' );

$relate_by = isset( $attributes['relateBy'] ) ? sanitize_key( $attributes['relateBy'] ) : 'all';

if ( 'all' !== $relate_by && (
	! taxonomy_exists( $relate_by )
	|| ! is_taxonomy_viewable( $relate_by )
	|| ! in_array( $relate_by, get_object_taxonomies( $post_type ), true )
) ) {
	$relate_by = 'all';
}

$fallback_recent = ! isset( $attributes['fallbackRecent'] ) || (bool) $attributes['fallbackRecent'];

$heading_text = isset( $attributes['headingText'] ) && is_string( $attributes['headingText'] ) ? sanitize_text_field( (string) $attributes['headingText'] ) : '';
$heading_tag  = isset( $attributes['headingTag'] ) ? sanitize_key( $attributes['headingTag'] ) : 'h2';
$heading_tag  = in_array( $heading_tag, array( 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ), true ) ? $heading_tag : 'h2';

$card_style = isset( $attributes['cardStyle'] ) ? sanitize_key( $attributes['cardStyle'] ) : 'boxed';
$card_style = in_array( $card_style, array( 'boxed', 'plain', 'overlay' ), true ) ? $card_style : 'boxed';
$hover      = isset( $attributes['hoverEffect'] ) ? sanitize_key( $attributes['hoverEffect'] ) : 'none';
$hover      = in_array( $hover, array( 'none', 'lift', 'zoom' ), true ) ? $hover : 'none';

$ratios      = array(
	'1x1'  => '1 / 1',
	'4x3'  => '4 / 3',
	'3x2'  => '3 / 2',
	'16x9' => '16 / 9',
	'21x9' => '21 / 9',
	'3x4'  => '3 / 4',
	'auto' => 'auto',
);
$ratio_key   = isset( $attributes['imageRatio'] ) ? sanitize_key( $attributes['imageRatio'] ) : 'default';
$title_tag   = isset( $attributes['titleTag'] ) ? sanitize_key( $attributes['titleTag'] ) : 'h3';
$title_tag   = in_array( $title_tag, array( 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div' ), true ) ? $title_tag : 'h3';
$columns_tab = isset( $attributes['columnsTablet'] ) ? min( absint( $attributes['columnsTablet'] ), 4 ) : 0;
$columns_mob = isset( $attributes['columnsMobile'] ) ? min( absint( $attributes['columnsMobile'] ), 2 ) : 0;

$show_reading_time = ! empty( $attributes['showReadingTime'] );
$show_comments     = ! empty( $attributes['showComments'] );
$no_results_text   = isset( $attributes['noResultsText'] ) && is_string( $attributes['noResultsText'] ) ? sanitize_text_field( (string) $attributes['noResultsText'] ) : '';

$tax_query = array();

if ( $current_id && empty( $manual_ids ) ) {
	$taxonomies = 'all' === $relate_by ? get_object_taxonomies( $post_type, 'names' ) : array( $relate_by );

	foreach ( $taxonomies as $taxonomy ) {
		if ( ! is_taxonomy_viewable( $taxonomy ) ) {
			continue;
		}

		$terms = get_the_terms( $current_id, $taxonomy );

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			continue;
		}

		$term_ids = wp_list_pluck( $terms, 'term_id' );

		$tax_query[] = array(
			'taxonomy' => $taxonomy,
			'field'    => 'term_id',
			'terms'    => array_map( 'absint', $term_ids ),
		);
	}
}

if ( count( $tax_query ) > 1 ) {
	$tax_query['relation'] = 'OR';
}

$query_args = array(
	'post_type'           => $post_type,
	'post_status'         => 'publish',
	'posts_per_page'      => $per_page,
	'orderby'             => $order_by,
	'order'               => $order,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);

if ( $current_id ) {
	$query_args['post__not_in'] = array( $current_id );
}

if ( ! empty( $exclude_ids ) ) {
	$query_args['post__not_in'] = array_merge( isset( $query_args['post__not_in'] ) ? $query_args['post__not_in'] : array(), $exclude_ids );
}

if ( ! empty( $manual_ids ) ) {
	$query_args['post__in'] = $manual_ids;
	$query_args['orderby']  = 'post__in';
	$query_args['post_type'] = array_values( array_diff( get_post_types( array( 'public' => true ) ), array( 'attachment' ) ) );
}

if ( ! empty( $tax_query ) ) {
	$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
}

$empty_markup = static function () use ( $no_results_text ) {
	if ( '' === $no_results_text ) {
		return '';
	}

	return '<div ' . get_block_wrapper_attributes( array( 'class' => 'bw-related-posts bw-related-posts--empty' ) ) . '><p class="bw-related-posts__empty">' . esc_html( $no_results_text ) . '</p></div>';
};

if ( empty( $manual_ids ) && empty( $tax_query ) && $current_id && ! $fallback_recent ) {
	return $empty_markup();
}

$related_query = new WP_Query( $query_args );

if ( ! $related_query->have_posts() ) {
	return $empty_markup();
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$modifier_class = '';

if ( 'boxed' !== $card_style ) {
	$modifier_class .= ' bw-related-posts--card-' . $card_style;
}

if ( 'none' !== $hover ) {
	$modifier_class .= ' bw-related-posts--hover-' . $hover;
}

$inline_style = '--bw-related-columns:' . $columns . ';';

if ( $columns_tab > 0 ) {
	$inline_style .= '--bw-related-columns-tablet:' . $columns_tab . ';';
}

if ( $columns_mob > 0 ) {
	$inline_style .= '--bw-related-columns-mobile:' . $columns_mob . ';';
}

if ( isset( $ratios[ $ratio_key ] ) ) {
	$inline_style .= '--bw-related-ratio:' . $ratios[ $ratio_key ] . ';';
}

$extra_attributes = array(
	'class' => trim( 'bw-related-posts' . $modifier_class . ' ' . $extra_class ),
	'style' => $inline_style,
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( '' !== $heading_text ) : ?>
		<?php echo '<' . $heading_tag . ' class="bw-related-posts__heading">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php echo esc_html( $heading_text ); ?>
		<?php echo '</' . $heading_tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>
	<?php
	while ( $related_query->have_posts() ) :
		$related_query->the_post();
		?>
		<article class="bw-related-posts__item">
			<?php if ( $show_image && has_post_thumbnail() ) : ?>
				<a class="bw-related-posts__image" href="<?php echo esc_url( get_permalink() ); ?>">
					<?php the_post_thumbnail( $image_size, array( 'loading' => 'lazy' ) ); ?>
				</a>
			<?php endif; ?>

			<div class="bw-related-posts__body">
				<?php echo '<' . $title_tag . ' class="bw-related-posts__title">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<a href="<?php echo esc_url( get_permalink() ); ?>">
						<?php echo esc_html( get_the_title() ); ?>
					</a>
				<?php echo '</' . $title_tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

				<?php if ( $show_author || $show_reading_time || $show_comments ) : ?>
					<div class="bw-related-posts__meta">
						<?php if ( $show_date ) : ?>
							<time class="bw-related-posts__date" datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
								<?php echo esc_html( get_the_date() ); ?>
							</time>
						<?php endif; ?>

						<?php if ( $show_author ) : ?>
							<span class="bw-related-posts__author">
								<?php echo esc_html( get_the_author() ); ?>
							</span>
						<?php endif; ?>

						<?php if ( $show_reading_time ) : ?>
							<span class="bw-related-posts__reading-time">
								<?php
								$word_count = count( preg_split( '/\s+/u', trim( wp_strip_all_tags( strip_shortcodes( (string) get_post_field( 'post_content' ) ) ) ), -1, PREG_SPLIT_NO_EMPTY ) );
								/* translators: %d: minutes. */
								echo esc_html( sprintf( __( '%d min read', 'kriti-blocks' ), max( 1, (int) ceil( $word_count / 200 ) ) ) );
								?>
							</span>
						<?php endif; ?>

						<?php if ( $show_comments ) : ?>
							<span class="bw-related-posts__comments">
								<?php
								$comment_count = (int) get_comments_number();
								/* translators: %s: number of comments. */
								echo esc_html( sprintf( _n( '%s comment', '%s comments', $comment_count, 'kriti-blocks' ), number_format_i18n( $comment_count ) ) );
								?>
							</span>
						<?php endif; ?>
					</div>
				<?php elseif ( $show_date ) : ?>
					<time class="bw-related-posts__date" datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
						<?php echo esc_html( get_the_date() ); ?>
					</time>
				<?php endif; ?>

				<?php if ( $show_excerpt ) : ?>
					<p class="bw-related-posts__excerpt">
						<?php echo esc_html( wp_trim_words( get_the_excerpt(), $excerpt_length ) ); ?>
					</p>
				<?php endif; ?>

				<?php if ( '' !== $read_more ) : ?>
					<a class="bw-related-posts__more" href="<?php echo esc_url( get_permalink() ); ?>">
						<?php echo esc_html( $read_more ); ?>
					</a>
				<?php endif; ?>
			</div>
		</article>
		<?php
	endwhile;
	?>
</div>
<?php
wp_reset_postdata();

return ob_get_clean();
