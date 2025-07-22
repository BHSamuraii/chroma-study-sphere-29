
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/DashboardHeader';
import { EnrolledCourses } from '@/components/EnrolledCourses';
import { AvailableCourses } from '@/components/AvailableCourses';
import { ProfileSection } from '@/components/ProfileSection';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import SignInDialog from '@/components/SignInDialog';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [signInDialogOpen, setSignInDialogOpen] = React.useState(false);
  const [signInMode, setSignInMode] = React.useState<'signin' | 'signup'>('signin');

  const handleSignInClick = () => {
    setSignInMode('signin');
    setSignInDialogOpen(true);
  };

  const handleSignUpClick = () => {
    setSignInMode('signup');
    setSignInDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to GCSE Anki Dashboard</h1>
            <p className="text-gray-600 mb-8">Please sign in to access your learning dashboard and track your progress.</p>
            
            <div className="space-y-4">
              <Button 
                onClick={handleSignInClick}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              
              <Button 
                onClick={handleSignUpClick}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              New to GCSE Anki? Create an account to get started with personalized learning.
            </p>
          </div>
        </div>
        
        <SignInDialog 
          open={signInDialogOpen}
          onOpenChange={setSignInDialogOpen}
          initialMode={signInMode}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Learning Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your progress, access your courses, and continue your journey to academic excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <EnrolledCourses />
            <AvailableCourses />
          </div>
          <div className="lg:col-span-1">
            <ProfileSection />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Dashboard;
