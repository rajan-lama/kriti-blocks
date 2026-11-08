<?php
/**
 * Server render for the BW Product Search block.
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

if ( ! class_exists( 'WooCommerce' ) || ! post_type_exists( 'product' ) ) {
	return '';
}

$show_button = ! isset( $attributes['showButton'] ) || (bool) $attributes['showButton'];

$label       = isset( $attributes['label'] ) ? trim( (string) $attributes['label'] ) : '';
$placeholder = isset( $attributes['placeholder'] ) ? trim( (string) $attributes['placeholder'] ) : '';
$button_text = isset( $attributes['buttonText'] ) ? trim( (string) $attributes['buttonText'] ) : '';

if ( '' === $label ) {
	$label = __( 'Search products', 'kriti-blocks' );
}

if ( '' === $placeholder ) {
	$placeholder = __( 'Search products...', 'kriti-blocks' );
}

if ( '' === $button_text ) {
	$button_text = __( 'Search', 'kriti-blocks' );
}

$category_dropdown = ! empty( $attributes['categoryDropdown'] ) && taxonomy_exists( 'product_cat' );
$icon_button       = ! empty( $attributes['iconButton'] );
$joined            = ! empty( $attributes['joined'] );
$size              = isset( $attributes['size'] ) ? sanitize_key( $attributes['size'] ) : 'medium';
$size              = in_array( $size, array( 'small', 'medium', 'large' ), true ) ? $size : 'medium';
$max_width         = isset( $attributes['maxWidth'] ) ? absint( $attributes['maxWidth'] ) : 0;
$max_width         = $max_width > 0 ? min( max( $max_width, 120 ), 1600 ) : 0;
$border_radius     = isset( $attributes['borderRadius'] ) && is_numeric( $attributes['borderRadius'] ) ? (int) $attributes['borderRadius'] : -1;
$border_radius     = $border_radius >= 0 ? min( $border_radius, 999 ) : -1;
$button_color      = isset( $attributes['buttonColor'] ) ? sanitize_hex_color( (string) $attributes['buttonColor'] ) : '';
$button_text_color = isset( $attributes['buttonTextColor'] ) ? sanitize_hex_color( (string) $attributes['buttonTextColor'] ) : '';
$all_cats_text     = isset( $attributes['allCategoriesText'] ) ? trim( sanitize_text_field( (string) $attributes['allCategoriesText'] ) ) : '';
$all_cats_text     = '' !== $all_cats_text ? $all_cats_text : __( 'All categories', 'kriti-blocks' );

$category_terms   = array();
$current_category = '';

if ( $category_dropdown ) {
	$category_terms = get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'number'     => 100,
			'orderby'    => 'name',
			'order'      => 'ASC',
		)
	);

	if ( is_wp_error( $category_terms ) ) {
		$category_terms = array();
	}

	$current_category = sanitize_title( (string) get_query_var( 'product_cat' ) );
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';
$field_id    = wp_unique_id( 'bw-woo-product-search-field-' );

$modifiers = '';

if ( 'medium' !== $size ) {
	$modifiers .= ' bw-woo-product-search--size-' . $size;
}

if ( $joined ) {
	$modifiers .= ' bw-woo-product-search--joined';
}

if ( $icon_button && $show_button ) {
	$modifiers .= ' bw-woo-product-search--icon';
}

$style_vars = array();

if ( $max_width > 0 ) {
	$style_vars[] = '--bw-woo-search-max-width:' . $max_width . 'px';
}

if ( $border_radius >= 0 ) {
	$style_vars[] = '--bw-woo-search-radius:' . $border_radius . 'px';
}

if ( $button_color ) {
	$style_vars[] = '--bw-woo-search-button-bg:' . $button_color;
}

if ( $button_text_color ) {
	$style_vars[] = '--bw-woo-search-button-text:' . $button_text_color;
}

$extra_attributes = array(
	'class' => trim( 'bw-woo-product-search' . $modifiers . ' ' . $extra_class ),
);

if ( ! empty( $style_vars ) ) {
	$extra_attributes['style'] = implode( ';', $style_vars ) . ';';
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<form
		class="bw-woo-product-search__form woocommerce-product-search"
		role="search"
		method="get"
		action="<?php echo esc_url( home_url( '/' ) ); ?>"
	>
		<?php if ( $category_dropdown && ! empty( $category_terms ) ) : ?>
			<label class="screen-reader-text" for="<?php echo esc_attr( $field_id . '-cat' ); ?>">
				<?php esc_html_e( 'Product category', 'kriti-blocks' ); ?>
			</label>
			<select class="bw-woo-product-search__category" id="<?php echo esc_attr( $field_id . '-cat' ); ?>" name="product_cat">
				<option value=""><?php echo esc_html( $all_cats_text ); ?></option>
				<?php foreach ( $category_terms as $category_term ) : ?>
					<?php if ( $category_term instanceof WP_Term ) : ?>
						<option value="<?php echo esc_attr( $category_term->slug ); ?>" <?php selected( $current_category, $category_term->slug ); ?>>
							<?php echo esc_html( $category_term->name ); ?>
						</option>
					<?php endif; ?>
				<?php endforeach; ?>
			</select>
		<?php endif; ?>

		<label class="bw-woo-product-search__label screen-reader-text" for="<?php echo esc_attr( $field_id ); ?>">
			<?php echo esc_html( $label ); ?>
		</label>

		<input
			class="bw-woo-product-search__input search-field"
			id="<?php echo esc_attr( $field_id ); ?>"
			type="search"
			name="s"
			value="<?php echo esc_attr( get_search_query() ); ?>"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
		/>

		<input
			class="bw-woo-product-search__post-type"
			type="hidden"
			name="post_type"
			value="product"
		/>

		<?php if ( $show_button ) : ?>
			<?php if ( $icon_button ) : ?>
				<button class="bw-woo-product-search__button" type="submit" aria-label="<?php echo esc_attr( $button_text ); ?>">
					<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true" focusable="false"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" fill="currentColor" /></svg>
				</button>
			<?php else : ?>
				<button class="bw-woo-product-search__button" type="submit">
					<?php echo esc_html( $button_text ); ?>
				</button>
			<?php endif; ?>
		<?php endif; ?>
	</form>
</div>
<?php
return ob_get_clean();
