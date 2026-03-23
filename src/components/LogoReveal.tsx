import { useEffect, useRef } from 'react';

interface LogoRevealProps {
  onPassedReveal?: (passed: boolean) => void;
}

export default function LogoReveal({ onPassedReveal }: LogoRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !maskRef.current || !darkOverlayRef.current || !whiteOverlayRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionHeight = sectionRef.current.offsetHeight;

      // progress: 0 = section top at viewport bottom, 1 = section bottom at viewport top
      const rawProgress = (vh - rect.top) / (vh + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // === PHASE BREAKDOWN ===
      // Phase 1 (0–0.12): Dark overlay fades in over the hero bg, mask fades in small
      // Phase 2 (0.12–0.70): Mask scales up — you see white THROUGH the logo shape
      // Phase 3 (0.70–1.0): White overlay completes the transition

      let darkOpacity: number;
      let maskScale: number;
      let maskOpacity: number;
      let whiteOpacity: number;

      if (progress < 0.12) {
        // Darken the hero bg, start showing the mask
        const p = progress / 0.12;
        darkOpacity = p * 0.85;
        maskOpacity = p;
        maskScale = 1;
        whiteOpacity = 0;
      } else if (progress < 0.70) {
        // Main phase — mask scales up, white revealed through logo shape
        const p = (progress - 0.12) / 0.58;
        darkOpacity = 0.85 + p * 0.15; // goes to 1.0
        maskOpacity = 1;
        // Exponential curve for natural feel — slow start, dramatic end
        maskScale = 1 + Math.pow(p, 2) * 55;
        // White overlay starts late in this phase
        whiteOpacity = Math.max(0, (p - 0.75) / 0.25) * 0.3;
      } else {
        // Completion — white takes over fully
        const p = (progress - 0.70) / 0.30;
        darkOpacity = 1;
        maskOpacity = 1;
        maskScale = 56;
        whiteOpacity = 0.3 + p * 0.7;
      }

      // Direct DOM updates — 60fps
      darkOverlayRef.current.style.opacity = String(darkOpacity);

      // The mask: a white div masked by the logo PNG
      // As mask-size grows, more white is revealed through the logo shape
      const maskSize = maskScale * 120; // 120px base → scales to ~6700px
      maskRef.current.style.opacity = String(maskOpacity);
      maskRef.current.style.setProperty('-webkit-mask-size', `auto ${maskSize}px`);
      maskRef.current.style.setProperty('mask-size', `auto ${maskSize}px`);

      whiteOverlayRef.current.style.opacity = String(whiteOpacity);

      // Notify parent
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
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Layer 1: The hero bg is still visible here (it's fixed behind everything).
            This dark overlay goes over it to darken it during the transition. */}
        <div
          ref={darkOverlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Layer 2: WHITE div masked by the logo PNG.
            You see white THROUGH the logo shape. As mask-size grows,
            the logo shape gets bigger and reveals more white.
            This is the martingarrix.com effect. */}
        <div
          ref={maskRef}
          className="absolute inset-0 bg-white pointer-events-none will-change-transform"
          style={{
            opacity: 0,
            WebkitMaskImage: 'url(/Jonna Rincon Logo WH.png)',
            maskImage: 'url(/Jonna Rincon Logo WH.png)',
            WebkitMaskPosition: 'center center',
            maskPosition: 'center center',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'auto 120px',
            maskSize: 'auto 120px',
          } as React.CSSProperties}
        />

        {/* Layer 3: Solid white overlay for final clean transition */}
        <div
          ref={whiteOverlayRef}
          className="absolute inset-0 bg-white pointer-events-none"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
