<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Product Grid block.
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
$layout   = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'grid';
$layout   = in_array( $layout, array( 'grid', 'list' ), true ) ? $layout : 'grid';
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

/*
 * "Load more" and the filter bar. They only work for a grid with an id, on a
 * real post, because the REST endpoint finds the block again through both.
 */
$shop            = \Kriti_Blocks\Shop::override();
$shop_filters    = $shop ? $shop['filters'] : array();
$shop_page       = $shop ? max( 1, (int) $shop['page'] ) : 1;
$load_more       = ! empty( $attributes['loadMore'] );
$filter_controls = \Kriti_Blocks\Shop::controls( $attributes );
$grid_id         = isset( $attributes['gridId'] ) ? (string) $attributes['gridId'] : '';
$quick_view      = ! empty( $attributes['quickView'] );
$wishlist        = ! empty( $attributes['wishlist'] );
$shop_on         = ( $load_more || ! empty( $filter_controls ) ) && \Kriti_Blocks\Shop::valid_id( $grid_id ) && get_the_ID();

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
		'class' => trim( 'bw-woo-product-grid bw-woo-product-grid--empty ' . $empty_class ),
	);

	if ( ! empty( $attributes['htmlId'] ) ) {
		$empty_args['id'] = (string) $attributes['htmlId'];
	}

	return sprintf(
		'<div %1$s><p class="bw-woo-product-grid__empty">%2$s</p></div>',
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

if ( $shop_on ) {
	$query_args['no_found_rows'] = false;

	if ( $shop_page > 1 ) {
		$query_args['offset'] = $offset + ( $shop_page - 1 ) * $per_page;
	}

	// The visitor's choices narrow the block's own settings. They never widen them.
	if ( ! empty( $shop_filters['q'] ) ) {
		$query_args['s'] = $shop_filters['q'];
	}

	if ( ! empty( $shop_filters['orderby'] ) ) {
		unset( $query_args['meta_key'] );

		switch ( $shop_filters['orderby'] ) {
			case 'price':
			case 'price-desc':
				$query_args['meta_key'] = '_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$query_args['orderby']  = 'meta_value_num';
				$query_args['order']    = 'price' === $shop_filters['orderby'] ? 'ASC' : 'DESC';
				break;
			case 'popularity':
				$query_args['meta_key'] = 'total_sales'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$query_args['orderby']  = 'meta_value_num';
				$query_args['order']    = 'DESC';
				break;
			case 'rating':
				$query_args['meta_key'] = '_wc_average_rating'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				$query_args['orderby']  = 'meta_value_num';
				$query_args['order']    = 'DESC';
				break;
			case 'title':
				$query_args['orderby'] = 'title';
				$query_args['order']   = 'ASC';
				break;
			default:
				$query_args['orderby'] = 'date';
				$query_args['order']   = 'DESC';
				break;
		}
	}

	if ( ! empty( $shop_filters['cat'] ) ) {
		$tax_query = isset( $query_args['tax_query'] ) ? $query_args['tax_query'] : array();
		unset( $tax_query['relation'] );

		$tax_query[] = array(
			'taxonomy' => 'product_cat',
			'field'    => 'term_id',
			'terms'    => array( (int) $shop_filters['cat'] ),
		);

		if ( count( $tax_query ) > 1 ) {
			$tax_query['relation'] = 'AND';
		}

		$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
	}

	$extra_meta = isset( $query_args['meta_query'] ) ? $query_args['meta_query'] : array();

	if ( ! empty( $shop_filters['stock'] ) ) {
		$extra_meta[] = array(
			'key'   => '_stock_status',
			'value' => 'instock',
		);
	}

	if ( ! empty( $shop_filters['min'] ) ) {
		$extra_meta[] = array(
			'key'     => '_price',
			'value'   => (float) $shop_filters['min'],
			'type'    => 'NUMERIC',
			'compare' => '>=',
		);
	}

	if ( ! empty( $shop_filters['max'] ) ) {
		$extra_meta[] = array(
			'key'     => '_price',
			'value'   => (float) $shop_filters['max'],
			'type'    => 'NUMERIC',
			'compare' => '<=',
		);
	}

	if ( ! empty( $extra_meta ) ) {
		$query_args['meta_query'] = $extra_meta; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
	}
}

$product_query = new WP_Query( $query_args );

if ( ! $product_query->have_posts() ) {
	return $render_empty();
}

$image_size  = 'woocommerce_thumbnail';
$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$modifier_classes = '';

if ( 'default' !== $card_style ) {
	$modifier_classes .= ' bw-woo-product-grid--card-' . $card_style;
}

if ( 'default' !== $button_style ) {
	$modifier_classes .= ' bw-woo-product-grid--btn-' . $button_style;
}

if ( $hover_swap ) {
	$modifier_classes .= ' bw-woo-product-grid--hover-swap';
}

$inline_style = '--bw-woo-product-grid-columns:' . $columns . ';';

if ( $columns_tablet > 0 ) {
	$inline_style .= '--bw-woo-product-grid-columns-tablet:' . $columns_tablet . ';';
}

if ( $columns_mobile > 0 ) {
	$inline_style .= '--bw-woo-product-grid-columns-mobile:' . $columns_mobile . ';';
}

if ( '' !== $ratio_map[ $image_ratio ] ) {
	$inline_style .= '--bw-woo-product-grid-ratio:' . $ratio_map[ $image_ratio ] . ';';
}

$extra_attributes = array(
	'class' => trim( 'bw-woo-product-grid bw-woo-product-grid--' . $layout . ' bw-woo-product-grid--cols-' . $columns . $modifier_classes . ' ' . $extra_class ),
	'style' => $inline_style,
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

if ( $wishlist ) {
	// Logged-in visitors also keep their wishlist on their account.
	$extra_attributes = array_merge( $extra_attributes, \Kriti_Blocks\Wishlist::account_attributes() );
}

if ( $quick_view || $wishlist ) {
	$extra_attributes['class']            .= ' bw-woo-product-grid--cards';
	$extra_attributes['data-kb-card']      = '1';
	$extra_attributes['data-card-endpoint'] = esc_url_raw( rest_url( \Kriti_Blocks\Shop::NAMESPACE . \Kriti_Blocks\Shop::CARD_ROUTE ) );
	$extra_attributes['data-cart-endpoint'] = esc_url_raw( \WC_AJAX::get_endpoint( 'add_to_cart' ) );
	$extra_attributes['data-i18n']          = wp_json_encode(
		array(
			'close'       => __( 'Close', 'kriti-blocks' ),
			'addToCart'   => __( 'Add to cart', 'kriti-blocks' ),
			'added'       => __( 'Added to cart.', 'kriti-blocks' ),
			'viewCart'    => __( 'View cart', 'kriti-blocks' ),
			'view'        => __( 'View product', 'kriti-blocks' ),
			'outOfStock'  => __( 'Out of stock', 'kriti-blocks' ),
			'choose'      => __( 'Choose an option', 'kriti-blocks' ),
			'unavailable' => __( 'This combination is not available.', 'kriti-blocks' ),
			'quantity'    => __( 'Quantity', 'kriti-blocks' ),
			/* translators: %d: the most that can be bought at once. */
			'limit'       => __( 'Up to %d per order', 'kriti-blocks' ),
			'error'       => __( 'Could not load the product.', 'kriti-blocks' ),
			'cartError'   => __( 'Could not add the product to the cart.', 'kriti-blocks' ),
			'wishAdd'     => __( 'Add to wishlist', 'kriti-blocks' ),
			'wishRemove'  => __( 'Remove from wishlist', 'kriti-blocks' ),
		)
	);
	$extra_attributes['data-cart-url'] = function_exists( 'wc_get_cart_url' ) ? esc_url_raw( wc_get_cart_url() ) : '';
}

if ( $shop_on ) {
	$extra_attributes['class']        .= ' bw-woo-product-grid--shop';
	$extra_attributes['data-kb-shop']  = $grid_id;
	$extra_attributes['data-post']     = (string) get_the_ID();
	$extra_attributes['data-endpoint'] = esc_url_raw( rest_url( \Kriti_Blocks\Shop::NAMESPACE . \Kriti_Blocks\Shop::ROUTE ) );
	$extra_attributes['data-page']     = (string) $shop_page;
	$extra_attributes['data-pages']    = (string) (int) $product_query->max_num_pages;
	$extra_attributes['data-empty']    = '' !== $empty_message ? $empty_message : __( 'No products found.', 'kriti-blocks' );

	if ( $load_more ) {
		$extra_attributes['data-more-label'] = ! empty( $attributes['loadMoreLabel'] ) ? sanitize_text_field( (string) $attributes['loadMoreLabel'] ) : __( 'Load more', 'kriti-blocks' );
	}
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $shop_on && ! empty( $filter_controls ) ) : ?>
		<?php
		$bar_categories = in_array( 'category', $filter_controls, true )
			? get_terms(
				array(
					'taxonomy'   => 'product_cat',
					'hide_empty' => true,
					'number'     => 100,
				)
			)
			: array();
		$bar_categories = is_wp_error( $bar_categories ) ? array() : $bar_categories;
		?>
		<form class="bw-woo-product-grid__bar" role="search" aria-label="<?php esc_attr_e( 'Filter products', 'kriti-blocks' ); ?>">
			<?php if ( in_array( 'search', $filter_controls, true ) ) : ?>
				<label class="bw-woo-product-grid__field">
					<span><?php esc_html_e( 'Search', 'kriti-blocks' ); ?></span>
					<input type="search" name="q" maxlength="60" autocomplete="off">
				</label>
			<?php endif; ?>
			<?php if ( in_array( 'category', $filter_controls, true ) && ! empty( $bar_categories ) ) : ?>
				<label class="bw-woo-product-grid__field">
					<span><?php esc_html_e( 'Category', 'kriti-blocks' ); ?></span>
					<select name="cat">
						<option value=""><?php esc_html_e( 'All categories', 'kriti-blocks' ); ?></option>
						<?php foreach ( $bar_categories as $bar_category ) : ?>
							<option value="<?php echo esc_attr( $bar_category->term_id ); ?>"><?php echo esc_html( $bar_category->name ); ?></option>
						<?php endforeach; ?>
					</select>
				</label>
			<?php endif; ?>
			<?php if ( in_array( 'sort', $filter_controls, true ) ) : ?>
				<label class="bw-woo-product-grid__field">
					<span><?php esc_html_e( 'Sort by', 'kriti-blocks' ); ?></span>
					<select name="orderby">
						<option value=""><?php esc_html_e( 'Default', 'kriti-blocks' ); ?></option>
						<option value="date"><?php esc_html_e( 'Newest', 'kriti-blocks' ); ?></option>
						<option value="price"><?php esc_html_e( 'Price: low to high', 'kriti-blocks' ); ?></option>
						<option value="price-desc"><?php esc_html_e( 'Price: high to low', 'kriti-blocks' ); ?></option>
						<option value="popularity"><?php esc_html_e( 'Popularity', 'kriti-blocks' ); ?></option>
						<option value="rating"><?php esc_html_e( 'Rating', 'kriti-blocks' ); ?></option>
						<option value="title"><?php esc_html_e( 'Name', 'kriti-blocks' ); ?></option>
					</select>
				</label>
			<?php endif; ?>
			<?php if ( in_array( 'price', $filter_controls, true ) ) : ?>
				<label class="bw-woo-product-grid__field bw-woo-product-grid__field--price">
					<span><?php esc_html_e( 'Min price', 'kriti-blocks' ); ?></span>
					<input type="number" name="min" min="0" step="any" inputmode="decimal">
				</label>
				<label class="bw-woo-product-grid__field bw-woo-product-grid__field--price">
					<span><?php esc_html_e( 'Max price', 'kriti-blocks' ); ?></span>
					<input type="number" name="max" min="0" step="any" inputmode="decimal">
				</label>
			<?php endif; ?>
			<?php if ( in_array( 'stock', $filter_controls, true ) ) : ?>
				<label class="bw-woo-product-grid__field bw-woo-product-grid__field--check">
					<input type="checkbox" name="stock" value="1">
					<span><?php esc_html_e( 'In stock only', 'kriti-blocks' ); ?></span>
				</label>
			<?php endif; ?>
		</form>
	<?php endif; ?>
	<?php if ( $shop_on ) : ?>
		<p class="bw-woo-product-grid__status" role="status" aria-live="polite"></p>
	<?php endif; ?>
	<ul class="bw-woo-product-grid__items">
		<?php
		while ( $product_query->have_posts() ) :
			$product_query->the_post();

			$product = wc_get_product( get_the_ID() );

			if ( ! $product instanceof WC_Product ) {
				continue;
			}
			?>
			<li class="bw-woo-product-grid__item">
				<?php if ( $show_image ) : ?>
					<div class="bw-woo-product-grid__media">
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
											'class'       => 'bw-woo-product-grid__hover-image',
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
							<span class="bw-woo-product-grid__badge"><?php esc_html_e( 'Sale', 'kriti-blocks' ); ?></span>
						<?php endif; ?>
					</div>
				<?php endif; ?>

				<div class="bw-woo-product-grid__body">
					<?php if ( $show_category ) : ?>
						<div class="bw-woo-product-grid__terms">
							<?php echo wp_kses_post( wc_get_product_category_list( $product->get_id(), ', ' ) ); ?>
						</div>
					<?php endif; ?>

					<?php if ( $show_title ) : ?>
						<h3 class="bw-woo-product-grid__title">
							<a href="<?php echo esc_url( $product->get_permalink() ); ?>">
								<?php echo esc_html( $product->get_name() ); ?>
							</a>
						</h3>
					<?php endif; ?>

					<?php if ( $show_rating && function_exists( 'wc_get_rating_html' ) ) : ?>
						<?php echo wp_kses_post( wc_get_rating_html( $product->get_average_rating() ) ); ?>
					<?php endif; ?>

					<?php if ( $show_price ) : ?>
						<div class="bw-woo-product-grid__price">
							<?php echo wp_kses_post( $product->get_price_html() ); ?>
						</div>
					<?php endif; ?>

					<?php if ( $show_cart && $product->is_purchasable() && $product->is_in_stock() ) : ?>
						<a
							href="<?php echo esc_url( $product->add_to_cart_url() ); ?>"
							data-quantity="1"
							data-product_id="<?php echo esc_attr( $product->get_id() ); ?>"
							data-product_sku="<?php echo esc_attr( $product->get_sku() ); ?>"
							class="<?php echo esc_attr( 'bw-woo-product-grid__cart button ' . ( $product->is_type( 'simple' ) ? 'ajax_add_to_cart add_to_cart_button' : '' ) ); ?>"
							rel="nofollow"
						>
							<?php echo esc_html( $product->add_to_cart_text() ); ?>
						</a>
					<?php endif; ?>
				</div>

				<?php if ( $quick_view || $wishlist ) : ?>
					<div class="bw-woo-product-grid__actions">
						<?php if ( $wishlist ) : ?>
							<button type="button" class="bw-woo-product-grid__heart" data-product="<?php echo esc_attr( $product->get_id() ); ?>" aria-pressed="false" aria-label="<?php esc_attr_e( 'Add to wishlist', 'kriti-blocks' ); ?>">
								<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>
							</button>
						<?php endif; ?>
						<?php if ( $quick_view ) : ?>
							<button type="button" class="bw-woo-product-grid__quick" data-product="<?php echo esc_attr( $product->get_id() ); ?>" aria-haspopup="dialog">
								<?php esc_html_e( 'Quick view', 'kriti-blocks' ); ?>
							</button>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</li>
			<?php
		endwhile;
		?>
	</ul>
	<?php if ( $shop_on && $load_more && (int) $product_query->max_num_pages > $shop_page ) : ?>
		<button type="button" class="bw-woo-product-grid__more">
			<?php echo esc_html( ! empty( $attributes['loadMoreLabel'] ) ? sanitize_text_field( (string) $attributes['loadMoreLabel'] ) : __( 'Load more', 'kriti-blocks' ) ); ?>
		</button>
	<?php endif; ?>
</div>
<?php
wp_reset_postdata();

return ob_get_clean();
