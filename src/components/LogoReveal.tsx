import { useEffect, useRef } from 'react';

interface LogoRevealProps {
  onPassedReveal?: (passed: boolean) => void;
}

export default function LogoReveal({ onPassedReveal }: LogoRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !logoRef.current || !whiteOverlayRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionHeight = sectionRef.current.offsetHeight;

      const rawProgress = (vh - rect.top) / (vh + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Phase 1 (0–0.15): Logo fades in at normal size
      // Phase 2 (0.15–0.75): Logo scales up — white pixels fill the viewport
      // Phase 3 (0.75–1.0): White overlay completes the transition

      let logoOpacity: number;
      let logoScale: number;
      let whiteOverlayOpacity: number;

      if (progress < 0.15) {
        const p = progress / 0.15;
        logoOpacity = p;
        logoScale = 1;
        whiteOverlayOpacity = 0;
      } else if (progress < 0.75) {
        const p = (progress - 0.15) / 0.6;
        logoOpacity = 1;
        logoScale = 1 + Math.pow(p, 1.8) * 50;
        whiteOverlayOpacity = Math.max(0, (p - 0.6) / 0.4);
      } else {
        const p = (progress - 0.75) / 0.25;
        logoOpacity = 1;
        logoScale = 51;
        whiteOverlayOpacity = Math.min(1, 0.4 + p * 0.6);
      }

      logoRef.current.style.opacity = String(logoOpacity);
      logoRef.current.style.transform = `translate(-50%, -50%) scale(${logoScale})`;
      whiteOverlayRef.current.style.opacity = String(whiteOverlayOpacity);

      onPassedReveal?.(progress > 0.7);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onPassedReveal]);

  return (
    <section
      ref={sectionRef}
      id="logo-reveal"
      className="relative"
      style={{ height: '300vh' }}
    >
      {/* Sticky viewport — hero bg (fixed) is visible through this since it's NOT bg-black.
          The hero's own overlay darkens it. The logo white pixels act as the reveal. */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black/90">
        {/* White logo — starts small, scales up. The white pixels fill the screen
            creating the transition from dark to light. You can still see the
            hero subtly through the bg-black/90 behind the logo. */}
        <img
          ref={logoRef}
          src="/Jonna Rincon Logo WH.png"
          alt=""
          className="absolute top-1/2 left-1/2 pointer-events-none will-change-transform"
          style={{
            height: '80px',
            width: 'auto',
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0,
            transformOrigin: 'center center',
          }}
        />

        {/* White overlay — ensures clean solid white for transition to light mode */}
        <div
          ref={whiteOverlayRef}
          className="absolute inset-0 bg-white pointer-events-none"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
