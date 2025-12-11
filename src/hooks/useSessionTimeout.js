import { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client.supabase';

/**
 * Auto-logout after 30 minutes of inactivity
 */
export const useSessionTimeout = (timeoutMinutes = 30) => {
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
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
