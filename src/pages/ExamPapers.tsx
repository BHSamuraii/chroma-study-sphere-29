import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthDialog } from '@/components/AuthDialogProvider';

const ExamPapers = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { openAuth } = useAuthDialog();
  const [selectedType, setSelectedType] = useState<'papers' | 'ms'>('papers');

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Updated papers data with Mathematics section added
  const paperLinks = {
    biology: {
      AQA: [
        { name: "Paper 1 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper1Triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper2Triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper1Triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper2Triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper1Combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper2Combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper1Combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper2Combined.pdf" },
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
        { name: "Paper 1 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper1Triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper2Triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryPaper1Triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryTriplePaper2.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper1Combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper2Combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryPaper1Combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryPaper2Combined.pdf" },
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
        { name: "Paper 1 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022PhysicsPaper1Triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQAPhysicsPaper2Triple2022.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/physics-aqa-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/physics-aqa-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022PhysicsPaper1Combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022PhysicsPaper2Combined.pdf" },
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
    maths: {
      AQA: [
        { name: "Paper 1 2023 (Higher)", url: "https://example.com/maths-aqa-p1-2023-higher.pdf" },
        { name: "Paper 2 2023 (Higher)", url: "https://example.com/maths-aqa-p2-2023-higher.pdf" },
        { name: "Paper 3 2023 (Higher)", url: "https://example.com/maths-aqa-p3-2023-higher.pdf" },
        { name: "Paper 1 2022 (Higher)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQA-83001H-QP-JUN22-merged.pdf" },
        { name: "Paper 2 2022 (Higher)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQA-83002H-QP-JUN22-merged.pdf" },
        { name: "Paper 3 2022 (Higher)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQA-MAY-2022-PAPER-3-HIGHER-merged.pdf" },
      ],
      Edexcel: [
        { name: "Paper 1 2023 (Higher)", url: "https://example.com/maths-edexcel-p1-2023-higher.pdf" },
        { name: "Paper 2 2023 (Higher)", url: "https://example.com/maths-edexcel-p2-2023-higher.pdf" },
        { name: "Paper 3 2023 (Higher)", url: "https://example.com/maths-edexcel-p3-2023-higher.pdf" },
        { name: "Paper 1 2022 (Higher)", url: "https://example.com/maths-edexcel-p1-2022-higher.pdf" },
        { name: "Paper 2 2022 (Higher)", url: "https://example.com/maths-edexcel-p2-2022-higher.pdf" },
        { name: "Paper 3 2022 (Higher)", url: "https://example.com/maths-edexcel-p3-2022-higher.pdf" },
      ],
    },
  };

  // Mark scheme links mirror the paperLinks structure
  const msLinks: typeof paperLinks = {
    biology: {
      AQA: [
        { name: "Paper 1 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper1Triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper2Triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper1Triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper2Triple.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper1Combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023BiologyPaper2Combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper1Combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022BiologyPaper2Combined.pdf" },
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
        { name: "Paper 1 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper1Triple.pdf" },
        { name: "Paper 2 2023 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper2Triple.pdf" },
        { name: "Paper 1 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryPaper1Triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryTriplePaper2.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper1Combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2025/08/June2023ChemistryPaper2Combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryPaper1Combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022ChemistryPaper2Combined.pdf" },
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
        { name: "Paper 1 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022PhysicsPaper1Triple.pdf" },
        { name: "Paper 2 2022 (Triple)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQAPhysicsPaper2Triple2022.pdf" },
        { name: "Paper 1 2023 (Combined)", url: "https://example.com/physics-aqa-p1-2023-combined.pdf" },
        { name: "Paper 2 2023 (Combined)", url: "https://example.com/physics-aqa-p2-2023-combined.pdf" },
        { name: "Paper 1 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022PhysicsPaper1Combined.pdf" },
        { name: "Paper 2 2022 (Combined)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/June2022PhysicsPaper2Combined.pdf" },
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
    maths: {
      AQA: [
        { name: "Paper 1 2023 (Higher)", url: "https://example.com/maths-aqa-p1-2023-higher.pdf" },
        { name: "Paper 2 2023 (Higher)", url: "https://example.com/maths-aqa-p2-2023-higher.pdf" },
        { name: "Paper 3 2023 (Higher)", url: "https://example.com/maths-aqa-p3-2023-higher.pdf" },
        { name: "Paper 1 2022 (Higher)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQA-83001H-QP-JUN22-merged.pdf" },
        { name: "Paper 2 2022 (Higher)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQA-83002H-QP-JUN22-merged.pdf" },
        { name: "Paper 3 2022 (Higher)", url: "https://gcseanki.co.uk/wp-content/uploads/2024/01/AQA-MAY-2022-PAPER-3-HIGHER-merged.pdf" },
      ],
      Edexcel: [
        { name: "Paper 1 2023 (Higher)", url: "https://example.com/maths-edexcel-p1-2023-higher.pdf" },
        { name: "Paper 2 2023 (Higher)", url: "https://example.com/maths-edexcel-p2-2023-higher.pdf" },
        { name: "Paper 3 2023 (Higher)", url: "https://example.com/maths-edexcel-p3-2023-higher.pdf" },
        { name: "Paper 1 2022 (Higher)", url: "https://example.com/maths-edexcel-p1-2022-higher.pdf" },
        { name: "Paper 2 2022 (Higher)", url: "https://example.com/maths-edexcel-p2-2022-higher.pdf" },
        { name: "Paper 3 2022 (Higher)", url: "https://example.com/maths-edexcel-p3-2022-higher.pdf" },
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
    { id: 'french', name: 'French', icon: '🇫🇷', color: 'bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20' },
  ];

  const boards = ['AQA', 'Edexcel'];

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(selectedSubject === subjectId ? null : subjectId);
    setSelectedBoard(null); // Reset board selection when changing subject
    setSelectedType('papers');
  };

  const handleBoardClick = (board: string) => {
    if (selectedBoard === board) {
      setSelectedBoard(null);
      setSelectedType('papers');
    } else {
      setSelectedBoard(board);
      setSelectedType('papers');
    }
  };

  const handleBoardMSClick = (board: string) => {
    setSelectedBoard(board);
    setSelectedType('ms');
  };

  return (
    <div className="min-h-screen bg-background">
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
              {!user && (
                <Link to="/#subjects" className="text-foreground hover:text-primary transition-colors">Subjects</Link>
              )}
              <Link to="/exampapers" className="text-foreground hover:text-primary transition-colors">Past Papers</Link>
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Past Papers
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
                  <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {boards.map((board) => (
                      <div key={board} className="flex gap-2">
                        <Button
                          variant={selectedBoard === board && selectedType === 'papers' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => {
                            if (selectedBoard === board && selectedType === 'ms') {
                              setSelectedType('papers');
                            } else {
                              handleBoardClick(board);
                            }
                          }}
                        >
                          {board}
                        </Button>
                        <Button
                          variant={selectedBoard === board && selectedType === 'ms' ? 'default' : 'outline'}
                          onClick={() => handleBoardMSClick(board)}
                        >
                          MS
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

              {/* File Links Dropdown */}
                {selectedSubject === subject.id && selectedBoard && (
                  <Card className="animate-fade-in bg-muted/50">
                    <CardContent className="p-4">
                      {(((selectedType === 'papers' ? paperLinks : msLinks)[subject.id as keyof typeof paperLinks]?.[selectedBoard as keyof typeof paperLinks[keyof typeof paperLinks]] || []).length > 0) ? (
                        <div className="space-y-2">
                          <div className="mb-2 text-sm text-foreground/70">
                            {selectedType === 'papers' ? 'Papers' : 'Mark Schemes'} — {selectedBoard}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {(selectedType === 'papers'
                              ? paperLinks[subject.id as keyof typeof paperLinks][selectedBoard as keyof typeof paperLinks[keyof typeof paperLinks]]
                              : msLinks[subject.id as keyof typeof paperLinks][selectedBoard as keyof typeof paperLinks[keyof typeof paperLinks]]
                            ).map((paper, index) => (
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
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-foreground/60">
                          <p className="text-sm">
                            {selectedBoard} {subject.name} {selectedType === 'papers' ? 'papers' : 'mark schemes'} coming soon...
                          </p>
                          <p className="text-xs mt-1">
                            {selectedType === 'papers' ? 'Papers' : 'Mark schemes'} will be added here
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
