import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExamPapers = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  // Updated papers data with "Higher" removed from all paper names
  const paperLinks = {
    biology: {
      AQA: [
        { name: "Paper 1 2023 (Triple)", url: "https://example.com/biology-aqa-p1-2023-triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://example.com/biology-aqa-p2-2023-triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://example.com/biology-aqa-p1-2022-triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://example.com/biology-aqa-p2-2022-triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/biology-aqa-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/biology-aqa-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://example.com/biology-aqa-p1-2022-combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://example.com/biology-aqa-p2-2022-combined.pdf" },
      ],
      Edexcel: [
        { name: "Paper 1 2023 (Triple)", url: "https://example.com/biology-edexcel-p1-2023-triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://example.com/biology-edexcel-p2-2023-triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://example.com/biology-edexcel-p1-2022-triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://example.com/biology-edexcel-p2-2022-triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/biology-edexcel-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/biology-edexcel-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://example.com/biology-edexcel-p1-2022-combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://example.com/biology-edexcel-p2-2022-combined.pdf" },
      ],
    },
    chemistry: {
      AQA: [
        { name: "Paper 1 2023 (Triple)", url: "https://example.com/chemistry-aqa-p1-2023-triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://example.com/chemistry-aqa-p2-2023-triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://example.com/chemistry-aqa-p1-2022-triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://example.com/chemistry-aqa-p2-2022-triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/chemistry-aqa-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/chemistry-aqa-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://example.com/chemistry-aqa-p1-2022-combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://example.com/chemistry-aqa-p2-2022-combined.pdf" },
      ],
      Edexcel: [
        { name: "Paper 1 2023 (Triple)", url: "https://example.com/chemistry-edexcel-p1-2023-triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://example.com/chemistry-edexcel-p2-2023-triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://example.com/chemistry-edexcel-p1-2022-triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://example.com/chemistry-edexcel-p2-2022-triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/chemistry-edexcel-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/chemistry-edexcel-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://example.com/chemistry-edexcel-p1-2022-combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://example.com/chemistry-edexcel-p2-2022-combined.pdf" },
      ],
    },
    physics: {
      AQA: [
        { name: "Paper 1 2023 (Triple)", url: "https://example.com/physics-aqa-p1-2023-triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://example.com/physics-aqa-p2-2023-triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://example.com/physics-aqa-p1-2022-triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://example.com/physics-aqa-p2-2022-triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/physics-aqa-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/physics-aqa-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://example.com/physics-aqa-p1-2022-combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://example.com/physics-aqa-p2-2022-combined.pdf" },
      ],
      Edexcel: [
        { name: "Paper 1 2023 (Triple)", url: "https://example.com/physics-edexcel-p1-2023-triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://example.com/physics-edexcel-p2-2023-triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://example.com/physics-edexcel-p1-2022-triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://example.com/physics-edexcel-p2-2022-triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/physics-edexcel-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/physics-edexcel-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://example.com/physics-edexcel-p1-2022-combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://example.com/physics-edexcel-p2-2022-combined.pdf" },
      ],
    },
  };

  const subjects = [
    { id: 'biology', name: 'Biology', icon: '🧬', color: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' },
    { id: 'chemistry', name: 'Chemistry', icon: '⚗️', color: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20' },
    { id: 'physics', name: 'Physics', icon: '⚛️', color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
    { id: 'maths', name: 'Mathematics', icon: '📐', color: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' },
    { id: 'history', name: 'History', icon: '📜', color: 'bg-amber-600/10 border-amber-600/20 hover:bg-amber-600/20' },
    { id: 'geography', name: 'Geography', icon: '🌍', color: 'bg-emerald-600/10 border-emerald-600/20 hover:bg-emerald-600/20' },
    { id: 'english-literature', name: 'English Literature', icon: '📚', color: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20' },
    { id: 'spanish', name: 'Spanish', icon: '🇪🇸', color: 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20' },
    { id: 'french', name: 'French', icon: '🇫🇷', color: 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20' }
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
            Access past papers for your subjects (mark schemes all included!)
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-3">
              <Card 
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${subject.color} ${
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
                <div className="animate-fade-in flex gap-2">
                  {boards.map((board) => (
                    <Button
                      key={board}
                      variant={selectedBoard === board ? "default" : "outline"}
                      className="flex-1"
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
                    {paperLinks[subject.id as keyof typeof paperLinks]?.[selectedBoard as keyof typeof paperLinks[keyof typeof paperLinks]] ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Triple Papers (first 4 items) */}
                          {paperLinks[subject.id as keyof typeof paperLinks][selectedBoard as keyof typeof paperLinks[keyof typeof paperLinks]].slice(0, 4).map((paper, index) => (
                            <a
                              key={index}
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-500 hover:text-blue-600 hover:underline text-sm py-1 transition-colors"
                            >
                              {paper.name}
                            </a>
                          ))}
                          {/* Combined Papers (last 4 items) */}
                          {paperLinks[subject.id as keyof typeof paperLinks][selectedBoard as keyof typeof paperLinks[keyof typeof paperLinks]].slice(4, 8).map((paper, index) => (
                            <a
                              key={index + 4}
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-500 hover:text-blue-600 hover:underline text-sm py-1 transition-colors"
                            >
                              {paper.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-foreground/60">
                        <p className="text-sm">
                          {selectedBoard} {subject.name} papers coming soon...
                        </p>
                        <p className="text-xs mt-1">
                          Papers will be added here
                        </p>
                      </div>
                    )}
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
