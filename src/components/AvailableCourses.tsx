
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  is_free: boolean;
  image_url?: string;
}

export const AvailableCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['available-courses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get user's enrolled courses
      const { data: enrolledCourses, error: enrolledError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      if (enrolledError) {
        console.error('Error fetching enrolled courses:', enrolledError);
        throw enrolledError;
      }

      const enrolledCourseIds = enrolledCourses?.map(e => e.course_id) || [];

      // Get all courses that user is NOT enrolled in
      const { data: availableCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .not('id', 'in', `(${enrolledCourseIds.join(',')})`)
        .order('title');

      if (coursesError) {
        console.error('Error fetching available courses:', coursesError);
        throw coursesError;
      }

      return availableCourses || [];
    },
    enabled: !!user,
  });

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in courses.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{
          user_id: user.id,
          course_id: courseId,
        }]);

      if (error) {
        console.error('Error enrolling in course:', error);
        toast({
          title: "Enrollment failed",
          description: "There was an error enrolling in this course. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Successfully enrolled!",
        description: "You've been enrolled in the course.",
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Enrollment failed",
        description: "There was an error enrolling in this course. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-card/50">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading courses. Please try again.</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">You're enrolled in all available courses! 🎉</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: Course) => (
        <Card key={course.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    GCSE
                  </Badge>
                </div>
                <CardTitle className="text-yellow-400 text-lg leading-tight">
                  {course.title}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-white/70 text-sm">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {course.is_free ? (
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Free
                  </Badge>
                ) : (
                  <span className="text-yellow-400 font-semibold">
                    £{course.price}
                  </span>
                )}
              </div>
              <Button 
                onClick={() => handleEnroll(course.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                {course.is_free ? 'Enroll Free' : 'Purchase'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
