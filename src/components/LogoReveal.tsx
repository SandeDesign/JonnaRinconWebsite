import { useEffect, useRef } from 'react';

interface LogoRevealProps {
  onPassedReveal?: (passed: boolean) => void;
}

export default function LogoReveal({ onPassedReveal }: LogoRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !circleRef.current || !logoRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionHeight = sectionRef.current.offsetHeight;

      const rawProgress = (vh - rect.top) / (vh + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Phase 1 (0–0.20): Logo fades in centered on dark bg
      // Phase 2 (0.20–0.80): White circle expands from center via clip-path
      // Phase 3 (0.80–1.0): Circle fills viewport, logo fades out

      let logoOpacity: number;
      let circleRadius: number; // percentage for clip-path circle()

      if (progress < 0.20) {
        // Logo fades in
        const p = progress / 0.20;
        logoOpacity = p;
        circleRadius = 0;
      } else if (progress < 0.80) {
        // Circle expands from center — eased curve
        const p = (progress - 0.20) / 0.60;
        logoOpacity = 1;
        // Ease-out curve: starts fast, slows down — feels natural
        circleRadius = Math.pow(p, 0.7) * 150; // 0% → 150% (150% guarantees full coverage)
      } else {
        // Complete — logo fades out, circle covers everything
        const p = (progress - 0.80) / 0.20;
        logoOpacity = 1 - p;
        circleRadius = 150;
      }

      // Apply clip-path circle — this is the reveal effect
      // circle(Radius at 50% 50%) = circle expanding from center
      circleRef.current.style.clipPath = `circle(${circleRadius}% at 50% 50%)`;

      // Logo sits on top
      logoRef.current.style.opacity = String(logoOpacity);

      onPassedReveal?.(progress > 0.65);
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
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* White circle that expands from center via clip-path.
            Pure CSS — no images needed, works in all modern browsers. */}
        <div
          ref={circleRef}
          className="absolute inset-0 bg-white"
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
        />

        {/* Logo centered — visible during the transition */}
        <img
          ref={logoRef}
          src="/Jonna Rincon Logo WH.png"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            height: '80px',
            width: 'auto',
            opacity: 0,
          }}
        />
      </div>
    </section>
  );
}
