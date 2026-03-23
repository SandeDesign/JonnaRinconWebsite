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

      // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
      const rawProgress = (vh - rect.top) / (vh + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Phase 1 (0-0.15): Logo fades in at normal size
      // Phase 2 (0.15-0.75): Logo scales up massively (1 → 45)
      // Phase 3 (0.75-1.0): White overlay completes the transition

      let logoOpacity: number;
      let logoScale: number;
      let whiteOverlayOpacity: number;

      if (progress < 0.15) {
        // Fade in
        const fadeProgress = progress / 0.15;
        logoOpacity = fadeProgress;
        logoScale = 1;
        whiteOverlayOpacity = 0;
      } else if (progress < 0.75) {
        // Scale up — the white pixels of the logo fill the screen
        const scaleProgress = (progress - 0.15) / 0.6;
        logoOpacity = 1;
        // Exponential scale curve for dramatic effect
        logoScale = 1 + Math.pow(scaleProgress, 1.8) * 50;
        // White overlay starts appearing as logo gets very large
        whiteOverlayOpacity = Math.max(0, (scaleProgress - 0.6) / 0.4);
      } else {
        // Logo is huge, white overlay takes over for clean transition
        const endProgress = (progress - 0.75) / 0.25;
        logoOpacity = 1;
        logoScale = 51;
        whiteOverlayOpacity = Math.min(1, 0.4 + endProgress * 0.6);
      }

      // Direct DOM updates for 60fps performance
      logoRef.current.style.opacity = String(logoOpacity);
      logoRef.current.style.transform = `translate(-50%, -50%) scale(${logoScale})`;
      whiteOverlayRef.current.style.opacity = String(whiteOverlayOpacity);

      // Notify parent for light mode switch
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
      {/* Sticky viewport — logo stays centered while you scroll through 300vh */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* The white logo — starts normal, scales to fill entire viewport with white */}
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

        {/* White overlay — catches the final moment when logo white fills everything,
            ensures a clean solid white for the transition to light mode */}
        <div
          ref={whiteOverlayRef}
          className="absolute inset-0 bg-white pointer-events-none"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
