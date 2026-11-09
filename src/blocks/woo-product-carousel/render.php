<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Product Carousel block.
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

$allowed_orderby = array( 'date', 'title', 'menu_order', 'modified', 'rand', 'price', 'popularity', 'rating' );
$allowed_order   = array( 'ASC', 'DESC' );

$per_page = isset( $attributes['perPage'] ) ? absint( $attributes['perPage'] ) : 6;
$per_page = $per_page > 0 ? min( $per_page, 50 ) : 6;
$columns  = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
$columns  = min( max( $columns, 1 ), 4 );
$order_by = isset( $attributes['orderBy'] ) ? sanitize_key( $attributes['orderBy'] ) : 'date';
$order_by = in_array( $order_by, $allowed_orderby, true ) ? $order_by : 'date';
$order    = isset( $attributes['order'] ) ? strtoupper( (string) $attributes['order'] ) : 'DESC';
$order    = in_array( $order, $allowed_order, true ) ? $order : 'DESC';

$show_image    = ! isset( $attributes['showImage'] ) || (bool) $attributes['showImage'];
$show_category = ! empty( $attributes['showCategory'] );
$show_rating   = ! isset( $attributes['showRating'] ) || (bool) $attributes['showRating'];
$show_price    = ! isset( $attributes['showPrice'] ) || (bool) $attributes['showPrice'];
$show_cart     = ! isset( $attributes['showAddToCart'] ) || (bool) $attributes['showAddToCart'];
$featured_only = ! empty( $attributes['featuredOnly'] );
$on_sale_only  = ! empty( $attributes['onSaleOnly'] );

$show_title      = ! isset( $attributes['showTitle'] ) || (bool) $attributes['showTitle'];
$show_sale_badge = ! isset( $attributes['showSaleBadge'] ) || (bool) $attributes['showSaleBadge'];
$hover_swap      = ! empty( $attributes['imageHover'] );
$button_style    = isset( $attributes['buttonStyle'] ) ? sanitize_key( $attributes['buttonStyle'] ) : 'default';
$button_style    = in_array( $button_style, array( 'default', 'outline', 'link' ), true ) ? $button_style : 'default';
$card_style      = isset( $attributes['cardStyle'] ) ? sanitize_key( $attributes['cardStyle'] ) : 'default';
$card_style      = in_array( $card_style, array( 'default', 'flat', 'shadow' ), true ) ? $card_style : 'default';
$image_ratio     = isset( $attributes['imageRatio'] ) ? sanitize_key( $attributes['imageRatio'] ) : 'square';
$ratio_map       = array(
	'square' => '',
	'4-3'    => '4 / 3',
	'3-4'    => '3 / 4',
	'16-9'   => '16 / 9',
);
$image_ratio     = isset( $ratio_map[ $image_ratio ] ) ? $image_ratio : 'square';
$columns_tablet  = isset( $attributes['columnsTablet'] ) ? min( absint( $attributes['columnsTablet'] ), 4 ) : 0;
$columns_mobile  = isset( $attributes['columnsMobile'] ) ? min( absint( $attributes['columnsMobile'] ), 4 ) : 0;

$autoplay   = ! empty( $attributes['autoplay'] );
$interval   = isset( $attributes['interval'] ) ? absint( $attributes['interval'] ) : 5000;
$interval   = min( max( $interval, 2000 ), 15000 );
$show_arrow = ! isset( $attributes['showArrows'] ) || (bool) $attributes['showArrows'];
$show_dots  = ! isset( $attributes['showDots'] ) || (bool) $attributes['showDots'];
$loop       = ! empty( $attributes['loop'] );
$pause_hover = ! isset( $attributes['pauseOnHover'] ) || (bool) $attributes['pauseOnHover'];

$category_ids = array();

if ( ! empty( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] ) ) {
	$category_ids = array_filter( array_map( 'absint', $attributes['categoryIds'] ) );
}

$query_args = array(
	'post_type'           => 'product',
	'post_status'         => 'publish',
	'posts_per_page'      => $per_page,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
	'order'               => $order,
);

switch ( $order_by ) {
	case 'price':
		$query_args['meta_key'] = '_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query_args['orderby']  = 'meta_value_num';
		break;
	case 'popularity':
		$query_args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query_args['orderby']  = 'meta_value_num';
		break;
	case 'rating':
		$query_args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query_args['orderby']  = 'meta_value_num';
		break;
	default:
		$query_args['orderby'] = $order_by;
		break;
}

$tax_query = array();

if ( ! empty( $category_ids ) ) {
	$tax_query[] = array(
		'taxonomy' => 'product_cat',
		'field'    => 'term_id',
		'terms'    => $category_ids,
	);
}

if ( $featured_only ) {
	$tax_query[] = array(
		'taxonomy' => 'product_visibility',
		'field'    => 'name',
		'terms'    => 'featured',
	);
}

if ( count( $tax_query ) > 1 ) {
	$tax_query['relation'] = 'AND';
}

if ( ! empty( $tax_query ) ) {
	$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
}

$parse_ids = static function ( $value ) {
	if ( is_string( $value ) ) {
		$value = preg_split( '/[\s,]+/', $value, -1, PREG_SPLIT_NO_EMPTY );
	}

	if ( ! is_array( $value ) ) {
		return array();
	}

	return array_slice( array_values( array_unique( array_filter( array_map( 'absint', array_filter( $value, 'is_scalar' ) ) ) ) ), 0, 100 );
};

$tag_ids     = $parse_ids( isset( $attributes['tagIds'] ) ? $attributes['tagIds'] : array() );
$include_ids = $parse_ids( isset( $attributes['includeIds'] ) ? $attributes['includeIds'] : array() );
$exclude_ids = $parse_ids( isset( $attributes['excludeIds'] ) ? $attributes['excludeIds'] : array() );
$stock       = isset( $attributes['stockStatus'] ) ? sanitize_key( $attributes['stockStatus'] ) : '';
$stock       = in_array( $stock, array( 'instock', 'outofstock', 'onbackorder' ), true ) ? $stock : '';
$min_price   = isset( $attributes['minPrice'] ) && is_numeric( $attributes['minPrice'] ) ? min( max( (float) $attributes['minPrice'], 0 ), 1000000000 ) : 0;
$max_price   = isset( $attributes['maxPrice'] ) && is_numeric( $attributes['maxPrice'] ) ? min( max( (float) $attributes['maxPrice'], 0 ), 1000000000 ) : 0;
$offset      = isset( $attributes['offset'] ) ? min( absint( $attributes['offset'] ), 500 ) : 0;

$empty_message = isset( $attributes['noResultsMessage'] ) ? sanitize_text_field( (string) $attributes['noResultsMessage'] ) : '';
$empty_message = function_exists( 'mb_substr' ) ? mb_substr( $empty_message, 0, 300 ) : substr( $empty_message, 0, 300 );

/*
 * Without a message the block renders nothing when no product matches, as it
 * always has. With a message it renders a notice inside the normal wrapper.
 */
$render_empty = static function () use ( $empty_message, $attributes ) {
	if ( '' === $empty_message ) {
		return '';
	}

	$empty_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
	$empty_args  = array(
		'class' => trim( 'bw-woo-product-carousel bw-woo-product-carousel--empty ' . $empty_class ),
	);

	if ( ! empty( $attributes['htmlId'] ) ) {
		$empty_args['id'] = (string) $attributes['htmlId'];
	}

	return sprintf(
		'<div %1$s><p class="bw-woo-product-carousel__empty">%2$s</p></div>',
		get_block_wrapper_attributes( $empty_args ),
		esc_html( $empty_message )
	);
};

$post_in = $include_ids;

if ( $on_sale_only ) {
	$on_sale_ids = function_exists( 'wc_get_product_ids_on_sale' ) ? array_map( 'absint', wc_get_product_ids_on_sale() ) : array();
	$post_in     = ! empty( $include_ids ) ? array_values( array_intersect( $include_ids, $on_sale_ids ) ) : $on_sale_ids;

	if ( empty( $post_in ) ) {
		return $render_empty();
	}
}

if ( ! empty( $post_in ) ) {
	/*
	 * WP_Query ignores post__not_in when post__in is set, so exclusions are
	 * removed from the include list instead.
	 */
	$post_in = array_values( array_diff( $post_in, $exclude_ids ) );

	if ( empty( $post_in ) ) {
		return $render_empty();
	}

	$query_args['post__in'] = $post_in;
} elseif ( ! empty( $exclude_ids ) ) {
	$query_args['post__not_in'] = $exclude_ids; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_post__not_in -- Bounded exclusion list.
}

if ( $offset > 0 ) {
	$query_args['offset'] = $offset;
}

if ( ! empty( $tag_ids ) ) {
	$tax_query = isset( $query_args['tax_query'] ) ? $query_args['tax_query'] : array();

	unset( $tax_query['relation'] );

	$tax_query[] = array(
		'taxonomy' => 'product_tag',
		'field'    => 'term_id',
		'terms'    => $tag_ids,
	);

	if ( count( $tax_query ) > 1 ) {
		$tax_query['relation'] = 'AND';
	}

	$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
}

$meta_query = array();

if ( '' !== $stock ) {
	$meta_query[] = array(
		'key'   => '_stock_status',
		'value' => $stock,
	);
}

if ( $min_price > 0 && $max_price > 0 && $max_price >= $min_price ) {
	$meta_query[] = array(
		'key'     => '_price',
		'value'   => array( $min_price, $max_price ),
		'type'    => 'NUMERIC',
		'compare' => 'BETWEEN',
	);
} elseif ( $min_price > 0 && ( $max_price <= 0 ) ) {
	$meta_query[] = array(
		'key'     => '_price',
		'value'   => $min_price,
		'type'    => 'NUMERIC',
		'compare' => '>=',
	);
} elseif ( $max_price > 0 && $min_price <= 0 ) {
	$meta_query[] = array(
		'key'     => '_price',
		'value'   => $max_price,
		'type'    => 'NUMERIC',
		'compare' => '<=',
	);
}

if ( ! empty( $meta_query ) ) {
	$query_args['meta_query'] = $meta_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
}

$product_query = new WP_Query( $query_args );

if ( ! $product_query->have_posts() ) {
	return $render_empty();
}

$total_slides = (int) $product_query->post_count;
$page_count   = (int) ceil( $total_slides / $columns );
$image_size   = 'woocommerce_thumbnail';
$extra_class  = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id      = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$modifier_classes = '';

if ( 'default' !== $card_style ) {
	$modifier_classes .= ' bw-woo-product-carousel--card-' . $card_style;
}

if ( 'default' !== $button_style ) {
	$modifier_classes .= ' bw-woo-product-carousel--btn-' . $button_style;
}

if ( $hover_swap ) {
	$modifier_classes .= ' bw-woo-product-carousel--hover-swap';
}

$inline_style = '';

if ( $columns_tablet > 0 ) {
	$inline_style .= '--bw-woo-product-carousel-columns-tablet:' . $columns_tablet . ';';
}

if ( $columns_mobile > 0 ) {
	$inline_style .= '--bw-woo-product-carousel-columns-mobile:' . $columns_mobile . ';';
}

if ( '' !== $ratio_map[ $image_ratio ] ) {
	$inline_style .= '--bw-woo-product-carousel-ratio:' . $ratio_map[ $image_ratio ] . ';';
}

$responsive_columns = $columns_tablet > 0 || $columns_mobile > 0;

$extra_attributes = array(
	'class' => trim( 'bw-woo-product-carousel bw-woo-product-carousel--cols-' . $columns . $modifier_classes . ' ' . $extra_class ),
	'role'  => 'region',
	'aria-roledescription' => __( 'carousel', 'kriti-blocks' ),
	'aria-label' => __( 'Product carousel', 'kriti-blocks' ),
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
<div
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	data-columns="<?php echo esc_attr( $columns ); ?>"
	data-autoplay="<?php echo esc_attr( $autoplay ? 'true' : 'false' ); ?>"
	data-interval="<?php echo esc_attr( $interval ); ?>"
	<?php echo $loop ? 'data-loop="true"' : ''; ?>
	<?php echo $pause_hover ? '' : 'data-pause-hover="false"'; ?>
>
	<div class="bw-woo-product-carousel__viewport">
		<ul class="bw-woo-product-carousel__track">
			<?php
			$slide_index = 0;

			while ( $product_query->have_posts() ) :
				$product_query->the_post();

				$product = wc_get_product( get_the_ID() );

				if ( ! $product instanceof WC_Product ) {
					continue;
				}

				++$slide_index;
				?>
				<li
					class="bw-woo-product-carousel__slide"
					role="group"
					aria-roledescription="<?php esc_attr_e( 'slide', 'kriti-blocks' ); ?>"
					aria-label="<?php
						/* translators: 1: slide number, 2: total slides. */
						echo esc_attr( sprintf( __( '%1$d of %2$d', 'kriti-blocks' ), $slide_index, $total_slides ) );
					?>"
				>
					<article class="bw-woo-product-carousel__card">
						<?php if ( $show_image ) : ?>
							<div class="bw-woo-product-carousel__media">
								<a href="<?php echo esc_url( $product->get_permalink() ); ?>">
									<?php echo wp_kses_post( $product->get_image( $image_size, array( 'loading' => 'lazy' ) ) ); ?>
									<?php
									if ( $hover_swap ) {
										$gallery_ids = $product->get_gallery_image_ids();

										if ( ! empty( $gallery_ids ) ) {
											echo wp_get_attachment_image(
												absint( $gallery_ids[0] ),
												$image_size,
												false,
												array(
													'class'       => 'bw-woo-product-carousel__hover-image',
													'alt'         => '',
													'aria-hidden' => 'true',
													'loading'     => 'lazy',
												)
											);
										}
									}
									?>
								</a>

								<?php if ( $show_sale_badge && $product->is_on_sale() ) : ?>
									<span class="bw-woo-product-carousel__badge"><?php esc_html_e( 'Sale', 'kriti-blocks' ); ?></span>
								<?php endif; ?>
							</div>
						<?php endif; ?>

						<div class="bw-woo-product-carousel__body">
							<?php if ( $show_category ) : ?>
								<div class="bw-woo-product-carousel__terms">
									<?php echo wp_kses_post( wc_get_product_category_list( $product->get_id(), ', ' ) ); ?>
								</div>
							<?php endif; ?>

							<?php if ( $show_title ) : ?>
								<h3 class="bw-woo-product-carousel__title">
									<a href="<?php echo esc_url( $product->get_permalink() ); ?>">
										<?php echo esc_html( $product->get_name() ); ?>
									</a>
								</h3>
							<?php endif; ?>

							<?php if ( $show_rating && function_exists( 'wc_get_rating_html' ) ) : ?>
								<?php echo wp_kses_post( wc_get_rating_html( $product->get_average_rating() ) ); ?>
							<?php endif; ?>

							<?php if ( $show_price ) : ?>
								<div class="bw-woo-product-carousel__price">
									<?php echo wp_kses_post( $product->get_price_html() ); ?>
								</div>
							<?php endif; ?>

							<?php if ( $show_cart && $product->is_purchasable() && $product->is_in_stock() ) : ?>
								<a
									href="<?php echo esc_url( $product->add_to_cart_url() ); ?>"
									data-quantity="1"
									data-product_id="<?php echo esc_attr( $product->get_id() ); ?>"
									data-product_sku="<?php echo esc_attr( $product->get_sku() ); ?>"
									class="<?php echo esc_attr( 'bw-woo-product-carousel__cart button ' . ( $product->is_type( 'simple' ) ? 'ajax_add_to_cart add_to_cart_button' : '' ) ); ?>"
									rel="nofollow"
								>
									<?php echo esc_html( $product->add_to_cart_text() ); ?>
								</a>
							<?php endif; ?>
						</div>
					</article>
				</li>
				<?php
			endwhile;
			?>
		</ul>
	</div>

	<?php if ( $show_arrow && ( $page_count > 1 || ( $responsive_columns && $total_slides > 1 ) ) ) : ?>
		<button
			type="button"
			class="bw-woo-product-carousel__arrow bw-woo-product-carousel__arrow--prev"
			aria-label="<?php esc_attr_e( 'Previous slide', 'kriti-blocks' ); ?>"
		>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
				<path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor" />
			</svg>
		</button>

		<button
			type="button"
			class="bw-woo-product-carousel__arrow bw-woo-product-carousel__arrow--next"
			aria-label="<?php esc_attr_e( 'Next slide', 'kriti-blocks' ); ?>"
		>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
				<path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor" />
			</svg>
		</button>
	<?php endif; ?>

	<?php if ( $show_dots && ( $page_count > 1 || ( $responsive_columns && $total_slides > 1 ) ) ) : ?>
		<ul class="bw-woo-product-carousel__dots">
			<?php for ( $page = 1; $page <= max( $page_count, 1 ); ++$page ) : ?>
				<li>
					<button
						type="button"
						class="bw-woo-product-carousel__dot"
						aria-label="<?php
							/* translators: %d: page number. */
							echo esc_attr( sprintf( __( 'Go to page %d', 'kriti-blocks' ), $page ) );
						?>"
					></button>
				</li>
			<?php endfor; ?>
		</ul>
	<?php endif; ?>
</div>
<?php
wp_reset_postdata();

return ob_get_clean();
