import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that only updates once `delay` ms have passed
 * without `value` changing.
 *
 * @param {*} value - The value to debounce (e.g. a search query).
 * @param {number} [delay=300] - Quiet period in milliseconds.
 * @returns {*} The debounced value.
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
