
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

  const { data: enrolledCourseIds } = useQuery({
    queryKey: ['enrolled-course-ids'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id');

      if (error) throw error;
      return data.map(enrollment => enrollment.course_id);
    },
  });

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Available Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Available Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading courses. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5" />
          <span>Available Courses</span>
        </CardTitle>
        <CardDescription>
          {courses?.length || 0} course{courses?.length !== 1 ? 's' : ''} available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses?.map((course) => {
            const isEnrolled = enrolledCourseIds?.includes(course.id);
            
            return (
              <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full h-32 rounded-lg object-cover mb-3"
                />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    {course.is_free ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      <Badge variant="outline">£{course.price}</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  
                  <div className="pt-2">
                    {isEnrolled ? (
                      <Button 
                        disabled 
                        variant="outline" 
                        className="w-full"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Enrolled
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollMutation.isPending || !user}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
