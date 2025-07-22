
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

const FlashcardCounter = () => {
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    // Animate the counters
    const flashcardTarget = 2847392;
    const studentsTarget = 48576;
    const subjectsTarget = 127;

    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setFlashcardCount(Math.floor(flashcardTarget * progress));
      setStudentsCount(Math.floor(studentsTarget * progress));
      setSubjectsCount(Math.floor(subjectsTarget * progress));

      if (currentStep >= steps) {
        setFlashcardCount(flashcardTarget);
        setStudentsCount(studentsTarget);
        setSubjectsCount(subjectsTarget);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <section className="py-20 bg-background/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Live Learning Stats
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            See the impact of our community in real-time as students master subjects worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="group bg-card/80 backdrop-blur-sm border-border/50 hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 text-primary w-fit">
                <BookOpen className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {formatNumber(flashcardCount)}
              </div>
              <p className="text-foreground/70 font-medium">Flashcards Studied</p>
              <p className="text-sm text-foreground/50 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="group bg-card/80 backdrop-blur-sm border-border/50 hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 text-primary w-fit">
                <Users className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {formatNumber(studentsCount)}
              </div>
              <p className="text-foreground/70 font-medium">Active Students</p>
              <p className="text-sm text-foreground/50 mt-1">Learning daily</p>
            </CardContent>
          </Card>

          <Card className="group bg-card/80 backdrop-blur-sm border-border/50 hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-primary/10 text-primary w-fit">
                <TrendingUp className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {subjectsCount}
              </div>
              <p className="text-foreground/70 font-medium">Subjects Available</p>
              <p className="text-sm text-foreground/50 mt-1">And growing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FlashcardCounter;
