<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Product Filters block.
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

if ( ! class_exists( 'WooCommerce' ) || ! taxonomy_exists( 'product_cat' ) ) {
	return '';
}

$show_categories = ! isset( $attributes['showCategories'] ) || (bool) $attributes['showCategories'];
$show_price      = ! isset( $attributes['showPrice'] ) || (bool) $attributes['showPrice'];
$show_counts     = isset( $attributes['showCounts'] ) && (bool) $attributes['showCounts'];

$filters_title = isset( $attributes['title'] ) ? trim( (string) $attributes['title'] ) : '';

$category_limit = isset( $attributes['categoryLimit'] ) ? absint( $attributes['categoryLimit'] ) : 8;
if ( $category_limit < 1 || $category_limit > 50 ) {
	$category_limit = 8;
}

$price_min = isset( $attributes['priceMin'] ) ? (float) $attributes['priceMin'] : 0;
$price_max = isset( $attributes['priceMax'] ) ? (float) $attributes['priceMax'] : 0;

$button_text = isset( $attributes['buttonText'] ) ? trim( (string) $attributes['buttonText'] ) : '';
if ( '' === $button_text ) {
	$button_text = __( 'Filter', 'kriti-blocks' );
}

$attribute_slugs = array();

if ( ! empty( $attributes['attributeSlugs'] ) && is_array( $attributes['attributeSlugs'] ) && function_exists( 'wc_get_attribute_taxonomies' ) && function_exists( 'wc_attribute_taxonomy_name' ) ) {
	$known_attributes = wp_list_pluck( wc_get_attribute_taxonomies(), 'attribute_name' );

	foreach ( array_slice( array_filter( $attributes['attributeSlugs'], 'is_scalar' ), 0, 5 ) as $attribute_slug ) {
		$attribute_slug = sanitize_title( (string) $attribute_slug );

		if ( '' !== $attribute_slug && in_array( $attribute_slug, $known_attributes, true ) && taxonomy_exists( wc_attribute_taxonomy_name( $attribute_slug ) ) ) {
			$attribute_slugs[ $attribute_slug ] = wc_attribute_taxonomy_name( $attribute_slug );
		}
	}
}

$attribute_term_limit = isset( $attributes['attributeTermLimit'] ) ? absint( $attributes['attributeTermLimit'] ) : 12;
$attribute_term_limit = ( $attribute_term_limit < 1 || $attribute_term_limit > 50 ) ? 12 : $attribute_term_limit;
$show_rating          = ! empty( $attributes['showRating'] );
$collapsible          = ! empty( $attributes['collapsible'] );
$start_collapsed      = $collapsible && ! empty( $attributes['startCollapsed'] );
$show_active          = ! empty( $attributes['showActiveFilters'] );
$show_clear           = ! isset( $attributes['showClearAll'] ) || (bool) $attributes['showClearAll'];

$shop_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );

$current_term_id = 0;
if ( is_tax( 'product_cat' ) ) {
	$queried_object = get_queried_object();
	if ( $queried_object instanceof WP_Term ) {
		$current_term_id = (int) $queried_object->term_id;
	}
}

$terms = array();
if ( $show_categories ) {
	$terms = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'number'     => $category_limit,
			'orderby'    => 'name',
			'order'      => 'ASC',
		)
	);

	if ( is_wp_error( $terms ) ) {
		$terms = array();
	}
}

/*
 * Current filter state, read from the same query vars WooCommerce itself uses
 * for classic shop filtering (filter_{attribute}, rating_filter, min_price,
 * max_price). Everything is sanitized before use.
 */
$current_attr_terms = array();

foreach ( array_keys( $attribute_slugs ) as $attribute_slug ) {
	$current_attr_terms[ $attribute_slug ] = array();

	if ( isset( $_GET[ 'filter_' . $attribute_slug ] ) && is_string( $_GET[ 'filter_' . $attribute_slug ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$raw_terms = explode( ',', wp_unslash( $_GET[ 'filter_' . $attribute_slug ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		$current_attr_terms[ $attribute_slug ] = array_slice( array_values( array_unique( array_filter( array_map( 'sanitize_title', $raw_terms ) ) ) ), 0, 50 );
	}
}

$current_rating = '';

if ( isset( $_GET['rating_filter'] ) && is_string( $_GET['rating_filter'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$rating_values  = array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['rating_filter'] ) ) ) ), static function ( $value ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return $value >= 1 && $value <= 5;
	} );
	$current_rating = implode( ',', array_unique( $rating_values ) );
}

$current_min = isset( $_GET['min_price'] ) && is_scalar( $_GET['min_price'] ) && is_numeric( sanitize_text_field( wp_unslash( $_GET['min_price'] ) ) ) ? max( 0, (float) sanitize_text_field( wp_unslash( $_GET['min_price'] ) ) ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$current_max = isset( $_GET['max_price'] ) && is_scalar( $_GET['max_price'] ) && is_numeric( sanitize_text_field( wp_unslash( $_GET['max_price'] ) ) ) ? max( 0, (float) sanitize_text_field( wp_unslash( $_GET['max_price'] ) ) ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

/*
 * Builds a link that keeps the current filters and applies $changes
 * (a null value removes a parameter).
 */
$filter_url = static function ( array $changes ) use ( $shop_url, $current_attr_terms, $current_rating, $current_min, $current_max ) {
	$params = array();

	foreach ( $current_attr_terms as $attr_slug => $attr_terms ) {
		if ( ! empty( $attr_terms ) ) {
			$params[ 'filter_' . $attr_slug ]     = implode( ',', $attr_terms );
			$params[ 'query_type_' . $attr_slug ] = 'or';
		}
	}

	if ( '' !== $current_rating ) {
		$params['rating_filter'] = $current_rating;
	}

	if ( $current_min > 0 ) {
		$params['min_price'] = $current_min;
	}

	if ( $current_max > 0 ) {
		$params['max_price'] = $current_max;
	}

	foreach ( $changes as $key => $value ) {
		if ( null === $value || '' === $value ) {
			unset( $params[ $key ] );
		} else {
			$params[ $key ] = $value;
		}
	}

	return add_query_arg( array_map( 'strval', $params ), $shop_url );
};

$active_filters = array();

if ( $show_active ) {
	foreach ( $attribute_slugs as $attribute_slug => $attribute_taxonomy ) {
		foreach ( $current_attr_terms[ $attribute_slug ] as $term_slug ) {
			$active_term = get_term_by( 'slug', $term_slug, $attribute_taxonomy );

			if ( ! $active_term instanceof WP_Term ) {
				continue;
			}

			$remaining = array_values( array_diff( $current_attr_terms[ $attribute_slug ], array( $term_slug ) ) );

			$active_filters[] = array(
				'label' => wc_attribute_label( $attribute_taxonomy ) . ': ' . $active_term->name,
				'url'   => $filter_url(
					array(
						'filter_' . $attribute_slug     => implode( ',', $remaining ),
						'query_type_' . $attribute_slug => empty( $remaining ) ? null : 'or',
					)
				),
			);
		}
	}

	if ( '' !== $current_rating ) {
		$active_filters[] = array(
			'label' => __( 'Rating', 'kriti-blocks' ) . ': ' . $current_rating,
			'url'   => $filter_url( array( 'rating_filter' => null ) ),
		);
	}

	if ( $current_min > 0 || $current_max > 0 ) {
		$active_filters[] = array(
			'label' => __( 'Price', 'kriti-blocks' ) . ': ' . ( $current_min > 0 ? $current_min : '0' ) . ( $current_max > 0 ? ' - ' . $current_max : '+' ),
			'url'   => $filter_url(
				array(
					'min_price' => null,
					'max_price' => null,
				)
			),
		);
	}
}

/*
 * Group wrapper. Plain groups keep the original markup; collapsible groups use
 * native details/summary so they work without JavaScript.
 */
$group_start = static function ( $group_title ) use ( $collapsible, $start_collapsed ) {
	if ( $collapsible ) {
		return '<details class="bw-woo-product-filters__group bw-woo-product-filters__group--collapsible"' . ( $start_collapsed ? '' : ' open' ) . '><summary class="bw-woo-product-filters__group-title">' . esc_html( $group_title ) . '</summary>';
	}

	return '<div class="bw-woo-product-filters__group"><span class="bw-woo-product-filters__group-title">' . esc_html( $group_title ) . '</span>';
};
$group_end   = $collapsible ? '</details>' : '</div>';

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$extra_attributes = array(
	'class' => trim( 'bw-woo-product-filters ' . $extra_class ),
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

$has_terms = $show_categories && ! empty( $terms );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( '' !== $filters_title ) : ?>
		<h2 class="bw-woo-product-filters__title"><?php echo esc_html( $filters_title ); ?></h2>
	<?php endif; ?>

	<?php if ( ! empty( $active_filters ) ) : ?>
		<ul class="bw-woo-product-filters__active" aria-label="<?php esc_attr_e( 'Active filters', 'kriti-blocks' ); ?>">
			<?php foreach ( $active_filters as $active_filter ) : ?>
				<li class="bw-woo-product-filters__chip">
					<a class="bw-woo-product-filters__chip-link" href="<?php echo esc_url( $active_filter['url'] ); ?>">
						<span><?php echo esc_html( $active_filter['label'] ); ?></span>
						<span class="screen-reader-text"><?php esc_html_e( 'Remove filter', 'kriti-blocks' ); ?></span>
						<span aria-hidden="true">&times;</span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php if ( $has_terms ) : ?>
		<?php echo $group_start( __( 'Product categories', 'kriti-blocks' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			<ul class="bw-woo-product-filters__categories">
				<?php foreach ( $terms as $product_term ) : ?>
					<?php
					if ( ! $product_term instanceof WP_Term ) {
						continue;
					}

					$term_link = get_term_link( $product_term );
					if ( is_wp_error( $term_link ) ) {
						continue;
					}

					$is_current = (int) $product_term->term_id === $current_term_id;
					?>
					<li class="bw-woo-product-filters__category">
						<a
							class="bw-woo-product-filters__category-link"
							href="<?php echo esc_url( (string) $term_link ); ?>"
							<?php echo $is_current ? ' aria-current="page"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						>
							<span class="bw-woo-product-filters__category-name"><?php echo esc_html( $product_term->name ); ?></span>
							<?php if ( $show_counts ) : ?>
								<span class="bw-woo-product-filters__category-count"><?php echo esc_html( (string) (int) $product_term->count ); ?></span>
							<?php endif; ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php echo $group_end; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php foreach ( $attribute_slugs as $attribute_slug => $attribute_taxonomy ) : ?>
		<?php
		$attribute_terms = get_terms(
			array(
				'taxonomy'   => $attribute_taxonomy,
				'hide_empty' => true,
				'number'     => $attribute_term_limit,
				'orderby'    => 'name',
				'order'      => 'ASC',
			)
		);

		if ( is_wp_error( $attribute_terms ) || empty( $attribute_terms ) ) {
			continue;
		}

		$selected_terms = $current_attr_terms[ $attribute_slug ];
		?>
		<?php echo $group_start( wc_attribute_label( $attribute_taxonomy ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<ul class="bw-woo-product-filters__categories bw-woo-product-filters__attribute">
				<?php foreach ( $attribute_terms as $attribute_term ) : ?>
					<?php
					if ( ! $attribute_term instanceof WP_Term ) {
						continue;
					}

					$is_selected = in_array( $attribute_term->slug, $selected_terms, true );
					$next_terms  = $is_selected ? array_values( array_diff( $selected_terms, array( $attribute_term->slug ) ) ) : array_merge( $selected_terms, array( $attribute_term->slug ) );
					?>
					<li class="bw-woo-product-filters__category">
						<a
							class="bw-woo-product-filters__category-link"
							href="<?php echo esc_url( $filter_url( array( 'filter_' . $attribute_slug => implode( ',', $next_terms ), 'query_type_' . $attribute_slug => empty( $next_terms ) ? null : 'or' ) ) ); ?>"
							<?php echo $is_selected ? ' aria-current="true"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						>
							<span class="bw-woo-product-filters__category-name"><?php echo esc_html( $attribute_term->name ); ?></span>
							<?php if ( $show_counts ) : ?>
								<span class="bw-woo-product-filters__category-count"><?php echo esc_html( (string) (int) $attribute_term->count ); ?></span>
							<?php endif; ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php echo $group_end; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endforeach; ?>

	<?php if ( $show_rating ) : ?>
		<?php echo $group_start( __( 'Average rating', 'kriti-blocks' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<ul class="bw-woo-product-filters__categories bw-woo-product-filters__rating">
				<?php for ( $stars = 5; $stars >= 1; --$stars ) : ?>
					<?php
					$rating_value = implode( ',', range( $stars, 5 ) );
					$is_selected  = $current_rating === $rating_value;
					?>
					<li class="bw-woo-product-filters__category">
						<a
							class="bw-woo-product-filters__category-link"
							href="<?php echo esc_url( $filter_url( array( 'rating_filter' => $is_selected ? null : $rating_value ) ) ); ?>"
							<?php echo $is_selected ? ' aria-current="true"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						>
							<span class="bw-woo-product-filters__category-name">
								<?php
								echo esc_html(
									5 === $stars
										? __( '5 stars', 'kriti-blocks' )
										/* translators: %d: minimum number of stars. */
										: sprintf( __( '%d stars & up', 'kriti-blocks' ), $stars )
								);
								?>
							</span>
						</a>
					</li>
				<?php endfor; ?>
			</ul>
		<?php echo $group_end; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php if ( $show_price ) : ?>
		<?php $price_id = wp_unique_id( 'bw-woo-product-filters-price-' ); ?>
		<?php echo $group_start( __( 'Filter by price', 'kriti-blocks' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

			<form class="bw-woo-product-filters__price" method="get" action="<?php echo esc_url( $shop_url ); ?>">
				<div class="bw-woo-product-filters__price-fields">
					<label class="screen-reader-text" for="<?php echo esc_attr( $price_id . '-min' ); ?>">
						<?php echo esc_html__( 'Minimum price', 'kriti-blocks' ); ?>
					</label>
					<input
						class="bw-woo-product-filters__price-input"
						id="<?php echo esc_attr( $price_id . '-min' ); ?>"
						type="number"
						name="min_price"
						min="0"
						step="1"
						value="<?php echo esc_attr( $price_min > 0 ? (string) $price_min : '' ); ?>"
						placeholder="<?php echo esc_attr__( 'Min', 'kriti-blocks' ); ?>"
					/>

					<label class="screen-reader-text" for="<?php echo esc_attr( $price_id . '-max' ); ?>">
						<?php echo esc_html__( 'Maximum price', 'kriti-blocks' ); ?>
					</label>
					<input
						class="bw-woo-product-filters__price-input"
						id="<?php echo esc_attr( $price_id . '-max' ); ?>"
						type="number"
						name="max_price"
						min="0"
						step="1"
						value="<?php echo esc_attr( $price_max > 0 ? (string) $price_max : '' ); ?>"
						placeholder="<?php echo esc_attr__( 'Max', 'kriti-blocks' ); ?>"
					/>

					<input type="hidden" name="post_type" value="product" />

					<button class="bw-woo-product-filters__submit" type="submit">
						<?php echo esc_html( $button_text ); ?>
					</button>
				</div>
			</form>
		<?php echo $group_end; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php if ( $show_clear && ( $has_terms || $show_price || ! empty( $attribute_slugs ) || $show_rating ) ) : ?>
		<a class="bw-woo-product-filters__clear" href="<?php echo esc_url( $shop_url ); ?>">
			<?php echo esc_html__( 'Clear filters', 'kriti-blocks' ); ?>
		</a>
	<?php endif; ?>
</div>
<?php
return ob_get_clean();
