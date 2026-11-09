<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Add To Cart block.
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

$product     = $product_id ? wc_get_product( $product_id ) : false;
$is_sample   = false;
$link_url    = '#';
$link_label  = '';
$is_ajax     = false;
$product_sku = '';
$resolved_id = 0;

if ( $product instanceof WC_Product ) {
	$purchasable = $product->is_purchasable();
	$in_stock    = $product->is_in_stock();

	$out_of_stock_text = isset( $attributes['outOfStockText'] ) ? sanitize_text_field( (string) $attributes['outOfStockText'] ) : '';

	if ( '' !== $out_of_stock_text && ! $in_stock ) {
		$classes = 'bw-woo-add-to-cart bw-woo-add-to-cart--out-of-stock';
		$extra   = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
		$id_attr = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

		$out_attributes = array( 'class' => trim( $classes . ' ' . $extra ) );

		if ( '' !== $id_attr ) {
			$out_attributes['id'] = $id_attr;
		}

		return sprintf(
			'<div %1$s><p class="bw-woo-add-to-cart__message">%2$s</p></div>',
			get_block_wrapper_attributes( $out_attributes ),
			esc_html( $out_of_stock_text )
		);
	}

	if ( ! $purchasable && ! $in_stock ) {
		return '';
	}

	$can_buy     = $purchasable && $in_stock;
	$link_url    = $can_buy ? $product->add_to_cart_url() : $product->get_permalink();
	$link_label  = $can_buy ? $product->add_to_cart_text() : __( 'Read more', 'kriti-blocks' );
	$is_ajax     = $can_buy && $product->is_type( 'simple' );
	$product_sku = $product->get_sku();
	$resolved_id = $product->get_id();
} elseif ( $is_preview ) {
	$is_sample  = true;
	$link_url   = '#';
	$link_label = __( 'Add to cart', 'kriti-blocks' );
	$is_ajax    = true;
} else {
	return '';
}

$text = isset( $attributes['text'] ) ? sanitize_text_field( (string) $attributes['text'] ) : '';

if ( '' !== $text ) {
	$link_label = $text;
}

$font_size     = isset( $attributes['fontSize'] ) ? absint( $attributes['fontSize'] ) : 0;
$font_size     = min( $font_size, 120 );
$border_radius = isset( $attributes['borderRadius'] ) ? absint( $attributes['borderRadius'] ) : 4;
$border_radius = min( $border_radius, 999 );
$button_color  = isset( $attributes['buttonColor'] ) ? sanitize_hex_color( (string) $attributes['buttonColor'] ) : '';
$text_color    = isset( $attributes['textColor'] ) ? sanitize_hex_color( (string) $attributes['textColor'] ) : '';
$full_width    = ! empty( $attributes['fullWidth'] );
$extra_class   = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id       = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$after_add = isset( $attributes['afterAdd'] ) ? sanitize_key( $attributes['afterAdd'] ) : 'default';
$after_add = in_array( $after_add, array( 'default', 'cart', 'checkout' ), true ) ? $after_add : 'default';
$icon      = isset( $attributes['icon'] ) ? sanitize_key( $attributes['icon'] ) : 'none';
$icon      = in_array( $icon, array( 'none', 'cart', 'bag', 'plus', 'check' ), true ) ? $icon : 'none';
$icon_pos  = isset( $attributes['iconPosition'] ) ? sanitize_key( $attributes['iconPosition'] ) : 'before';
$icon_pos  = in_array( $icon_pos, array( 'before', 'after' ), true ) ? $icon_pos : 'before';
$size      = isset( $attributes['size'] ) ? sanitize_key( $attributes['size'] ) : 'medium';
$size      = in_array( $size, array( 'small', 'medium', 'large' ), true ) ? $size : 'medium';
$hover_bg  = isset( $attributes['hoverColor'] ) ? sanitize_hex_color( (string) $attributes['hoverColor'] ) : '';
$hover_txt = isset( $attributes['hoverTextColor'] ) ? sanitize_hex_color( (string) $attributes['hoverTextColor'] ) : '';

$use_quantity = false;

if ( $product instanceof WC_Product && $can_buy && $product->is_type( 'simple' ) ) {
	$use_quantity = ! empty( $attributes['showQuantity'] ) && function_exists( 'woocommerce_quantity_input' );

	/*
	 * Redirect after adding: WooCommerce processes ?add-to-cart=ID on any page,
	 * so point its own add-to-cart URL at the cart or checkout page and let it
	 * navigate normally instead of using the AJAX handler.
	 */
	if ( 'default' !== $after_add ) {
		$target_url = 'cart' === $after_add ? wc_get_cart_url() : wc_get_checkout_url();

		if ( $target_url ) {
			$link_url = add_query_arg( 'add-to-cart', $product->get_id(), $target_url );
			$is_ajax  = false;
		}
	}
}

$styles = array( 'border-radius:' . $border_radius . 'px' );

if ( $font_size > 0 ) {
	$styles[] = 'font-size:' . $font_size . 'px';
}

if ( $button_color ) {
	$styles[] = 'background-color:' . $button_color;
}

if ( $text_color ) {
	$styles[] = 'color:' . $text_color;
}

if ( $full_width ) {
	$styles[] = 'display:block';
	$styles[] = 'width:100%';
	$styles[] = 'text-align:center';
}

$classes = 'bw-woo-add-to-cart';

if ( $is_sample ) {
	$classes .= ' bw-woo-add-to-cart--preview';
}

if ( $full_width ) {
	$classes .= ' bw-woo-add-to-cart--full';
}

if ( 'medium' !== $size ) {
	$classes .= ' bw-woo-add-to-cart--size-' . $size;
}

if ( $hover_bg ) {
	$classes .= ' bw-woo-add-to-cart--hover-bg';
}

if ( $hover_txt ) {
	$classes .= ' bw-woo-add-to-cart--hover-text';
}

if ( $use_quantity ) {
	$classes .= ' bw-woo-add-to-cart--has-quantity';
}

if ( '' !== $extra_class ) {
	$classes .= ' ' . $extra_class;
}

$button_classes = 'bw-woo-add-to-cart__button button';

if ( $is_ajax ) {
	$button_classes .= ' ajax_add_to_cart add_to_cart_button';
}

$extra_attributes = array(
	'class' => trim( $classes ),
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

if ( $hover_bg || $hover_txt ) {
	$hover_vars = array();

	if ( $hover_bg ) {
		$hover_vars[] = '--bw-woo-atc-hover-bg:' . $hover_bg;
	}

	if ( $hover_txt ) {
		$hover_vars[] = '--bw-woo-atc-hover-text:' . $hover_txt;
	}

	$extra_attributes['style'] = implode( ';', $hover_vars ) . ';';
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

$icon_paths = array(
	'cart'  => 'M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.6-1.35 2.4A2 2 0 0 0 7 17h12v-2H7.42l.9-1.6h7.45a2 2 0 0 0 1.75-1.03L21 5.5 19.25 4.5l-3.48 6.5H8.1L4.3 3H1Z',
	'bag'   => 'M6 7V6a6 6 0 0 1 12 0v1h3l-1 15H4L3 7h3Zm2 0h8V6a4 4 0 0 0-8 0v1Z',
	'plus'  => 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z',
	'check' => 'm9.55 17.65-4.9-4.9 1.4-1.4 3.5 3.5 8.4-8.4 1.4 1.4-9.8 9.8Z',
);
$icon_svg   = '';

if ( 'none' !== $icon ) {
	$icon_svg = '<svg class="bw-woo-add-to-cart__icon" viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" focusable="false"><path d="' . esc_attr( $icon_paths[ $icon ] ) . '" fill="currentColor"/></svg>';
}

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $use_quantity ) : ?>
		<form
			class="cart bw-woo-add-to-cart__form"
			action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action', $product->get_permalink() ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound ?>"
			method="post"
			enctype="multipart/form-data"
		>
			<?php
			woocommerce_quantity_input(
				array(
					'min_value'   => $product->get_min_purchase_quantity(),
					'max_value'   => $product->get_max_purchase_quantity(),
					'input_value' => $product->get_min_purchase_quantity(),
				),
				$product,
				true
			);
			?>
			<button
				type="submit"
				name="add-to-cart"
				value="<?php echo esc_attr( $resolved_id ); ?>"
				class="<?php echo esc_attr( 'bw-woo-add-to-cart__button button single_add_to_cart_button' ); ?>"
				style="<?php echo esc_attr( implode( ';', $styles ) ); ?>"
			>
				<?php
				if ( $icon_svg && 'before' === $icon_pos ) {
					echo $icon_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
				<span class="bw-woo-add-to-cart__label"><?php echo esc_html( $link_label ); ?></span>
				<?php
				if ( $icon_svg && 'after' === $icon_pos ) {
					echo $icon_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
			</button>
		</form>
	<?php else : ?>
		<a
			href="<?php echo esc_url( $link_url ); ?>"
			data-quantity="1"
			data-product_id="<?php echo esc_attr( $resolved_id ); ?>"
			data-product_sku="<?php echo esc_attr( $product_sku ); ?>"
			class="<?php echo esc_attr( $button_classes ); ?>"
			style="<?php echo esc_attr( implode( ';', $styles ) ); ?>"
			rel="nofollow"
		>
			<?php if ( $icon_svg ) : ?>
				<?php
				if ( 'before' === $icon_pos ) {
					echo $icon_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
				<span class="bw-woo-add-to-cart__label"><?php echo esc_html( $link_label ); ?></span>
				<?php
				if ( 'after' === $icon_pos ) {
					echo $icon_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
			<?php else : ?>
				<?php echo esc_html( $link_label ); ?>
			<?php endif; ?>
		</a>
	<?php endif; ?>
</div>
<?php
return ob_get_clean();
