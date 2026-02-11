import { Music, Sparkles, Play } from 'lucide-react';
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

  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center -mt-24">
      {/* Fullscreen Background Image - FIXED zodat het altijd zichtbaar blijft */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img
          src="/DJ Screenshot 3-2-26.png"
          alt="Jonna Rincon"
          className="w-full h-full object-cover"
          style={{objectFit: 'cover', objectPosition: 'center'}}
        />
        {/* Dynamische Overlay - wordt donkerder + blurred bij scrollen */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black"
          style={{ opacity: 0 }}
        ></div>
        <div
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
          style={{ opacity: 0 }}
        ></div>
      </div>

      {/* Content Container - Buttons iets onder het midden */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          {/* Browse Beats Button - Transparant met paarse omlijning */}
          <a
            href="#beats"
            className="group relative px-10 py-5 backdrop-blur-md bg-purple-900/20 border-2 border-purple-500/50 rounded-xl font-bold text-xl transition-all duration-300 hover:border-purple-400 hover:bg-purple-600/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 min-w-[220px]"
          >
            <Play className="w-6 h-6" fill="currentColor" />
            <span>Browse Beats</span>
          </a>

          {/* Listen Now Button - Transparant met paarse omlijning */}
          <a
            href="#music"
            className="group relative px-10 py-5 backdrop-blur-md bg-purple-900/20 border-2 border-purple-500/50 rounded-xl font-bold text-xl transition-all duration-300 hover:border-purple-400 hover:bg-purple-600/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 min-w-[220px]"
          >
            <span>Listen Now</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator - VERWIJDERD */}
    </section>
  );
}