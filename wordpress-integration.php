
<?php
/**
 * WordPress Integration Helper for GCSEwala
 * 
 * This file contains the PHP code needed to integrate the GCSEwala
 * homepage and dashboard into WordPress pages.
 */

// Enqueue scripts and styles for homepage
function enqueue_gcsewala_home_assets() {
    $build_dir = get_template_directory_uri() . '/home/';
    
    // Find the main CSS file
    $css_files = glob(get_template_directory() . '/home/assets/index-*.css');
    if (!empty($css_files)) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style('gcsewala-home-css', $build_dir . 'assets/' . $css_file);
    }
    
    // Find the main JS file
    $js_files = glob(get_template_directory() . '/home/assets/index-*.js');
    if (!empty($js_files)) {
        $js_file = basename($js_files[0]);
        wp_enqueue_script('gcsewala-home-js', $build_dir . 'assets/' . $js_file, array(), null, true);
    }
}

// Enqueue scripts and styles for dashboard
function enqueue_gcsewala_dashboard_assets() {
    $build_dir = get_template_directory_uri() . '/dashboard/';
    
    // Find the main CSS file
    $css_files = glob(get_template_directory() . '/dashboard/assets/dashboard-*.css');
    if (!empty($css_files)) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style('gcsewala-dashboard-css', $build_dir . 'assets/' . $css_file);
    }
    
    // Find the main JS file
    $js_files = glob(get_template_directory() . '/dashboard/assets/dashboard-*.js');
    if (!empty($js_files)) {
        $js_file = basename($js_files[0]);
        wp_enqueue_script('gcsewala-dashboard-js', $build_dir . 'assets/' . $js_file, array(), null, true);
    }
}

// Shortcode for homepage
function gcsewala_home_shortcode($atts) {
    // Enqueue assets
    enqueue_gcsewala_home_assets();
    
    // Return the container div where React will mount
    return '<div id="root" style="width: 100%; min-height: 100vh;"></div>';
}
add_shortcode('gcsewala_home', 'gcsewala_home_shortcode');

// Shortcode for dashboard
function gcsewala_dashboard_shortcode($atts) {
    // Enqueue assets
    enqueue_gcsewala_dashboard_assets();
    
    // Return the container div where React will mount
    return '<div id="dashboard-root" style="width: 100%; min-height: 100vh;"></div>';
}
add_shortcode('gcsewala_dashboard', 'gcsewala_dashboard_shortcode');

// Add custom CSS to hide WordPress elements that might interfere
function gcsewala_custom_css() {
    ?>
    <style>
    .gcsewala-page {
        margin: 0 !important;
        padding: 0 !important;
    }
    .gcsewala-page .site-header,
    .gcsewala-page .site-footer {
        display: none !important;
    }
    .gcsewala-page .entry-content {
        padding: 0 !important;
        margin: 0 !important;
    }
    </style>
    <?php
}
add_action('wp_head', 'gcsewala_custom_css');
?>
