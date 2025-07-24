
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
function get_gcsewala_assets($directory_url) {
    $assets = array('css' => array(), 'js' => array());
    
    // For production builds, we need to scan the actual assets directory
    $assets_dir = ABSPATH . str_replace(get_site_url() . '/', '', $directory_url) . 'assets/';
    
    if (is_dir($assets_dir)) {
        $files = scandir($assets_dir);
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
    $assets_url = GCSEWALA_HOME_PATH . 'assets/';
    $assets = get_gcsewala_assets(GCSEWALA_HOME_PATH);
    
    // Enqueue CSS files first
    foreach ($assets['css'] as $index => $css_file) {
        wp_enqueue_style(
            'gcsewala-home-css-' . $index, 
            $assets_url . $css_file, 
            array(), 
            filemtime(ABSPATH . 'home/assets/' . $css_file)
        );
    }
    
    // Enqueue JS files
    foreach ($assets['js'] as $index => $js_file) {
        wp_enqueue_script(
            'gcsewala-home-js-' . $index, 
            $assets_url . $js_file, 
            array(), 
            filemtime(ABSPATH . 'home/assets/' . $js_file), 
            true
        );
    }
}

// Enqueue dashboard assets
function enqueue_gcsewala_dashboard_assets() {
    $assets_url = GCSEWALA_DASHBOARD_PATH . 'assets/';
    $assets = get_gcsewala_assets(GCSEWALA_DASHBOARD_PATH);
    
    // Enqueue CSS files first
    foreach ($assets['css'] as $index => $css_file) {
        wp_enqueue_style(
            'gcsewala-dashboard-css-' . $index, 
            $assets_url . $css_file, 
            array(), 
            filemtime(ABSPATH . 'dashboard/assets/' . $css_file)
        );
    }
    
    // Enqueue JS files
    foreach ($assets['js'] as $index => $js_file) {
        wp_enqueue_script(
            'gcsewala-dashboard-js-' . $index, 
            $assets_url . $js_file, 
            array(), 
            filemtime(ABSPATH . 'dashboard/assets/' . $js_file), 
            true
        );
    }
}

// Main function to run on specific pages
function gcsewala_page_integration() {
    // Get current page ID
    $page_id = get_the_ID();
    
    // Define your page IDs here - REPLACE THESE WITH YOUR ACTUAL PAGE IDs
    $home_page_id = 123; // Replace with your actual home page ID
    $dashboard_page_id = 456; // Replace with your actual dashboard page ID
    
    if ($page_id == $home_page_id) {
        // Homepage integration
        enqueue_gcsewala_home_assets();
        add_action('wp_head', 'gcsewala_home_inline_styles');
    } elseif ($page_id == $dashboard_page_id) {
        // Dashboard integration
        enqueue_gcsewala_dashboard_assets();
        add_action('wp_head', 'gcsewala_dashboard_inline_styles');
    }
}

// Hook into WordPress
add_action('wp_enqueue_scripts', 'gcsewala_page_integration');

// Shortcode for homepage
function gcsewala_home_shortcode() {
    return '<div id="root" style="width: 100%; min-height: 100vh; position: relative; z-index: 1;"></div>';
}
add_shortcode('gcsewala_home', 'gcsewala_home_shortcode');

// Shortcode for dashboard
function gcsewala_dashboard_shortcode() {
    return '<div id="dashboard-root" style="width: 100%; min-height: 100vh; position: relative; z-index: 1;"></div>';
}
add_shortcode('gcsewala_dashboard', 'gcsewala_dashboard_shortcode');

// Add custom CSS for home page
function gcsewala_home_inline_styles() {
    $page_id = get_the_ID();
    $home_page_id = 123; // Replace with your actual home page ID
    
    if ($page_id == $home_page_id) {
        ?>
        <style>
        /* WordPress theme override styles for home page */
        body {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background: transparent !important;
        }
        
        /* Hide WordPress theme elements */
        .site-header,
        .site-footer,
        .entry-header,
        .entry-footer,
        .comments-area,
        .sidebar,
        .widget-area,
        .site-navigation,
        .main-navigation,
        .secondary-navigation,
        .breadcrumb,
        .page-header {
            display: none !important;
        }
        
        /* Make content area full width */
        .entry-content,
        .page-content,
        .content-area,
        .container,
        .site-content,
        .main,
        article {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
        }
        
        /* Ensure React root takes full space */
        #root {
            width: 100% !important;
            min-height: 100vh !important;
            position: relative !important;
            z-index: 1 !important;
        }
        
        /* Hide any WordPress admin bar */
        #wpadminbar {
            display: none !important;
        }
        
        /* Reset any WordPress theme styles that might interfere */
        * {
            box-sizing: border-box;
        }
        </style>
        <?php
    }
}

// Add custom CSS for dashboard page
function gcsewala_dashboard_inline_styles() {
    $page_id = get_the_ID();
    $dashboard_page_id = 456; // Replace with your actual dashboard page ID
    
    if ($page_id == $dashboard_page_id) {
        ?>
        <style>
        /* WordPress theme override styles for dashboard page */
        body {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background: transparent !important;
        }
        
        /* Hide WordPress theme elements */
        .site-header,
        .site-footer,
        .entry-header,
        .entry-footer,
        .comments-area,
        .sidebar,
        .widget-area,
        .site-navigation,
        .main-navigation,
        .secondary-navigation,
        .breadcrumb,
        .page-header {
            display: none !important;
        }
        
        /* Make content area full width */
        .entry-content,
        .page-content,
        .content-area,
        .container,
        .site-content,
        .main,
        article {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
        }
        
        /* Ensure React root takes full space */
        #dashboard-root {
            width: 100% !important;
            min-height: 100vh !important;
            position: relative !important;
            z-index: 1 !important;
        }
        
        /* Hide any WordPress admin bar */
        #wpadminbar {
            display: none !important;
        }
        
        /* Reset any WordPress theme styles that might interfere */
        * {
            box-sizing: border-box;
        }
        </style>
        <?php
    }
}

// Force disable WordPress theme styles on our pages
function gcsewala_disable_theme_styles() {
    $page_id = get_the_ID();
    $home_page_id = 123; // Replace with your actual home page ID
    $dashboard_page_id = 456; // Replace with your actual dashboard page ID
    
    if ($page_id == $home_page_id || $page_id == $dashboard_page_id) {
        // Remove theme styles
        wp_dequeue_style('twenty*');
        wp_dequeue_style('theme-style');
        wp_dequeue_style('style');
        
        // Add high priority to our styles
        add_action('wp_head', function() {
            echo '<style>html { height: 100% !important; } body { height: 100% !important; }</style>';
        }, 999);
    }
}
add_action('wp_enqueue_scripts', 'gcsewala_disable_theme_styles', 100);

// Debug function to check if assets are loading
function gcsewala_debug_assets() {
    if (current_user_can('administrator')) {
        $page_id = get_the_ID();
        $home_page_id = 123; // Replace with your actual home page ID
        $dashboard_page_id = 456; // Replace with your actual dashboard page ID
        
        if ($page_id == $home_page_id || $page_id == $dashboard_page_id) {
            add_action('wp_footer', function() use ($page_id, $home_page_id, $dashboard_page_id) {
                echo '<!-- GCSEwala Debug: Page ID ' . $page_id . ' -->';
                if ($page_id == $home_page_id) {
                    echo '<!-- Home page detected -->';
                } elseif ($page_id == $dashboard_page_id) {
                    echo '<!-- Dashboard page detected -->';
                }
            });
        }
    }
}
add_action('init', 'gcsewala_debug_assets');
?>
