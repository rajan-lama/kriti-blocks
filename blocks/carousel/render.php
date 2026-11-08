<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * ----------------------------------------
 * 1. Attributes Filter
 * ----------------------------------------
 */
$attributes = apply_filters(
	'bw_slider_block_attributes',
	$attributes,
	$content
);

$slides                = $attributes['slides'] ?? [];
$showTitle             = $attributes['showTitle'] ?? true;
$showDescription       = $attributes['showDescription'] ?? true;
$showSubtitle          = $attributes['showSubtitle'] ?? true;
$showPrimaryButtons    = $attributes['showPrimaryButtons'] ?? true;
$showSecondaryButtons  = $attributes['showSecondaryButtons'] ?? false;
$interval              = $attributes['interval'] ?? 3000;
$showIndicators        = $attributes['showIndicators'] ?? true;
$showControls          = $attributes['showControls'] ?? true;
$slideEffect           = $attributes['slideEffect'] ?? 'slide';

/**
 * Optional options added after the first release. Each default reproduces the
 * earlier output, and every value is validated before it reaches the markup.
 */
$kb_bool = static function ( $key ) use ( $attributes ) {
	return ! array_key_exists( $key, $attributes ) || rest_sanitize_boolean( $attributes[ $key ] );
};
$kb_num = static function ( $key, $min, $max ) use ( $attributes ) {
	$value = $attributes[ $key ] ?? null;
	if ( '' === $value || null === $value || ! is_numeric( $value ) ) {
		return null;
	}
	return (int) round( max( $min, min( $max, (float) $value ) ) );
};

$autoplay      = $kb_bool( 'autoplay' );
$pause_hover   = $kb_bool( 'pauseOnHover' );
$loop          = $kb_bool( 'loop' );
$touch         = $kb_bool( 'touch' );
$control_theme = ( $attributes['controlTheme'] ?? '' ) === 'dark' ? 'dark' : 'light';
$speed         = $kb_num( 'transitionSpeed', 100, 3000 );
$image_height  = $kb_num( 'imageHeight', 100, 1200 );
$image_fit     = in_array( $attributes['imageFit'] ?? '', array( 'cover', 'contain' ), true ) ? $attributes['imageFit'] : '';
$thumbnails    = ! empty( $attributes['showThumbnails'] );
$vertical      = ( $attributes['direction'] ?? '' ) === 'vertical';
$per_view      = $kb_num( 'slidesPerView', 1, 6 ) ?? 1;
$per_view_tab  = $kb_num( 'slidesPerViewTablet', 1, 6 );
$per_view_mob  = $kb_num( 'slidesPerViewMobile', 1, 6 );
$slide_gap     = $kb_num( 'slideGap', 0, 80 );
// More than one slide per view uses a scrolling track instead of Bootstrap's one-at-a-time carousel.
$multi         = $per_view > 1;
$caption_align = in_array( $attributes['captionAlign'] ?? '', array( 'left', 'right' ), true ) ? $attributes['captionAlign'] : '';

$extra_classes = '';
$extra_style   = '';
$extra_data    = '';

if ( 'dark' === $control_theme ) {
	$extra_classes .= ' kb-carousel--dark';
}
if ( $vertical ) {
	$extra_classes .= ' kb-carousel--vertical';
}
if ( $caption_align ) {
	$extra_classes .= ' kb-carousel--cap-' . $caption_align;
}
if ( null !== $speed ) {
	$extra_classes .= ' kb-carousel--speed';
	$extra_style   .= '--kb-car-speed:' . $speed . 'ms;';
}
if ( null !== $image_height ) {
	$extra_classes .= ' kb-carousel--img-h';
	$extra_style   .= '--kb-car-h:' . $image_height . 'px;';
}
if ( $image_fit ) {
	$extra_style .= '--kb-car-fit:' . $image_fit . ';';
}
if ( ! $pause_hover ) {
	$extra_data .= ' data-bs-pause="false"';
}
if ( ! $loop ) {
	$extra_data .= ' data-bs-wrap="false"';
}
if ( ! $touch ) {
	$extra_data .= ' data-bs-touch="false"';
}
if ( '' !== $extra_style ) {
	$extra_data .= ' style="' . esc_attr( $extra_style ) . '"';
}

/**
 * ----------------------------------------
 * 2. Slides Filter
 * ----------------------------------------
 */
$slides = apply_filters(
	'bw_slider_slides',
	$slides,
	$attributes
);

/**
 * ----------------------------------------
 * 3. Carousel Classes
 * ----------------------------------------
 */
$carousel_class = 'carousel slide';

if ($slideEffect === 'fade') {
	$carousel_class .= ' carousel-fade';
}

$carousel_class .= $extra_classes;
if ( $multi ) {
	$carousel_class = 'wp-block-kriti-blocks-carousel kb-carousel kb-carousel--multi' . $extra_classes;
}

$carousel_class = apply_filters(
	'bw_slider_carousel_class',
	$carousel_class,
	$attributes
);

/**
 * ----------------------------------------
 * 4. Slide Count (Indicators)
 * ----------------------------------------
 */
$slide_count = is_array( $slides ) ? count( $slides ) : 0;

/**
 * ----------------------------------------
 * 5. Unique ID
 * ----------------------------------------
 */
$slider_id = apply_filters(
	'bw_slider_id',
	'slider-' . uniqid(),
	$attributes
);


/**
 * Optional thumbnail strip, built here so the default markup is untouched.
 * Bootstrap marks the active thumbnail because it sits in .carousel-indicators.
 */
$thumbs_html = '';
if ( $thumbnails && ! empty( $slides ) ) {
	$thumbs_html .= '<div class="carousel-indicators kb-carousel-thumbs">';
	foreach ( array_values( $slides ) as $thumb_index => $thumb_slide ) {
		$thumbs_html .= sprintf(
			'<button type="button" data-bs-target="#%s" data-bs-slide-to="%d" aria-label="%s"%s><img src="%s" alt=""></button>',
			esc_attr( $slider_id ),
			$thumb_index,
			esc_attr( sprintf( 'Go to slide %d', $thumb_index + 1 ) ),
			0 === $thumb_index ? ' class="active"' : '',
			esc_url( $thumb_slide['image'] ?? '' )
		);
	}
	$thumbs_html .= '</div>';
}

/**
 * ----------------------------------------
 * 6. Start Output Buffer
 * ----------------------------------------
 */
ob_start();
?>

<?php if ( $multi ) :
	$multi_style  = '--kb-car-cols-d:' . $per_view . ';';
	$multi_style .= null !== $per_view_tab ? '--kb-car-cols-t:' . $per_view_tab . ';' : '';
	$multi_style .= null !== $per_view_mob ? '--kb-car-cols-m:' . $per_view_mob . ';' : '';
	$multi_style .= null !== $slide_gap ? '--kb-car-gap:' . $slide_gap . 'px;' : '';
	$multi_style .= null !== $image_height ? '--kb-car-h:' . $image_height . 'px;' : '';
	$multi_style .= $image_fit ? '--kb-car-fit:' . $image_fit . ';' : '';
	?>
<div id="<?php echo esc_attr($slider_id); ?>"
	class="<?php echo esc_attr($carousel_class); ?>"
	style="<?php echo esc_attr( $multi_style ); ?>"
	data-columns="<?php echo esc_attr( $per_view ); ?>"
	<?php echo null !== $per_view_tab ? 'data-columns-tablet="' . esc_attr( $per_view_tab ) . '"' : ''; ?>
	<?php echo null !== $per_view_mob ? 'data-columns-mobile="' . esc_attr( $per_view_mob ) . '"' : ''; ?>
	data-autoplay="<?php echo $autoplay ? 'true' : 'false'; ?>"
	data-interval="<?php echo esc_attr( $interval ); ?>">
<?php else : ?>
<div id="<?php echo esc_attr($slider_id); ?>"
	class="<?php echo esc_attr($carousel_class); ?>"<?php echo $autoplay ? "\n\tdata-bs-ride=\"carousel\"" : ''; ?>
	data-bs-interval="<?php echo esc_attr($interval); ?>"<?php echo $extra_data; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built above from fixed attribute names and an esc_attr()'d style. ?>>
<?php endif; ?>

	<?php do_action('bw_slider_before_inner', $attributes); ?>

	<?php echo $multi ? '<div class="kb-carousel__viewport"><div class="kb-carousel__track">' : '<div class="carousel-inner">'; ?>

		<?php foreach ($slides as $index => $slide):

			/**
			 * ----------------------------------------
			 * 7. Single Slide Filter
			 * ----------------------------------------
			 */
			$slide = apply_filters(
				'bw_slider_single_slide',
				$slide,
				$index,
				$attributes
			);

			ob_start();
		?>

		<?php
		// Optional per-slide background and overlay. Colors must be hex values.
		$slide_bg      = sanitize_hex_color( $slide['bgColor'] ?? '' );
		$slide_overlay = sanitize_hex_color( $slide['overlayColor'] ?? '' );
		$slide_style   = '';
		$slide_class   = '';
		if ( $slide_bg ) {
			$slide_style .= 'background-color:' . $slide_bg . ';';
		}
		if ( $slide_overlay ) {
			$overlay_opacity = isset( $slide['overlayOpacity'] ) && is_numeric( $slide['overlayOpacity'] )
				? max( 0, min( 90, (int) $slide['overlayOpacity'] ) )
				: 40;
			$slide_style    .= '--kb-slide-overlay:' . $slide_overlay . ';--kb-slide-overlay-o:' . ( $overlay_opacity / 100 ) . ';';
			$slide_class    .= ' kb-slide--overlay';
		}
		?>
		<div class="<?php echo esc_attr( trim( ( $multi ? 'kb-carousel__slide' : 'carousel-item ' . ( $index === 0 ? 'active' : '' ) ) . $slide_class ) ); ?>"<?php echo '' !== $slide_style ? ' style="' . esc_attr( $slide_style ) . '"' : ''; ?>>

			<?php do_action('bw_slider_before_slide', $slide, $index, $attributes); ?>

			<img src="<?php echo esc_attr($slide['image'] ?? ''); ?>" alt="<?php echo esc_attr($slide['alt'] ?? ''); ?>">

			<div class="carousel-caption d-none d-md-block">

				<?php if ($showTitle && !empty($slide['title'])): ?>
					<h2 class="bw-slider-title">
						<?php echo esc_html($slide['title']); ?>
					</h2>
				<?php endif; ?>

				<?php if ($showSubtitle && !empty($slide['subtitle'])): ?>
					<h5 class="bw-slider-subtitle">
						<?php echo esc_html($slide['subtitle']); ?>
					</h5>
				<?php endif; ?>

				<?php if ($showDescription && !empty($slide['description'])): ?>
					<p class="bw-slider-description">
						<?php echo esc_html($slide['description']); ?>
					</p>
				<?php endif; ?>

				<?php
				/**
				 * ----------------------------------------
				 * 8. Primary Button
				 * ----------------------------------------
				 */
				if ($showPrimaryButtons && !empty($slide['btn1Url']) && !empty($slide['btn1Text'])) {

					$primary_btn = sprintf(
						'<a class="btn btn-primary" href="%s">%s</a>',
						esc_url($slide['btn1Url']),
						esc_html($slide['btn1Text'])
					);

					echo wp_kses_post( apply_filters(
						'bw_slider_primary_button',
						$primary_btn,
						$slide,
						$attributes
					) );
				}

				/**
				 * ----------------------------------------
				 * 9. Secondary Button
				 * ----------------------------------------
				 */
				if ($showSecondaryButtons && !empty($slide['btn2Url']) && !empty($slide['btn2Text'])) {

					$secondary_btn = sprintf(
						'<a class="btn btn-secondary" href="%s">%s</a>',
						esc_url($slide['btn2Url']),
						esc_html($slide['btn2Text'])
					);

					echo wp_kses_post( apply_filters(
						'bw_slider_secondary_button',
						$secondary_btn,
						$slide,
						$attributes
					)) ;
				}
				?>

			</div>

			<?php do_action('bw_slider_after_slide', $slide, $index, $attributes); ?>

		</div>

		<?php
			/**
			 * ----------------------------------------
			 * 10. Slide HTML Filter
			 * ----------------------------------------
			 */
			$slide_html = ob_get_clean();

			echo wp_kses_post( apply_filters(
				'bw_slider_slide_html',
				$slide_html,
				$slide,
				$index,
				$attributes
			));

		endforeach; ?>

	<?php echo $multi ? '</div></div>' : '</div>'; ?>

	<?php do_action('bw_slider_after_inner', $attributes); echo $thumbs_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built above only from esc_attr() and esc_url() values. ?>

	<?php if ( $multi ) : ?>
		<?php if ( $showControls ) : ?>
			<button type="button" class="kb-carousel__arrow kb-carousel__arrow--prev" aria-label="<?php esc_attr_e( 'Previous slides', 'kriti-blocks' ); ?>"><span aria-hidden="true">&#8249;</span></button>
			<button type="button" class="kb-carousel__arrow kb-carousel__arrow--next" aria-label="<?php esc_attr_e( 'Next slides', 'kriti-blocks' ); ?>"><span aria-hidden="true">&#8250;</span></button>
		<?php endif; ?>
		<?php if ( $showIndicators && count( $slides ) > 0 ) : ?>
			<div class="kb-carousel__dots">
				<?php foreach ( array_keys( array_values( $slides ) ) as $dot_index ) : ?>
					<button type="button" class="kb-carousel__dot" aria-label="<?php echo esc_attr( sprintf( /* translators: %d: slide number */ __( 'Go to slide %d', 'kriti-blocks' ), $dot_index + 1 ) ); ?>"></button>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	<?php else : ?>

	<?php if ($showControls): ?>
		<button class="carousel-control-prev"
			type="button"
			data-bs-target="#<?php echo esc_attr($slider_id); ?>"
			data-bs-slide="prev">
			<span class="carousel-control-prev-icon"></span>
		</button>

		<button class="carousel-control-next"
			type="button"
			data-bs-target="#<?php echo esc_attr($slider_id); ?>"
			data-bs-slide="next">
			<span class="carousel-control-next-icon"></span>
		</button>
	<?php endif; ?>

	<?php if ($showIndicators && $slide_count > 0): ?>
		<div class="carousel-indicators">
			<?php for ($i = 0; $i < $slide_count; $i++): ?>
				<button
					type="button"
					data-bs-target="#<?php echo esc_attr($slider_id); ?>"
					data-bs-slide-to="<?php echo esc_attr($i); ?>"
					class="<?php echo $i === 0 ? 'active' : ''; ?>">
				</button>
			<?php endfor; ?>
		</div>
	<?php endif; ?>

	<?php endif; // $multi ?>

</div>

<?php
/**
 * ----------------------------------------
 * 11. Final Output Filter
 * ----------------------------------------
 */
$html = ob_get_clean();

echo wp_kses_post( apply_filters(
	'bw_slider_output',
	$html,
	$attributes,
	$slides
));
