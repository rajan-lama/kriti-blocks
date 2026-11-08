<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://wpblockwriter.com
 * @since      1.0.0
 *
 * @package    Kriti Blocks
 * @subpackage Kriti Blocks/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Kriti Blocks
 * @subpackage Kriti Blocks/public
 * @author     Ri Themes <wpblockwriter@gmail.com>
 */
class Kriti_Blocks_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Kriti_Blocks_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Kriti_Blocks_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/kriti-blocks-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Kriti_Blocks_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Kriti_Blocks_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

    // wp_register_script( 'my-blocks-editor', KRITI_BLOCKS_URL . 'build/index.js', [ 'wp-blocks', 'wp-element', 'wp-editor' ], KRITI_BLOCKS_VERSION );
    // One copy of Bootstrap's script. The admin class loads the same file under this handle on
    // `enqueue_block_assets` (front end and editor), so WordPress prints it once.
    wp_enqueue_script( 'bootstrap-bundle', plugin_dir_url( __FILE__ ) . 'js/bootstrap/bootstrap.bundle.min.js', array(), '5.3.3', true );
    // The old handle stays registered, without a file, for anything that depends on it.
    wp_register_script( 'bootstrap', false, array( 'bootstrap-bundle' ), '5.3.3' );
		wp_enqueue_script( $this->plugin_name . '-public', plugin_dir_url( __FILE__ ) . 'js/kriti-blocks-public.js', array( 'jquery', 'bootstrap-bundle' ), $this->version, false );
	}

}
