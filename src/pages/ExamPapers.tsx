import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExamPapers = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const subjects = [
    { id: 'biology', name: 'Biology', icon: '🧬' },
    { id: 'chemistry', name: 'Chemistry', icon: '⚗️' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'maths', name: 'Mathematics', icon: '📐' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'geography', name: 'Geography', icon: '🌍' },
    { id: 'english-literature', name: 'English Literature', icon: '📚' },
    { id: 'spanish', name: 'Spanish', icon: '🇪🇸' },
    { id: 'french', name: 'French', icon: '🇫🇷' }
  ];

  const boards = ['AQA', 'Edexcel'];

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(selectedSubject === subjectId ? null : subjectId);
    setSelectedBoard(null); // Reset board selection when changing subject
  };

  const handleBoardClick = (board: string) => {
    setSelectedBoard(selectedBoard === board ? null : board);
  };

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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Exam Papers
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Access past papers and practice materials for your subjects
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-3">
              <Card 
                className={`edtech-card cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedSubject === subject.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{subject.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {subject.name}
                  </h3>
                  <div className="flex items-center justify-center text-primary">
                    {selectedSubject === subject.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Board Selection */}
              {selectedSubject === subject.id && (
                <div className="animate-fade-in space-y-2">
                  {boards.map((board) => (
                    <Button
                      key={board}
                      variant={selectedBoard === board ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleBoardClick(board)}
                    >
                      {board}
                    </Button>
                  ))}
                </div>
              )}

              {/* File Links Dropdown */}
              {selectedSubject === subject.id && selectedBoard && (
                <Card className="animate-fade-in bg-muted/50">
                  <CardContent className="p-4">
                    <div className="text-center text-foreground/60">
                      <p className="text-sm">
                        {selectedBoard} {subject.name} papers coming soon...
                      </p>
                      <p className="text-xs mt-1">
                        File links will be added here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPapers;