<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server-side render for the Advance Header block.
 *
 * Every value is validated here before it reaches markup or CSS.
 *
 * @package Kriti_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ----------------------------------------
 * 1. Attributes Filter
 * ----------------------------------------
 */
$attributes = apply_filters(
	'kriti_blocks_header_block_attributes',
	$attributes,
	$content
);

/**
 * ----------------------------------------
 * 2. Validators
 * ----------------------------------------
 */
$kb_color = static function ( $value ) {
	if ( ! is_string( $value ) ) {
		return '';
	}
	$value = trim( $value );
	if ( preg_match( '/^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\(\s*[\d.\s,%\/-]+\)|var\(--[a-z0-9-]+\)|[a-z]{3,20})$/i', $value ) ) {
		return $value;
	}
	return '';
};

$kb_int = static function ( $value, $min, $max ) {
	if ( ! is_numeric( $value ) ) {
		return null;
	}
	return (int) max( $min, min( $max, (float) $value ) );
};

/**
 * ----------------------------------------
 * 3. Extract and validate attributes
 * ----------------------------------------
 */
$tag = $attributes['header'] ?? 'h2';
if ( ! in_array( $tag, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ) {
	$tag = 'h2';
}

$heading_content = $attributes['message'] ?? '';
$subtitle        = isset( $attributes['subtitle'] ) && is_string( $attributes['subtitle'] ) ? trim( $attributes['subtitle'] ) : '';

$text_align = $attributes['textAlign'] ?? '';
if ( ! in_array( $text_align, array( 'left', 'center', 'right' ), true ) ) {
	$text_align = '';
}

$bg_color   = $kb_color( $attributes['headerBgColor'] ?? '' );
$text_color = $kb_color( $attributes['headerTextColor'] ?? '' );

$border_width = $kb_int( $attributes['borderWidth'] ?? 0, 0, 20 );
$border_style = $attributes['borderStyle'] ?? 'solid';
if ( ! in_array( $border_style, array( 'solid', 'dashed', 'dotted', 'double' ), true ) ) {
	$border_style = 'solid';
}
$border_color  = $kb_color( $attributes['borderColor'] ?? '' );
$border_radius = $kb_int( $attributes['borderRadius'] ?? null, 0, 100 );
$margin_bottom = $kb_int( $attributes['marginBottom'] ?? null, 0, 200 );

$icon          = $attributes['headerIcon'] ?? '';
$icon_position = ( $attributes['iconPosition'] ?? '' ) === 'after' ? 'after' : 'before';
if ( ! in_array( $icon, array( 'chevron', 'arrow', 'star', 'check', 'plus' ), true ) ) {
	$icon = '';
}
$icon_color = $kb_color( $attributes['headerIconColor'] ?? '' );

$link_url = isset( $attributes['linkUrl'] ) && is_string( $attributes['linkUrl'] ) ? trim( $attributes['linkUrl'] ) : '';
$link_url = '' !== $link_url ? esc_url( $link_url, array( 'http', 'https', 'mailto', 'tel' ) ) : '';
$new_tab  = ! empty( $attributes['linkNewTab'] );

/**
 * ----------------------------------------
 * 4. Styles
 * ----------------------------------------
 * "Box" styles belong to the heading itself; alignment and spacing go on
 * the outer element (the heading, or a wrapper when there is a subtitle).
 */
$box   = array();
$outer = array();

if ( $text_color ) {
	$box[] = 'color:' . $text_color;
}
if ( $bg_color ) {
	$box[] = 'background-color:' . $bg_color;
}
if ( $border_width ) {
	$box[] = 'border-style:' . $border_style;
	$box[] = 'border-width:' . $border_width . 'px';
	if ( $border_color ) {
		$box[] = 'border-color:' . $border_color;
	}
}
if ( null !== $border_radius && $border_radius > 0 ) {
	$box[] = 'border-radius:' . $border_radius . 'px';
}
if ( $text_align ) {
	$outer[] = 'text-align:' . $text_align;
}
if ( null !== $margin_bottom ) {
	$outer[] = 'margin-bottom:' . $margin_bottom . 'px';
}

$classes = array();
if ( $bg_color || $border_width ) {
	$classes[] = 'kb-ah--boxed';
}
if ( $icon ) {
	$classes[] = 'kb-ah--icon-' . $icon_position;
}

/**
 * ----------------------------------------
 * 5. Inner content (icon, link)
 * ----------------------------------------
 */
$text_html = wp_kses_post( $heading_content );
if ( $link_url ) {
	$text_html = sprintf(
		'<a href="%1$s"%2$s>%3$s</a>',
		esc_url( $link_url ),
		$new_tab ? ' target="_blank" rel="noopener noreferrer"' : '',
		$text_html
	);
}
if ( $icon ) {
	$icon_html = sprintf(
		'<span class="kb-ah__icon kb-ah__icon--%1$s" aria-hidden="true"%2$s></span>',
		esc_attr( $icon ),
		$icon_color ? ' style="background-color:' . esc_attr( $icon_color ) . '"' : ''
	);
	$text_html = 'after' === $icon_position ? $text_html . $icon_html : $icon_html . $text_html;
}

/**
 * ----------------------------------------
 * 6. Output
 * ----------------------------------------
 * Without a subtitle the heading carries the block wrapper attributes, as it
 * always has. With a subtitle a wrapper div holds both.
 */
$wrapper_args = array();
if ( $classes ) {
	$wrapper_args['class'] = implode( ' ', $classes );
}

if ( '' === $subtitle ) {
	$style = array_merge( $outer, $box );
	if ( $style ) {
		$wrapper_args['style'] = implode( ';', $style ) . ';';
	}
	$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

	$html = sprintf(
		'<%1$s %2$s>%3$s</%1$s>',
		esc_html( $tag ),
		wp_kses_data( $wrapper_attributes ),
		$text_html
	);
} else {
	$wrapper_args['class'] = trim( ( $wrapper_args['class'] ?? '' ) . ' kb-ah--has-sub' );
	if ( $outer ) {
		$wrapper_args['style'] = implode( ';', $outer ) . ';';
	}
	$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

	$html = sprintf(
		'<div %1$s><%2$s class="kb-ah__title"%3$s>%4$s</%2$s><p class="kb-ah__sub">%5$s</p></div>',
		wp_kses_data( $wrapper_attributes ),
		esc_html( $tag ),
		$box ? ' style="' . esc_attr( implode( ';', $box ) ) . ';"' : '',
		$text_html,
		esc_html( $subtitle )
	);
}

/**
 * ----------------------------------------
 * 7. Final Output Filter
 * ----------------------------------------
 */
echo wp_kses_post( apply_filters(
	'kriti_blocks_header_block_output',
	$html,
	$attributes
) );
