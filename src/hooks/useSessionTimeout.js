import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client.supabase';

/**
 * Auto-logout after 30 minutes of inactivity
 */
export const useSessionTimeout = (timeoutMinutes = 30) => {
  const timeoutRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated before starting timeout
    const checkAuth = async () => {
      try {
        const session = await base44.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const resetTimeout = () => {
    // Only set timeout if user is authenticated
    if (!isAuthenticated) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      console.log('Session timeout - logging out');
      await base44.auth.logout('/');
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Events that indicate user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Reset timeout on any user activity
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeoutMinutes]);
};
