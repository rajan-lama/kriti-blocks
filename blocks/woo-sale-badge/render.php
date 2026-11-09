<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Sale Badge block.
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
	$product_id = absint( wp_unslash( $_GET['post_id'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
} elseif ( get_the_ID() ) {
	$product_id = absint( get_the_ID() );
}

$product   = $product_id ? wc_get_product( $product_id ) : false;
$is_sample = false;

if ( ! $product instanceof WC_Product ) {
	if ( ! $is_preview ) {
		return '';
	}

	$is_sample = true;
}

$badge_type = isset( $attributes['badgeType'] ) ? sanitize_key( $attributes['badgeType'] ) : 'sale';
$badge_type = in_array( $badge_type, array( 'sale', 'new', 'outofstock', 'lowstock' ), true ) ? $badge_type : 'sale';

if ( $product instanceof WC_Product ) {
	switch ( $badge_type ) {
		case 'new':
			$new_days = isset( $attributes['newDays'] ) ? absint( $attributes['newDays'] ) : 30;
			$new_days = min( max( $new_days, 1 ), 365 );
			$created  = $product->get_date_created();

			if ( ! $created || $created->getTimestamp() < time() - ( $new_days * DAY_IN_SECONDS ) ) {
				return '';
			}
			break;
		case 'outofstock':
			if ( $product->is_in_stock() ) {
				return '';
			}
			break;
		case 'lowstock':
			$low_threshold = (int) get_option( 'woocommerce_notify_low_stock_amount', 2 );
			$stock_qty     = $product->get_stock_quantity();

			if ( ! $product->managing_stock() || ! $product->is_in_stock() || null === $stock_qty || $stock_qty > max( $low_threshold, 1 ) ) {
				return '';
			}
			break;
		default:
			if ( ! $product->is_on_sale() ) {
				return '';
			}
			break;
	}
}

$text            = isset( $attributes['text'] ) ? sanitize_text_field( (string) $attributes['text'] ) : '';
$show_percentage = ! empty( $attributes['showPercentage'] );

if ( 'sale' === $badge_type && $show_percentage && $product instanceof WC_Product ) {
	if ( $product->is_type( 'variable' ) ) {
		$regular_price = (float) $product->get_variation_regular_price( 'min', true );
		$sale_price    = (float) $product->get_variation_sale_price( 'min', true );
	} else {
		$regular_price = (float) $product->get_regular_price();
		$sale_price    = (float) $product->get_sale_price();
	}

	if ( $regular_price > 0 && $sale_price > 0 && $sale_price < $regular_price ) {
		$percentage = (int) round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 );

		$text = sprintf(
			/* translators: %d: discount percentage. */
			__( '%d%% off', 'kriti-blocks' ),
			$percentage
		);
	}
}

if ( '' === $text ) {
	$default_labels = array(
		'sale'       => __( 'Sale', 'kriti-blocks' ),
		'new'        => __( 'New', 'kriti-blocks' ),
		'outofstock' => __( 'Out of stock', 'kriti-blocks' ),
		'lowstock'   => __( 'Low stock', 'kriti-blocks' ),
	);
	$text           = $default_labels[ $badge_type ];
}

$position = isset( $attributes['position'] ) ? sanitize_key( $attributes['position'] ) : 'none';
$position = in_array( $position, array( 'none', 'top-left', 'top-right', 'bottom-left', 'bottom-right' ), true ) ? $position : 'none';
$shape    = isset( $attributes['shape'] ) ? sanitize_key( $attributes['shape'] ) : 'default';
$shape    = in_array( $shape, array( 'default', 'square', 'circle', 'ribbon' ), true ) ? $shape : 'default';
$offset   = isset( $attributes['offset'] ) ? absint( $attributes['offset'] ) : 10;
$offset   = min( $offset, 100 );

$font_size     = isset( $attributes['fontSize'] ) ? absint( $attributes['fontSize'] ) : 0;
$font_size     = min( $font_size, 120 );
$border_radius = isset( $attributes['borderRadius'] ) ? absint( $attributes['borderRadius'] ) : 999;
$border_radius = min( $border_radius, 999 );
$badge_color   = isset( $attributes['badgeColor'] ) ? sanitize_hex_color( (string) $attributes['badgeColor'] ) : '';
$text_color    = isset( $attributes['textColor'] ) ? sanitize_hex_color( (string) $attributes['textColor'] ) : '';
$extra_class   = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id       = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$styles = array();

if ( 'default' === $shape ) {
	$styles[] = 'border-radius:' . $border_radius . 'px';
}

if ( $font_size > 0 ) {
	$styles[] = 'font-size:' . $font_size . 'px';
}

if ( $badge_color ) {
	$styles[] = 'background-color:' . $badge_color;
}

if ( $text_color ) {
	$styles[] = 'color:' . $text_color;
}

$classes = 'bw-woo-sale-badge';

if ( $is_sample ) {
	$classes .= ' bw-woo-sale-badge--preview';
}

if ( 'sale' !== $badge_type ) {
	$classes .= ' bw-woo-sale-badge--' . $badge_type;
}

if ( 'default' !== $shape ) {
	$classes .= ' bw-woo-sale-badge--shape-' . $shape;
}

if ( 'none' !== $position ) {
	$classes .= ' bw-woo-sale-badge--overlay bw-woo-sale-badge--' . $position;
}

if ( '' !== $extra_class ) {
	$classes .= ' ' . $extra_class;
}

$extra_attributes = array(
	'class' => trim( $classes ),
);

if ( 'none' !== $position ) {
	$extra_attributes['style'] = '--bw-woo-sale-badge-offset:' . $offset . 'px;';
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );
$style_attribute    = empty( $styles ) ? '' : implode( ';', $styles ) . ';';

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<span class="bw-woo-sale-badge__text"<?php echo '' !== $style_attribute ? ' style="' . esc_attr( $style_attribute ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<?php echo esc_html( $text ); ?>
	</span>
</div>
<?php
return ob_get_clean();
