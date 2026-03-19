import { useEffect, useRef, useState } from 'react';

const GLYPHS = '!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Cyber decode animation that triggers when element comes into view.
 * Same effect as the JONNA RINCON hero text.
 */
export function useCyberDecodeInView(text: string, tickInterval = 30, lockEvery = 3) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          let lockedCount = 0;
          let tickCount = 0;

          const interval = setInterval(() => {
            tickCount++;

            if (tickCount % lockEvery === 0 && lockedCount < text.length) {
              lockedCount++;
            }

            let result = '';
            for (let i = 0; i < text.length; i++) {
              if (i < lockedCount) {
                result += text[i];
              } else if (text[i] === ' ') {
                result += ' ';
              } else {
                result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              }
            }
            setDisplay(result);

            if (lockedCount >= text.length) {
              clearInterval(interval);
            }
          }, tickInterval);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [text, tickInterval, lockEvery]);

  return { ref, display };
}

/**
 * Cyber decode that re-triggers every time `text` changes.
 * Useful for dynamic titles like About section slides.
 */
export function useCyberDecodeOnChange(text: string, tickInterval = 30, lockEvery = 3) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let lockedCount = 0;
    let tickCount = 0;

    const interval = setInterval(() => {
      tickCount++;

      if (tickCount % lockEvery === 0 && lockedCount < text.length) {
        lockedCount++;
      }

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < lockedCount) {
          result += text[i];
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(result);

      if (lockedCount >= text.length) {
        clearInterval(interval);
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [text, tickInterval, lockEvery]);

  return display;
}
