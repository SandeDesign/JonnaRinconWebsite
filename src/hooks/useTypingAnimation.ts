import { useState, useEffect } from 'react';

export const useTypingAnimation = (enabled: boolean = true, speed: number = 30) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedChars(0);
      setIsComplete(false);
      return;
    }

    if (isComplete) return;

    const timer = setTimeout(() => {
      setDisplayedChars((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [enabled, isComplete, speed, displayedChars]);

  useEffect(() => {
    // Mark as complete when we've typed everything
    // We'll set a flag based on the container having scrollable content
    // For now, we rely on the component to signal completion
  }, []);

  const markComplete = () => setIsComplete(true);
  const reset = () => {
    setDisplayedChars(0);
    setIsComplete(false);
  };

  return { displayedChars, isComplete, markComplete, reset };
};
