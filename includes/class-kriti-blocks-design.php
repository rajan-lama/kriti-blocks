<?php
/**
 * Shared design layer for every Kriti Blocks block.
 *
 * The editor stores all design options in one object attribute, `kbStyle`
 * (see src/extensions). Because the attribute is saved in the block comment
 * delimiter, nothing in a block's saved markup changes, so existing content
 * stays valid. This class turns the attribute into scoped CSS and a few
 * HTML attributes when the block is rendered.
 *
 * Every value is validated here before it reaches CSS or HTML.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Design {

	const ATTRIBUTE = 'kbStyle';

	/**
	 * Names from src/constants/advancedOptionsAttributes.js and layoutOptionsAttributes.js.
	 */
	const LEGACY_ATTRIBUTES = array(
		'animations',
		'displayDateRange',
		'onHoverAnimations',
		'selectedRoles',
		'showDesktop',
		'showMobile',
		'showTablet',
		'userVisibility',
		'alignItem',
		'backgroundAttachmentScroll',
		'backgroundBlendMode',
		'backgroundColor',
		'backgroundFocalPoint',
		'backgroundGradient',
		'backgroundImageOverlay',
		'backgroundOpacity',
		'backgroundOption',
		'backgroundRepeat',
		'columnGap',
		'displayType',
		'flexWrap',
		'hoverColor',
		'justifyContent',
		'linkColor',
		'margin',
		'padding',
		'positionType',
		'rowDirection',
		'rowGap',
		'textColor',
		'visitedColor',
		'zindex',
	);
	const PREFIX            = 'kriti-blocks/';
	const TABLET_MAX        = 1024;
	const MOBILE_MAX        = 767;

	/**
	 * Classes whose CSS was already printed during this request.
	 *
	 * @var array<string,bool>
	 */
	private static $printed = array();

	public static function init() {
		add_filter( 'register_block_type_args', array( __CLASS__, 'register_attribute' ), 10, 2 );
		add_filter( 'render_block', array( __CLASS__, 'render' ), 10, 2 );
		add_action( 'wp_head', array( __CLASS__, 'print_js_flag' ), 1 );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'enqueue_frontend' ) );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'enqueue_editor' ) );
	}

	/**
	 * Adds the `kbStyle` attribute to every Kriti Blocks block on the server.
	 */
	public static function register_attribute( $args, $block_type ) {
		if ( 0 !== strpos( $block_type, self::PREFIX ) ) {
			return $args;
		}
		if ( ! isset( $args['attributes'] ) || ! is_array( $args['attributes'] ) ) {
			$args['attributes'] = array();
		}
		$args['attributes'][ self::ATTRIBUTE ] = array(
			'type'    => 'object',
			'default' => array(),
		);
		// Older attribute names the blocks still register in JavaScript. The editor sends every
		// attribute to the server to preview a block, and WordPress refuses names it does not
		// know. An empty definition accepts any value and changes nothing else.
		foreach ( self::LEGACY_ATTRIBUTES as $name ) {
			if ( ! isset( $args['attributes'][ $name ] ) ) {
				$args['attributes'][ $name ] = array();
			}
		}
		return $args;
	}

	/**
	 * Marks the page as scripted so entrance animations only hide content
	 * when the script that reveals it can run.
	 */
	public static function print_js_flag() {
		echo '<script>document.documentElement.classList.add("kb-js");</script>' . "\n";
	}

	public static function enqueue_frontend() {
		wp_enqueue_style(
			'kriti-blocks-design',
			KRITI_BLOCKS_URL . 'assets/css/design.css',
			array(),
			KRITI_BLOCKS_VERSION
		);
		wp_enqueue_script(
			'kriti-blocks-design',
			KRITI_BLOCKS_URL . 'assets/js/design-frontend.js',
			array(),
			KRITI_BLOCKS_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
	}

	public static function enqueue_editor() {
		$asset_file = KRITI_BLOCKS_PATH . 'assets/extensions/extensions.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}
		$asset = include $asset_file;
		wp_enqueue_script(
			'kriti-blocks-extensions',
			KRITI_BLOCKS_URL . 'assets/extensions/extensions.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_set_script_translations( 'kriti-blocks-extensions', 'kriti-blocks' );
		wp_enqueue_style(
			'kriti-blocks-design-editor',
			KRITI_BLOCKS_URL . 'assets/css/design.css',
			array(),
			KRITI_BLOCKS_VERSION
		);
	}

	/**
	 * render_block callback.
	 *
	 * @param string $content Rendered block markup.
	 * @param array  $block   Parsed block.
	 * @return string
	 */
	public static function render( $content, $block ) {
		if ( empty( $block['blockName'] ) || 0 !== strpos( $block['blockName'], self::PREFIX ) ) {
			return $content;
		}
		$raw = isset( $block['attrs'][ self::ATTRIBUTE ] ) ? $block['attrs'][ self::ATTRIBUTE ] : null;
		if ( ! is_array( $raw ) || empty( $raw ) || '' === trim( $content ) ) {
			return $content;
		}

		// Needs WordPress 6.2 or newer. On older versions the block is shown as saved.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $content;
		}

		$style = self::sanitize( $raw );

		if ( ! self::is_visible( $style ) ) {
			return '';
		}

		$class = 'kb-' . substr( md5( wp_json_encode( $style ) ), 0, 10 );
		$css   = self::build_css( $style, '.' . $class );

		$classes = array();
		if ( '' !== $css ) {
			$classes[] = $class;
		}
		if ( ! empty( $style['anim']['type'] ) ) {
			$classes[] = 'kb-anim';
			$classes[] = 'kb-anim--' . $style['anim']['type'];
		}

		// A column's outer element carries the grid gutters as padding. Put the
		// design on an inner wrapper added here, so padding, borders and
		// backgrounds do not replace or cover the gutters. Saved markup is unchanged.
		$inner = false;
		if ( 'kriti-blocks/column' === $block['blockName']
			&& preg_match( '#^(\s*<div\b[^>]*>)(.*)(</div>\s*)$#s', $content, $parts )
		) {
			$content = $parts[1] . '<div class="kb-col-inner">' . $parts[2] . '</div>' . $parts[3];
			$inner   = true;
		}

		$tags = new \WP_HTML_Tag_Processor( $content );
		if ( ! $tags->next_tag() || ( $inner && ! $tags->next_tag() ) ) {
			return $content;
		}
		foreach ( $classes as $c ) {
			$tags->add_class( $c );
		}
		if ( ! empty( $style['aria']['label'] ) ) {
			$tags->set_attribute( 'aria-label', $style['aria']['label'] );
		}
		if ( ! empty( $style['aria']['role'] ) ) {
			$tags->set_attribute( 'role', $style['aria']['role'] );
		}
		$content = $tags->get_updated_html();

		if ( '' !== $css && ! isset( self::$printed[ $class ] ) ) {
			self::$printed[ $class ] = true;
			$content                 = '<style id="' . esc_attr( $class ) . '-css">' . $css . '</style>' . $content;
		}

		return $content;
	}

	/*
	------------------------------------------------------------------
	 * Visibility
	 * ---------------------------------------------------------------- */

	private static function is_visible( array $style ) {
		if ( empty( $style['vis'] ) ) {
			return true;
		}
		$vis = $style['vis'];

		if ( 'in' === ( $vis['login'] ?? '' ) && ! is_user_logged_in() ) {
			return false;
		}
		if ( 'out' === ( $vis['login'] ?? '' ) && is_user_logged_in() ) {
			return false;
		}

		// Dates are Y-m-d strings (checked in sanitize()), so they compare correctly as text.
		// Today is taken in the site's timezone.
		$today = wp_date( 'Y-m-d' );
		if ( ! empty( $vis['from'] ) && $today < $vis['from'] ) {
			return false;
		}
		if ( ! empty( $vis['to'] ) && $today > $vis['to'] ) {
			return false;
		}
		return true;
	}

	/*
	------------------------------------------------------------------
	 * CSS
	 * ---------------------------------------------------------------- */

	private static function build_css( array $s, $sel ) {
		$base   = array();
		$tablet = array();
		$mobile = array();
		$hover  = array();

		// Background and colors.
		if ( ! empty( $s['bg']['gradient'] ) ) {
			$base[] = 'background-image:' . $s['bg']['gradient'];
		}
		if ( ! empty( $s['bg']['color'] ) ) {
			$base[] = 'background-color:' . $s['bg']['color'];
		}
		if ( ! empty( $s['color']['text'] ) ) {
			$base[] = 'color:' . $s['color']['text'];
		}
		if ( ! empty( $s['bg']['hover'] ) ) {
			$hover[] = 'background-color:' . $s['bg']['hover'];
		}
		if ( ! empty( $s['color']['hover'] ) ) {
			$hover[] = 'color:' . $s['color']['hover'];
		}

		// Typography.
		$buckets = array(
			'd' => &$base,
			't' => &$tablet,
			'm' => &$mobile,
		);
		foreach ( $buckets as $dev => &$bucket ) {
			if ( ! empty( $s['font']['size'][ $dev ] ) ) {
				$bucket[] = 'font-size:' . $s['font']['size'][ $dev ];
			}
			if ( ! empty( $s['minHeight'][ $dev ] ) ) {
				$bucket[] = 'min-height:' . $s['minHeight'][ $dev ];
			}
			foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
				if ( isset( $s['inset'][ $dev ][ $side ] ) ) {
					$bucket[] = $side . ':' . $s['inset'][ $dev ][ $side ];
				}
			}
			if ( ! empty( $s['gap'][ $dev ] ) ) {
				$bucket[] = 'gap:' . $s['gap'][ $dev ];
			}
			// Tablet and mobile overrides for grid and flex containers. The blocks set
			// their layout inline, so these need !important to win.
			if ( 'd' !== $dev ) {
				if ( ! empty( $s['cols'][ $dev ] ) ) {
					$bucket[] = 'grid-template-columns:repeat(' . (int) $s['cols'][ $dev ] . ',minmax(0,1fr)) !important';
				}
				if ( ! empty( $s['stack'][ $dev ] ) ) {
					$bucket[] = 'flex-direction:' . $s['stack'][ $dev ] . ' !important';
				}
			}
			// `font.align` is a string in older content (desktop only) or a per-device map.
			$align = $s['font']['align'] ?? '';
			$align = is_array( $align ) ? ( $align[ $dev ] ?? '' ) : ( 'd' === $dev ? $align : '' );
			if ( '' !== $align ) {
				$bucket[] = 'text-align:' . $align;
			}
			foreach ( array( 'padding', 'margin' ) as $prop ) {
				if ( empty( $s[ $prop ][ $dev ] ) ) {
					continue;
				}
				foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
					if ( isset( $s[ $prop ][ $dev ][ $side ] ) ) {
						$bucket[] = $prop . '-' . $side . ':' . $s[ $prop ][ $dev ][ $side ];
					}
				}
			}
		}
		unset( $bucket );

		foreach ( array(
			'weight'        => 'font-weight',
			'transform'     => 'text-transform',
			'lineHeight'    => 'line-height',
			'letterSpacing' => 'letter-spacing',
		) as $key => $prop ) {
			if ( isset( $s['font'][ $key ] ) && '' !== $s['font'][ $key ] ) {
				$base[] = $prop . ':' . $s['font'][ $key ];
			}
		}

		// Border.
		$b = isset( $s['border'] ) ? $s['border'] : array();
		if ( ! empty( $b['width'] ) ) {
			$base[] = 'border-width:' . $b['width'];
			$base[] = 'border-style:' . ( ! empty( $b['style'] ) ? $b['style'] : 'solid' );
		}
		if ( ! empty( $b['color'] ) ) {
			$base[] = 'border-color:' . $b['color'];
		}
		if ( ! empty( $b['radius'] ) ) {
			$base[] = 'border-radius:' . $b['radius'];
			$base[] = 'overflow:hidden';
		}
		if ( ! empty( $b['hover'] ) ) {
			$hover[] = 'border-color:' . $b['hover'];
		}

		// Shadows.
		if ( ! empty( $s['shadow'] ) ) {
			$base[] = 'box-shadow:' . $s['shadow'];
		}
		if ( ! empty( $s['shadowHover'] ) ) {
			$hover[] = 'box-shadow:' . $s['shadowHover'];
		}

		// Opacity and transform.
		if ( ! empty( $s['position'] ) ) {
			$base[] = 'position:' . $s['position'];
		}
		if ( isset( $s['zIndex'] ) ) {
			$base[] = 'z-index:' . (int) $s['zIndex'];
		}
		if ( isset( $s['opacity'] ) ) {
			$base[] = 'opacity:' . $s['opacity'];
		}
		$tf = array();
		if ( isset( $s['hoverFx']['scale'] ) ) {
			$tf[] = 'scale(' . $s['hoverFx']['scale'] . ')';
		}
		if ( isset( $s['hoverFx']['rotate'] ) ) {
			$tf[] = 'rotate(' . $s['hoverFx']['rotate'] . 'deg)';
		}
		if ( isset( $s['hoverFx']['lift'] ) ) {
			$tf[] = 'translateY(-' . $s['hoverFx']['lift'] . 'px)';
		}
		if ( $tf ) {
			$hover[] = 'transform:' . implode( ' ', $tf );
		}
		if ( $hover || $tf ) {
			$dur    = isset( $s['hoverFx']['duration'] ) ? $s['hoverFx']['duration'] : 200;
			$base[] = 'transition:all ' . $dur . 'ms ease';
		}

		// Animation timing.
		if ( ! empty( $s['anim']['type'] ) ) {
			if ( isset( $s['anim']['duration'] ) ) {
				$base[] = '--kb-anim-duration:' . $s['anim']['duration'] . 'ms';
			}
			if ( isset( $s['anim']['delay'] ) ) {
				$base[] = '--kb-anim-delay:' . $s['anim']['delay'] . 'ms';
			}
		}

		$css = '';
		if ( $base ) {
			$css .= $sel . '{' . implode( ';', $base ) . '}';
		}
		if ( $hover ) {
			$css .= $sel . ':hover{' . implode( ';', $hover ) . '}';
		}
		if ( $tablet ) {
			$css .= '@media (max-width:' . self::TABLET_MAX . 'px){' . $sel . '{' . implode( ';', $tablet ) . '}}';
		}
		if ( $mobile ) {
			$css .= '@media (max-width:' . self::MOBILE_MAX . 'px){' . $sel . '{' . implode( ';', $mobile ) . '}}';
		}

		// Device visibility.
		if ( ! empty( $s['hide']['d'] ) ) {
			$css .= '@media (min-width:' . ( self::TABLET_MAX + 1 ) . 'px){' . $sel . '{display:none!important}}';
		}
		if ( ! empty( $s['hide']['t'] ) ) {
			$css .= '@media (min-width:' . ( self::MOBILE_MAX + 1 ) . 'px) and (max-width:' . self::TABLET_MAX . 'px){' . $sel . '{display:none!important}}';
		}
		if ( ! empty( $s['hide']['m'] ) ) {
			$css .= '@media (max-width:' . self::MOBILE_MAX . 'px){' . $sel . '{display:none!important}}';
		}

		// Custom CSS. `selector` is replaced with the block's class.
		if ( ! empty( $s['customCss'] ) ) {
			$css .= str_replace( 'selector', $sel, $s['customCss'] );
		}

		return $css;
	}

	/*
	------------------------------------------------------------------
	 * Sanitizing
	 * ---------------------------------------------------------------- */

	/**
	 * Returns only values that are safe to print, with unknown keys dropped.
	 *
	 * @param array $in Raw attribute value.
	 * @return array
	 */
	public static function sanitize( array $in ) {
		$out = array();

		$bg        = array(
			'color'    => self::color( $in['bg']['color'] ?? '' ),
			'hover'    => self::color( $in['bg']['hover'] ?? '' ),
			'gradient' => self::gradient( $in['bg']['gradient'] ?? '' ),
		);
		$out['bg'] = array_filter( $bg );

		$out['color'] = array_filter(
			array(
				'text'  => self::color( $in['color']['text'] ?? '' ),
				'hover' => self::color( $in['color']['hover'] ?? '' ),
			)
		);

		$font = array();
		foreach ( array( 'd', 't', 'm' ) as $dev ) {
			$v = self::length( $in['font']['size'][ $dev ] ?? '' );
			if ( '' !== $v ) {
				$font['size'][ $dev ] = $v;
			}
		}
		$w = $in['font']['weight'] ?? '';
		if ( in_array( (string) $w, array( '100', '200', '300', '400', '500', '600', '700', '800', '900' ), true ) ) {
			$font['weight'] = (string) $w;
		}
		$t = $in['font']['transform'] ?? '';
		if ( in_array( $t, array( 'none', 'uppercase', 'lowercase', 'capitalize' ), true ) ) {
			$font['transform'] = $t;
		}
		$aligns = array( 'left', 'center', 'right', 'justify' );
		$a      = $in['font']['align'] ?? '';
		if ( is_array( $a ) ) {
			foreach ( array( 'd', 't', 'm' ) as $dev ) {
				if ( isset( $a[ $dev ] ) && in_array( $a[ $dev ], $aligns, true ) ) {
					$font['align'][ $dev ] = $a[ $dev ];
				}
			}
		} elseif ( in_array( $a, $aligns, true ) ) {
			$font['align'] = array( 'd' => $a );
		}
		$lh = $in['font']['lineHeight'] ?? '';
		if ( is_numeric( $lh ) && $lh >= 0 && $lh <= 10 ) {
			$font['lineHeight'] = (string) ( 0 + $lh );
		}
		$ls = self::length( $in['font']['letterSpacing'] ?? '' );
		if ( '' !== $ls ) {
			$font['letterSpacing'] = $ls;
		}
		$out['font'] = $font;

		foreach ( array( 'padding', 'margin' ) as $prop ) {
			foreach ( array( 'd', 't', 'm' ) as $dev ) {
				foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
					$v = self::length( $in[ $prop ][ $dev ][ $side ] ?? '', 'margin' === $prop );
					if ( '' !== $v ) {
						$out[ $prop ][ $dev ][ $side ] = $v;
					}
				}
			}
		}
		foreach ( array( 'd', 't', 'm' ) as $dev ) {
			if ( 'd' !== $dev ) {
				$n = (int) ( $in['cols'][ $dev ] ?? 0 );
				if ( $n >= 1 && $n <= 12 ) {
					$out['cols'][ $dev ] = $n;
				}
				$st = $in['stack'][ $dev ] ?? '';
				if ( in_array( $st, array( 'row', 'column', 'column-reverse', 'row-reverse' ), true ) ) {
					$out['stack'][ $dev ] = $st;
				}
			}
			$v = self::length( $in['gap'][ $dev ] ?? '' );
			if ( '' !== $v ) {
				$out['gap'][ $dev ] = $v;
			}
			foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
				$inset = self::length( $in['inset'][ $dev ][ $side ] ?? '', true );
				if ( '' !== $inset ) {
					$out['inset'][ $dev ][ $side ] = $inset;
				}
			}
			$v = self::length( $in['minHeight'][ $dev ] ?? '' );
			if ( '' !== $v ) {
				$out['minHeight'][ $dev ] = $v;
			}
		}

		$border = array(
			'width'  => self::length( $in['border']['width'] ?? '' ),
			'color'  => self::color( $in['border']['color'] ?? '' ),
			'hover'  => self::color( $in['border']['hover'] ?? '' ),
			'radius' => self::length( $in['border']['radius'] ?? '' ),
		);
		$bs     = $in['border']['style'] ?? '';
		if ( in_array( $bs, array( 'solid', 'dashed', 'dotted', 'double' ), true ) ) {
			$border['style'] = $bs;
		}
		$out['border'] = array_filter( $border, 'strlen' );

		$out['shadow']      = self::shadow( $in['shadow'] ?? null );
		$out['shadowHover'] = self::shadow( $in['shadowHover'] ?? null );

		if ( in_array( $in['position'] ?? '', array( 'relative', 'absolute', 'fixed', 'sticky' ), true ) ) {
			$out['position'] = $in['position'];
		}
		if ( isset( $in['zIndex'] ) && is_numeric( $in['zIndex'] ) && abs( (int) $in['zIndex'] ) <= 9999 ) {
			$out['zIndex'] = (int) $in['zIndex'];
		}
		if ( isset( $in['opacity'] ) && is_numeric( $in['opacity'] ) && $in['opacity'] >= 0 && $in['opacity'] <= 1 ) {
			$out['opacity'] = (string) ( 0 + $in['opacity'] );
		}

		$fx  = array();
		$map = array(
			'scale'    => array( 0.5, 2 ),
			'rotate'   => array( -180, 180 ),
			'lift'     => array( 0, 50 ),
			'duration' => array( 0, 3000 ),
		);
		foreach ( $map as $k => $range ) {
			if ( isset( $in['hoverFx'][ $k ] ) && is_numeric( $in['hoverFx'][ $k ] ) ) {
				$n = 0 + $in['hoverFx'][ $k ];
				if ( $n >= $range[0] && $n <= $range[1] ) {
					$fx[ $k ] = $n;
				}
			}
		}
		$out['hoverFx'] = $fx;

		$out['hide'] = array();
		foreach ( array( 'd', 't', 'm' ) as $dev ) {
			if ( ! empty( $in['hide'][ $dev ] ) ) {
				$out['hide'][ $dev ] = true;
			}
		}

		$anim = array();
		$type = $in['anim']['type'] ?? '';
		if ( in_array( $type, array( 'fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'flip' ), true ) ) {
			$anim['type'] = $type;
			foreach ( array(
				'duration' => 5000,
				'delay'    => 5000,
			) as $k => $max ) {
				if ( isset( $in['anim'][ $k ] ) && is_numeric( $in['anim'][ $k ] ) && $in['anim'][ $k ] >= 0 && $in['anim'][ $k ] <= $max ) {
					$anim[ $k ] = 0 + $in['anim'][ $k ];
				}
			}
		}
		$out['anim'] = $anim;

		$vis   = array();
		$login = $in['vis']['login'] ?? '';
		if ( in_array( $login, array( 'in', 'out' ), true ) ) {
			$vis['login'] = $login;
		}
		foreach ( array( 'from', 'to' ) as $k ) {
			$d = $in['vis'][ $k ] ?? '';
			if ( is_string( $d ) && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $d ) ) {
				$vis[ $k ] = $d;
			}
		}
		$out['vis'] = $vis;

		$aria = array();
		if ( ! empty( $in['aria']['label'] ) && is_string( $in['aria']['label'] ) ) {
			$aria['label'] = sanitize_text_field( $in['aria']['label'] );
		}
		$role = $in['aria']['role'] ?? '';
		if ( in_array( $role, array( 'region', 'navigation', 'complementary', 'banner', 'contentinfo', 'main', 'search', 'group', 'presentation' ), true ) ) {
			$aria['role'] = $role;
		}
		$out['aria'] = $aria;

		if ( ! empty( $in['customCss'] ) && is_string( $in['customCss'] ) ) {
			$out['customCss'] = self::custom_css( $in['customCss'] );
		}

		return array_filter(
			$out,
			function ( $v ) {
				return ! ( is_array( $v ) && empty( $v ) ) && '' !== $v;
			}
		);
	}

	private static function color( $v ) {
		if ( ! is_string( $v ) ) {
			return '';
		}
		$v = trim( $v );
		if ( preg_match( '/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9.,%\s\/a-z-]{3,60}\)|var\(--[a-z0-9_-]{1,60}\)|[a-z]{3,20})$/i', $v ) ) {
			return $v;
		}
		return '';
	}

	private static function gradient( $v ) {
		if ( ! is_string( $v ) ) {
			return '';
		}
		$v = trim( $v );
		if ( ! preg_match( '/^(repeating-)?(linear|radial|conic)-gradient\(/i', $v ) ) {
			return '';
		}
		if ( strlen( $v ) > 400 || ! preg_match( '/^[a-z0-9#%.,()\s\/-]+$/i', $v ) ) {
			return '';
		}
		if ( substr_count( $v, '(' ) !== substr_count( $v, ')' ) ) {
			return '';
		}
		return $v;
	}

	/**
	 * A CSS length. Accepts numbers, px/em/rem/%/vh/vw units and WordPress
	 * spacing presets ("var:preset|spacing|40").
	 */
	private static function length( $v, $allow_auto = false ) {
		if ( is_int( $v ) || is_float( $v ) ) {
			$v = (string) $v;
		}
		if ( ! is_string( $v ) ) {
			return '';
		}
		$v = trim( $v );
		if ( $allow_auto && 'auto' === $v ) {
			return $v;
		}
		if ( preg_match( '/^var:preset\|([a-z-]+)\|([a-z0-9-]+)$/i', $v, $m ) ) {
			return 'var(--wp--preset--' . $m[1] . '--' . $m[2] . ')';
		}
		// Global style presets from Settings > Kriti Global Styles.
		if ( preg_match( '/^var\(--kb-(space|font)-[a-z0-9-]{1,30}\)$/', $v ) ) {
			return $v;
		}
		if ( preg_match( '/^-?(\d+|\d*\.\d+)(px|em|rem|%|vh|vw|vmin|vmax|ch)?$/', $v ) ) {
			return $v;
		}
		return '';
	}

	private static function shadow( $v ) {
		if ( ! is_array( $v ) ) {
			return '';
		}
		$parts = array();
		foreach ( array( 'x', 'y', 'blur', 'spread' ) as $k ) {
			$n = self::length( $v[ $k ] ?? '0' );
			if ( '' === $n ) {
				return '';
			}
			$parts[] = ( preg_match( '/[a-z%]$/', $n ) ? $n : $n . 'px' );
		}
		$color = self::color( $v['color'] ?? 'rgba(0,0,0,.25)' );
		if ( '' === $color ) {
			return '';
		}
		if ( 0 === (float) $parts[0] && 0 === (float) $parts[1] && 0 === (float) $parts[2] && 0 === (float) $parts[3] ) {
			return '';
		}
		return implode( ' ', $parts ) . ' ' . $color;
	}

	/**
	 * Strips anything that could break out of the <style> element or load
	 * remote or scripted content.
	 */
	private static function custom_css( $css ) {
		$css = wp_strip_all_tags( $css );
		$css = preg_replace( '#/\*.*?\*/#s', '', $css );
		if ( preg_match( '/@import|expression\s*\(|javascript:|behavior\s*:|-moz-binding|url\s*\(/i', $css ) ) {
			return '';
		}
		return substr( trim( $css ), 0, 5000 );
	}
}
