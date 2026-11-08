<?php
/**
 * Global styles: named colors, font sizes and spacing values.
 *
 * Saved in one option and printed as CSS variables (--kb-color-*, --kb-font-*,
 * --kb-space-*) on the site and in the editor. The Design panels offer them
 * as presets and store the variable, so changing a value here updates every
 * block that uses it.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Global_Styles {

	const OPTION = 'kriti_blocks_global_styles';
	const PAGE   = 'kriti-blocks-global-styles';
	const MAX    = 12;

	/**
	 * Groups with their CSS variable prefix. Labels are translated on use,
	 * because translations cannot be loaded this early.
	 *
	 * @return array<string,array{prefix:string,label:string}>
	 */
	private static function groups() {
		return array(
			'colors'    => array(
				'prefix' => 'color',
				'label'  => __( 'Colors', 'kriti-blocks' ),
			),
			'fontSizes' => array(
				'prefix' => 'font',
				'label'  => __( 'Font sizes', 'kriti-blocks' ),
			),
			'spacing'   => array(
				'prefix' => 'space',
				'label'  => __( 'Spacing', 'kriti-blocks' ),
			),
		);
	}

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'add_page' ) );
		add_action( 'admin_init', array( __CLASS__, 'register_setting' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'print_front' ), 20 );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'print_editor' ), 20 );
		add_filter( 'block_editor_settings_all', array( __CLASS__, 'add_to_editor_iframe' ) );
	}

	/*
	------------------------------------------------------------------
	 * Data
	 * ---------------------------------------------------------------- */

	public static function get() {
		return self::sanitize( get_option( self::OPTION, array() ) );
	}

	private static function value( $group, $raw ) {
		$raw = is_string( $raw ) ? trim( $raw ) : '';
		if ( 'colors' === $group ) {
			return (string) sanitize_hex_color( $raw );
		}
		return preg_match( '/^\d*\.?\d+(px|em|rem|%|vw|vh)$/', $raw ) ? $raw : '';
	}

	/**
	 * Keeps only valid, unique entries. Used when saving and when reading.
	 *
	 * @param mixed $input Raw option value.
	 * @return array<string,array<int,array{name:string,slug:string,value:string}>>
	 */
	public static function sanitize( $input ) {
		$out   = array();
		$input = is_array( $input ) ? $input : array();
		foreach ( array( 'colors', 'fontSizes', 'spacing' ) as $group ) {
			$out[ $group ] = array();
			$seen          = array();
			$rows          = is_array( $input[ $group ] ?? null ) ? $input[ $group ] : array();
			foreach ( $rows as $row ) {
				if ( ! is_array( $row ) || count( $out[ $group ] ) >= self::MAX ) {
					continue;
				}
				$name  = mb_substr( sanitize_text_field( (string) ( $row['name'] ?? '' ) ), 0, 40 );
				$slug  = substr( sanitize_title( (string) ( $row['slug'] ?? '' ) ?: $name ), 0, 30 );
				$value = self::value( $group, $row['value'] ?? '' );
				if ( '' === $name || '' === $slug || '' === $value || isset( $seen[ $slug ] ) ) {
					continue;
				}
				$seen[ $slug ]   = true;
				$out[ $group ][] = array(
					'name'  => $name,
					'slug'  => $slug,
					'value' => $value,
				);
			}
		}
		return $out;
	}

	public static function css() {
		$data = self::get();
		$vars = '';
		foreach ( self::groups() as $group => $info ) {
			foreach ( $data[ $group ] as $item ) {
				$vars .= '--kb-' . $info['prefix'] . '-' . $item['slug'] . ':' . $item['value'] . ';';
			}
		}
		return '' === $vars ? '' : ':root{' . $vars . '}';
	}

	/*
	------------------------------------------------------------------
	 * Output
	 * ---------------------------------------------------------------- */

	public static function print_front() {
		$css = self::css();
		if ( '' !== $css ) {
			wp_add_inline_style( 'kriti-blocks-design', $css );
		}
	}

	public static function print_editor() {
		$css = self::css();
		if ( '' !== $css ) {
			// For the editor's own document (popovers and swatches).
			wp_add_inline_style( 'kriti-blocks-design-editor', $css );
		}
		$data    = self::get();
		$presets = array(
			'colors'    => array_map(
				static function ( $i ) {
					return array(
						'name'  => $i['name'],
						'color' => 'var(--kb-color-' . $i['slug'] . ')',
						'hex'   => $i['value'],
					);
				},
				$data['colors']
			),
			'fontSizes' => array_map(
				static function ( $i ) {
					return array(
						'name'  => $i['name'] . ' (' . $i['value'] . ')',
						'value' => 'var(--kb-font-' . $i['slug'] . ')',
					);
				},
				$data['fontSizes']
			),
			'spacing'   => array_map(
				static function ( $i ) {
					return array(
						'name'  => $i['name'] . ' (' . $i['value'] . ')',
						'value' => 'var(--kb-space-' . $i['slug'] . ')',
					);
				},
				$data['spacing']
			),
		);
		wp_add_inline_script(
			'kriti-blocks-extensions',
			'window.kritiBlocksGlobal = ' . wp_json_encode( $presets ) . ';',
			'before'
		);
	}

	/**
	 * Puts the variables inside the editor iframe too.
	 */
	public static function add_to_editor_iframe( $settings ) {
		$css = self::css();
		if ( '' !== $css ) {
			$settings['styles'][] = array( 'css' => $css );
		}
		return $settings;
	}

	/*
	------------------------------------------------------------------
	 * Settings page
	 * ---------------------------------------------------------------- */

	public static function register_setting() {
		register_setting(
			self::PAGE,
			self::OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( __CLASS__, 'sanitize' ),
				'default'           => array(),
			)
		);
	}

	public static function add_page() {
		add_options_page(
			__( 'Kriti Global Styles', 'kriti-blocks' ),
			__( 'Kriti Global Styles', 'kriti-blocks' ),
			'manage_options',
			self::PAGE,
			array( __CLASS__, 'render_page' )
		);
	}

	public static function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$data = self::get();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Kriti Global Styles', 'kriti-blocks' ); ?></h1>
			<p><?php esc_html_e( 'Name the colors, font sizes and spacing you use often. They appear as presets in each block\'s Design panels. Blocks keep a link to the preset, so changing a value here changes it everywhere. Leave a row empty to remove it.', 'kriti-blocks' ); ?></p>
			<form method="post" action="options.php">
				<?php settings_fields( self::PAGE ); ?>
				<?php foreach ( self::groups() as $group => $info ) : ?>
					<h2><?php echo esc_html( $info['label'] ); ?></h2>
					<table class="widefat striped" style="max-width:640px">
						<thead><tr>
							<th><?php esc_html_e( 'Name', 'kriti-blocks' ); ?></th>
							<th><?php esc_html_e( 'Slug', 'kriti-blocks' ); ?></th>
							<th><?php echo esc_html( 'colors' === $group ? __( 'Color (hex, like #1d4ed8)', 'kriti-blocks' ) : __( 'Size (like 1.25rem or 24px)', 'kriti-blocks' ) ); ?></th>
						</tr></thead>
						<tbody>
						<?php
						$rows = $data[ $group ];
						// Always show a few empty rows to add to.
						for ( $i = 0; $i < 3; $i++ ) {
							$rows[] = array(
								'name'  => '',
								'slug'  => '',
								'value' => '',
							);
						}
						foreach ( array_slice( $rows, 0, self::MAX ) as $index => $row ) :
							$field = self::OPTION . '[' . $group . '][' . $index . ']';
							?>
							<tr>
								<td><input type="text" class="regular-text" maxlength="40" name="<?php echo esc_attr( $field . '[name]' ); ?>" value="<?php echo esc_attr( $row['name'] ); ?>"></td>
								<td><input type="text" maxlength="30" name="<?php echo esc_attr( $field . '[slug]' ); ?>" value="<?php echo esc_attr( $row['slug'] ); ?>"></td>
								<td><input type="text" maxlength="20" name="<?php echo esc_attr( $field . '[value]' ); ?>" value="<?php echo esc_attr( $row['value'] ); ?>"></td>
							</tr>
						<?php endforeach; ?>
						</tbody>
					</table>
				<?php endforeach; ?>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
