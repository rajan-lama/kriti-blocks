<?php
/**
 * Dynamic content for the Heading and Text blocks.
 *
 * Both blocks are static, so the text typed in the editor stays in the saved
 * markup and acts as the fallback. When a block has a `kbDynamic` source, the
 * text is replaced with the live value as the block renders. Every value is
 * plain text and is escaped before it is printed.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Dynamic {

	const ATTRIBUTE = 'kbDynamic';
	const BLOCKS    = array( 'kriti-blocks/heading', 'kriti-blocks/text' );
	const TAGS      = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span' );
	const SOURCES   = array(
		'post_title',
		'post_excerpt',
		'post_date',
		'post_modified',
		'post_author',
		'post_terms',
		'site_title',
		'site_tagline',
		'current_year',
		'meta',
		'acf',
	);

	const IMAGE_SOURCES = array( 'featured_image', 'meta_image', 'acf_image', 'site_logo', 'author_avatar' );
	const LINK_SOURCES  = array( 'post_permalink', 'author_posts', 'home', 'meta', 'acf' );
	const SCHEMES       = array( '', 'mailto:', 'tel:' );

	/**
	 * Text slots for other blocks: block => slot => class of the element that holds the text.
	 * The slot ids are also listed in src/extensions/DynamicSlots.js for the editor.
	 */
	const SLOTS = array(
		'kriti-blocks/team-member' => array(
			'name' => 'bw-team-member-name',
			'role' => 'bw-team-member-role',
			'bio'  => 'bw-team-member-bio',
		),
		'kriti-blocks/testimonial' => array(
			'quote'  => 'bw-testimonial-quote',
			'author' => 'bw-testimonial-author',
			'role'   => 'bw-testimonial-role',
		),
		'kriti-blocks/feature' => array(
			'title'       => 'bw-feature__title',
			'description' => 'bw-feature__description',
		),
		'kriti-blocks/quote' => array(
			'content'  => 'bw-quote-content',
			'citation' => 'bw-quote-citation',
		),
		'kriti-blocks/stat' => array(
			'label' => 'bw-stat-label',
		),
		'kriti-blocks/alert' => array(
			'title'   => 'bw-alert-title',
			'content' => 'bw-alert-content',
		),
		'kriti-blocks/pricing-column' => array(
			'plan' => 'bw-pricing-plan',
		),
	);

	/**
	 * Link slots: block => slot => anchor class. `inside` means the anchor sits
	 * inside the element with that class. The link must already exist in the
	 * saved markup, so a URL has to be set in the block first.
	 */
	const LINK_SLOTS = array(
		'kriti-blocks/card'           => array(
			'link' => array(
				'class'  => 'bw-card-link',
				'inside' => false,
			),
		),
		'kriti-blocks/feature'        => array(
			'link' => array(
				'class'  => 'bw-feature__link',
				'inside' => false,
			),
		),
		'kriti-blocks/pricing-column' => array(
			'button' => array(
				'class'  => 'bw-pricing-button',
				'inside' => false,
			),
		),
		'kriti-blocks/team-member'    => array(
			'profile' => array(
				'class'  => 'bw-team-member-name',
				'inside' => true,
			),
		),
	);

	const SLOTS_ATTRIBUTE = 'kbDynamicSlots';
	const LINKS_ATTRIBUTE = 'kbDynamicLinks';

	public static function init() {
		foreach ( self::BLOCKS as $name ) {
			add_filter( 'render_block_' . $name, array( __CLASS__, 'render' ), 10, 2 );
		}
		// Early, so the Design layer (priority 10) styles the result, including an
		// image built here when none was saved in the editor.
		add_filter( 'render_block', array( __CLASS__, 'render_other' ), 5, 2 );
	}

	/**
	 * Routes the image and buttons blocks to their handlers.
	 */
	public static function render_other( $content, $block ) {
		switch ( $block['blockName'] ?? '' ) {
			case 'kriti-blocks/image':
				return self::render_image( $content, $block );
			case 'kriti-blocks/buttons':
				return self::render_buttons( $content, $block );
		}
		$name = $block['blockName'] ?? '';
		if ( isset( self::SLOTS[ $name ] ) || isset( self::LINK_SLOTS[ $name ] ) ) {
			return self::render_slots( $content, $block );
		}
		if ( 'kriti-blocks/list' === $name ) {
			return self::render_list( $content, $block );
		}
		return $content;
	}

	/*
	------------------------------------------------------------------
	 * Links and images
	 * ---------------------------------------------------------------- */

	/**
	 * Checks a `{source, key, scheme}` object against an allowed source list.
	 *
	 * @param mixed    $raw     Saved value.
	 * @param string[] $allowed Allowed sources.
	 * @return array|null
	 */
	public static function sanitize_source( $raw, array $allowed ) {
		if ( ! is_array( $raw ) || ! in_array( $raw['source'] ?? '', $allowed, true ) ) {
			return null;
		}
		$key    = is_string( $raw['key'] ?? null ) && preg_match( '/^[A-Za-z0-9_\-]{1,64}$/', $raw['key'] ) ? $raw['key'] : '';
		$scheme = $raw['scheme'] ?? '';
		$scheme = is_string( $scheme ) && in_array( $scheme, self::SCHEMES, true ) ? $scheme : '';
		return array(
			'source' => $raw['source'],
			'key'    => $key,
			'scheme' => $scheme,
		);
	}

	/**
	 * The current post, only when its data may be shown to this visitor.
	 *
	 * @return \WP_Post|null
	 */
	private static function visible_post() {
		$post = get_post();
		if ( ! $post || post_password_required( $post ) || ( 'publish' !== $post->post_status && ! current_user_can( 'read_post', $post->ID ) ) ) {
			return null;
		}
		return $post;
	}

	/**
	 * Resolves a link source to a safe URL, or '' when there is none.
	 */
	public static function resolve_link( array $cfg ) {
		$url = '';
		switch ( $cfg['source'] ) {
			case 'home':
				$url = home_url( '/' );
				break;
			case 'post_permalink':
				$post = self::visible_post();
				$url  = $post ? (string) get_permalink( $post ) : '';
				break;
			case 'author_posts':
				$post = self::visible_post();
				$url  = $post ? (string) get_author_posts_url( (int) $post->post_author ) : '';
				break;
			case 'meta':
			case 'acf':
				$post = self::visible_post();
				$url  = $post ? self::field_value( $cfg['source'], $cfg['key'], $post ) : '';
				if ( '' !== $url ) {
					$url = $cfg['scheme'] . $url;
				}
				break;
		}
		if ( '' === $url ) {
			return '';
		}
		// Only normal web, mail and phone links. This refuses javascript: and data: URLs.
		return (string) esc_url_raw( $url, array( 'http', 'https', 'mailto', 'tel' ) );
	}

	/**
	 * Resolves an image source to a URL and alt text, or null.
	 *
	 * @return array{url:string,alt:string}|null
	 */
	public static function resolve_image( array $cfg ) {
		$post = in_array( $cfg['source'], array( 'featured_image', 'meta_image', 'acf_image', 'author_avatar' ), true ) ? self::visible_post() : null;
		$id   = 0;
		switch ( $cfg['source'] ) {
			case 'featured_image':
				$id = $post ? (int) get_post_thumbnail_id( $post ) : 0;
				break;
			case 'site_logo':
				$id = (int) get_theme_mod( 'custom_logo' );
				break;
			case 'author_avatar':
				if ( $post ) {
					$url = get_avatar_url( (int) $post->post_author, array( 'size' => 256 ) );
					return $url ? array(
						'url' => esc_url_raw( $url ),
						'alt' => '',
					) : null;
				}
				return null;
			case 'meta_image':
			case 'acf_image':
				if ( ! $post || '' === $cfg['key'] || is_protected_meta( $cfg['key'], 'post' )
					|| ! apply_filters( 'kriti_blocks_dynamic_field_allowed', true, $cfg['key'], $post )
				) {
					return null;
				}
				if ( 'acf_image' === $cfg['source'] ) {
					if ( ! function_exists( 'get_field' ) ) {
						return null;
					}
					$value = get_field( $cfg['key'], $post->ID );
					$value = is_array( $value ) ? ( $value['ID'] ?? $value['id'] ?? '' ) : $value;
				} else {
					$value = get_post_meta( $post->ID, $cfg['key'], true );
				}
				if ( is_numeric( $value ) ) {
					$id = (int) $value;
				} elseif ( is_string( $value ) ) {
					$url = esc_url_raw( $value, array( 'http', 'https' ) );
					return '' !== $url ? array(
						'url' => $url,
						'alt' => '',
					) : null;
				}
				break;
		}
		if ( $id <= 0 || ! wp_attachment_is_image( $id ) ) {
			return null;
		}
		$url = wp_get_attachment_image_url( $id, 'large' );
		return $url ? array(
			'url' => esc_url_raw( $url ),
			'alt' => (string) get_post_meta( $id, '_wp_attachment_image_alt', true ),
		) : null;
	}

	/**
	 * Replaces the text of the element that has this class. If the text sits
	 * inside a link, the link is kept. Returns the markup unchanged when the
	 * element is not found.
	 */
	private static function replace_slot_text( $html, $class, $text ) {
		$pattern = '#(<([a-z0-9]+)\b[^>]*\bclass="[^"]*(?<![\w-])' . preg_quote( $class, '#' ) . '(?![\w-])[^"]*"[^>]*>)(.*?)(</\2>)#s';
		$result  = preg_replace_callback(
			$pattern,
			static function ( $m ) use ( $text ) {
				$inner = $m[3];
				if ( preg_match( '#^(\s*<a\b[^>]*>)(.*)(</a>\s*)$#s', $inner, $a ) ) {
					return $m[1] . $a[1] . $text . $a[3] . $m[4];
				}
				return $m[1] . $text . $m[4];
			},
			$html,
			1
		);
		return null === $result ? $html : $result;
	}

	/**
	 * Sets the link on the anchor with this class (or inside the element with it).
	 */
	private static function replace_slot_link( $html, $class, $inside, $href ) {
		$tags = new \WP_HTML_Tag_Processor( $html );
		if ( $inside ) {
			if ( ! $tags->next_tag( array( 'class_name' => $class ) ) || ! $tags->next_tag( 'a' ) ) {
				return $html;
			}
		} elseif ( ! $tags->next_tag(
			array(
				'tag_name'   => 'a',
				'class_name' => $class,
			)
		) ) {
			return $html;
		}
		$tags->set_attribute( 'href', $href );
		return $tags->get_updated_html();
	}

	/**
	 * Other blocks: swaps the text and links in each configured slot. Saved values are the fallback.
	 */
	private static function render_slots( $content, $block ) {
		// Needs WordPress 6.2 or newer. On older versions the block is shown as saved.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $content;
		}
		$name = $block['blockName'];
		if ( '' === trim( $content ) ) {
			return $content;
		}
		$texts = $block['attrs'][ self::SLOTS_ATTRIBUTE ] ?? null;
		if ( is_array( $texts ) && isset( self::SLOTS[ $name ] ) ) {
			foreach ( self::SLOTS[ $name ] as $slot => $class ) {
				$cfg = self::sanitize( $texts[ $slot ] ?? null );
				if ( ! $cfg ) {
					continue;
				}
				$value = trim( self::resolve( $cfg ) );
				if ( '' !== $value ) {
					$content = self::replace_slot_text( $content, $class, esc_html( $cfg['prefix'] . $value . $cfg['suffix'] ) );
				}
			}
		}
		$links = $block['attrs'][ self::LINKS_ATTRIBUTE ] ?? null;
		if ( is_array( $links ) && isset( self::LINK_SLOTS[ $name ] ) ) {
			foreach ( self::LINK_SLOTS[ $name ] as $slot => $spec ) {
				$cfg  = self::sanitize_source( $links[ $slot ] ?? null, self::LINK_SOURCES );
				$href = $cfg ? self::resolve_link( $cfg ) : '';
				if ( '' !== $href ) {
					$content = self::replace_slot_link( $content, $spec['class'], $spec['inside'], $href );
				}
			}
		}
		return $content;
	}

	/**
	 * List block: per-item dynamic text and link. Items match the saved list
	 * items in order, skipping items with no text, as the block does when saving.
	 */
	private static function render_list( $content, $block ) {
		// Needs WordPress 6.2 or newer. On older versions the block is shown as saved.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $content;
		}
		$items = $block['attrs']['items'] ?? null;
		if ( ! is_array( $items ) || '' === trim( $content ) ) {
			return $content;
		}
		$visible = array_values(
			array_filter(
				$items,
				static function ( $item ) {
					return is_array( $item ) && '' !== trim( (string) ( $item['text'] ?? '' ) );
				}
			)
		);
		$any     = false;
		foreach ( $visible as $item ) {
			if ( ! empty( $item['dynamic'] ) ) {
				$any = true;
				break;
			}
		}
		if ( ! $any ) {
			return $content;
		}
		$index  = 0;
		$result = preg_replace_callback(
			'#<li\b[^>]*\bbw-list__item\b[^>]*>.*?</li>#s',
			static function ( $m ) use ( &$index, $visible ) {
				$item = $visible[ $index++ ] ?? null;
				$dyn  = is_array( $item ) && is_array( $item['dynamic'] ?? null ) ? $item['dynamic'] : null;
				if ( ! $dyn ) {
					return $m[0];
				}
				$html = $m[0];
				$cfg  = self::sanitize( $dyn['text'] ?? null );
				if ( $cfg ) {
					$value = trim( self::resolve( $cfg ) );
					if ( '' !== $value ) {
						$html = self::replace_slot_text( $html, 'bw-list__text', esc_html( $cfg['prefix'] . $value . $cfg['suffix'] ) );
					}
				}
				$link = self::sanitize_source( $dyn['link'] ?? null, self::LINK_SOURCES );
				$href = $link ? self::resolve_link( $link ) : '';
				if ( '' !== $href ) {
					$html = self::replace_slot_link( $html, 'bw-list__link', false, $href );
				}
				return $html;
			},
			$content
		);
		return null === $result ? $content : $result;
	}

	/**
	 * Image block: swaps the picture and/or link. The saved image is the fallback.
	 */
	private static function render_image( $content, $block ) {
		// Needs WordPress 6.2 or newer. On older versions the block is shown as saved.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $content;
		}
		$cfg   = is_array( $block['attrs'][ self::ATTRIBUTE ] ?? null ) ? $block['attrs'][ self::ATTRIBUTE ] : array();
		$image = self::sanitize_source( $cfg['image'] ?? null, self::IMAGE_SOURCES );
		$link  = self::sanitize_source( $cfg['link'] ?? null, self::LINK_SOURCES );
		if ( ! $image && ! $link ) {
			return $content;
		}
		$picture = $image ? self::resolve_image( $image ) : null;
		$href    = $link ? self::resolve_link( $link ) : '';

		if ( '' === trim( $content ) ) {
			// No picture was chosen in the editor, so build a minimal one.
			if ( ! $picture ) {
				return $content;
			}
			$content = '<figure class="wp-block-kriti-blocks-image"><img class="bw-image" src="" alt=""></figure>';
		}

		$tags = new \WP_HTML_Tag_Processor( $content );
		if ( $picture && $tags->next_tag( 'img' ) ) {
			$tags->set_attribute( 'src', $picture['url'] );
			$tags->remove_attribute( 'srcset' );
			$tags->remove_attribute( 'sizes' );
			if ( '' === (string) $tags->get_attribute( 'alt' ) && '' !== $picture['alt'] ) {
				$tags->set_attribute( 'alt', $picture['alt'] );
			}
		}
		$content = $tags->get_updated_html();

		// A lightbox link should open the new picture rather than the saved one.
		$tags = new \WP_HTML_Tag_Processor( $content );
		if ( $tags->next_tag( 'a' ) ) {
			$is_lightbox = null !== $tags->get_attribute( 'data-bw-lightbox' );
			if ( $is_lightbox && $picture ) {
				$tags->set_attribute( 'href', $picture['url'] );
			} elseif ( ! $is_lightbox && '' !== $href ) {
				$tags->set_attribute( 'href', $href );
			}
			return $tags->get_updated_html();
		}
		if ( '' !== $href ) {
			// No link saved: wrap the picture.
			$content = preg_replace( '#(<img\b[^>]*>)#', '<a href="' . esc_url( $href ) . '">$1</a>', $content, 1 );
		}
		return (string) $content;
	}

	/**
	 * Buttons block: per-button dynamic link and text. Saved values are the fallback.
	 */
	private static function render_buttons( $content, $block ) {
		// Needs WordPress 6.2 or newer. On older versions the block is shown as saved.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $content;
		}
		$buttons = $block['attrs']['buttons'] ?? array();
		if ( ! is_array( $buttons ) ) {
			return $content;
		}
		$any = false;
		foreach ( $buttons as $btn ) {
			if ( is_array( $btn ) && ! empty( $btn['dynamic'] ) ) {
				$any = true;
				break;
			}
		}
		if ( ! $any ) {
			return $content;
		}
		$buttons = array_values( $buttons );
		$index   = 0;
		$result  = preg_replace_callback(
			'#<a\b[^>]*>.*?</a>#s',
			static function ( $m ) use ( &$index, $buttons ) {
				$btn = $buttons[ $index++ ] ?? null;
				$dyn = is_array( $btn ) && is_array( $btn['dynamic'] ?? null ) ? $btn['dynamic'] : null;
				if ( ! $dyn ) {
					return $m[0];
				}
				$html = $m[0];
				$link = self::sanitize_source( $dyn['link'] ?? null, self::LINK_SOURCES );
				$href = $link ? self::resolve_link( $link ) : '';
				if ( '' !== $href ) {
					$tags = new \WP_HTML_Tag_Processor( $html );
					if ( $tags->next_tag( 'a' ) ) {
						$tags->set_attribute( 'href', $href );
						$html = $tags->get_updated_html();
					}
				}
				$text_cfg = self::sanitize( $dyn['text'] ?? null );
				if ( $text_cfg ) {
					$value = trim( self::resolve( $text_cfg ) );
					if ( '' !== $value ) {
						$text = esc_html( $text_cfg['prefix'] . $value . $text_cfg['suffix'] );
						$html = preg_replace_callback(
							'#(<span class="kb-btn__label"[^>]*>)(.*?)(</span>)#s',
							static function ( $p ) use ( $text ) {
								return $p[1] . $text . $p[3];
							},
							$html,
							1
						);
					}
				}
				return $html;
			},
			$content
		);
		return null === $result ? $content : $result;
	}

	/**
	 * Resolves a source to plain text. Returns '' when there is nothing to show.
	 *
	 * @param array $config Sanitized configuration.
	 * @return string
	 */
	public static function resolve( array $config ) {
		$source = $config['source'];
		$post   = get_post();

		if ( in_array( $source, array( 'post_title', 'post_excerpt', 'post_date', 'post_modified', 'post_author', 'post_terms', 'meta', 'acf' ), true ) ) {
			// Never reveal post data the visitor could not see on the page itself.
			if ( ! $post || post_password_required( $post ) || ( 'publish' !== $post->post_status && ! current_user_can( 'read_post', $post->ID ) ) ) {
				return '';
			}
		}

		switch ( $source ) {
			case 'post_title':
				return wp_strip_all_tags( get_the_title( $post ) );
			case 'post_excerpt':
				return wp_strip_all_tags( get_the_excerpt( $post ) );
			case 'post_date':
				return (string) get_the_date( $config['format'], $post );
			case 'post_modified':
				return (string) get_the_modified_date( $config['format'], $post );
			case 'post_author':
				return (string) get_the_author_meta( 'display_name', $post->post_author );
			case 'post_terms':
				$names = wp_get_post_terms( $post->ID, $config['key'] ?: 'category', array( 'fields' => 'names' ) );
				return is_wp_error( $names ) ? '' : implode( ', ', array_map( 'wp_strip_all_tags', $names ) );
			case 'site_title':
				return wp_strip_all_tags( get_bloginfo( 'name' ) );
			case 'site_tagline':
				return wp_strip_all_tags( get_bloginfo( 'description' ) );
			case 'current_year':
				return (string) wp_date( 'Y' );
			case 'meta':
			case 'acf':
				return self::field_value( $source, $config['key'], $post );
		}
		return '';
	}

	private static function field_value( $source, $key, $post ) {
		// Keys that start with an underscore are private to plugins and WordPress.
		if ( '' === $key || is_protected_meta( $key, 'post' ) ) {
			return '';
		}
		/**
		 * Lets a site block specific custom fields from appearing in blocks.
		 *
		 * @param bool    $allowed Whether the field may be shown.
		 * @param string  $key     Field name.
		 * @param WP_Post $post    Current post.
		 */
		if ( ! apply_filters( 'kriti_blocks_dynamic_field_allowed', true, $key, $post ) ) {
			return '';
		}
		if ( 'acf' === $source ) {
			if ( ! function_exists( 'get_field' ) ) {
				return '';
			}
			$value = get_field( $key, $post->ID );
		} else {
			$value = get_post_meta( $post->ID, $key, true );
		}
		// Only simple values. Arrays and objects are skipped.
		return is_scalar( $value ) ? wp_strip_all_tags( (string) $value ) : '';
	}

	/**
	 * Checks the saved configuration and drops anything unexpected.
	 *
	 * @param mixed $raw Value of the `kbDynamic` attribute.
	 * @return array|null Clean configuration or null when unused.
	 */
	public static function sanitize( $raw ) {
		if ( ! is_array( $raw ) || ! in_array( $raw['source'] ?? '', self::SOURCES, true ) ) {
			return null;
		}
		// sanitize_text_field() trims, which would drop the space in "By: ", so keep one edge space.
		$text = static function ( $value, $max ) {
			if ( ! is_string( $value ) ) {
				return '';
			}
			$clean = mb_substr( sanitize_text_field( $value ), 0, $max );
			if ( '' !== $clean ) {
				$clean = ( preg_match( '/^\s/', $value ) ? ' ' : '' ) . $clean . ( preg_match( '/\s$/', $value ) ? ' ' : '' );
			}
			return $clean;
		};
		$key  = is_string( $raw['key'] ?? null ) && preg_match( '/^[A-Za-z0-9_\-]{1,64}$/', $raw['key'] ) ? $raw['key'] : '';
		return array(
			'source' => $raw['source'],
			'key'    => $key,
			'format' => $text( $raw['format'] ?? '', 30 ),
			'prefix' => $text( $raw['prefix'] ?? '', 100 ),
			'suffix' => $text( $raw['suffix'] ?? '', 100 ),
		);
	}

	public static function render( $content, $block ) {
		$config = self::sanitize( $block['attrs'][ self::ATTRIBUTE ] ?? null );
		if ( ! $config ) {
			return $content;
		}

		$value = trim( self::resolve( $config ) );
		if ( '' === $value ) {
			// Nothing to show: keep the text typed in the editor.
			return $content;
		}

		$tag = $block['attrs']['tagType'] ?? ( 'kriti-blocks/heading' === $block['blockName'] ? 'h2' : 'p' );
		if ( ! in_array( $tag, self::TAGS, true ) ) {
			return $content;
		}

		// The main element is the first one of that tag that is not the subheading.
		$pattern = '#(<' . $tag . '\b(?![^>]*kb-heading-sub)[^>]*>)(.*?)(</' . $tag . '>)#s';
		$text    = esc_html( $config['prefix'] . $value . $config['suffix'] );
		$result  = preg_replace_callback(
			$pattern,
			static function ( $m ) use ( $text ) {
				return $m[1] . $text . $m[3];
			},
			$content,
			1,
			$count
		);
		return ( $count && null !== $result ) ? $result : $content;
	}
}
