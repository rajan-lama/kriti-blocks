<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}


/**
 * Validate a CSS color: hex, rgb(a), hsl(a), a named color or a preset variable.
 *
 * @param mixed $value Candidate color.
 * @return string Safe color or an empty string.
 */
function kriti_blocks_icon_safe_color( $value ) {
    if ( ! is_string( $value ) ) {
        return '';
    }
    $value = trim( $value );
    if ( preg_match( '/^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\(\s*[\d.\s,%\/-]+\)|var\(--wp--preset--color--[a-z0-9-]+\)|[a-z]{3,20})$/i', $value ) ) {
        return $value;
    }
    return '';
}

/**
 * Clamp a numeric attribute, or return null when it is missing or not numeric.
 *
 * @param mixed $value Candidate value.
 * @param float $min   Lowest allowed value.
 * @param float $max   Highest allowed value.
 * @return int|null
 */
function kriti_blocks_icon_num( $value, $min, $max ) {
    if ( '' === $value || null === $value || ! is_numeric( $value ) ) {
        return null;
    }
    return (int) round( max( $min, min( $max, (float) $value ) ) );
}

/**
 * Build the optional extras (classes, style, link, label) from the new
 * attributes. Everything is empty when the options are left at their defaults.
 *
 * @param array $attributes Block attributes.
 * @return array
 */
function kriti_blocks_icon_extras( $attributes ) {
    $classes = array();
    $style   = '';

    $hover_color = kriti_blocks_icon_safe_color( $attributes['hoverColor'] ?? '' );
    if ( $hover_color ) {
        $style .= '--bw-icon-hover-color:' . $hover_color . ';';
    }
    $hover_bg = kriti_blocks_icon_safe_color( $attributes['hoverBg'] ?? '' );
    if ( $hover_bg ) {
        $style .= '--bw-icon-hover-bg:' . $hover_bg . ';';
    }

    $rotation = kriti_blocks_icon_num( $attributes['rotation'] ?? null, -360, 360 );
    if ( $rotation ) {
        $style .= '--bw-icon-rot:' . $rotation . 'deg;';
    }

    $tablet = kriti_blocks_icon_num( $attributes['sizeTablet'] ?? null, 8, 500 );
    $mobile = kriti_blocks_icon_num( $attributes['sizeMobile'] ?? null, 8, 500 );
    if ( null !== $tablet ) {
        $style .= '--bw-icon-size-t:' . $tablet . 'px;';
    }
    if ( null !== $mobile ) {
        $style .= '--bw-icon-size-m:' . $mobile . 'px;';
    }
    if ( null !== $tablet || null !== $mobile ) {
        $classes[] = 'kb-icon--rs';
    }

    $align = $attributes['iconAlign'] ?? '';
    if ( in_array( $align, array( 'left', 'center', 'right' ), true ) ) {
        $style .= 'text-align:' . $align . ';';
    }

    $label = '';
    if ( isset( $attributes['label'] ) && is_string( $attributes['label'] ) ) {
        $label = trim( mb_substr( wp_strip_all_tags( $attributes['label'] ), 0, 120 ) );
    }
    if ( $label && 'right' === ( $attributes['labelPosition'] ?? '' ) ) {
        $classes[] = 'kb-icon--label-right';
    }

    $link_open = '';
    $url       = '';
    if ( ! empty( $attributes['linkUrl'] ) && is_string( $attributes['linkUrl'] ) ) {
        $url = esc_url( $attributes['linkUrl'], array( 'http', 'https', 'mailto', 'tel' ) );
    }
    if ( $url ) {
        $rel = array();
        if ( ! empty( $attributes['linkNofollow'] ) ) {
            $rel[] = 'nofollow';
        }
        $new_tab = ! empty( $attributes['linkNewTab'] );
        if ( $new_tab ) {
            $rel[] = 'noopener';
            $rel[] = 'noreferrer';
        }
        $name = '';
        if ( isset( $attributes['ariaLabel'] ) && is_string( $attributes['ariaLabel'] ) ) {
            $name = trim( mb_substr( wp_strip_all_tags( $attributes['ariaLabel'] ), 0, 120 ) );
        }
        $link_open = sprintf(
            '<a class="bw-icon-link" href="%s"%s%s%s>',
            esc_url( $url ),
            $new_tab ? ' target="_blank"' : '',
            $rel ? ' rel="' . esc_attr( implode( ' ', $rel ) ) . '"' : '',
            $name ? ' aria-label="' . esc_attr( $name ) . '"' : ''
        );
    }

    return array(
        'classes'   => $classes,
        'style'     => $style,
        'label'     => $label,
        'link_open' => $link_open,
    );
}

/**
 * Render callback for kriti-blocks/icon
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function kriti_blocks_icon_block_render_callback( $attributes ) {

    // Set default attributes
    $defaults = array(
        'icon'         => '',
        'size'         => 24,
        'color'        => '#000000',
        'bgColor'      => 'transparent',
        'padding'      => 0,
        'borderRadius' => 0,
        'svg'          => '',
    );

    // Merge defaults with user-provided attributes
    $attributes = array_merge( $defaults, $attributes );

    /**
     * Filter block attributes before rendering.
     *
     * @param array $attributes Block attributes.
     */
    $attributes = apply_filters( 'kriti_blocks_icon_block_attributes', $attributes );

    // Prepare inline style with CSS variables
    $style = sprintf(
        '--bw-icon-size:%spx;--bw-icon-color:%s;--bw-icon-bg:%s;--bw-icon-padding:%spx;--bw-icon-radius:%spx;',
        esc_attr( $attributes['size'] ),
        esc_attr( $attributes['color'] ),
        esc_attr( $attributes['bgColor'] ),
        esc_attr( $attributes['padding'] ),
        esc_attr( $attributes['borderRadius'] )
    );

    // Render SVG if exists
    $icon_html = '';
    if ( ! empty( $attributes['svg'] ) ) {
        $icon_html = sprintf(
            '<div class="bw-icon" style="margin-top:15px;">%s</div>',
            $attributes['svg']
        );
    }

    // Optional extras (hover colors, rotation, per-device size, label, link).
    $extras = kriti_blocks_icon_extras( $attributes );
    $style .= $extras['style'];

    if ( $extras['label'] || $extras['link_open'] ) {
        $inner = '<div class="bw-icon-inner">' . $icon_html;
        if ( $extras['label'] ) {
            $inner .= '<span class="bw-icon-label">' . esc_html( $extras['label'] ) . '</span>';
        }
        $inner .= '</div>';
        $icon_html = $extras['link_open'] ? $extras['link_open'] . $inner . '</a>' : $inner;
    }

    $class = 'wp-block-kriti-blocks-icon';
    if ( $extras['classes'] ) {
        $class .= ' ' . implode( ' ', $extras['classes'] );
    }

    // Return final block HTML
    return sprintf(
        '<div class="%s" style="%s">%s</div>',
        esc_attr( $class ),
        esc_attr( $style ),
        $icon_html
    );
}

// Register block render callback
add_action( 'init', function() {
    if ( function_exists( 'register_block_type' ) ) {
        register_block_type( 'kriti-blocks/icon', array(
            'render_callback' => 'kriti_blocks_icon_block_render_callback',
        ) );
    }
} );