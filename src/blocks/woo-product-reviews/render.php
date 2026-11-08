<?php
/**
 * Server render for the BW Product Reviews block.
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

if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_product' ) || ! post_type_exists( 'product' ) ) {
	return '';
}

$is_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;

/*
 * Resolve the product from block context (product templates and query loops),
 * falling back to the current entry. The editor preview passes a `post_id`
 * hint because block context is not available over the REST request.
 */
$product_id = 0;

if ( ! empty( $block->context['postId'] ) ) {
	$product_id = absint( $block->context['postId'] );
} elseif ( isset( $_GET['post_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$product_id = absint( wp_unslash( $_GET['post_id'] ) );
} elseif ( get_the_ID() ) {
	$product_id = absint( get_the_ID() );
}

/*
 * An explicit product choice overrides the context, but only for products the
 * visitor is allowed to see.
 */
$chosen_id = isset( $attributes['productId'] ) ? absint( $attributes['productId'] ) : 0;

if ( $chosen_id > 0 && 'product' === get_post_type( $chosen_id ) && ( 'publish' === get_post_status( $chosen_id ) || current_user_can( 'read_post', $chosen_id ) ) ) {
	$product_id = $chosen_id;
}

$product = $product_id ? wc_get_product( $product_id ) : false;

if ( ! $product instanceof WC_Product ) {
	if ( ! $is_preview ) {
		return '';
	}

	$product = false;
}

$is_sample = false === $product;

$reviews_per_page = isset( $attributes['perPage'] ) ? absint( $attributes['perPage'] ) : 5;
$reviews_per_page = min( $reviews_per_page, 50 );
$review_order     = isset( $attributes['order'] ) ? strtoupper( (string) $attributes['order'] ) : 'DESC';
$review_order     = in_array( $review_order, array( 'ASC', 'DESC' ), true ) ? $review_order : 'DESC';
$heading_level    = isset( $attributes['headingLevel'] ) ? absint( $attributes['headingLevel'] ) : 3;
$heading_level    = min( max( $heading_level, 2 ), 6 );
$heading_tag      = 'h' . $heading_level;

$show_title    = ! isset( $attributes['showTitle'] ) || (bool) $attributes['showTitle'];
$show_rating   = ! isset( $attributes['showRating'] ) || (bool) $attributes['showRating'];
$show_avatar   = ! isset( $attributes['showAvatar'] ) || (bool) $attributes['showAvatar'];
$show_date     = ! isset( $attributes['showDate'] ) || (bool) $attributes['showDate'];
$show_verified = ! isset( $attributes['showVerified'] ) || (bool) $attributes['showVerified'];

$min_rating   = isset( $attributes['minRating'] ) ? min( absint( $attributes['minRating'] ), 5 ) : 0;
$show_summary = ! empty( $attributes['showSummary'] );
$paginate     = ! empty( $attributes['pagination'] ) && $reviews_per_page > 0;
$show_write   = ! empty( $attributes['showWriteLink'] );
$write_text   = isset( $attributes['writeLinkText'] ) ? sanitize_text_field( (string) $attributes['writeLinkText'] ) : '';
$write_text   = '' !== $write_text ? $write_text : __( 'Write a review', 'kriti-blocks' );
$card_style   = isset( $attributes['cardStyle'] ) ? sanitize_key( $attributes['cardStyle'] ) : 'default';
$card_style   = in_array( $card_style, array( 'default', 'plain', 'shadow', 'filled' ), true ) ? $card_style : 'default';
$avatar_size  = isset( $attributes['avatarSize'] ) ? absint( $attributes['avatarSize'] ) : 48;
$avatar_size  = $avatar_size > 0 ? min( max( $avatar_size, 24 ), 96 ) : 48;

$total_reviews = $is_sample ? 2 : (int) $product->get_review_count();
$reviews       = array();
$current_page  = 1;
$total_pages   = 1;

if ( ! $is_sample ) {
	$comment_query = array(
		'post_id' => $product->get_id(),
		'status'  => 'approve',
		'type'    => 'review',
		'orderby' => 'comment_date_gmt',
		'order'   => $review_order,
	);

	if ( $min_rating > 0 ) {
		$comment_query['meta_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			array(
				'key'     => 'rating',
				'value'   => $min_rating,
				'type'    => 'NUMERIC',
				'compare' => '>=',
			),
		);
	}

	/*
	 * Older WooCommerce versions stored reviews as standard comments, so fall
	 * back to that when no typed reviews are found.
	 */
	$count_query = $comment_query;

	$count_query['count'] = true;

	$filtered_total = (int) get_comments( $count_query );

	if ( 0 === $filtered_total ) {
		$comment_query['type'] = 'comment';
		$count_query['type']   = 'comment';
		$filtered_total        = (int) get_comments( $count_query );
	}

	if ( $min_rating > 0 || $paginate ) {
		$total_reviews = $min_rating > 0 ? $filtered_total : $total_reviews;
	}

	if ( $reviews_per_page > 0 ) {
		$comment_query['number'] = $reviews_per_page;

		if ( $paginate ) {
			$total_pages  = max( 1, (int) ceil( $filtered_total / $reviews_per_page ) );
			$current_page = isset( $_GET['kb_reviews_page'] ) ? absint( wp_unslash( $_GET['kb_reviews_page'] ) ) : 1; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$current_page = min( max( $current_page, 1 ), $total_pages );

			$comment_query['offset'] = ( $current_page - 1 ) * $reviews_per_page;
		}
	}

	$reviews = get_comments( $comment_query );
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$classes = 'bw-woo-product-reviews';

if ( $is_sample ) {
	$classes .= ' bw-woo-product-reviews--preview';
}

if ( 'default' !== $card_style ) {
	$classes .= ' bw-woo-product-reviews--card-' . $card_style;
}

if ( '' !== $extra_class ) {
	$classes .= ' ' . $extra_class;
}

$extra_attributes = array(
	'class' => trim( $classes ),
);

if ( 48 !== $avatar_size ) {
	$extra_attributes['style'] = '--bw-woo-reviews-avatar-size:' . $avatar_size . 'px;';
}

$summary_average = 0.0;
$summary_counts  = array();
$summary_total   = 0;

if ( $show_summary ) {
	if ( $is_sample ) {
		$summary_average = 4.5;
		$summary_counts  = array(
			5 => 8,
			4 => 3,
			3 => 1,
			2 => 0,
			1 => 0,
		);
	} else {
		$summary_average = (float) $product->get_average_rating();
		$raw_counts      = $product->get_rating_counts();

		for ( $star = 5; $star >= 1; --$star ) {
			$summary_counts[ $star ] = isset( $raw_counts[ $star ] ) ? absint( $raw_counts[ $star ] ) : 0;
		}
	}

	$summary_total = array_sum( $summary_counts );
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $show_summary && $summary_total > 0 ) : ?>
		<div class="bw-woo-product-reviews__summary">
			<div class="bw-woo-product-reviews__summary-average">
				<span class="bw-woo-product-reviews__summary-score"><?php echo esc_html( number_format_i18n( $summary_average, 1 ) ); ?></span>
				<?php if ( function_exists( 'wc_get_rating_html' ) ) : ?>
					<?php echo wp_kses_post( wc_get_rating_html( $summary_average ) ); ?>
				<?php endif; ?>
			</div>
			<ul class="bw-woo-product-reviews__summary-bars">
				<?php foreach ( $summary_counts as $star => $star_count ) : ?>
					<li class="bw-woo-product-reviews__summary-row">
						<span class="bw-woo-product-reviews__summary-label">
							<?php
							/* translators: %d: number of stars. */
							echo esc_html( sprintf( _n( '%d star', '%d stars', $star, 'kriti-blocks' ), $star ) );
							?>
						</span>
						<span class="bw-woo-product-reviews__summary-bar" aria-hidden="true">
							<span class="bw-woo-product-reviews__summary-fill" style="<?php echo esc_attr( 'width:' . round( ( $star_count / $summary_total ) * 100, 1 ) . '%' ); ?>"></span>
						</span>
						<span class="bw-woo-product-reviews__summary-count"><?php echo esc_html( number_format_i18n( $star_count ) ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	<?php endif; ?>

	<?php if ( $show_title && $total_reviews > 0 ) : ?>
		<?php echo '<' . $heading_tag . ' class="bw-woo-product-reviews__title">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php
			echo esc_html(
				sprintf(
					/* translators: %s: number of reviews. */
					_n( '%s review', '%s reviews', $total_reviews, 'kriti-blocks' ),
					number_format_i18n( $total_reviews )
				)
			);
			?>
		<?php echo '</' . $heading_tag . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php if ( $is_sample ) : ?>
		<ol class="bw-woo-product-reviews__list">
			<?php for ( $sample_index = 0; $sample_index < 2; $sample_index++ ) : ?>
				<li class="bw-woo-product-reviews__item">
					<div class="bw-woo-product-reviews__meta">
						<?php if ( $show_avatar ) : ?>
							<span class="bw-woo-product-reviews__avatar bw-woo-product-reviews__avatar--placeholder" aria-hidden="true"></span>
						<?php endif; ?>

						<div class="bw-woo-product-reviews__author">
							<span class="bw-woo-product-reviews__name"><?php esc_html_e( 'Jane Doe', 'kriti-blocks' ); ?></span>

							<?php if ( $show_rating && function_exists( 'wc_get_rating_html' ) ) : ?>
								<span class="bw-woo-product-reviews__rating"><?php echo wp_kses_post( wc_get_rating_html( 5 ) ); ?></span>
							<?php endif; ?>

							<?php if ( $show_verified ) : ?>
								<span class="bw-woo-product-reviews__verified"><?php esc_html_e( 'Verified owner', 'kriti-blocks' ); ?></span>
							<?php endif; ?>
						</div>

						<?php if ( $show_date ) : ?>
							<time class="bw-woo-product-reviews__date" datetime="<?php echo esc_attr( gmdate( 'c' ) ); ?>">
								<?php echo esc_html( date_i18n( get_option( 'date_format' ) ) ); ?>
							</time>
						<?php endif; ?>
					</div>

					<div class="bw-woo-product-reviews__content">
						<?php esc_html_e( 'This is a sample review used for the editor preview.', 'kriti-blocks' ); ?>
					</div>
				</li>
			<?php endfor; ?>
		</ol>
	<?php elseif ( empty( $reviews ) ) : ?>
		<p class="bw-woo-product-reviews__empty"><?php esc_html_e( 'There are no reviews yet.', 'kriti-blocks' ); ?></p>
	<?php else : ?>
		<ol class="bw-woo-product-reviews__list">
			<?php foreach ( $reviews as $review ) : ?>
				<?php
				$review_rating = (float) get_comment_meta( $review->comment_ID, 'rating', true );
				$is_verified   = function_exists( 'wc_review_is_from_verified_owner' ) && wc_review_is_from_verified_owner( $review->comment_ID );
				?>
				<li class="bw-woo-product-reviews__item">
					<div class="bw-woo-product-reviews__meta">
						<?php if ( $show_avatar ) : ?>
							<span class="bw-woo-product-reviews__avatar">
								<?php echo wp_kses_post( get_avatar( $review, $avatar_size ) ); ?>
							</span>
						<?php endif; ?>

						<div class="bw-woo-product-reviews__author">
							<span class="bw-woo-product-reviews__name"><?php echo esc_html( get_comment_author( $review ) ); ?></span>

							<?php if ( $show_rating && $review_rating > 0 && function_exists( 'wc_get_rating_html' ) ) : ?>
								<span class="bw-woo-product-reviews__rating"><?php echo wp_kses_post( wc_get_rating_html( $review_rating ) ); ?></span>
							<?php endif; ?>

							<?php if ( $show_verified && $is_verified ) : ?>
								<span class="bw-woo-product-reviews__verified"><?php esc_html_e( 'Verified owner', 'kriti-blocks' ); ?></span>
							<?php endif; ?>
						</div>

						<?php if ( $show_date ) : ?>
							<time class="bw-woo-product-reviews__date" datetime="<?php echo esc_attr( mysql2date( 'c', $review->comment_date_gmt ) ); ?>">
								<?php echo esc_html( get_comment_date( get_option( 'date_format' ), $review ) ); ?>
							</time>
						<?php endif; ?>
					</div>

					<div class="bw-woo-product-reviews__content">
						<?php echo wp_kses_post( get_comment_text( $review ) ); ?>
					</div>
				</li>
			<?php endforeach; ?>
		</ol>
	<?php endif; ?>

	<?php if ( $paginate && ! $is_sample && $total_pages > 1 ) : ?>
		<nav class="bw-woo-product-reviews__pagination" aria-label="<?php esc_attr_e( 'Reviews pagination', 'kriti-blocks' ); ?>">
			<?php if ( $current_page > 1 ) : ?>
				<a class="bw-woo-product-reviews__page-link" rel="prev" href="<?php echo esc_url( add_query_arg( 'kb_reviews_page', $current_page - 1 ) ); ?>"><?php esc_html_e( 'Previous', 'kriti-blocks' ); ?></a>
			<?php endif; ?>
			<span class="bw-woo-product-reviews__page-status">
				<?php
				/* translators: 1: current page, 2: total pages. */
				echo esc_html( sprintf( __( 'Page %1$d of %2$d', 'kriti-blocks' ), $current_page, $total_pages ) );
				?>
			</span>
			<?php if ( $current_page < $total_pages ) : ?>
				<a class="bw-woo-product-reviews__page-link" rel="next" href="<?php echo esc_url( add_query_arg( 'kb_reviews_page', $current_page + 1 ) ); ?>"><?php esc_html_e( 'Next', 'kriti-blocks' ); ?></a>
			<?php endif; ?>
		</nav>
	<?php endif; ?>

	<?php if ( $show_write ) : ?>
		<p class="bw-woo-product-reviews__write">
			<a class="bw-woo-product-reviews__write-link button" href="<?php echo esc_url( $is_sample ? '#' : $product->get_permalink() . '#reviews' ); ?>"><?php echo esc_html( $write_text ); ?></a>
		</p>
	<?php endif; ?>
</div>
<?php
return ob_get_clean();
