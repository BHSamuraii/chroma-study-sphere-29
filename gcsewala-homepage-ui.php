<?php
/**
 * GCSeWala Homepage UI - Pure PHP Recreation
 * Recreates the exact EdTech homepage UI without React/Supabase dependencies
 * Activates for page ID 7655 (or set your homepage ID)
 */

// Hook into WordPress to replace homepage content
add_action('template_redirect', 'gcsewala_homepage_override');

function gcsewala_homepage_override() {
    // Check if this is the homepage (adjust ID as needed)
    if (is_page(7655) || is_home() || is_front_page()) {
        add_filter('the_content', 'gcsewala_render_homepage_ui');
        add_action('wp_head', 'gcsewala_homepage_styles');
        add_action('wp_footer', 'gcsewala_homepage_scripts');
    }
}

function gcsewala_render_homepage_ui($content) {
    ob_start();
    ?>
    
    <div id="gcsewala-homepage" class="min-h-screen">
        <!-- Navigation -->
        <nav id="main-nav" class="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50 transition-transform duration-300">
            <div class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <button onclick="scrollToTop()" class="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity cursor-pointer">
                            gcsewala
                        </button>
                    </div>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#subjects" class="text-foreground hover:text-primary transition-colors">Subjects</a>
                        <a href="#faq" class="text-foreground hover:text-primary transition-colors">FAQ</a>
                        <a href="#testimonials" class="text-foreground hover:text-primary transition-colors">Reviews</a>
                        <button class="btn-outline mr-2">Log In</button>
                        <button class="btn-primary animate-pulse-glow">Get Started</button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="gradient-purple-yellow py-20 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent"></div>
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="badge mb-6 animate-float">
                        🚀 New AI-Powered Learning Experience
                    </div>
                    <h1 class="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
                        Master Any Subject
                        <br>
                        <span class="text-primary">With Expert Guidance</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who've transformed their academic performance with our interactive courses and personalized learning paths.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button class="btn-primary-lg animate-pulse-glow">
                            Get Started
                            <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="btn-outline-lg">
                            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Watch Demo
                        </button>
                    </div>
                    <div class="mt-12 flex justify-center items-center space-x-8 text-sm text-foreground/60">
                        <div class="flex items-center">
                            <svg class="h-4 w-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                            </svg>
                            50K+ Students
                        </div>
                        <div class="flex items-center">
                            <svg class="h-4 w-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            4.9/5 Rating
                        </div>
                        <div class="flex items-center">
                            <svg class="h-4 w-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                            Lifetime Access
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Subject Carousel Section -->
        <section id="subjects" class="py-20 bg-background">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                        Choose a Subject
                    </h2>
                    <p class="text-xl text-foreground/70 max-w-2xl mx-auto">
                        Select from our comprehensive library of subjects and start your learning journey today.
                    </p>
                </div>
                
                <div class="carousel-container">
                    <div class="carousel-wrapper">
                        <div class="carousel-track" id="subject-carousel">
                            <?php
                            $subjects = [
                                [
                                    'title' => 'Mathematics',
                                    'description' => 'Master calculus, algebra, geometry, and advanced mathematical concepts with interactive problem-solving',
                                    'icon' => '📊',
                                    'features' => ['2,450+ flashcards', 'Step-by-step solutions', 'Practice tests', 'Progress tracking'],
                                    'color' => 'from-blue-500 to-purple-600'
                                ],
                                [
                                    'title' => 'Computer Science',
                                    'description' => 'Learn programming, algorithms, data structures, and software development fundamentals',
                                    'icon' => '💻',
                                    'features' => ['3,200+ flashcards', 'Code examples', 'Algorithm visualization', 'Project templates'],
                                    'color' => 'from-green-500 to-teal-600'
                                ],
                                [
                                    'title' => 'Physics',
                                    'description' => 'Explore quantum mechanics, thermodynamics, electromagnetism, and classical physics',
                                    'icon' => '⚛️',
                                    'features' => ['1,800+ flashcards', 'Interactive simulations', 'Formula reference', 'Lab experiments'],
                                    'color' => 'from-orange-500 to-red-600'
                                ],
                                [
                                    'title' => 'Chemistry',
                                    'description' => 'Understand molecular structures, chemical reactions, and periodic table mastery',
                                    'icon' => '🧪',
                                    'features' => ['2,100+ flashcards', '3D molecular models', 'Reaction simulator', 'Lab safety guide'],
                                    'color' => 'from-pink-500 to-rose-600'
                                ],
                                [
                                    'title' => 'Biology',
                                    'description' => 'Study cellular biology, genetics, anatomy, and ecosystem relationships',
                                    'icon' => '🧬',
                                    'features' => ['2,800+ flashcards', 'Anatomical diagrams', 'Evolution timeline', 'Ecosystem maps'],
                                    'color' => 'from-emerald-500 to-green-600'
                                ],
                                [
                                    'title' => 'History',
                                    'description' => 'Journey through world history, civilizations, and significant historical events',
                                    'icon' => '🌍',
                                    'features' => ['3,500+ flashcards', 'Interactive timelines', 'Historical maps', 'Primary sources'],
                                    'color' => 'from-amber-500 to-orange-600'
                                ],
                                [
                                    'title' => 'Literature',
                                    'description' => 'Analyze classic and modern literature, poetry, and literary techniques',
                                    'icon' => '📚',
                                    'features' => ['2,600+ flashcards', 'Text analysis tools', 'Character guides', 'Writing prompts'],
                                    'color' => 'from-violet-500 to-purple-600'
                                ],
                                [
                                    'title' => 'Art & Design',
                                    'description' => 'Master artistic techniques, design principles, and art history fundamentals',
                                    'icon' => '🎨',
                                    'features' => ['1,900+ flashcards', 'Color theory guide', 'Technique tutorials', 'Artist profiles'],
                                    'color' => 'from-fuchsia-500 to-pink-600'
                                ],
                                [
                                    'title' => 'Music Theory',
                                    'description' => 'Learn scales, chords, composition, and musical analysis techniques',
                                    'icon' => '🎵',
                                    'features' => ['1,400+ flashcards', 'Audio examples', 'Scale reference', 'Chord progressions'],
                                    'color' => 'from-cyan-500 to-blue-600'
                                ]
                            ];

                            foreach ($subjects as $index => $subject) :
                            ?>
                            <div class="carousel-item">
                                <div class="subject-card">
                                    <div class="card-header">
                                        <div class="subject-icon bg-gradient-<?php echo $subject['color']; ?>">
                                            <?php echo $subject['icon']; ?>
                                        </div>
                                        <h3 class="text-xl mb-2 font-bold"><?php echo $subject['title']; ?></h3>
                                        <p class="text-sm leading-relaxed text-foreground/70">
                                            <?php echo $subject['description']; ?>
                                        </p>
                                    </div>
                                    <div class="card-content">
                                        <ul class="space-y-2 mb-6 text-sm">
                                            <?php foreach ($subject['features'] as $feature) : ?>
                                            <li class="flex items-center text-foreground/70">
                                                <div class="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                                                <?php echo $feature; ?>
                                            </li>
                                            <?php endforeach; ?>
                                        </ul>
                                        <button class="btn-primary w-full">Enrol Now</button>
                                    </div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <!-- Navigation Dots -->
                    <div class="carousel-dots">
                        <?php for ($i = 0; $i < ceil(count($subjects) / 3); $i++) : ?>
                        <button class="carousel-dot <?php echo $i === 0 ? 'active' : ''; ?>" onclick="goToSlide(<?php echo $i; ?>)"></button>
                        <?php endfor; ?>
                    </div>
                    
                    <div class="flex justify-center mt-4">
                        <div class="text-sm text-foreground/60 bg-card/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            Auto-scrolling • <?php echo count($subjects); ?> subjects available
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Flashcard Counter Section -->
        <section class="py-20 bg-background/20">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                        Live Learning Stats
                    </h2>
                    <p class="text-xl text-foreground/70 max-w-2xl mx-auto">
                        See the impact of our community in real-time as students master subjects worldwide.
                    </p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div class="stats-card">
                        <div class="stats-icon">📚</div>
                        <div class="stats-number" data-target="2847392">0</div>
                        <p class="text-foreground/70 font-medium">Flashcards Studied</p>
                        <p class="text-sm text-foreground/50 mt-1">This month</p>
                    </div>

                    <div class="stats-card">
                        <div class="stats-icon">👥</div>
                        <div class="stats-number" data-target="48576">0</div>
                        <p class="text-foreground/70 font-medium">Active Students</p>
                        <p class="text-sm text-foreground/50 mt-1">Learning daily</p>
                    </div>

                    <div class="stats-card">
                        <div class="stats-icon">📈</div>
                        <div class="stats-number" data-target="127">0</div>
                        <p class="text-foreground/70 font-medium">Subjects Available</p>
                        <p class="text-sm text-foreground/50 mt-1">And growing</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section id="testimonials" class="py-20 bg-card/20">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                        What Students Say
                    </h2>
                    <p class="text-xl text-foreground/70 max-w-2xl mx-auto">
                        Real success stories from students who've transformed their academic journey with us.
                    </p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <?php
                    $testimonials = [
                        [
                            'name' => 'Sarah Johnson',
                            'role' => 'Computer Science Student',
                            'content' => 'The interactive courses helped me land my dream internship at Google!',
                            'rating' => 5,
                            'avatar' => 'SJ'
                        ],
                        [
                            'name' => 'Michael Chen',
                            'role' => 'Mathematics Major',
                            'content' => 'Amazing explanations and practice problems. My grades improved by 40%!',
                            'rating' => 5,
                            'avatar' => 'MC'
                        ],
                        [
                            'name' => 'Emily Rodriguez',
                            'role' => 'Physics Student',
                            'content' => 'Complex concepts made simple. The best learning platform I\'ve used.',
                            'rating' => 5,
                            'avatar' => 'ER'
                        ]
                    ];

                    foreach ($testimonials as $testimonial) :
                    ?>
                    <div class="testimonial-card">
                        <div class="flex items-center mb-4">
                            <?php for ($i = 0; $i < $testimonial['rating']; $i++) : ?>
                            <svg class="h-4 w-4 text-primary fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <?php endfor; ?>
                        </div>
                        <p class="text-foreground/80 mb-6 italic">"<?php echo $testimonial['content']; ?>"</p>
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-3">
                                <?php echo $testimonial['avatar']; ?>
                            </div>
                            <div>
                                <p class="font-semibold"><?php echo $testimonial['name']; ?></p>
                                <p class="text-sm text-foreground/60"><?php echo $testimonial['role']; ?></p>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 gradient-purple-yellow relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent"></div>
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                        Ready to Transform Your Learning?
                    </h2>
                    <p class="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of successful students and start your journey to academic excellence today.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button class="btn-primary-lg animate-pulse-glow">
                            Start Free Trial
                            <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="btn-outline-lg">Schedule Demo</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-muted/20 py-12 border-t border-border/50">
            <div class="container mx-auto px-6">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <div class="flex items-center space-x-2 mb-4">
                            <span class="text-xl font-bold text-gradient">gcsewala</span>
                        </div>
                        <p class="text-foreground/60">Empowering students worldwide with quality education and innovative learning experiences.</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4 text-primary">Subjects</h4>
                        <ul class="space-y-2 text-foreground/60">
                            <li><a href="#" class="hover:text-primary transition-colors">Mathematics</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Computer Science</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Physics</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Chemistry</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4 text-primary">Company</h4>
                        <ul class="space-y-2 text-foreground/60">
                            <li><a href="#" class="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4 text-primary">Support</h4>
                        <ul class="space-y-2 text-foreground/60">
                            <li><a href="#" class="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" class="hover:text-primary transition-colors">Refund Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="mt-8 pt-8 border-t border-border/50 text-center text-foreground/60">
                    &copy; 2025 gcsewala. All rights reserved.
                </div>
            </div>
        </footer>
    </div>

    <?php
    return ob_get_clean();
}

function gcsewala_homepage_styles() {
    ?>
    <style>
    /* GCSeWala Homepage Styles - Matching React Design */
    :root {
        --background: 260 30% 15%;
        --foreground: 48 100% 88%;
        --card: 260 25% 20%;
        --card-foreground: 48 100% 92%;
        --primary: 48 100% 70%;
        --primary-foreground: 260 30% 15%;
        --secondary: 260 20% 25%;
        --muted: 260 15% 30%;
        --border: 260 20% 25%;
        --radius: 0.75rem;
    }

    #gcsewala-homepage {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, 
            hsl(260, 35%, 8%) 0%, 
            hsl(260, 30%, 12%) 25%, 
            hsl(280, 25%, 10%) 50%, 
            hsl(260, 30%, 8%) 75%, 
            hsl(270, 35%, 12%) 100%
        );
        color: hsl(48, 100%, 88%);
        min-height: 100vh;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    /* Navigation */
    #main-nav {
        background: hsla(260, 30%, 15%, 0.8);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid hsl(260, 20%, 25%);
        transition: transform 0.3s ease;
    }

    .nav-hidden {
        transform: translateY(-100%);
    }

    /* Gradient and Text Styles */
    .gradient-purple-yellow {
        background: linear-gradient(135deg, 
            hsl(260, 40%, 15%) 0%, 
            hsl(280, 35%, 18%) 25%, 
            hsl(260, 30%, 12%) 50%, 
            hsl(270, 35%, 15%) 75%, 
            hsl(260, 40%, 18%) 100%
        );
    }

    .text-gradient {
        background: linear-gradient(135deg, hsl(48, 100%, 70%) 0%, hsl(45, 100%, 82%) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .text-primary {
        color: hsl(48, 100%, 70%);
    }

    .text-foreground\/80 {
        color: hsla(48, 100%, 88%, 0.8);
    }

    .text-foreground\/70 {
        color: hsla(48, 100%, 88%, 0.7);
    }

    .text-foreground\/60 {
        color: hsla(48, 100%, 88%, 0.6);
    }

    /* Buttons */
    .btn-primary, .btn-primary-lg {
        background: hsl(48, 100%, 70%);
        color: hsl(260, 30%, 15%);
        padding: 0.75rem 2rem;
        border: none;
        border-radius: var(--radius);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
    }

    .btn-primary-lg {
        padding: 1.5rem 2rem;
        font-size: 1.125rem;
    }

    .btn-outline, .btn-outline-lg {
        background: transparent;
        color: hsl(48, 100%, 88%);
        padding: 0.75rem 2rem;
        border: 1px solid hsl(260, 20%, 25%);
        border-radius: var(--radius);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
    }

    .btn-outline-lg {
        padding: 1.5rem 2rem;
        font-size: 1.125rem;
    }

    .btn-primary:hover, .btn-primary-lg:hover {
        background: hsl(48, 100%, 75%);
        transform: translateY(-2px);
    }

    .btn-outline:hover, .btn-outline-lg:hover {
        background: hsl(260, 20%, 25%);
        border-color: hsl(48, 100%, 70%);
    }

    /* Badge */
    .badge {
        background: hsla(48, 100%, 70%, 0.1);
        color: hsl(48, 100%, 70%);
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-block;
        border: 1px solid hsla(48, 100%, 70%, 0.2);
    }

    /* Subject Carousel */
    .carousel-container {
        position: relative;
        overflow: hidden;
    }

    .carousel-wrapper {
        overflow: hidden;
        border-radius: var(--radius);
    }

    .carousel-track {
        display: flex;
        transition: transform 0.5s ease;
        gap: 1rem;
    }

    .carousel-item {
        flex: 0 0 calc(33.333% - 0.75rem);
        min-width: 300px;
    }

    @media (max-width: 768px) {
        .carousel-item {
            flex: 0 0 calc(100% - 0.75rem);
        }
    }

    .subject-card {
        background: hsla(260, 25%, 20%, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid hsl(260, 20%, 25%);
        border-radius: var(--radius);
        padding: 1.5rem;
        height: 100%;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .subject-card:hover {
        transform: scale(1.05);
        border-color: hsla(48, 100%, 70%, 0.5);
    }

    .card-header {
        text-align: center;
        margin-bottom: 1rem;
    }

    .subject-icon {
        width: 4rem;
        height: 4rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 2rem;
        background: linear-gradient(135deg, hsl(48, 100%, 70%) 0%, hsl(45, 100%, 82%) 100%);
        transition: transform 0.3s ease;
    }

    .subject-card:hover .subject-icon {
        transform: scale(1.1);
    }

    /* Stats Cards */
    .stats-card {
        background: hsla(260, 25%, 20%, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid hsl(260, 20%, 25%);
        border-radius: var(--radius);
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
    }

    .stats-card:hover {
        transform: scale(1.05);
    }

    .stats-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .stats-number {
        font-size: 2.5rem;
        font-weight: bold;
        color: hsl(48, 100%, 70%);
        margin-bottom: 0.5rem;
    }

    /* Testimonial Cards */
    .testimonial-card {
        background: hsla(260, 25%, 20%, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid hsl(260, 20%, 25%);
        border-radius: var(--radius);
        padding: 1.5rem;
    }

    /* Carousel Dots */
    .carousel-dots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }

    .carousel-dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background-color: hsl(260, 20%, 40%);
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .carousel-dot.active {
        background-color: hsl(48, 100%, 70%);
        transform: scale(1.2);
    }

    .carousel-dot:hover {
        background-color: hsla(48, 100%, 70%, 0.7);
    }

    /* Animations */
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }

    .animate-float {
        animation: float 3s ease-in-out infinite;
    }

    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px hsla(48, 100%, 70%, 0.3); }
        50% { box-shadow: 0 0 40px hsla(48, 100%, 70%, 0.6); }
    }

    .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .text-5xl { font-size: 2.5rem; }
        .text-7xl { font-size: 3rem; }
        .text-4xl { font-size: 2rem; }
        .text-5xl { font-size: 2.25rem; }
        .container { padding: 0 1rem; }
    }

    /* Utility Classes */
    .w-full { width: 100%; }
    .w-2 { width: 0.5rem; }
    .h-2 { height: 0.5rem; }
    .h-4 { width: 1rem; height: 1rem; }
    .h-5 { width: 1.25rem; height: 1.25rem; }
    .mr-2 { margin-right: 0.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    .mr-3 { margin-right: 0.75rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-16 { margin-bottom: 4rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-12 { margin-top: 3rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .rounded-full { border-radius: 9999px; }
    .bg-primary { background-color: hsl(48, 100%, 70%); }
    .flex { display: flex; }
    .grid { display: grid; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-x-8 > * + * { margin-left: 2rem; }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }
    .max-w-2xl { max-width: 42rem; }
    .max-w-4xl { max-width: 56rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-4xl { font-size: 2.25rem; }
    .text-5xl { font-size: 3rem; }
    .text-7xl { font-size: 4.5rem; }
    .text-sm { font-size: 0.875rem; }
    .leading-tight { line-height: 1.25; }
    .leading-relaxed { line-height: 1.625; }
    .transition-colors { transition: color 0.3s ease; }
    .transition-transform { transition: transform 0.3s ease; }
    .transition-all { transition: all 0.3s ease; }
    .hover\:opacity-80:hover { opacity: 0.8; }
    .cursor-pointer { cursor: pointer; }
    .sticky { position: sticky; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .top-0 { top: 0; }
    .z-10 { z-index: 10; }
    .z-50 { z-index: 50; }
    .overflow-hidden { overflow: hidden; }
    .backdrop-blur-sm { backdrop-filter: blur(4px); }
    .backdrop-blur-md { backdrop-filter: blur(12px); }
    .border-t { border-top-width: 1px; }
    .border-b { border-bottom-width: 1px; }
    .fill-current { fill: currentColor; }
    .flex-shrink-0 { flex-shrink: 0; }

    @media (min-width: 768px) {
        .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .md\:flex { display: flex; }
        .md\:text-7xl { font-size: 4.5rem; }
        .md\:text-5xl { font-size: 3rem; }
        .md\:text-2xl { font-size: 1.5rem; }
    }

    @media (min-width: 640px) {
        .sm\:flex-row { flex-direction: row; }
    }

    .hidden { display: none; }
    @media (min-width: 768px) {
        .md\:flex.hidden { display: flex; }
    }

    .italic { font-style: italic; }
    </style>
    <?php
}

function gcsewala_homepage_scripts() {
    ?>
    <script>
    // Navigation scroll behavior
    let lastScrollY = 0;
    const nav = document.getElementById('main-nav');

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Animated counters
    function animateCounters() {
        const counters = document.querySelectorAll('.stats-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 3000;
            const interval = 50;
            const steps = duration / interval;
            let currentStep = 0;
            
            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                const current = Math.floor(target * progress);
                
                if (current >= 1000000) {
                    counter.textContent = (current / 1000000).toFixed(1) + 'M';
                } else if (current >= 1000) {
                    counter.textContent = Math.floor(current / 1000) + 'K';
                } else {
                    counter.textContent = current.toLocaleString();
                }
                
                if (currentStep >= steps) {
                    if (target >= 1000000) {
                        counter.textContent = (target / 1000000).toFixed(1) + 'M';
                    } else if (target >= 1000) {
                        counter.textContent = Math.floor(target / 1000) + 'K';
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                    clearInterval(timer);
                }
            }, interval);
        });
    }

    // Subject carousel functionality
    let currentSlide = 0;
    const carousel = document.getElementById('subject-carousel');
    const dots = document.querySelectorAll('.carousel-dot');
    const totalSlides = Math.ceil(9 / 3); // 9 subjects, 3 per slide group

    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Auto-scroll carousel
    setInterval(nextSlide, 4000);

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    // Start animations when page loads
    document.addEventListener('DOMContentLoaded', () => {
        const statsSection = document.querySelector('.stats-card');
        if (statsSection) {
            observer.observe(statsSection);
        }
    });

    // Smooth scroll for navigation links
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
    </script>
    <?php
}
?>