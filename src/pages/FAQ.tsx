import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthDialog } from '@/components/AuthDialogProvider';
import { 
  ChevronDown,
  ChevronUp,
  Users, 
  Star, 
  Play, 
  ArrowRight,
  Infinity,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { openAuth } = useAuthDialog();

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "What subjects do you offer?",
      answer: "We offer comprehensive courses in Mathematics, Computer Science, Physics, Chemistry, Biology, History, Geography, English Literature, Spanish, and French. Each subject includes interactive lessons, practice problems, and past exam papers."
    },
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing plans to suit every student's needs. Our basic plan starts at £9.99/month, with premium features available at £19.99/month. We also offer annual subscriptions with significant discounts."
    },
    {
      question: "Can I access past exam papers?",
      answer: "Yes! We provide extensive collections of past exam papers for both AQA and Edexcel exam boards. All papers include mark schemes and detailed explanations to help you understand the marking criteria."
    },
    {
      question: "Is there a free trial?",
      answer: "Absolutely! We offer a 7-day free trial with full access to all our courses and features. No credit card required to start your trial."
    },
    {
      question: "How do I track my progress?",
      answer: "Your personalized dashboard shows detailed progress tracking, including completion rates, test scores, and areas for improvement. You can also set goals and receive recommendations based on your performance."
    },
    {
      question: "Are the courses suitable for all exam boards?",
      answer: "Our courses are designed to cover the core curriculum that applies to most major exam boards including AQA, Edexcel, OCR, and WJEC. We specifically highlight exam board differences where relevant."
    },
    {
      question: "Can I download materials for offline study?",
      answer: "Yes, premium subscribers can download PDF notes, practice worksheets, and exam papers for offline study. This feature is perfect for studying on the go or in areas with limited internet access."
    },
    {
      question: "How often is content updated?",
      answer: "We continuously update our content to reflect the latest curriculum changes and exam specifications. New practice questions, exam papers, and interactive content are added monthly."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link 
                to="/"
                className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity cursor-pointer"
              >
                gcsewala
              </Link>
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
              <Link to="/#subjects" className="text-foreground hover:text-primary transition-colors">Subjects</Link>
              <Link to="/exampapers" className="text-foreground hover:text-primary transition-colors">Exam Papers</Link>
              <Link to="/quizzes" className="text-foreground hover:text-primary transition-colors">Quizzes</Link>
              <Link to="/lessons" className="text-foreground hover:text-primary transition-colors">Lessons</Link>
              <Link to="/faq" className="text-foreground hover:text-primary transition-colors">FAQ</Link>
              
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
                    onClick={() => openAuth('signin')}
                    disabled={loading}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="animate-pulse-glow" 
                    onClick={() => openAuth('signup')}
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
              ❓ Frequently Asked Questions
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
              Get Your Questions
              <br />
              <span className="text-primary">Answered</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Find answers to common questions about our platform, courses, and features.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h3>
                      {openFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-6 animate-fade-in">
                        <p className="text-foreground/70 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gradient">
                    Still have questions?
                  </h3>
                  <p className="text-foreground/70 mb-6">
                    Can't find the answer you're looking for? Our support team is here to help.
                  </p>
                  <Button size="lg" className="animate-pulse-glow">
                    Contact Support
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default FAQ;