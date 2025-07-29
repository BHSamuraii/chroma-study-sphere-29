
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/DashboardHeader';
import { EnrolledCourses } from '@/components/EnrolledCourses';
import { AvailableCourses } from '@/components/AvailableCourses';
import { Toaster } from '@/components/ui/toaster';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only set initialized after loading is complete
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  useEffect(() => {
    // If user is not authenticated and initialization is complete, redirect to home page
    if (isInitialized && !user) {
      window.location.href = '/';
    }
  }, [user, isInitialized]);

  const getUsername = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show nothing (redirect will happen via useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Welcome back, {getUsername()}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Track your progress, access your courses, and continue your journey to academic excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <EnrolledCourses />
          <AvailableCourses />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Dashboard;
