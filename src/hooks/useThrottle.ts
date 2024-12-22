import { useCallback, useRef } from 'react';

type Throttle = (...args: unknown[]) => void;

export const useThrottle = <T extends Throttle>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const lastRun = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(
          () => {
            callback(...args);
            lastRun.current = Date.now();
          },
          delay - (now - lastRun.current),
        );
      }
    },
    [callback, delay],
  );
};
