<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Pagination block.
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

global $wp_query;

if ( ! $wp_query instanceof WP_Query ) {
	return '';
}

$total_pages = (int) $wp_query->max_num_pages;
$is_preview  = defined( 'REST_REQUEST' ) && REST_REQUEST;

if ( $total_pages < 2 ) {
	if ( ! $is_preview ) {
		return '';
	}

	$total_pages = 3;
}

$current_page = max( 1, (int) get_query_var( 'paged' ) );
$current_page = min( $current_page, $total_pages );

$show_prev_next = ! isset( $attributes['showPrevNext'] ) || (bool) $attributes['showPrevNext'];
$show_numbers   = ! isset( $attributes['showNumbers'] ) || (bool) $attributes['showNumbers'];
$mid_size       = isset( $attributes['midSize'] ) ? absint( $attributes['midSize'] ) : 1;
$mid_size       = min( $mid_size, 3 );
$end_size       = isset( $attributes['endSize'] ) ? absint( $attributes['endSize'] ) : 1;
$end_size       = min( $end_size, 3 );

$justify = isset( $attributes['justify'] ) ? sanitize_key( $attributes['justify'] ) : 'left';
$justify = in_array( $justify, array( 'left', 'center', 'right' ), true ) ? $justify : 'left';

$prev_text = isset( $attributes['prevText'] ) ? trim( (string) $attributes['prevText'] ) : '';
$next_text = isset( $attributes['nextText'] ) ? trim( (string) $attributes['nextText'] ) : '';

if ( '' === $prev_text ) {
	$prev_text = __( 'Previous', 'kriti-blocks' );
}

if ( '' === $next_text ) {
	$next_text = __( 'Next', 'kriti-blocks' );
}

/*
 * Extra options. Each value is validated; the defaults reproduce the original output.
 */
$style = isset( $attributes['paginationStyle'] ) ? sanitize_key( $attributes['paginationStyle'] ) : 'outline';
$style = in_array( $style, array( 'outline', 'solid', 'minimal', 'pill' ), true ) ? $style : 'outline';
$size  = isset( $attributes['size'] ) ? sanitize_key( $attributes['size'] ) : 'md';
$size  = in_array( $size, array( 'sm', 'md', 'lg' ), true ) ? $size : 'md';
$arrow = isset( $attributes['arrowStyle'] ) ? sanitize_key( $attributes['arrowStyle'] ) : 'text';
$arrow = in_array( $arrow, array( 'text', 'arrows', 'both' ), true ) ? $arrow : 'text';

$show_first_last = ! empty( $attributes['showFirstLast'] );
$show_page_info  = ! empty( $attributes['showPageInfo'] );

$color_vars = array(
	'linkColor'    => '--bw-pg-color',
	'linkBg'       => '--bw-pg-bg',
	'linkBorder'   => '--bw-pg-border',
	'hoverColor'   => '--bw-pg-hover-color',
	'hoverBg'      => '--bw-pg-hover-bg',
	'hoverBorder'  => '--bw-pg-hover-border',
	'currentColor' => '--bw-pg-current-color',
	'currentBg'    => '--bw-pg-current-bg',
);

$inline_style = '';

foreach ( $color_vars as $attribute_name => $css_var ) {
	$color = isset( $attributes[ $attribute_name ] ) && is_string( $attributes[ $attribute_name ] ) ? sanitize_hex_color( $attributes[ $attribute_name ] ) : '';

	if ( $color ) {
		$inline_style .= $css_var . ':' . $color . ';';
	}
}

$modifier_class = '';

if ( 'outline' !== $style ) {
	$modifier_class .= ' bw-pagination--style-' . $style;
}

if ( 'md' !== $size ) {
	$modifier_class .= ' bw-pagination--size-' . $size;
}

// Link labels. The accessible name always stays the text label.
$label_html = static function ( $text, $glyph, $arrow_style, $before ) {
	if ( 'arrows' === $arrow_style ) {
		return '<span aria-hidden="true">' . esc_html( $glyph ) . '</span><span class="screen-reader-text">' . esc_html( $text ) . '</span>';
	}

	if ( 'both' === $arrow_style ) {
		return $before
			? '<span aria-hidden="true">' . esc_html( $glyph ) . '</span> ' . esc_html( $text )
			: esc_html( $text ) . ' <span aria-hidden="true">' . esc_html( $glyph ) . '</span>';
	}

	return esc_html( $text );
};

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$extra_attributes = array(
	'class' => trim( 'bw-pagination bw-pagination--' . $justify . $modifier_class . ' ' . $extra_class ),
);

if ( '' !== $inline_style ) {
	$extra_attributes['style'] = $inline_style;
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

if ( $is_preview && (int) $wp_query->max_num_pages < 2 ) {
	ob_start();
	?>
	<nav <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> aria-label="<?php esc_attr_e( 'Pagination preview', 'kriti-blocks' ); ?>">
		<div class="bw-pagination__items" aria-hidden="true">
			<?php if ( $show_page_info ) : ?>
				<span class="bw-pagination__info"><?php echo esc_html( sprintf( /* translators: 1: current page, 2: total pages. */ __( 'Page %1$d of %2$d', 'kriti-blocks' ), 2, 3 ) ); ?></span>
			<?php endif; ?>
			<?php if ( $show_first_last ) : ?>
				<span class="bw-pagination__link bw-pagination__first"><?php echo wp_kses( $label_html( __( 'First', 'kriti-blocks' ), '«', $arrow, true ), array( 'span' => array( 'aria-hidden' => true, 'class' => true ) ) ); ?></span>
			<?php endif; ?>
			<span class="bw-pagination__link bw-pagination__prev"><?php echo wp_kses( $label_html( $prev_text, '←', $arrow, true ), array( 'span' => array( 'aria-hidden' => true, 'class' => true ) ) ); ?></span>
			<span class="bw-pagination__link">1</span>
			<span class="bw-pagination__link is-current">2</span>
			<span class="bw-pagination__link">3</span>
			<span class="bw-pagination__link bw-pagination__next"><?php echo wp_kses( $label_html( $next_text, '→', $arrow, false ), array( 'span' => array( 'aria-hidden' => true, 'class' => true ) ) ); ?></span>
			<?php if ( $show_first_last ) : ?>
				<span class="bw-pagination__link bw-pagination__last"><?php echo wp_kses( $label_html( __( 'Last', 'kriti-blocks' ), '»', $arrow, false ), array( 'span' => array( 'aria-hidden' => true, 'class' => true ) ) ); ?></span>
			<?php endif; ?>
		</div>
	</nav>
	<?php
	return ob_get_clean();
}

$prev_url = $current_page > 1 ? get_pagenum_link( $current_page - 1 ) : '';
$next_url = $current_page < $total_pages ? get_pagenum_link( $current_page + 1 ) : '';

$numbers = '';

if ( $show_numbers ) {
	$numbers = paginate_links(
		array(
			'total'     => $total_pages,
			'current'   => $current_page,
			'mid_size'  => $mid_size,
			'end_size'  => $end_size,
			'prev_next' => false,
			'type'      => 'plain',
			'add_args'  => false,
		)
	);
}

ob_start();
?>
<nav <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> aria-label="<?php esc_attr_e( 'Pagination', 'kriti-blocks' ); ?>">
	<div class="bw-pagination__items">
		<?php if ( $show_page_info ) : ?>
			<span class="bw-pagination__info">
				<?php
				/* translators: 1: current page, 2: total pages. */
				echo esc_html( sprintf( __( 'Page %1$d of %2$d', 'kriti-blocks' ), $current_page, $total_pages ) );
				?>
			</span>
		<?php endif; ?>

		<?php if ( $show_first_last && $current_page > 1 ) : ?>
			<a class="bw-pagination__link bw-pagination__first" href="<?php echo esc_url( get_pagenum_link( 1 ) ); ?>">
				<?php echo $label_html( __( 'First', 'kriti-blocks' ), '«', $arrow, true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		<?php endif; ?>

		<?php if ( $show_prev_next && '' !== $prev_url ) : ?>
			<a class="bw-pagination__link bw-pagination__prev" href="<?php echo esc_url( $prev_url ); ?>" rel="prev">
				<?php echo $label_html( $prev_text, '←', $arrow, true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		<?php endif; ?>

		<?php echo $numbers; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

		<?php if ( $show_prev_next && '' !== $next_url ) : ?>
			<a class="bw-pagination__link bw-pagination__next" href="<?php echo esc_url( $next_url ); ?>" rel="next">
				<?php echo $label_html( $next_text, '→', $arrow, false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		<?php endif; ?>

		<?php if ( $show_first_last && $current_page < $total_pages ) : ?>
			<a class="bw-pagination__link bw-pagination__last" href="<?php echo esc_url( get_pagenum_link( $total_pages ) ); ?>">
				<?php echo $label_html( __( 'Last', 'kriti-blocks' ), '»', $arrow, false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		<?php endif; ?>
	</div>
</nav>
<?php
return ob_get_clean();
