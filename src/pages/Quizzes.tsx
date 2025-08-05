import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, LogOut, User, LayoutDashboard, Lock, ArrowLeft, Clock, ChevronUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

interface Topic {
  id: string;
  topic_name: string;
  subject?: string;
  is_free: boolean;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  showResults: boolean;
  timer: number;
  isQuizActive: boolean;
}

const Quizzes = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    timer: 0,
    isQuizActive: false
  });
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Free courses that are unlocked for everyone
  const freeCourses = [
    'AQA Mathematics',
    'OCR Computer Science', 
    'AQA Triple Science'
  ];

  // Quiz questions for available topics
  const quizQuestions: Record<string, Question[]> = {
    'AQA Mathematics-Number': [
      {
        id: 1,
        question: "What is the value of 2³?",
        options: ["6", "8", "9", "12"],
        correctAnswer: 1,
        explanation: "2³ = 2 × 2 × 2 = 8"
      },
      {
        id: 2,
        question: "Which of these is a prime number?",
        options: ["15", "21", "23", "27"],
        correctAnswer: 2,
        explanation: "23 is prime because it can only be divided by 1 and itself"
      },
      {
        id: 3,
        question: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 1,
        explanation: "25% of 80 = 0.25 × 80 = 20"
      }
    ],
    'AQA Mathematics-Algebra': [
      {
        id: 1,
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        correctAnswer: 1,
        explanation: "2x + 5 = 13, so 2x = 8, therefore x = 4"
      },
      {
        id: 2,
        question: "Expand (x + 3)(x + 2)",
        options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6x + 6"],
        correctAnswer: 0,
        explanation: "(x + 3)(x + 2) = x² + 2x + 3x + 6 = x² + 5x + 6"
      },
      {
        id: 3,
        question: "If y = 2x + 1, what is y when x = 3?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "y = 2(3) + 1 = 6 + 1 = 7"
      }
    ],
    'OCR Computer Science-SLR 1.1 - Systems Architecture': [
      {
        id: 1,
        question: "What does CPU stand for?",
        options: ["Computer Processing Unit", "Central Processing Unit", "Central Program Unit", "Computer Program Unit"],
        correctAnswer: 1,
        explanation: "CPU stands for Central Processing Unit"
      },
      {
        id: 2,
        question: "Which of these is volatile memory?",
        options: ["Hard Drive", "SSD", "RAM", "ROM"],
        correctAnswer: 2,
        explanation: "RAM (Random Access Memory) is volatile - it loses data when power is removed"
      },
      {
        id: 3,
        question: "What is the purpose of the ALU?",
        options: ["Store data", "Control operations", "Perform calculations", "Manage memory"],
        correctAnswer: 2,
        explanation: "The ALU (Arithmetic Logic Unit) performs mathematical and logical operations"
      }
    ],
    'AQA Triple Science-Physics-Forces': [
      {
        id: 1,
        question: "What is the unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correctAnswer: 1,
        explanation: "Force is measured in Newtons (N), named after Sir Isaac Newton"
      },
      {
        id: 2,
        question: "What is Newton's first law of motion?",
        options: ["F = ma", "Objects at rest stay at rest unless acted upon by a force", "For every action there is an equal and opposite reaction", "Force equals mass times acceleration"],
        correctAnswer: 1,
        explanation: "Newton's first law states that objects at rest stay at rest and objects in motion stay in motion unless acted upon by an unbalanced force"
      },
      {
        id: 3,
        question: "If a 10N force is applied to a 2kg object, what is its acceleration?",
        options: ["5 m/s²", "20 m/s²", "0.2 m/s²", "12 m/s²"],
        correctAnswer: 0,
        explanation: "Using F = ma, acceleration = F/m = 10N/2kg = 5 m/s²"
      }
    ],
    'AQA Triple Science-Biology-Cell Biology': [
      {
        id: 1,
        question: "What is the function of mitochondria?",
        options: ["Protein synthesis", "Energy production", "Cell division", "Waste removal"],
        correctAnswer: 1,
        explanation: "Mitochondria are the powerhouses of the cell, producing ATP for energy"
      },
      {
        id: 2,
        question: "Which organelle contains the cell's genetic material?",
        options: ["Nucleus", "Cytoplasm", "Ribosome", "Vacuole"],
        correctAnswer: 0,
        explanation: "The nucleus contains the cell's DNA and controls cell activities"
      }
    ],
    'AQA Triple Science-Chemistry-Atomic Structure': [
      {
        id: 1,
        question: "What is the atomic number of an element?",
        options: ["Number of neutrons", "Number of protons", "Number of electrons", "Mass number"],
        correctAnswer: 1,
        explanation: "The atomic number is the number of protons in an atom's nucleus"
      }
    ]
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchTopics();
    }
  }, [selectedCourse]);

  // Timer effect for quiz
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizState.isQuizActive && !quizState.showResults) {
      interval = setInterval(() => {
        setQuizState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState.isQuizActive, quizState.showResults]);

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

  const fetchTopics = async () => {
    if (!selectedCourse) return;
    
    try {
      const course = courses.find(c => c.title === selectedCourse);
      if (!course) return;

      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('course_id', course.id)
        .order('subject', { nullsFirst: true })
        .order('topic_name');

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const isCourseUnlocked = (courseTitle: string) => {
    return user || freeCourses.includes(courseTitle);
  };

  const getAvailableCourses = () => {
    return [...courses].sort((a, b) => {
      const aUnlocked = isCourseUnlocked(a.title);
      const bUnlocked = isCourseUnlocked(b.title);
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return a.title.localeCompare(b.title);
    });
  };

  const isScienceCourse = (courseTitle: string) => {
    return courseTitle.toLowerCase().includes('triple') || courseTitle.toLowerCase().includes('combined');
  };

  const getAvailableSubjects = () => {
    if (!isScienceCourse(selectedCourse)) return [];
    const subjects = [...new Set(topics.filter(t => t.subject).map(t => t.subject!))];
    return subjects;
  };

  const getAvailableTopics = () => {
    if (isScienceCourse(selectedCourse)) {
      if (!selectedSubject) return [];
      return topics.filter(t => t.subject === selectedSubject);
    } else {
      // For non-science courses, show all topics regardless of subject
      return topics;
    }
  };

  const isTopicLocked = (topic: Topic) => {
    if (!user && !topic.is_free) return true;
    const questionKey = isScienceCourse(selectedCourse) && topic.subject
      ? `${selectedCourse}-${topic.subject}-${topic.topic_name}`
      : `${selectedCourse}-${topic.topic_name}`;
    return !quizQuestions[questionKey];
  };

  const handleCourseChange = (courseTitle: string) => {
    if (!isCourseUnlocked(courseTitle)) return;
    setSelectedCourse(courseTitle);
    setSelectedSubject('');
    setSelectedTopic('');
    setQuizState({ currentQuestion: 0, answers: [], showResults: false, timer: 0, isQuizActive: false });
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopic('');
    setQuizState({ currentQuestion: 0, answers: [], showResults: false, timer: 0, isQuizActive: false });
  };

  const handleTopicChange = (topicName: string) => {
    setSelectedTopic(topicName);
    setQuizState({ currentQuestion: 0, answers: [], showResults: false, timer: 0, isQuizActive: false });
  };

  const startQuiz = () => {
    const questions = getCurrentQuestions();
    setQuizState({
      currentQuestion: 0,
      answers: new Array(questions.length).fill(null),
      showResults: false,
      timer: 0,
      isQuizActive: true
    });
  };

  const getCurrentQuestions = (): Question[] => {
    if (!selectedCourse || !selectedTopic) return [];
    
    const questionKey = isScienceCourse(selectedCourse) && selectedSubject
      ? `${selectedCourse}-${selectedSubject}-${selectedTopic}`
      : `${selectedCourse}-${selectedTopic}`;
    
    return quizQuestions[questionKey] || [];
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState(prev => ({ ...prev, answers: newAnswers }));
  };

  const nextQuestion = () => {
    const questions = getCurrentQuestions();
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      setQuizState(prev => ({ ...prev, showResults: true, isQuizActive: false }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  const resetQuiz = () => {
    const questions = getCurrentQuestions();
    setQuizState({
      currentQuestion: 0,
      answers: new Array(questions.length).fill(null),
      showResults: false,
      timer: 0,
      isQuizActive: true
    });
  };

  const goBackToSelection = () => {
    setSelectedCourse('');
    setSelectedSubject('');
    setSelectedTopic('');
    setQuizState({ currentQuestion: 0, answers: [], showResults: false, timer: 0, isQuizActive: false });
  };

  const calculateScore = () => {
    const questions = getCurrentQuestions();
    const correctAnswers = quizState.answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    return { correct: correctAnswers, total: questions.length };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  // Quiz active view (full page)
  if (quizState.isQuizActive || quizState.showResults) {
    return (
      <div className="min-h-screen bg-background">
        {/* Quiz Header */}
        <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={goBackToSelection}
                  className="text-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Selection
                </Button>
                <div className="text-sm text-foreground/60">
                  {selectedCourse} {selectedSubject && `- ${selectedSubject}`} - {selectedTopic}
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Timer */}
                <div className="flex items-center space-x-2 text-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm">{formatTime(quizState.timer)}</span>
                </div>
                
                {/* Progress */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground/60">Progress:</span>
                  <div className="w-32">
                    <Progress 
                      value={((quizState.currentQuestion + 1) / getCurrentQuestions().length) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm text-foreground/60">
                    {quizState.currentQuestion + 1}/{getCurrentQuestions().length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {!quizState.showResults ? (
              <Card className="border-border">
                <CardContent className="p-12">
                  {getCurrentQuestions()[quizState.currentQuestion] && (
                    <div>
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-semibold text-foreground">
                            Question {quizState.currentQuestion + 1}
                          </h2>
                          <Badge variant="outline" className="px-3 py-1">
                            {getCurrentQuestions().length} questions total
                          </Badge>
                        </div>
                        
                        <p className="text-xl text-foreground leading-relaxed">
                          {getCurrentQuestions()[quizState.currentQuestion].question}
                        </p>
                      </div>
                      
                      <div className="space-y-4 mb-12">
                        {getCurrentQuestions()[quizState.currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            variant={quizState.answers[quizState.currentQuestion] === index ? "default" : "outline"}
                            className="w-full text-left justify-start p-6 h-auto text-lg"
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <span className="mr-4 font-bold text-xl">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={previousQuestion}
                          disabled={quizState.currentQuestion === 0}
                          size="lg"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={nextQuestion}
                          disabled={quizState.answers[quizState.currentQuestion] === null}
                          size="lg"
                        >
                          {quizState.currentQuestion === getCurrentQuestions().length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Quiz Complete!</h2>
                  <div className="text-5xl font-bold text-primary mb-6">
                    {calculateScore().correct} / {calculateScore().total}
                  </div>
                  <p className="text-xl text-foreground/70 mb-8">
                    Time taken: {formatTime(quizState.timer)}
                  </p>
                  <p className="text-lg text-foreground/70 mb-12">
                    {calculateScore().correct === calculateScore().total 
                      ? "Perfect score! Excellent work!" 
                      : calculateScore().correct >= calculateScore().total * 0.7 
                      ? "Great job! Keep practicing!" 
                      : "Good effort! Review the topics and try again."}
                  </p>
                  
                  <div className="space-y-6 mb-12 text-left">
                    {getCurrentQuestions().map((question, index) => (
                      <div key={index} className="border border-border rounded-lg p-6">
                        <p className="font-semibold text-foreground mb-3 text-lg">{question.question}</p>
                        <p className={`text-base mb-2 ${
                          quizState.answers[index] === question.correctAnswer 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          Your answer: {question.options[quizState.answers[index] ?? -1] || 'Not answered'}
                        </p>
                        {quizState.answers[index] !== question.correctAnswer && (
                          <p className="text-base text-green-600 mb-2">
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-foreground/60">{question.explanation}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button onClick={resetQuiz} size="lg">
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={goBackToSelection} size="lg">
                      Choose New Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Course selection view
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
                Access to full courses require enrolment. Sign up to study all content!!
              </p>
            </div>
          )}
        </div>

        {/* Quiz Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center text-foreground">Start Your Quiz</h2>
              <p className="text-center text-foreground/70 mb-8">Select a course and topic to begin your personalized quiz</p>
              
              <div className="space-y-6">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Course</label>
                  <Select value={selectedCourse} onValueChange={handleCourseChange}>
                    <SelectTrigger className="w-full bg-background border-border">
                      <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {getAvailableCourses().map((course) => (
                        <SelectItem 
                          key={course.id} 
                          value={course.title}
                          disabled={!isCourseUnlocked(course.title)}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{course.title}</span>
                            {!isCourseUnlocked(course.title) && (
                              <Lock className="h-3 w-3 text-muted-foreground ml-2" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Selection (for science courses) */}
                {selectedCourse && isScienceCourse(selectedCourse) && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                      <SelectTrigger className="w-full bg-background border-border">
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {getAvailableSubjects().map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Topic Selection */}
                {selectedCourse && (!isScienceCourse(selectedCourse) || selectedSubject) && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-foreground mb-2">Topic</label>
                    <Select value={selectedTopic} onValueChange={handleTopicChange}>
                      <SelectTrigger className="w-full bg-background border-border">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#4A2C6D] border-border">
                        <div className="relative">
                          {getAvailableTopics().length > 5 && (
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                              <ChevronUp className="h-4 w-4 text-primary/60 animate-pulse" />
                            </div>
                          )}
                          <ScrollArea className="h-[200px]">
                            {getAvailableTopics().map((topic) => (
                              <SelectItem 
                                key={topic.id} 
                                value={topic.topic_name}
                                disabled={isTopicLocked(topic)}
                                className="hover:bg-primary/20"
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{topic.topic_name}</span>
                                  {isTopicLocked(topic) && (
                                    <Lock className="h-3 w-3 text-muted-foreground ml-2" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </ScrollArea>
                          {getAvailableTopics().length > 5 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                              <ChevronDown className="h-4 w-4 text-primary/60 animate-pulse" />
                            </div>
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Start Quiz Button */}
                {selectedCourse && selectedTopic && getCurrentQuestions().length > 0 && (
                  <div className="text-center animate-fade-in">
                    <Button 
                      onClick={startQuiz}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3"
                    >
                      Start Quiz <ChevronDown className="ml-2 h-4 w-4 rotate-90" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Locked Topic Message */}
          {selectedCourse && selectedTopic && getCurrentQuestions().length === 0 && (
            <Card className="mt-8 animate-fade-in">
              <CardContent className="p-8 text-center">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Topic Locked</h3>
                <p className="text-foreground/70 mb-6">
                  This topic doesn't have quiz questions available yet or requires an account to access.
                </p>
                {!user && (
                  <Button onClick={() => window.location.href = '/'}>
                    Sign Up to Access More Content
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
