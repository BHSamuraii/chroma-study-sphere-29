
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AccountSettingsPopup } from '@/components/AccountSettingsPopup';

export const DashboardHeader = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    }
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <h1 className="text-2xl font-bold text-gradient">gcsewala</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/exampapers'}
                className="text-foreground hover:bg-accent/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                Past Papers
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAccountSettings(true)}
                className="text-foreground hover:bg-accent/20"
              >
                <Settings className="w-5 h-5" />
              </Button>
              
              <Button 
                onClick={handleSignOut}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AccountSettingsPopup 
        isOpen={showAccountSettings} 
        onClose={() => setShowAccountSettings(false)} 
      />
    </>
  );
};
