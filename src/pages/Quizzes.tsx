import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, LogOut, User, LayoutDashboard, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

const Quizzes = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Free courses that are unlocked for everyone
  const freeCourses = [
    'AQA GCSE Triple Science',
    'AQA Triple Science', 
    'AQA Mathematics',
    'OCR Computer Science'
  ];

  // Mock topics for each course
  const courseTopics = {
    'AQA GCSE Triple Science': [
      'Cell Biology', 'Organisation', 'Infection and Response', 'Bioenergetics',
      'Homeostasis', 'Inheritance', 'Ecology', 'Atomic Structure', 'Bonding',
      'Quantitative Chemistry', 'Chemical Changes', 'Energy Changes', 'Organic Chemistry',
      'Forces', 'Waves', 'Electricity', 'Magnetism', 'Particle Model'
    ],
    'AQA Triple Science': [
      'Cell Biology', 'Organisation', 'Infection and Response', 'Bioenergetics',
      'Homeostasis', 'Inheritance', 'Ecology', 'Atomic Structure', 'Bonding',
      'Quantitative Chemistry', 'Chemical Changes', 'Energy Changes', 'Organic Chemistry',
      'Forces', 'Waves', 'Electricity', 'Magnetism', 'Particle Model'
    ],
    'AQA Mathematics': [
      'Number', 'Algebra', 'Ratio & Proportion', 'Geometry & Measures',
      'Probability', 'Statistics', 'Sequences', 'Graphs', 'Transformations'
    ],
    'OCR Computer Science': [
      'Computer Systems', 'Computational Thinking', 'Algorithms', 'Programming',
      'Data Representation', 'Computer Networks', 'Cyber Security', 'Ethical Issues'
    ],
    'AQA Combined Science': [
      'Cell Biology', 'Organisation', 'Infection and Response', 'Bioenergetics',
      'Atomic Structure', 'Bonding', 'Chemical Changes', 'Forces', 'Waves', 'Electricity'
    ],
    'AQA English Literature': [
      'Poetry Analysis', 'Shakespeare', 'Modern Texts', 'Literary Techniques',
      'Character Analysis', 'Themes and Context'
    ],
    'Edexcel Combined Science': [
      'Cells and Control', 'Genetics', 'Natural Selection', 'Health and Disease',
      'Plant Structures', 'Animal Coordination', 'Atomic Structure', 'States of Matter'
    ],
    'Edexcel Triple Science': [
      'Cells and Control', 'Genetics', 'Natural Selection', 'Health and Disease',
      'Plant Structures', 'Animal Coordination', 'Motion and Forces', 'Conservation of Energy'
    ]
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, image_url')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleCourseClick = (courseId: string, courseTitle: string) => {
    // If user is not logged in and course is not free, don't allow selection
    if (!user && !freeCourses.includes(courseTitle)) {
      return;
    }
    setSelectedCourse(selectedCourse === courseId ? null : courseId);
    setSelectedTopic(null);
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(selectedTopic === topic ? null : topic);
  };

  const isCourseLocked = (courseTitle: string) => {
    return !user && !freeCourses.includes(courseTitle);
  };

  const getSelectedCourseTitle = () => {
    const course = courses.find(c => c.id === selectedCourse);
    return course?.title || '';
  };

  const getCourseIcon = (title: string) => {
    if (title.toLowerCase().includes('science')) return '🧬';
    if (title.toLowerCase().includes('mathematics') || title.toLowerCase().includes('maths')) return '📐';
    if (title.toLowerCase().includes('computer')) return '💻';
    if (title.toLowerCase().includes('english')) return '📚';
    return '📖';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50">
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
              <a href="/#subjects" className="text-foreground hover:text-primary transition-colors">Subjects</a>
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
                    disabled={authLoading}
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
                    onClick={() => window.location.href = '/'}
                    disabled={authLoading}
                  >
                    Log In
                  </Button>
                  <Button
                    className="animate-pulse-glow"
                    onClick={() => window.location.href = '/'}
                    disabled={authLoading}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Practice Quizzes
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Test your knowledge with exam-style questions. Choose your course and topic to begin practicing.
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-accent/10 border border-accent rounded-lg max-w-lg mx-auto">
              <p className="text-sm text-foreground/70">
                <Lock className="h-4 w-4 inline mr-1" />
                Some courses require an account. Sign up to access all content!
              </p>
            </div>
          )}
        </div>

        {/* Course Selection */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Select a Course</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <Card
                key={course.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isCourseLocked(course.title) 
                    ? 'opacity-60 bg-muted/20 border-muted' 
                    : 'bg-card border-border hover:border-primary/50'
                } ${
                  selectedCourse === course.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => handleCourseClick(course.id, course.title)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl mb-2">{getCourseIcon(course.title)}</div>
                    {isCourseLocked(course.title) && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    {course.description}
                  </p>
                  {freeCourses.includes(course.title) && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Free Access
                    </Badge>
                  )}
                  <div className="flex items-center justify-center text-primary mt-4">
                    {selectedCourse === course.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Topic Selection */}
          {selectedCourse && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">
                Select a Topic - {getSelectedCourseTitle()}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {(courseTopics[getSelectedCourseTitle() as keyof typeof courseTopics] || []).map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    className="p-4 h-auto text-left justify-start"
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Content */}
          {selectedCourse && selectedTopic && (
            <Card className="animate-fade-in bg-muted/30">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {selectedTopic} Quiz
                </h3>
                <p className="text-foreground/70 mb-6">
                  Get ready to test your knowledge on {selectedTopic} from {getSelectedCourseTitle()}!
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-foreground/60">
                    Quiz features coming soon:
                  </p>
                  <ul className="text-sm text-foreground/60 space-y-1">
                    <li>• 10-15 exam-style questions</li>
                    <li>• Instant feedback with explanations</li>
                    <li>• Progress tracking and scoring</li>
                    <li>• Timed practice mode</li>
                  </ul>
                  <Button className="mt-6" disabled>
                    Start Quiz (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;