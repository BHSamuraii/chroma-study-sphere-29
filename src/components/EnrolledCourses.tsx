
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScienceCoursePopup } from '@/components/ScienceCoursePopup';

interface EnrolledCourse {
  id: string;
  course_id: string;
  enrolled_at: string;
  courses: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    is_free: boolean;
    course_url: string;
  };
}

export const EnrolledCourses = () => {
  const { toast } = useToast();
  const [sciencePopupOpen, setSciencePopupOpen] = useState(false);
  const [selectedScienceCourse, setSelectedScienceCourse] = useState<string>('');

  const SCIENCE_COURSES = [
    'AQA Triple Science',
    'AQA Combined Science', 
    'Edexcel Triple Science',
    'Edexcel Combined Science'
  ];

  const isScienceCourse = (courseTitle: string) => {
    return SCIENCE_COURSES.some(science => 
      courseTitle.toLowerCase().includes(science.toLowerCase())
    );
  };

  const handleContinueLearning = (course: EnrolledCourse['courses']) => {
    if (isScienceCourse(course.title)) {
      setSelectedScienceCourse(course.title);
      setSciencePopupOpen(true);
    } else if (course.course_url) {
      window.open(course.course_url, '_blank');
    }
  };

  const { data: enrolledCourses, isLoading, error } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          enrolled_at,
          courses (
            id,
            title,
            description,
            price,
            image_url,
            is_free,
            course_url
          )
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data as EnrolledCourse[];
    },
    enabled: !!supabase.auth.getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-400">
            <BookOpen className="w-5 h-5" />
            <span>My Enrolled Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Error loading enrolled courses:', error);
    return (
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-400">
            <BookOpen className="w-5 h-5" />
            <span>My Enrolled Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error loading enrolled courses. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-400">
          <BookOpen className="w-5 h-5" />
          <span>My Enrolled Courses</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          {enrolledCourses?.length || 0} course{enrolledCourses?.length !== 1 ? 's' : ''} enrolled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!enrolledCourses || enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70 mb-2">No enrolled courses yet</p>
            <p className="text-sm text-white/50">Browse available courses below to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center space-x-4 p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors bg-black/10 backdrop-blur-sm">
                <img 
                  src={enrollment.courses.image_url} 
                  alt={enrollment.courses.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-yellow-400">{enrollment.courses.title}</h3>
                    {enrollment.courses.is_free ? (
                      <Badge variant="secondary" className="bg-green-400/20 text-green-400 border-green-400/30">Free</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-xs">GCSE</Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-2">{enrollment.courses.description}</p>
                  <div className="flex items-center text-xs text-white/50">
                    <Calendar className="w-3 h-3 mr-1" />
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
                  onClick={() => handleContinueLearning(enrollment.courses)}
                  disabled={!isScienceCourse(enrollment.courses.title) && !enrollment.courses.course_url}
                >
                  Continue Learning
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <ScienceCoursePopup 
        isOpen={sciencePopupOpen}
        onClose={() => setSciencePopupOpen(false)}
        courseTitle={selectedScienceCourse}
      />
    </Card>
  );
};
