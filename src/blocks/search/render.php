<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Search block.
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

$layout = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'inline';
$layout = in_array( $layout, array( 'inline', 'stacked' ), true ) ? $layout : 'inline';

$show_button = ! isset( $attributes['showButton'] ) || (bool) $attributes['showButton'];

$label       = isset( $attributes['label'] ) ? trim( (string) $attributes['label'] ) : '';
$placeholder = isset( $attributes['placeholder'] ) ? trim( (string) $attributes['placeholder'] ) : '';
$button_text = isset( $attributes['buttonText'] ) ? trim( (string) $attributes['buttonText'] ) : '';
$post_type   = isset( $attributes['postType'] ) ? sanitize_key( $attributes['postType'] ) : '';

if ( '' === $label ) {
	$label = __( 'Search', 'kriti-blocks' );
}

if ( '' === $placeholder ) {
	$placeholder = __( 'Search this site', 'kriti-blocks' );
}

if ( '' === $button_text ) {
	$button_text = __( 'Search', 'kriti-blocks' );
}

if ( '' !== $post_type && ! post_type_exists( $post_type ) ) {
	$post_type = '';
}

/*
 * Extra options. Each value is validated; the defaults reproduce the original output.
 */
$button_style = isset( $attributes['buttonStyle'] ) ? sanitize_key( $attributes['buttonStyle'] ) : 'text';
$button_style = in_array( $button_style, array( 'text', 'icon' ), true ) ? $button_style : 'text';
$size         = isset( $attributes['size'] ) ? sanitize_key( $attributes['size'] ) : 'md';
$size         = in_array( $size, array( 'sm', 'md', 'lg' ), true ) ? $size : 'md';
$align        = isset( $attributes['fieldAlign'] ) ? sanitize_key( $attributes['fieldAlign'] ) : 'left';
$align        = in_array( $align, array( 'left', 'center', 'right' ), true ) ? $align : 'left';
$max_width    = isset( $attributes['maxWidth'] ) ? min( absint( $attributes['maxWidth'] ), 1200 ) : 0;
$radius       = isset( $attributes['fieldRadius'] ) ? min( absint( $attributes['fieldRadius'] ), 40 ) : 8;

$show_categories = ! empty( $attributes['showCategoryFilter'] ) && ( '' === $post_type || 'post' === $post_type );
$category_label  = isset( $attributes['categoryLabel'] ) && is_string( $attributes['categoryLabel'] ) ? trim( sanitize_text_field( (string) $attributes['categoryLabel'] ) ) : '';

if ( '' === $category_label ) {
	$category_label = __( 'All categories', 'kriti-blocks' );
}

$categories = array();

if ( $show_categories ) {
	$categories = get_categories(
		array(
			'hide_empty' => true,
			'number'     => 100,
			'orderby'    => 'name',
		)
	);

	if ( empty( $categories ) || is_wp_error( $categories ) ) {
		$show_categories = false;
	}
}

$color_vars   = array(
	'buttonBg'      => '--bw-search-button-bg',
	'buttonColor'   => '--bw-search-button-color',
	'buttonHoverBg' => '--bw-search-button-hover-bg',
	'inputBorder'   => '--bw-search-border',
	'inputBg'       => '--bw-search-input-bg',
);
$inline_style = '';

foreach ( $color_vars as $attribute_name => $css_var ) {
	$color = isset( $attributes[ $attribute_name ] ) && is_string( $attributes[ $attribute_name ] ) ? sanitize_hex_color( $attributes[ $attribute_name ] ) : '';

	if ( $color ) {
		$inline_style .= $css_var . ':' . $color . ';';
	}
}

if ( $max_width > 0 ) {
	$inline_style .= '--bw-search-max:' . $max_width . 'px;';
}

if ( 8 !== $radius ) {
	$inline_style .= '--bw-search-radius:' . $radius . 'px;';
}

$modifier_class = '';

if ( 'md' !== $size ) {
	$modifier_class .= ' bw-search--size-' . $size;
}

if ( $max_width > 0 && 'left' !== $align ) {
	$modifier_class .= ' bw-search--align-' . $align;
}

if ( 'icon' === $button_style ) {
	$modifier_class .= ' bw-search--icon-button';
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';
$field_id    = wp_unique_id( 'bw-search-field-' );

$extra_attributes = array(
	'class' => trim( 'bw-search bw-search--' . $layout . $modifier_class . ' ' . $extra_class ),
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
	<form
		class="bw-search__form"
		role="search"
		method="get"
		action="<?php echo esc_url( home_url( '/' ) ); ?>"
	>
		<label class="bw-search__label screen-reader-text" for="<?php echo esc_attr( $field_id ); ?>">
			<?php echo esc_html( $label ); ?>
		</label>

		<input
			class="bw-search__input"
			id="<?php echo esc_attr( $field_id ); ?>"
			type="search"
			name="s"
			value="<?php echo esc_attr( get_search_query() ); ?>"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
		/>

		<?php if ( $show_categories ) : ?>
			<?php $selected_cat = absint( get_query_var( 'cat' ) ); ?>
			<select class="bw-search__category" name="cat" aria-label="<?php echo esc_attr( $category_label ); ?>">
				<option value="0"><?php echo esc_html( $category_label ); ?></option>
				<?php foreach ( $categories as $category ) : ?>
					<option value="<?php echo esc_attr( $category->term_id ); ?>"<?php selected( $selected_cat, (int) $category->term_id ); ?>>
						<?php echo esc_html( $category->name ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		<?php endif; ?>

		<?php if ( '' !== $post_type ) : ?>
			<input
				class="bw-search__post-type"
				type="hidden"
				name="post_type"
				value="<?php echo esc_attr( $post_type ); ?>"
			/>
		<?php endif; ?>

		<?php if ( $show_button ) : ?>
			<?php if ( 'icon' === $button_style ) : ?>
				<button class="bw-search__button" type="submit" aria-label="<?php echo esc_attr( $button_text ); ?>">
					<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
						<path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" fill="currentColor" />
					</svg>
				</button>
			<?php else : ?>
				<button class="bw-search__button" type="submit">
					<?php echo esc_html( $button_text ); ?>
				</button>
			<?php endif; ?>
		<?php endif; ?>
	</form>
</div>
<?php
return ob_get_clean();
