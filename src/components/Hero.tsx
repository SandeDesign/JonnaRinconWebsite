import { useEffect, useRef, useCallback, useState } from 'react';

const TARGET_TEXT = 'JONNA RINCON';
const GLYPHS = '!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function useCyberDecode(text: string, startDelay = 300) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lockedCount = 0;
    let interval: ReturnType<typeof setInterval>;
    let tickCount = 0;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        tickCount++;

        // Lock next character every 3 ticks (~90ms at 30ms interval)
        if (tickCount % 3 === 0 && lockedCount < text.length) {
          lockedCount++;
        }

        // Build display string
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
          setDone(true);
        }
      }, 30);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, startDelay]);

  return { display, done };
}

export default function Hero() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const { display, done } = useCyberDecode(TARGET_TEXT);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    const scrollPercent = (scrollPosition / windowHeight) * 100;

    // Opacity curve
    let opacity: number;
    if (scrollPercent < 10) {
      opacity = (scrollPercent / 10) * 0.3;
    } else if (scrollPercent < 70) {
      opacity = 0.3 + ((scrollPercent - 10) / 60) * 0.5;
    } else {
      opacity = 0.8;
    }

    const blur = Math.min((scrollPosition / windowHeight) * 10, 10);

    // Direct DOM update — no React re-render
    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(opacity);
      overlayRef.current.style.backdropFilter = `blur(${blur}px)`;
      overlayRef.current.style.webkitBackdropFilter = `blur(${blur}px)`;
    }
    if (gradientRef.current) {
      gradientRef.current.style.opacity = String(opacity);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center -mt-24">
      {/* Fullscreen Background Image - FIXED */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img
          src="/JEIGHTENESIS.jpg"
          alt="Jonna Rincon"
          className="w-full h-full object-cover"
          style={{objectPosition: 'center'}}
        />
        {/* Dynamische Overlay - wordt donkerder + blurred bij scrollen */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black"
          style={{ opacity: 0 }}
        ></div>
        <div
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"
          style={{ opacity: 0 }}
        ></div>
      </div>

      {/* Content — grote naam + buttons onderaan */}
      <div className="relative z-10 w-full flex flex-col items-center px-6">
        {/* JONNA RINCON — cyber decode animatie */}
        <h1
          className="text-white font-black uppercase leading-none tracking-tighter text-center select-none"
          style={{
            fontSize: 'clamp(2.6rem, 10.2vw, 10.2rem)',
            fontFamily: 'inherit',
            minHeight: '1.1em',
          }}
        >
          {display || '\u00A0'}
        </h1>

        {/* Buttons — fade in nadat tekst klaar is */}
        <div
          className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8 transition-opacity duration-700"
          style={{ opacity: done ? 1 : 0 }}
        >
          <a
            href="#beats"
            className="px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center min-w-[180px]"
          >
            Browse Beats
          </a>
          <a
            href="#music"
            className="px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 text-center min-w-[180px]"
          >
            Listen Now
          </a>
        </div>
      </div>
    </section>
  );
}
