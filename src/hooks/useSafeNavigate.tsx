
import { useCallback } from 'react';

// Check if we're in WordPress environment
const isWordPress = () => {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1' &&
         !window.location.hostname.includes('lovableproject.com');
};

// Custom hook that safely uses navigate only when router is available
export const useSafeNavigate = () => {
  let navigate = null;
  
  // Only try to use useNavigate if we're not in WordPress
  if (!isWordPress()) {
    try {
      const { useNavigate } = require('react-router-dom');
      navigate = useNavigate();
    } catch (error) {
      console.log('Router not available, using fallback navigation');
      navigate = null;
    }
  }

  const safeNavigate = useCallback((path: string) => {
    if (navigate && !isWordPress()) {
      navigate(path);
    } else {
      // Fallback for WordPress environment - use window.location
      if (path.startsWith('/')) {
        // For absolute paths, construct the full URL
        const baseUrl = window.location.origin;
        window.location.href = baseUrl + path;
      } else {
        window.location.href = path;
      }
    }
  }, [navigate]);

  return safeNavigate;
};
