import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle(callback, delay = 16) {
  const [lastRun, setLastRun] = useState(Date.now());

  return (...args) => {
    const now = Date.now();
    if (now - lastRun >= delay) {
      callback(...args);
      setLastRun(now);
    }
  };
}
