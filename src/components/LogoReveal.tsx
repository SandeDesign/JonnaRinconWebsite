import { useState, useEffect, useRef } from 'react';

export default function LogoReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="logo-reveal"
      className="h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full transition-all duration-[1.5s] ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Logo */}
      <div
        className={`relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'
        }`}
      >
        <img
          src="/Jonna Rincon Logo WH.png"
          alt="Jonna Rincon"
          className="h-[150px] md:h-[300px] lg:h-[350px] w-auto"
        />
      </div>
    </section>
  );
}
