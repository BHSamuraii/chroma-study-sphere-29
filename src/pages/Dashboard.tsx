
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/DashboardHeader';
import { EnrolledCourses } from '@/components/EnrolledCourses';
import { AvailableCourses } from '@/components/AvailableCourses';
import { ProfileSection } from '@/components/ProfileSection';
import { Toaster } from '@/components/ui/toaster';

const Dashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to home page
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

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

  // If user is not authenticated, show nothing (redirect will happen via useEffect)
  if (!user) {
    return null;
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
