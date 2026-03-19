import { useEffect, useRef, useCallback } from 'react';

export default function Hero() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

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
    <section className="relative w-full min-h-screen flex items-end justify-center -mt-24">
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
      <div className="relative z-10 w-full flex flex-col items-center pb-24 md:pb-32 px-6 animate-fade-in">
        {/* JONNA RINCON — grote tekst zoals CATHARINA op Martin Garrix */}
        <h1
          className="text-white font-black uppercase leading-none tracking-tighter text-center select-none"
          style={{ fontSize: 'clamp(3rem, 12vw, 12rem)' }}
        >
          JONNA RINCON
        </h1>

        {/* Buttons — wit, clean, Martin Garrix stijl */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
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
