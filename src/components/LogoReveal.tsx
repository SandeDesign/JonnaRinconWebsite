import { useState, useEffect, useRef } from 'react';

interface LogoRevealProps {
  onPassedReveal?: (passed: boolean) => void;
}

export default function LogoReveal({ onPassedReveal }: LogoRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Trigger logo animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Track scroll progress through the section for polarisation transition
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Calculate how far through the section we've scrolled
      // 0 = section top is at viewport bottom, 1 = section bottom is at viewport top
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      setScrollProgress(progress);

      // Notify parent when we've passed ~70% through the section
      onPassedReveal?.(progress > 0.65);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onPassedReveal]);

  // Logo opacity peaks in the middle of the section, fades at edges
  const logoOpacity = isVisible ? Math.min(1, Math.sin(scrollProgress * Math.PI) * 1.5) : 0;
  const logoScale = isVisible ? 0.7 + scrollProgress * 0.3 : 0.6;

  // Background transitions from black to white as you scroll through
  const bgWhite = Math.max(0, (scrollProgress - 0.4) / 0.6);

  return (
    <section
      ref={ref}
      id="logo-reveal"
      className="relative overflow-hidden"
      style={{ height: '150vh' }}
    >
      {/* Sticky container for the logo - stays centered while you scroll through */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background transition from black → white */}
        <div
          className="absolute inset-0 transition-none"
          style={{
            background: `linear-gradient(180deg,
              rgba(0,0,0,1) 0%,
              rgba(${255 * bgWhite},${255 * bgWhite},${255 * bgWhite},1) 50%,
              rgba(${255 * Math.min(1, bgWhite * 1.3)},${255 * Math.min(1, bgWhite * 1.3)},${255 * Math.min(1, bgWhite * 1.3)},1) 100%)`,
          }}
        />

        {/* Subtle radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full"
            style={{
              opacity: logoOpacity * 0.15,
              transform: `scale(${logoScale})`,
              background: bgWhite > 0.5
                ? 'radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              transition: 'background 0.3s ease',
            }}
          />
        </div>

        {/* Logo — crossfade from white to black version */}
        <div
          className="relative z-10"
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            transition: 'transform 0.1s linear',
          }}
        >
          {/* White logo (for dark bg) */}
          <img
            src="/Jonna Rincon Logo WH.png"
            alt="Jonna Rincon"
            className="h-[120px] md:h-[250px] lg:h-[300px] w-auto"
            style={{
              opacity: 1 - bgWhite,
              transition: 'opacity 0.2s ease',
            }}
          />
          {/* Black logo (for light bg) */}
          <img
            src="/Jonna Rincon Logo BL.png"
            alt="Jonna Rincon"
            className="absolute top-0 left-0 h-[120px] md:h-[250px] lg:h-[300px] w-auto"
            style={{
              opacity: bgWhite,
              transition: 'opacity 0.2s ease',
            }}
          />
        </div>
      </div>
    </section>
  );
}
