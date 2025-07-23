import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const domain = window.location.hostname.includes('gcseanki.co.uk') ? '.gcseanki.co.uk' : '';
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;domain=${domain};SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  const domain = window.location.hostname.includes('gcseanki.co.uk') ? '.gcseanki.co.uk' : '';
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${domain};SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Function to sync token with WordPress via the edge function
const syncTokenWithWordPress = async (session: Session | null) => {
  try {
    const response = await fetch('https://xcibkpxhyivgfvrojrbw.supabase.co/functions/v1/wordpress-auth-bridge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session.access_token}` : '',
      },
      body: JSON.stringify({
        action: session ? 'set_token' : 'clear_token',
        token: session?.access_token || null,
        user: session?.user || null,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to sync token with WordPress:', response.statusText);
    }
  } catch (error) {
    console.warn('Error syncing token with WordPress:', error);
  }
};

// Function to redirect to WordPress dashboard
const redirectToDashboard = () => {
  // Clean the URL by removing any hash fragments (which contain tokens)
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  
  setTimeout(() => {
    // Check if we're on WordPress site
    if (window.location.hostname.includes('gcseanki.co.uk')) {
      window.location.href = 'https://gcseanki.co.uk/dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  }, 100);
};

// Check if this is a first-time login by checking if user has visited before
const isFirstTimeLogin = (userId: string): boolean => {
  const hasVisitedBefore = getCookie(`user_visited_${userId}`);
  return !hasVisitedBefore;
};

// Mark user as having visited before
const markUserAsVisited = (userId: string) => {
  setCookie(`user_visited_${userId}`, 'true', 30); // 30 days
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Handle OAuth callback immediately if present
    const handleOAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      if (hashParams.get('access_token')) {
        console.log('OAuth callback detected, processing...');
        // Let Supabase handle the session from the hash
        const { data, error } = await supabase.auth.getSession();
        if (data.session && !error) {
          console.log('OAuth session established successfully');
          // Clean URL immediately
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    handleOAuthCallback();

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Store token in cookie for WordPress access
        if (session?.access_token) {
          setCookie('supabase_token', session.access_token, 7);
          setCookie('supabase_user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email
          }), 7);
        } else {
          deleteCookie('supabase_token');
          deleteCookie('supabase_user');
        }

        // Sync with WordPress via edge function
        await syncTokenWithWordPress(session);

        // Handle first-time login redirect
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, checking if first time...');
          
          // Check if this is a first-time login
          if (isFirstTimeLogin(session.user.id)) {
            console.log('First time login detected, redirecting to dashboard...');
            markUserAsVisited(session.user.id);
            redirectToDashboard();
          } else {
            console.log('Returning user, staying on current page');
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session check:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);

          // Store token in cookie for WordPress access
          if (session?.access_token) {
            setCookie('supabase_token', session.access_token, 7);
            setCookie('supabase_user', JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email
            }), 7);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      const redirectUrl = window.location.hostname.includes('gcseanki.co.uk') 
        ? 'https://gcseanki.co.uk/dashboard'
        : `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: name ? { full_name: name } : undefined
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user && !data.session) {
        toast({
          title: "Check Your Email",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Check if there's an active session before attempting to sign out
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        // No active session, just clear local state and cookies
        setSession(null);
        setUser(null);
        
        // Clear cookies
        deleteCookie('supabase_token');
        deleteCookie('supabase_user');
        
        // Clear visit tracking cookies
        if (user) {
          deleteCookie(`user_visited_${user.id}`);
        }
        
        toast({
          title: "Already Signed Out",
          description: "You were already signed out.",
        });
        
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Handle specific auth session missing error
        if (error.message.includes('Auth session missing') || error.message.includes('session_not_found')) {
          // Session was already cleared, just update local state
          setSession(null);
          setUser(null);
          
          // Clear cookies
          deleteCookie('supabase_token');
          deleteCookie('supabase_user');
          
          if (user) {
            deleteCookie(`user_visited_${user.id}`);
          }
          
          toast({
            title: "Signed Out",
            description: "You have been signed out successfully.",
          });
          
          return { error: null };
        }
        
        console.error('Sign out error:', error);
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Clear cookies on successful sign out
      deleteCookie('supabase_token');
      deleteCookie('supabase_user');

      // Clear visit tracking cookies
      if (user) {
        deleteCookie(`user_visited_${user.id}`);
      }

      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Even if there's an error, clear local state
      setSession(null);
      setUser(null);
      deleteCookie('supabase_token');
      deleteCookie('supabase_user');
      
      if (user) {
        deleteCookie(`user_visited_${user.id}`);
      }
      
      toast({
        title: "Signed Out",
        description: "You have been signed out (with local cleanup).",
      });
      
      return { error: null }; // Return success since we cleaned up locally
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const redirectUrl = window.location.hostname.includes('gcseanki.co.uk') 
        ? 'https://gcseanki.co.uk/dashboard'
        : `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password Reset Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Check Your Email",
        description: "Password reset instructions have been sent to your email.",
      });

      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password Reset Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUrl = window.location.hostname.includes('gcseanki.co.uk') 
        ? 'https://gcseanki.co.uk/dashboard'
        : `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
          }
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        toast({
          title: "Google Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInWithGoogle,
  };
};
