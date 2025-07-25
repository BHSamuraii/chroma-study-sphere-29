<?php
/**
 * GCSEwala SEO-Optimized WordPress Integration
 * Complete EdTech homepage recreation with optimal SEO
 * Activates only on page ID 7655
 */

class GCSEwalaSEOOptimized {
    
    private $home_page_id = 7655;
    
    public function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        // Create custom post types
        $this->create_course_post_type();
        
        // Hook into WordPress actions
        add_action('wp_enqueue_scripts', array($this, 'conditional_enqueue'));
        add_action('wp_head', array($this, 'add_seo_meta'));
        add_action('wp_head', array($this, 'add_schema_markup'));
        add_filter('the_content', array($this, 'inject_homepage_content'));
        add_action('wp_footer', array($this, 'add_interactive_scripts'));
    }
    
    /**
     * Create Course Custom Post Type
     */
    public function create_course_post_type() {
        register_post_type('courses', array(
            'labels' => array(
                'name' => 'Courses',
                'singular_name' => 'Course',
                'add_new' => 'Add New Course',
                'add_new_item' => 'Add New Course',
                'edit_item' => 'Edit Course',
                'new_item' => 'New Course',
                'view_item' => 'View Course',
                'search_items' => 'Search Courses',
                'not_found' => 'No courses found',
                'not_found_in_trash' => 'No courses found in Trash'
            ),
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-book-alt',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest' => true,
            'taxonomies' => array('course_subject', 'course_level')
        ));
        
        // Register taxonomies
        register_taxonomy('course_subject', 'courses', array(
            'labels' => array(
                'name' => 'Subjects',
                'singular_name' => 'Subject'
            ),
            'public' => true,
            'hierarchical' => true,
            'show_in_rest' => true
        ));
    }
    
    /**
     * Conditional asset enqueuing for page 7655
     */
    public function conditional_enqueue() {
        if (is_page($this->home_page_id)) {
            // Enqueue custom styles
            wp_enqueue_style(
                'gcsewala-homepage', 
                plugin_dir_url(__FILE__) . 'assets/homepage.css', 
                array(), 
                '1.0.0'
            );
            
            // Add inline styles if external CSS doesn't exist
            $this->add_inline_styles();
            
            // Preload critical fonts
            wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', array(), null);
        }
    }
    
    /**
     * Add SEO meta tags for homepage
     */
    public function add_seo_meta() {
        if (is_page($this->home_page_id)) {
            echo '<meta name="description" content="Master GCSE subjects with our interactive online learning platform. Join thousands of successful students achieving excellence in Mathematics, English, Sciences and more.">' . "\n";
            echo '<meta name="keywords" content="GCSE, online learning, education, mathematics, english, science, interactive courses">' . "\n";
            echo '<meta property="og:title" content="GCSEwala - Master Your GCSEs with Interactive Learning">' . "\n";
            echo '<meta property="og:description" content="Join thousands of students achieving GCSE excellence with our interactive learning platform.">' . "\n";
            echo '<meta property="og:type" content="website">' . "\n";
            echo '<meta property="og:url" content="' . get_permalink() . '">' . "\n";
            echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
            echo '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">' . "\n";
        }
    }
    
    /**
     * Add Schema.org structured data
     */
    public function add_schema_markup() {
        if (is_page($this->home_page_id)) {
            ?>
            <script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "GCSEwala",
                "description": "Interactive GCSE learning platform helping students achieve excellence",
                "url": "<?php echo home_url(); ?>",
                "logo": "<?php echo get_template_directory_uri(); ?>/assets/logo.png",
                "sameAs": [
                    "https://facebook.com/gcsewala",
                    "https://twitter.com/gcsewala",
                    "https://instagram.com/gcsewala"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "GB"
                },
                "offers": {
                    "@type": "Offer",
                    "category": "Education",
                    "itemOffered": {
                        "@type": "Course",
                        "name": "GCSE Courses",
                        "description": "Comprehensive GCSE preparation courses",
                        "provider": {
                            "@type": "Organization",
                            "name": "GCSEwala"
                        }
                    }
                }
            }
            </script>
            <?php
        }
    }
    
    /**
     * Inject homepage content
     */
    public function inject_homepage_content($content) {
        if (is_page($this->home_page_id)) {
            return $this->get_homepage_html();
        }
        return $content;
    }
    
    /**
     * Generate complete homepage HTML
     */
    private function get_homepage_html() {
        $courses = $this->get_featured_courses();
        $testimonials = $this->get_testimonials();
        
        ob_start();
        ?>
        <div class="gcsewala-homepage">
            <!-- Navigation Header -->
            <header class="gcse-header">
                <div class="container">
                    <div class="nav-brand">
                        <h1 class="brand-logo">GCSEwala</h1>
                    </div>
                    <nav class="main-nav">
                        <a href="#subjects" class="nav-link">Subjects</a>
                        <a href="#testimonials" class="nav-link">Reviews</a>
                        <a href="#pricing" class="nav-link">Pricing</a>
                        <a href="/login" class="nav-link login-btn">Sign In</a>
                        <a href="/signup" class="nav-link signup-btn">Get Started</a>
                    </nav>
                </div>
            </header>

            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">Master Your GCSEs with Interactive Learning</h1>
                        <p class="hero-subtitle">Join thousands of students achieving excellence with our personalized learning platform. Get instant feedback, track progress, and ace your exams.</p>
                        <div class="hero-stats">
                            <div class="stat">
                                <span class="stat-number">50,000+</span>
                                <span class="stat-label">Students</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">15+</span>
                                <span class="stat-label">Subjects</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">95%</span>
                                <span class="stat-label">Success Rate</span>
                            </div>
                        </div>
                        <div class="hero-actions">
                            <a href="/signup" class="btn btn-primary">Start Free Trial</a>
                            <a href="#demo" class="btn btn-outline">Watch Demo</a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Popular Subjects -->
            <section id="subjects" class="subjects-section">
                <div class="container">
                    <h2 class="section-title">Popular GCSE Subjects</h2>
                    <p class="section-subtitle">Comprehensive courses designed by expert teachers</p>
                    
                    <div class="subjects-grid">
                        <?php echo $this->get_subjects_html(); ?>
                    </div>
                </div>
            </section>

            <!-- Featured Courses -->
            <section class="courses-section">
                <div class="container">
                    <h2 class="section-title">Featured Courses</h2>
                    <div class="courses-grid">
                        <?php echo $this->get_courses_html($courses); ?>
                    </div>
                </div>
            </section>

            <!-- Flashcard Counter -->
            <section class="flashcard-section">
                <div class="container">
                    <div class="flashcard-counter">
                        <h3>Flashcards Created Today</h3>
                        <div class="counter-display">
                            <span class="counter-number">12,847</span>
                            <span class="counter-label">and counting...</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            <section id="testimonials" class="testimonials-section">
                <div class="container">
                    <h2 class="section-title">What Students Say</h2>
                    <div class="testimonials-grid">
                        <?php echo $this->get_testimonials_html($testimonials); ?>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content">
                        <h2>Ready to Excel in Your GCSEs?</h2>
                        <p>Join thousands of successful students today</p>
                        <a href="/signup" class="btn btn-primary btn-large">Get Started Free</a>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <h3>GCSEwala</h3>
                            <p>Excellence in GCSE Education</p>
                        </div>
                        <div class="footer-links">
                            <h4>Subjects</h4>
                            <a href="/mathematics">Mathematics</a>
                            <a href="/english">English</a>
                            <a href="/sciences">Sciences</a>
                            <a href="/history">History</a>
                        </div>
                        <div class="footer-links">
                            <h4>Support</h4>
                            <a href="/help">Help Center</a>
                            <a href="/contact">Contact Us</a>
                            <a href="/privacy">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Get subjects HTML
     */
    private function get_subjects_html() {
        $subjects = array(
            array('name' => 'Mathematics', 'icon' => '🔢', 'color' => 'blue', 'students' => '15,234'),
            array('name' => 'English Literature', 'icon' => '📚', 'color' => 'green', 'students' => '12,567'),
            array('name' => 'Biology', 'icon' => '🧬', 'color' => 'purple', 'students' => '9,876'),
            array('name' => 'Chemistry', 'icon' => '⚗️', 'color' => 'orange', 'students' => '8,543'),
            array('name' => 'Physics', 'icon' => '⚡', 'color' => 'red', 'students' => '7,890'),
            array('name' => 'History', 'icon' => '🏛️', 'color' => 'brown', 'students' => '6,234'),
        );
        
        $html = '';
        foreach ($subjects as $subject) {
            $html .= '<div class="subject-card subject-' . $subject['color'] . '">';
            $html .= '<div class="subject-icon">' . $subject['icon'] . '</div>';
            $html .= '<h3 class="subject-name">' . $subject['name'] . '</h3>';
            $html .= '<p class="subject-students">' . $subject['students'] . ' students</p>';
            $html .= '<a href="/subjects/' . strtolower(str_replace(' ', '-', $subject['name'])) . '" class="subject-link">Explore →</a>';
            $html .= '</div>';
        }
        
        return $html;
    }
    
    /**
     * Get courses HTML from WordPress posts
     */
    private function get_courses_html($courses) {
        $html = '';
        
        if (empty($courses)) {
            // Fallback static courses
            $static_courses = array(
                array('title' => 'GCSE Mathematics Complete', 'excerpt' => 'Master algebra, geometry, and statistics', 'price' => '£29/month'),
                array('title' => 'English Literature Mastery', 'excerpt' => 'Analyze texts and perfect your essays', 'price' => '£24/month'),
                array('title' => 'Combined Science Trilogy', 'excerpt' => 'Biology, Chemistry, and Physics combined', 'price' => '£34/month'),
            );
            
            foreach ($static_courses as $course) {
                $html .= '<div class="course-card">';
                $html .= '<div class="course-image"></div>';
                $html .= '<div class="course-content">';
                $html .= '<h3 class="course-title">' . $course['title'] . '</h3>';
                $html .= '<p class="course-excerpt">' . $course['excerpt'] . '</p>';
                $html .= '<div class="course-footer">';
                $html .= '<span class="course-price">' . $course['price'] . '</span>';
                $html .= '<a href="/enroll" class="btn btn-small">Enroll Now</a>';
                $html .= '</div>';
                $html .= '</div>';
                $html .= '</div>';
            }
        } else {
            foreach ($courses as $course) {
                $html .= '<div class="course-card">';
                $html .= '<div class="course-image">' . get_the_post_thumbnail($course->ID, 'medium') . '</div>';
                $html .= '<div class="course-content">';
                $html .= '<h3 class="course-title">' . get_the_title($course->ID) . '</h3>';
                $html .= '<p class="course-excerpt">' . get_the_excerpt($course->ID) . '</p>';
                $html .= '<div class="course-footer">';
                $html .= '<span class="course-price">£' . get_post_meta($course->ID, 'course_price', true) . '/month</span>';
                $html .= '<a href="' . get_permalink($course->ID) . '" class="btn btn-small">Learn More</a>';
                $html .= '</div>';
                $html .= '</div>';
                $html .= '</div>';
            }
        }
        
        return $html;
    }
    
    /**
     * Get testimonials HTML
     */
    private function get_testimonials_html($testimonials) {
        $static_testimonials = array(
            array('name' => 'Sarah Johnson', 'grade' => 'A* in Mathematics', 'text' => 'GCSEwala helped me understand complex concepts easily. The interactive lessons made learning enjoyable!'),
            array('name' => 'James Smith', 'grade' => 'A* in Sciences', 'text' => 'The flashcards and practice tests were incredibly helpful. I felt confident going into my exams.'),
            array('name' => 'Emma Wilson', 'grade' => 'A in English', 'text' => 'Amazing platform! The personalized learning path adapted to my needs perfectly.'),
        );
        
        $html = '';
        foreach ($static_testimonials as $testimonial) {
            $html .= '<div class="testimonial-card">';
            $html .= '<div class="testimonial-content">';
            $html .= '<p class="testimonial-text">"' . $testimonial['text'] . '"</p>';
            $html .= '<div class="testimonial-author">';
            $html .= '<div class="author-avatar"></div>';
            $html .= '<div class="author-info">';
            $html .= '<h4 class="author-name">' . $testimonial['name'] . '</h4>';
            $html .= '<p class="author-grade">' . $testimonial['grade'] . '</p>';
            $html .= '</div>';
            $html .= '</div>';
            $html .= '</div>';
            $html .= '</div>';
        }
        
        return $html;
    }
    
    /**
     * Get featured courses from WordPress
     */
    private function get_featured_courses() {
        $courses = get_posts(array(
            'post_type' => 'courses',
            'posts_per_page' => 3,
            'meta_query' => array(
                array(
                    'key' => 'featured_course',
                    'value' => 'yes',
                    'compare' => '='
                )
            )
        ));
        
        return $courses;
    }
    
    /**
     * Get testimonials
     */
    private function get_testimonials() {
        // You can create a custom post type for testimonials or use static data
        return array();
    }
    
    /**
     * Add inline styles
     */
    private function add_inline_styles() {
        ?>
        <style>
        .gcsewala-homepage {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header Styles */
        .gcse-header {
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .gcse-header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 20px;
        }
        
        .brand-logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #6366f1;
            margin: 0;
        }
        
        .main-nav {
            display: flex;
            align-items: center;
            gap: 2rem;
        }
        
        .nav-link {
            text-decoration: none;
            color: #64748b;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-link:hover {
            color: #6366f1;
        }
        
        .login-btn {
            background: transparent;
            border: 1px solid #e2e8f0;
            padding: 0.5rem 1rem;
            border-radius: 6px;
        }
        
        .signup-btn {
            background: #6366f1;
            color: white !important;
            padding: 0.5rem 1rem;
            border-radius: 6px;
        }
        
        /* Hero Section */
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6rem 0;
            text-align: center;
        }
        
        .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            margin-bottom: 3rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .hero-stats {
            display: flex;
            justify-content: center;
            gap: 4rem;
            margin-bottom: 3rem;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            display: block;
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .hero-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        
        /* Button Styles */
        .btn {
            display: inline-block;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn-primary {
            background: #fff;
            color: #6366f1;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .btn-outline {
            background: transparent;
            color: white;
            border: 2px solid white;
        }
        
        .btn-outline:hover {
            background: white;
            color: #6366f1;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
        
        .btn-large {
            padding: 1rem 3rem;
            font-size: 1.1rem;
        }
        
        /* Section Styles */
        .subjects-section,
        .courses-section,
        .testimonials-section {
            padding: 5rem 0;
        }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1rem;
            color: #1e293b;
        }
        
        .section-subtitle {
            text-align: center;
            color: #64748b;
            margin-bottom: 3rem;
            font-size: 1.1rem;
        }
        
        /* Subjects Grid */
        .subjects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .subject-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            border-left: 4px solid;
        }
        
        .subject-card:hover {
            transform: translateY(-5px);
        }
        
        .subject-blue { border-left-color: #3b82f6; }
        .subject-green { border-left-color: #10b981; }
        .subject-purple { border-left-color: #8b5cf6; }
        .subject-orange { border-left-color: #f59e0b; }
        .subject-red { border-left-color: #ef4444; }
        .subject-brown { border-left-color: #92400e; }
        
        .subject-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .subject-name {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        
        .subject-students {
            color: #64748b;
            margin-bottom: 1rem;
        }
        
        .subject-link {
            color: #6366f1;
            text-decoration: none;
            font-weight: 600;
        }
        
        /* Courses Grid */
        .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .course-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .course-card:hover {
            transform: translateY(-5px);
        }
        
        .course-image {
            height: 200px;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
        }
        
        .course-content {
            padding: 1.5rem;
        }
        
        .course-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        
        .course-excerpt {
            color: #64748b;
            margin-bottom: 1.5rem;
        }
        
        .course-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .course-price {
            font-size: 1.1rem;
            font-weight: 600;
            color: #6366f1;
        }
        
        /* Flashcard Section */
        .flashcard-section {
            background: #f8fafc;
            padding: 3rem 0;
        }
        
        .flashcard-counter {
            text-align: center;
            padding: 2rem;
        }
        
        .flashcard-counter h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #1e293b;
        }
        
        .counter-display {
            display: flex;
            justify-content: center;
            align-items: baseline;
            gap: 0.5rem;
        }
        
        .counter-number {
            font-size: 3rem;
            font-weight: 700;
            color: #6366f1;
        }
        
        .counter-label {
            color: #64748b;
        }
        
        /* Testimonials */
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .testimonial-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .testimonial-text {
            font-style: italic;
            margin-bottom: 1.5rem;
            color: #475569;
        }
        
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(45deg, #6366f1, #8b5cf6);
        }
        
        .author-name {
            font-weight: 600;
            margin: 0;
            color: #1e293b;
        }
        
        .author-grade {
            color: #6366f1;
            margin: 0;
            font-size: 0.9rem;
        }
        
        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
        }
        
        .cta-content h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .cta-content p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        /* Footer */
        .site-footer {
            background: #1e293b;
            color: white;
            padding: 3rem 0;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .footer-brand h3 {
            color: #6366f1;
            margin-bottom: 1rem;
        }
        
        .footer-links h4 {
            margin-bottom: 1rem;
            color: #e2e8f0;
        }
        
        .footer-links a {
            display: block;
            color: #94a3b8;
            text-decoration: none;
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: #6366f1;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-stats {
                flex-direction: column;
                gap: 2rem;
            }
            
            .main-nav {
                display: none; /* Add mobile menu toggle */
            }
            
            .subjects-grid,
            .courses-grid,
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
            
            .hero-actions {
                flex-direction: column;
                align-items: center;
            }
        }
        </style>
        <?php
    }
    
    /**
     * Add minimal interactive scripts
     */
    public function add_interactive_scripts() {
        if (is_page($this->home_page_id)) {
            ?>
            <script>
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Animate counter on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target.querySelector('.counter-number');
                        if (counter && !counter.classList.contains('animated')) {
                            counter.classList.add('animated');
                            animateNumber(counter, 12847);
                        }
                    }
                });
            });
            
            const counterSection = document.querySelector('.flashcard-counter');
            if (counterSection) {
                observer.observe(counterSection);
            }
            
            function animateNumber(element, target) {
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current).toLocaleString();
                    }
                }, 20);
            }
            </script>
            <?php
        }
    }
}

// Initialize the plugin
new GCSEwalaSEOOptimized();

/**
 * Add to functions.php to activate:
 * require_once get_template_directory() . '/gcsewala-seo-optimized.php';
 */
?>