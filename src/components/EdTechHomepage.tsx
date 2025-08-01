import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FlashcardCounter from './FlashcardCounter';
import SubjectCarousel from './SubjectCarousel';
import SignInDialog from './SignInDialog';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Star, 
  Play, 
  ArrowRight,
  Infinity,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';

const EdTechHomepage = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<'signin' | 'signup'>('signin');

  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false);
      } else {
        // Scrolling up
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInClick = () => {
    setSignInMode('signin');
    setSignInDialogOpen(true);
  };

  const handleEnrolClick = () => {
    if (user) {
      // User is already logged in, navigate to dashboard
      navigate('/dashboard');
      return;
    }
    setSignInMode('signup');
    setSignInDialogOpen(true);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "The interactive courses helped me land my dream internship at Google!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Mathematics Major",
      content: "Amazing explanations and practice problems. My grades improved by 40%!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Physics Student",
      content: "Complex concepts made simple. The best learning platform I've used.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a 
                href="/"
                className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity cursor-pointer"
              >
                gcsewala
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <Button 
                  variant="ghost" 
                  onClick={handleDashboardClick}
                  className="text-primary hover:text-black hover:bg-accent/20"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              )}
              <a href="#subjects" className="text-foreground hover:text-primary transition-colors">Subjects</a>
              <a href="/exampapers" className="text-foreground hover:text-primary transition-colors">Exam Papers</a>
              <a href="/faq" className="text-foreground hover:text-primary transition-colors">FAQ</a>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={handleSignInClick}
                    disabled={loading}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="animate-pulse-glow" 
                    onClick={handleEnrolClick}
                    disabled={loading}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-purple-yellow py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 animate-float">
              {user ? `🎉 Welcome back, ${user.user_metadata?.full_name || user.email?.split('@')[0]}!` : '🚀 New AI-Powered Learning Experience'}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
              Master Any Subject
              <br />
              <span className="text-primary">With Expert Guidance</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              {user 
                ? "Continue your learning journey with our interactive courses and personalized learning paths."
                : "Join thousands of students who've transformed their academic performance with our interactive courses and personalized learning paths."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 animate-pulse-glow" 
                onClick={handleEnrolClick}
                disabled={loading}
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-foreground/60">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                50K+ Students
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-primary" />
                4.9/5 Rating
              </div>
              <div className="flex items-center">
                <Infinity className="h-4 w-4 mr-2 text-primary" />
                Lifetime Access
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flashcard Counter Section - Live Learning Stats */}
      <FlashcardCounter />

      {/* Subject Carousel Section */}
      <SubjectCarousel />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-card/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              What Students Say
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Real success stories from students who've transformed their academic journey with us.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 gradient-purple-yellow relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Powerful Learning Tools & Resources
              </h2>
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                Master your subjects with our comprehensive suite of revision tools designed to boost your academic performance
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mr-4">
                    <div className="w-6 h-6 bg-primary rounded"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Interactive Flashcards</h3>
                </div>
                <p className="text-foreground/80 mb-4">
                  Boost memory retention with our smart flashcard system that adapts to your learning pace.
                </p>
                <ul className="space-y-2 text-foreground/70">
                  <li>• Spaced repetition algorithm for optimal retention</li>
                  <li>• Track your progress and identify weak areas</li>
                  <li>• Mobile-friendly for studying on the go</li>
                  <li>• Customizable difficulty levels</li>
                </ul>
              </Card>
              
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mr-4">
                    <div className="w-6 h-6 bg-primary rounded-full border-2 border-background"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Topic Tests</h3>
                </div>
                <p className="text-foreground/80 mb-4">
                  Practice with targeted tests designed to strengthen your understanding of specific topics.
                </p>
                <ul className="space-y-2 text-foreground/70">
                  <li>• Instant feedback and detailed explanations</li>
                  <li>• Performance analytics to track improvement</li>
                  <li>• Exam-style questions for real preparation</li>
                  <li>• Unlimited attempts to perfect your skills</li>
                </ul>
              </Card>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-gradient">
                Why Our Revision Methods Work
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">40%</span>
                  </div>
                  <p className="text-foreground/80 text-center">Average grade improvement using our flashcard system</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">85%</span>
                  </div>
                  <p className="text-foreground/80 text-center">Students report better exam confidence after topic tests</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">50%</span>
                  </div>
                  <p className="text-foreground/80 text-center">Reduction in study time needed for exam preparation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/20 py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold text-gradient">gcsewala</span>
              </div>
              <p className="text-foreground/60">Empowering students worldwide with quality education and innovative learning experiences.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary">Subjects</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">Mathematics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Computer Science</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Physics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Chemistry</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary">Company</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-primary">Support</h4>
              <ul className="space-y-2 text-foreground/60">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-foreground/60">
            &copy; 2025 gcsewala. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sign In Dialog */}
      <SignInDialog 
        open={signInDialogOpen}
        onOpenChange={setSignInDialogOpen}
        initialMode={signInMode}
      />
    </div>
  );
};

export default EdTechHomepage;
