
<?php
/**
 * WordPress Integration Code Snippet for GCSEwala
 * 
 * Add this to your WordPress Code Snippets plugin
 * Set it to run on specific page IDs where you want the apps to appear
 */

// Configuration - Update these paths according to your setup
define('GCSEWALA_HOME_PATH', get_site_url() . '/home/');
define('GCSEWALA_DASHBOARD_PATH', get_site_url() . '/dashboard/');

// Function to get asset files from a directory
function get_gcsewala_assets($directory) {
    $assets = array('css' => array(), 'js' => array());
    
    if (is_dir($directory)) {
        $files = scandir($directory);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
                $assets['css'][] = $file;
            } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
                $assets['js'][] = $file;
            }
        }
    }
    
    return $assets;
}

// Enqueue homepage assets
function enqueue_gcsewala_home_assets() {
    $assets_dir = ABSPATH . 'home/assets/';
    $assets_url = GCSEWALA_HOME_PATH . 'assets/';
    
    $assets = get_gcsewala_assets($assets_dir);
    
    // Enqueue CSS files
    foreach ($assets['css'] as $css_file) {
        wp_enqueue_style('gcsewala-home-' . sanitize_title($css_file), $assets_url . $css_file);
    }
    
    // Enqueue JS files
    foreach ($assets['js'] as $js_file) {
        wp_enqueue_script('gcsewala-home-' . sanitize_title($js_file), $assets_url . $js_file, array(), null, true);
    }
}

// Enqueue dashboard assets
function enqueue_gcsewala_dashboard_assets() {
    $assets_dir = ABSPATH . 'dashboard/assets/';
    $assets_url = GCSEWALA_DASHBOARD_PATH . 'assets/';
    
    $assets = get_gcsewala_assets($assets_dir);
    
    // Enqueue CSS files
    foreach ($assets['css'] as $css_file) {
        wp_enqueue_style('gcsewala-dashboard-' . sanitize_title($css_file), $assets_url . $css_file);
    }
    
    // Enqueue JS files
    foreach ($assets['js'] as $js_file) {
        wp_enqueue_script('gcsewala-dashboard-' . sanitize_title($js_file), $assets_url . $js_file, array(), null, true);
    }
}

// Main function to run on specific pages
function gcsewala_page_integration() {
    // Get current page ID
    $page_id = get_the_ID();
    
    // Define your page IDs here
    $home_page_id = 123; // Replace with your actual home page ID
    $dashboard_page_id = 456; // Replace with your actual dashboard page ID
    
    if ($page_id == $home_page_id) {
        // Homepage integration
        enqueue_gcsewala_home_assets();
    } elseif ($page_id == $dashboard_page_id) {
        // Dashboard integration
        enqueue_gcsewala_dashboard_assets();
    }
}

// Hook into WordPress
add_action('wp_enqueue_scripts', 'gcsewala_page_integration');

// Shortcode for homepage
function gcsewala_home_shortcode() {
    return '<div id="root" style="width: 100%; min-height: 100vh;"></div>';
}
add_shortcode('gcsewala_home', 'gcsewala_home_shortcode');

// Shortcode for dashboard
function gcsewala_dashboard_shortcode() {
    return '<div id="dashboard-root" style="width: 100%; min-height: 100vh;"></div>';
}
add_shortcode('gcsewala_dashboard', 'gcsewala_dashboard_shortcode');

// Add custom CSS to hide WordPress elements
function gcsewala_custom_styles() {
    $page_id = get_the_ID();
    $home_page_id = 123; // Replace with your actual home page ID
    $dashboard_page_id = 456; // Replace with your actual dashboard page ID
    
    if ($page_id == $home_page_id || $page_id == $dashboard_page_id) {
        ?>
        <style>
        body {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden;
        }
        .site-header,
        .site-footer,
        .entry-header,
        .entry-footer,
        .comments-area,
        .sidebar,
        .widget-area {
            display: none !important;
        }
        .entry-content {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
        }
        .container,
        .content-area {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        </style>
        <?php
    }
}
add_action('wp_head', 'gcsewala_custom_styles');
?>
