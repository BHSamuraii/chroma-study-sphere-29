import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, FlaskConical, Atom, Dna } from 'lucide-react';

interface ScienceCoursePopupProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  isScienceCourse: boolean;
}

type Subject = 'biology' | 'chemistry' | 'physics';
type StudyType = 'flashcards' | 'quizzes' | 'lessons';

export const ScienceCoursePopup: React.FC<ScienceCoursePopupProps> = ({
  isOpen,
  onClose,
  courseTitle,
  isScienceCourse,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [step, setStep] = useState<'subject' | 'study-type'>(isScienceCourse ? 'subject' : 'study-type');

  // Reset step when course type changes
  useEffect(() => {
    if (isOpen) {
      setStep(isScienceCourse ? 'subject' : 'study-type');
      setSelectedSubject(null);
    }
  }, [isOpen, isScienceCourse]);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setStep('study-type');
  };

  const handleStudyTypeSelect = (studyType: StudyType) => {
    // TODO: Handle the study type selection
    console.log('Selected:', selectedSubject, studyType);
    onClose();
    resetPopup();
  };

  const resetPopup = () => {
    setSelectedSubject(null);
    setStep(isScienceCourse ? 'subject' : 'study-type');
  };

  const handleClose = () => {
    onClose();
    resetPopup();
  };

  const handleBack = () => {
    if (isScienceCourse) {
      setStep('subject');
      setSelectedSubject(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 to-purple-950/95 border-white/20 backdrop-blur-sm max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-yellow-400 text-xl font-bold">
            {step === 'subject' ? 'Choose Your Science Subject' : isScienceCourse ? `Study ${selectedSubject?.charAt(0).toUpperCase()}${selectedSubject?.slice(1)}` : 'Choose Study Method'}
          </DialogTitle>
          <p className="text-center text-white/70 text-sm mt-2">
            {step === 'subject' ? courseTitle : 'How would you like to study?'}
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {step === 'subject' ? (
            <>
              <Button
                onClick={() => handleSubjectSelect('biology')}
                className="w-full h-16 bg-green-600/20 hover:bg-green-600/30 border-2 border-green-500/50 hover:border-green-400 text-green-100 hover:text-green-50 transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <Dna className="w-6 h-6" />
                <span className="text-lg font-semibold">Biology</span>
              </Button>

              <Button
                onClick={() => handleSubjectSelect('chemistry')}
                className="w-full h-16 bg-red-600/20 hover:bg-red-600/30 border-2 border-red-500/50 hover:border-red-400 text-red-100 hover:text-red-50 transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <FlaskConical className="w-6 h-6" />
                <span className="text-lg font-semibold">Chemistry</span>
              </Button>

              <Button
                onClick={() => handleSubjectSelect('physics')}
                className="w-full h-16 bg-blue-600/20 hover:bg-blue-600/30 border-2 border-blue-500/50 hover:border-blue-400 text-blue-100 hover:text-blue-50 transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <Atom className="w-6 h-6" />
                <span className="text-lg font-semibold">Physics</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleStudyTypeSelect('flashcards')}
                className="w-full h-16 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-purple-500/50 hover:border-purple-400 text-purple-100 hover:text-purple-50 transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-lg font-semibold">Flashcards</span>
              </Button>

              <Button
                onClick={() => handleStudyTypeSelect('quizzes')}
                className="w-full h-16 bg-yellow-600/20 hover:bg-yellow-600/30 border-2 border-yellow-500/50 hover:border-yellow-400 text-yellow-100 hover:text-yellow-50 transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                  <path d="M3 12v6a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-6"/>
                </svg>
                <span className="text-lg font-semibold">Quizzes</span>
              </Button>

              <Button
                onClick={() => handleStudyTypeSelect('lessons')}
                className="w-full h-16 bg-indigo-600/20 hover:bg-indigo-600/30 border-2 border-indigo-500/50 hover:border-indigo-400 text-indigo-100 hover:text-indigo-50 transition-all duration-200 flex items-center justify-center space-x-3"
                variant="outline"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <span className="text-lg font-semibold">Lessons</span>
              </Button>

              {isScienceCourse && (
                <Button
                  onClick={handleBack}
                  className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/80 hover:text-white transition-all duration-200"
                  variant="outline"
                >
                  ← Back to Subjects
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};