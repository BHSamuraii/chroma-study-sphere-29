
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

// Custom hook that safely uses navigate only when router is available
export const useSafeNavigate = () => {
  let navigate;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    // Router not available, return a no-op function
    navigate = null;
  }

  const safeNavigate = useCallback((path: string) => {
    if (navigate) {
      navigate(path);
    } else {
      // Fallback for WordPress environment - use window.location
      window.location.href = path;
    }
  }, [navigate]);

  return safeNavigate;
};
