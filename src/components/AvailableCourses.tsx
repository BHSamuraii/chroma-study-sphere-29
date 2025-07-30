
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export const AvailableCourses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['available-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });

  const { data: enrolledCourses } = useQuery({
    queryKey: ['enrolled-course-ids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          courses (
            title
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  const enrolledCourseIds = enrolledCourses?.map(e => e.course_id) || [];
  
  // Science courses that should be mutually exclusive
  const scienceCourses = [
    'AQA Triple Science',
    'Edexcel Triple Science', 
    'Edexcel Combined Science',
    'AQA Combined Science'
  ];
  
  // Check if user is enrolled in any science course
  const enrolledScienceCourse = enrolledCourses?.find(e => 
    scienceCourses.includes(e.courses?.title || '')
  );

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) {
        throw new Error('User must be logged in to enroll');
      }

      const { data, error } = await supabase
        .from('enrollments')
        .insert([{ course_id: courseId, user_id: user.id }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrolled-course-ids'] });
      toast({
        title: "Enrollment successful!",
        description: "You've successfully enrolled in the course.",
      });
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment failed",
        description: "There was an error enrolling in the course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = (courseId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in courses.",
        variant: "destructive",
      });
      return;
    }
    enrollMutation.mutate(courseId);
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-400">
          <GraduationCap className="w-5 h-5" />
          <span>Other Courses</span>
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Error loading courses:', error);
    return (
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-400">
          <GraduationCap className="w-5 h-5" />
          <span>Other Courses</span>
        </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error loading courses. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-400">
          <GraduationCap className="w-5 h-5" />
          <span>Other Courses</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          {(() => {
            const filteredCourses = courses?.filter(course => {
              // Don't show enrolled courses
              if (enrolledCourseIds.includes(course.id)) return false;
              
              // If user is enrolled in a science course, hide other science courses
              if (enrolledScienceCourse && scienceCourses.includes(course.title)) {
                return course.title === enrolledScienceCourse.courses?.title;
              }
              
              return true;
            }) || [];
            
            return `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} available`;
          })()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses?.filter(course => {
            // Don't show enrolled courses
            if (enrolledCourseIds.includes(course.id)) return false;
            
            // If user is enrolled in a science course, hide other science courses
            if (enrolledScienceCourse && scienceCourses.includes(course.title)) {
              return course.title === enrolledScienceCourse.courses?.title;
            }
            
            return true;
          }).map((course) => {
            const isEnrolled = enrolledCourseIds?.includes(course.id);
            
            return (
              <div key={course.id} className="border border-white/10 rounded-lg p-4 hover:shadow-md transition-shadow bg-black/10 backdrop-blur-sm">
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full h-32 rounded-lg object-cover mb-3"
                />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-yellow-400">{course.title}</h3>
                      <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-xs">
                        GCSE
                      </Badge>
                    </div>
                    {course.is_free ? (
                      <Badge variant="secondary" className="bg-green-400/20 text-green-400 border-green-400/30">Free</Badge>
                    ) : (
                      <Badge variant="outline" className="border-white/20 text-white">£{course.price}</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-white/70 line-clamp-2">{course.description}</p>
                  
                  <div className="pt-2">
                    {isEnrolled ? (
                      <Button 
                        disabled 
                        variant="outline" 
                        className="w-full border-white/20 text-white/60"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Enrolled
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollMutation.isPending || !user}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
                      >
                        {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
