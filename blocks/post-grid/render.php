<?php
/**
 * Server render for the BW Post Grid block.
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

$post_type = isset( $attributes['postType'] ) ? sanitize_key( $attributes['postType'] ) : 'post';

if ( ! post_type_exists( $post_type ) ) {
	$post_type = 'post';
}

$post_type_object = get_post_type_object( $post_type );

if ( ! $post_type_object || empty( $post_type_object->public ) ) {
	return '';
}

$allowed_orderby = array( 'date', 'title', 'menu_order', 'modified', 'rand' );
$allowed_order   = array( 'ASC', 'DESC' );

$per_page  = isset( $attributes['perPage'] ) ? absint( $attributes['perPage'] ) : 6;
$per_page  = $per_page > 0 ? min( $per_page, 24 ) : 6;
$columns   = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
$columns   = min( max( $columns, 1 ), 4 );
$layout    = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'grid';
$layout    = in_array( $layout, array( 'grid', 'list' ), true ) ? $layout : 'grid';
$order_by  = isset( $attributes['orderBy'] ) ? sanitize_key( $attributes['orderBy'] ) : 'date';
$order_by  = in_array( $order_by, $allowed_orderby, true ) ? $order_by : 'date';
$order     = isset( $attributes['order'] ) ? strtoupper( (string) $attributes['order'] ) : 'DESC';
$order     = in_array( $order, $allowed_order, true ) ? $order : 'DESC';

$show_image     = ! isset( $attributes['showFeaturedImage'] ) || (bool) $attributes['showFeaturedImage'];
$show_excerpt   = ! isset( $attributes['showExcerpt'] ) || (bool) $attributes['showExcerpt'];
$show_date      = ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'];
$show_author    = ! empty( $attributes['showAuthor'] );
$show_category  = ! empty( $attributes['showCategory'] );
$excerpt_length = isset( $attributes['excerptLength'] ) ? absint( $attributes['excerptLength'] ) : 20;
$excerpt_length = min( max( $excerpt_length, 5 ), 60 );
$image_size     = isset( $attributes['imageSize'] ) ? sanitize_key( $attributes['imageSize'] ) : 'medium_large';
$read_more      = isset( $attributes['readMoreText'] ) ? (string) $attributes['readMoreText'] : '';

$category_ids = array();
if ( ! empty( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] ) ) {
	$category_ids = array_filter( array_map( 'absint', $attributes['categoryIds'] ) );
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

$offset      = isset( $attributes['offset'] ) ? min( absint( $attributes['offset'] ), 100 ) : 0;
$include_ids = $parse_ids( $attributes['includeIds'] ?? '' );
$exclude_ids = $parse_ids( $attributes['excludeIds'] ?? '' );
$sticky_mode = isset( $attributes['stickyPosts'] ) ? sanitize_key( $attributes['stickyPosts'] ) : 'ignore';
$sticky_mode = in_array( $sticky_mode, array( 'ignore', 'exclude', 'only' ), true ) ? $sticky_mode : 'ignore';

$filter_taxonomy = isset( $attributes['filterTaxonomy'] ) ? sanitize_key( $attributes['filterTaxonomy'] ) : '';
$filter_term_ids = $parse_ids( $attributes['filterTermIds'] ?? array() );

if ( '' !== $filter_taxonomy && (
	! taxonomy_exists( $filter_taxonomy )
	|| ! is_taxonomy_viewable( $filter_taxonomy )
	|| ! in_array( $filter_taxonomy, get_object_taxonomies( $post_type ), true )
) ) {
	$filter_taxonomy = '';
}

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

$query_args = array(
	'post_type'           => $post_type,
	'post_status'         => 'publish',
	'posts_per_page'      => $per_page,
	'orderby'             => $order_by,
	'order'               => $order,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);

if ( ! empty( $category_ids ) && 'post' === $post_type ) {
	$query_args['cat'] = $category_ids;
}

if ( $offset > 0 ) {
	$query_args['offset'] = $offset;
}

$sticky_ids = array();

if ( 'post' === $post_type && 'ignore' !== $sticky_mode ) {
	$sticky_ids = array_map( 'absint', (array) get_option( 'sticky_posts', array() ) );
}

$post_in = $include_ids;

if ( 'only' === $sticky_mode && 'post' === $post_type ) {
	$post_in = ! empty( $post_in ) ? array_values( array_intersect( $post_in, $sticky_ids ) ) : $sticky_ids;

	if ( empty( $post_in ) ) {
		$post_in = array( 0 );
	}
}

if ( ! empty( $post_in ) ) {
	$query_args['post__in'] = $post_in;
}

$not_in = $exclude_ids;

if ( 'exclude' === $sticky_mode ) {
	$not_in = array_merge( $not_in, $sticky_ids );
}

if ( ! empty( $not_in ) ) {
	$query_args['post__not_in'] = $not_in;
}

if ( '' !== $filter_taxonomy && ! empty( $filter_term_ids ) ) {
	$query_args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		array(
			'taxonomy' => $filter_taxonomy,
			'field'    => 'term_id',
			'terms'    => $filter_term_ids,
		),
	);
}

$post_grid_query = new WP_Query( $query_args );

if ( ! $post_grid_query->have_posts() ) {
	if ( '' === $no_results_text ) {
		return '';
	}

	return '<div ' . get_block_wrapper_attributes( array( 'class' => 'bw-post-grid bw-post-grid--empty' ) ) . '><p class="bw-post-grid__empty">' . esc_html( $no_results_text ) . '</p></div>';
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$modifier_class = '';

if ( 'boxed' !== $card_style ) {
	$modifier_class .= ' bw-post-grid--card-' . $card_style;
}

if ( 'none' !== $hover ) {
	$modifier_class .= ' bw-post-grid--hover-' . $hover;
}

$inline_style = '--bw-post-grid-columns:' . $columns . ';';

if ( $columns_tab > 0 ) {
	$inline_style .= '--bw-post-grid-columns-tablet:' . $columns_tab . ';';
}

if ( $columns_mob > 0 ) {
	$inline_style .= '--bw-post-grid-columns-mobile:' . $columns_mob . ';';
}

if ( isset( $ratios[ $ratio_key ] ) ) {
	$inline_style .= '--bw-post-grid-ratio:' . $ratios[ $ratio_key ] . ';';
}

$extra_attributes = array(
	'class' => trim( 'bw-post-grid bw-post-grid--' . $layout . $modifier_class . ' ' . $extra_class ),
	'style' => $inline_style,
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php
	while ( $post_grid_query->have_posts() ) :
		$post_grid_query->the_post();
		?>
		<article class="bw-post-grid__item">
			<?php if ( $show_image && has_post_thumbnail() ) : ?>
				<a class="bw-post-grid__image" href="<?php echo esc_url( get_permalink() ); ?>">
					<?php the_post_thumbnail( $image_size, array( 'loading' => 'lazy' ) ); ?>
				</a>
			<?php endif; ?>

			<div class="bw-post-grid__body">
				<?php echo '<' . $title_tag . ' class="bw-post-grid__title">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<a href="<?php echo esc_url( get_permalink() ); ?>">
						<?php echo esc_html( get_the_title() ); ?>
					</a>
				<?php echo '</' . $title_tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

				<?php if ( $show_date || $show_author || $show_reading_time || $show_comments || ( $show_category && 'post' === $post_type ) ) : ?>
					<div class="bw-post-grid__meta">
						<?php if ( $show_date ) : ?>
							<time class="bw-post-grid__date" datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
								<?php echo esc_html( get_the_date() ); ?>
							</time>
						<?php endif; ?>

						<?php if ( $show_author ) : ?>
							<span class="bw-post-grid__author">
								<?php echo esc_html( get_the_author() ); ?>
							</span>
						<?php endif; ?>

						<?php if ( $show_category && 'post' === $post_type ) : ?>
							<span class="bw-post-grid__terms">
								<?php echo wp_kses_post( get_the_category_list( ', ' ) ); ?>
							</span>
						<?php endif; ?>

						<?php if ( $show_reading_time ) : ?>
							<span class="bw-post-grid__reading-time">
								<?php
								$word_count = count( preg_split( '/\s+/u', trim( wp_strip_all_tags( strip_shortcodes( (string) get_post_field( 'post_content' ) ) ) ), -1, PREG_SPLIT_NO_EMPTY ) );
								/* translators: %d: minutes. */
								echo esc_html( sprintf( __( '%d min read', 'kriti-blocks' ), max( 1, (int) ceil( $word_count / 200 ) ) ) );
								?>
							</span>
						<?php endif; ?>

						<?php if ( $show_comments ) : ?>
							<span class="bw-post-grid__comments">
								<?php
								$comment_count = (int) get_comments_number();
								/* translators: %s: number of comments. */
								echo esc_html( sprintf( _n( '%s comment', '%s comments', $comment_count, 'kriti-blocks' ), number_format_i18n( $comment_count ) ) );
								?>
							</span>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<?php if ( $show_excerpt ) : ?>
					<p class="bw-post-grid__excerpt">
						<?php echo esc_html( wp_trim_words( get_the_excerpt(), $excerpt_length ) ); ?>
					</p>
				<?php endif; ?>

				<?php if ( '' !== $read_more ) : ?>
					<a class="bw-post-grid__more" href="<?php echo esc_url( get_permalink() ); ?>">
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
