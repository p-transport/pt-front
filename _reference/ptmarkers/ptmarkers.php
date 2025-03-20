<?php
/**
 * Plugin Name: PT Markers
 * Description: Adds marker edit functionality.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action('edit_form_after_title', 'map_on_marker_screen_lw',-1000);
function map_on_marker_screen_lw() {
	$screen = get_current_screen();
	if($screen->post_type=='markers' && $screen->id=='markers') {
		echo "<div id=\"mymap\"></div>";

	}
}

add_action('edit_form_after_title','custom_scripts',200);
function custom_scripts() {
	$screen = get_current_screen();
	if($screen->post_type=='markers' && $screen->id=='markers') {

		wp_register_style( 'leaflet', 
			'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
			false, '1.0.0' );
		wp_enqueue_style( 'leaflet' );

		wp_register_style( 'style_marker_region', 
			plugins_url( '/styles/admin-style.css', __FILE__ ),
			false, '1.0.0' );
		wp_enqueue_style( 'style_marker_region' );

		wp_enqueue_script( 'leaflet', 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js' );
		wp_enqueue_script( 'leafleteditable', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-editable/1.2.0/Leaflet.Editable.min.js' );
		wp_enqueue_script( 'leafletpathdrag', '/wp-content/plugins/ptmarkers/js/Path.Drag.js' );
		
		wp_enqueue_script('my_custom_script', plugin_dir_url(__FILE__) . '/js/main.js');


	}	
}
