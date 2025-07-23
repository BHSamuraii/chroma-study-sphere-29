
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AccountSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettingsPopup = ({ isOpen, onClose }: AccountSettingsPopupProps) => {
  const { user } = useAuth();

  const { data: enrollmentStats } = useQuery({
    queryKey: ['enrollment-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, enrolled_at')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      
      const totalEnrollments = data.length;
      const thisMonth = data.filter(enrollment => {
        const enrolledDate = new Date(enrollment.enrolled_at);
        const now = new Date();
        return enrolledDate.getMonth() === now.getMonth() && 
               enrolledDate.getFullYear() === now.getFullYear();
      }).length;

      return { totalEnrollments, thisMonth };
    },
  });

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.user_metadata?.full_name || 'User'}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member since</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
              <CardDescription>Your progress overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {enrollmentStats?.totalEnrollments || 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Courses</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {enrollmentStats?.thisMonth || 0}
                  </div>
                  <div className="text-xs text-gray-600">This Month</div>
                </div>
              </div>

              <div className="pt-2">
                <Badge variant="secondary" className="w-full justify-center py-2">
                  🎯 Active Learner
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
