
<?php
/**
 * Plugin Name: GCSEwala Enqueue
 * Description: Enqueues GCSEwala static files and provides shortcodes for React apps
 * Version: 1.0.0
 * Author: GCSEwala Team
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class GCSEwalaEnqueue {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        // Register shortcodes
        add_shortcode('gcsewala_home', array($this, 'home_shortcode'));
        add_shortcode('gcsewala_dashboard', array($this, 'dashboard_shortcode'));
        
        // Hook into wp_enqueue_scripts
        add_action('wp_enqueue_scripts', array($this, 'conditional_enqueue'));
    }
    
    /**
     * Get asset files from a directory
     */
    private function get_assets($app_path) {
        $assets = array('css' => array(), 'js' => array());
        $assets_dir = ABSPATH . $app_path . 'assets/';
        
        if (is_dir($assets_dir)) {
            $files = scandir($assets_dir);
            foreach ($files as $file) {
                $ext = pathinfo($file, PATHINFO_EXTENSION);
                if ($ext === 'css') {
                    $assets['css'][] = $file;
                } elseif ($ext === 'js') {
                    $assets['js'][] = $file;
                }
            }
        }
        
        return $assets;
    }
    
    /**
     * Enqueue assets for a specific app
     */
    private function enqueue_app_assets($app_name, $app_path) {
        $assets_url = get_site_url() . '/' . $app_path . 'assets/';
        $assets = $this->get_assets($app_path);
        
        // Enqueue CSS files
        foreach ($assets['css'] as $index => $css_file) {
            wp_enqueue_style(
                'gcsewala-' . $app_name . '-css-' . $index,
                $assets_url . $css_file,
                array(),
                filemtime(ABSPATH . $app_path . 'assets/' . $css_file)
            );
        }
        
        // Enqueue JS files
        foreach ($assets['js'] as $index => $js_file) {
            wp_enqueue_script(
                'gcsewala-' . $app_name . '-js-' . $index,
                $assets_url . $js_file,
                array(),
                filemtime(ABSPATH . $app_path . 'assets/' . $js_file),
                true
            );
        }
    }
    
    /**
     * Conditionally enqueue assets based on shortcode presence
     */
    public function conditional_enqueue() {
        global $post;
        
        if (!$post) return;
        
        // Check if home shortcode is present
        if (has_shortcode($post->post_content, 'gcsewala_home')) {
            $this->enqueue_app_assets('home', 'home/');
            add_action('wp_head', array($this, 'add_home_styles'));
        }
        
        // Check if dashboard shortcode is present
        if (has_shortcode($post->post_content, 'gcsewala_dashboard')) {
            $this->enqueue_app_assets('dashboard', 'dashboard/');
            add_action('wp_head', array($this, 'add_dashboard_styles'));
        }
    }
    
    /**
     * Home app shortcode
     */
    public function home_shortcode($atts) {
        // Add initialization script
        add_action('wp_footer', array($this, 'add_home_init_script'));
        
        return '<div id="root" style="width: 100%; min-height: 100vh; position: relative; z-index: 1;"></div>';
    }
    
    /**
     * Dashboard app shortcode
     */
    public function dashboard_shortcode($atts) {
        // Add initialization script
        add_action('wp_footer', array($this, 'add_dashboard_init_script'));
        
        return '<div id="dashboard-root" style="width: 100%; min-height: 100vh; position: relative; z-index: 1;"></div>';
    }
    
    /**
     * Add custom styles for home app
     */
    public function add_home_styles() {
        ?>
        <style>
        /* GCSEwala Home App Styles */
        body.gcsewala-home {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background: transparent !important;
        }
        
        .gcsewala-home .site-header,
        .gcsewala-home .site-footer,
        .gcsewala-home .entry-header,
        .gcsewala-home .entry-footer,
        .gcsewala-home .comments-area,
        .gcsewala-home .sidebar,
        .gcsewala-home .widget-area,
        .gcsewala-home .site-navigation,
        .gcsewala-home .main-navigation,
        .gcsewala-home .secondary-navigation,
        .gcsewala-home .breadcrumb,
        .gcsewala-home .page-header,
        .gcsewala-home .wp-block-post-title,
        .gcsewala-home .entry-meta,
        .gcsewala-home .post-navigation {
            display: none !important;
        }
        
        .gcsewala-home .entry-content,
        .gcsewala-home .page-content,
        .gcsewala-home .content-area,
        .gcsewala-home .container,
        .gcsewala-home .site-content,
        .gcsewala-home .main,
        .gcsewala-home article,
        .gcsewala-home .wp-site-blocks,
        .gcsewala-home .wp-block-group {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: transparent !important;
        }
        
        .gcsewala-home #root {
            width: 100% !important;
            min-height: 100vh !important;
            position: relative !important;
            z-index: 1 !important;
            background: transparent !important;
        }
        
        .gcsewala-home #wpadminbar {
            display: none !important;
        }
        
        .gcsewala-home html,
        .gcsewala-home body {
            height: 100% !important;
            min-height: 100vh !important;
        }
        </style>
        <script>
        document.body.classList.add('gcsewala-home');
        </script>
        <?php
    }
    
    /**
     * Add custom styles for dashboard app
     */
    public function add_dashboard_styles() {
        ?>
        <style>
        /* GCSEwala Dashboard App Styles */
        body.gcsewala-dashboard {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background: transparent !important;
        }
        
        .gcsewala-dashboard .site-header,
        .gcsewala-dashboard .site-footer,
        .gcsewala-dashboard .entry-header,
        .gcsewala-dashboard .entry-footer,
        .gcsewala-dashboard .comments-area,
        .gcsewala-dashboard .sidebar,
        .gcsewala-dashboard .widget-area,
        .gcsewala-dashboard .site-navigation,
        .gcsewala-dashboard .main-navigation,
        .gcsewala-dashboard .secondary-navigation,
        .gcsewala-dashboard .breadcrumb,
        .gcsewala-dashboard .page-header,
        .gcsewala-dashboard .wp-block-post-title,
        .gcsewala-dashboard .entry-meta,
        .gcsewala-dashboard .post-navigation {
            display: none !important;
        }
        
        .gcsewala-dashboard .entry-content,
        .gcsewala-dashboard .page-content,
        .gcsewala-dashboard .content-area,
        .gcsewala-dashboard .container,
        .gcsewala-dashboard .site-content,
        .gcsewala-dashboard .main,
        .gcsewala-dashboard article,
        .gcsewala-dashboard .wp-site-blocks,
        .gcsewala-dashboard .wp-block-group {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: transparent !important;
        }
        
        .gcsewala-dashboard #dashboard-root {
            width: 100% !important;
            min-height: 100vh !important;
            position: relative !important;
            z-index: 1 !important;
            background: transparent !important;
        }
        
        .gcsewala-dashboard #wpadminbar {
            display: none !important;
        }
        
        .gcsewala-dashboard html,
        .gcsewala-dashboard body {
            height: 100% !important;
            min-height: 100vh !important;
        }
        </style>
        <script>
        document.body.classList.add('gcsewala-dashboard');
        </script>
        <?php
    }
    
    /**
     * Add initialization script for home app
     */
    public function add_home_init_script() {
        ?>
        <script>
        console.log('GCSEwala Home: Plugin loaded');
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('GCSEwala Home: DOM loaded');
            
            const rootElement = document.getElementById('root');
            if (rootElement) {
                console.log('GCSEwala Home: Root element found!', rootElement);
            } else {
                console.error('GCSEwala Home: Root element NOT found!');
            }
        });
        
        window.addEventListener('load', function() {
            console.log('GCSEwala Home: Window fully loaded');
            setTimeout(function() {
                const rootElement = document.getElementById('root');
                if (rootElement) {
                    console.log('GCSEwala Home: Final check - Root element exists!');
                } else {
                    console.error('GCSEwala Home: Final check - Root element missing!');
                }
            }, 1000);
        });
        </script>
        <?php
    }
    
    /**
     * Add initialization script for dashboard app
     */
    public function add_dashboard_init_script() {
        ?>
        <script>
        console.log('GCSEwala Dashboard: Plugin loaded');
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('GCSEwala Dashboard: DOM loaded');
            
            const rootElement = document.getElementById('dashboard-root');
            if (rootElement) {
                console.log('GCSEwala Dashboard: Root element found!', rootElement);
            } else {
                console.error('GCSEwala Dashboard: Root element NOT found!');
            }
        });
        
        window.addEventListener('load', function() {
            console.log('GCSEwala Dashboard: Window fully loaded');
            setTimeout(function() {
                const rootElement = document.getElementById('dashboard-root');
                if (rootElement) {
                    console.log('GCSEwala Dashboard: Final check - Root element exists!');
                } else {
                    console.error('GCSEwala Dashboard: Final check - Root element missing!');
                }
            }, 1000);
        });
        </script>
        <?php
    }
}

// Initialize the plugin
new GCSEwalaEnqueue();
?>
