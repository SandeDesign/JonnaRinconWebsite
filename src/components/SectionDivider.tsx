import { useEffect, useRef, useState } from 'react';

export default function SectionDivider() {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (dividerRef.current) observer.observe(dividerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={dividerRef}
      className="relative py-20 md:py-32 overflow-hidden bg-black"
    >
      {/* Animated horizontal lines */}
      <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.03 + i * 0.01}) 20%, rgba(255,255,255,${0.06 + i * 0.02}) 50%, rgba(255,255,255,${0.03 + i * 0.01}) 80%, transparent 100%)`,
              marginBottom: `${12 + i * 4}px`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* Center logo with glow */}
      <div className="relative z-10 flex items-center justify-center">
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          {/* Glow behind logo */}
          <div className="absolute inset-0 blur-3xl bg-white/[0.03] rounded-full scale-150" />

          <img
            src="/Jonna Rincon Logo WH.png"
            alt=""
            className="h-12 md:h-16 w-auto relative"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.08))',
            }}
          />
        </div>
      </div>

      {/* Decorative side lines */}
      <div className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center px-8 md:px-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="mx-6 md:mx-10" style={{ width: '100px' }} />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <style>{`
        @keyframes divider-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
