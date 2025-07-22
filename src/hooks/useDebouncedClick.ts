import { useState, useCallback } from "react";

/**
 * Custom hook for debounced click functionality
 * @param delay - Debounce delay in milliseconds
 * @returns Object with debouncedClick function
 */
export const useDebouncedClick = (delay: number = 200) => {
  const [lastClickTime, setLastClickTime] = useState(0);

  const debouncedClick = useCallback(
    (action: () => void, actionName: string) => {
      const now = Date.now();
      if (now - lastClickTime > delay) {
        console.log(`🎯 ${actionName} button clicked!`);
        setLastClickTime(now);
        action();
      } else {
        console.log(
          `⏱️ ${actionName} button click ignored (debounced) - ${
            now - lastClickTime
          }ms since last click`
        );
      }
    },
    [lastClickTime, delay]
  );

  return { debouncedClick };
};
