
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  };
}

export const EnrolledCourses = () => {
  const { toast } = useToast();

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
            is_free
          )
        `)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      return data as EnrolledCourse[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>My Enrolled Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>My Enrolled Courses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading enrolled courses. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>My Enrolled Courses</span>
        </CardTitle>
        <CardDescription>
          {enrolledCourses?.length || 0} course{enrolledCourses?.length !== 1 ? 's' : ''} enrolled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!enrolledCourses || enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No enrolled courses yet</p>
            <p className="text-sm text-gray-500">Browse available courses below to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <img 
                  src={enrollment.courses.image_url} 
                  alt={enrollment.courses.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{enrollment.courses.title}</h3>
                    {enrollment.courses.is_free && (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{enrollment.courses.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Continue Learning
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
