import { useEffect, useRef, useState } from 'react';

export default function WaveformDivider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [glitchText, setGlitchText] = useState('MY TRACKS');

  // Glitch text effect
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
    const original = 'MY TRACKS';
    let interval: ReturnType<typeof setInterval>;

    const doGlitch = () => {
      let count = 0;
      interval = setInterval(() => {
        count++;
        const result = original
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (Math.random() > 0.4 && count > 3) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        setGlitchText(result);

        if (count > 8) {
          setGlitchText(original);
          clearInterval(interval);
        }
      }, 50);
    };

    // Glitch every 4 seconds
    doGlitch();
    const loop = setInterval(doGlitch, 4000);
    return () => {
      clearInterval(loop);
      clearInterval(interval);
    };
  }, []);

  // Canvas equalizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const barCount = 120;
    const barHeights = new Float32Array(barCount);
    const barTargets = new Float32Array(barCount);
    const barSpeeds = new Float32Array(barCount);

    // Initialize
    for (let i = 0; i < barCount; i++) {
      barHeights[i] = Math.random() * 0.3;
      barTargets[i] = Math.random();
      barSpeeds[i] = 0.02 + Math.random() * 0.04;
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barWidth = w / barCount;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        // Smooth towards target
        barHeights[i] += (barTargets[i] - barHeights[i]) * barSpeeds[i];

        // Set new target occasionally
        if (Math.random() < 0.03) {
          // Create a wave-like pattern — center bars higher
          const center = barCount / 2;
          const dist = Math.abs(i - center) / center;
          const baseHeight = 1 - dist * 0.6;
          barTargets[i] = baseHeight * (0.3 + Math.random() * 0.7);
          barSpeeds[i] = 0.02 + Math.random() * 0.04;
        }

        const barH = barHeights[i] * h * 0.85;
        const x = i * barWidth + gap / 2;
        const y = (h - barH) / 2;

        // Gradient per bar: red at bottom, white at top
        const grad = ctx.createLinearGradient(x, y + barH, x, y);
        grad.addColorStop(0, `rgba(220, 38, 38, ${0.3 + barHeights[i] * 0.5})`);
        grad.addColorStop(0.5, `rgba(255, 80, 80, ${0.2 + barHeights[i] * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${0.1 + barHeights[i] * 0.3})`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - gap, barH, 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="relative py-8 md:py-14 select-none overflow-hidden">
      {/* Canvas equalizer */}
      <canvas
        ref={canvasRef}
        className="w-full h-24 md:h-36"
        style={{ imageRendering: 'auto' }}
      />

      {/* Horizontal lines — top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-px wf-line-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-px wf-line-gradient" />

      {/* Center label with glitch text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          <div className="bg-black/70 backdrop-blur-xl px-8 md:px-14 py-3 md:py-4 border border-white/[0.06] rounded-sm">
            <span
              className="text-sm md:text-lg font-black uppercase tracking-[0.5em] text-white/70 font-mono"
              style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.3)' }}
            >
              {glitchText}
            </span>
          </div>
          {/* Red accent line */}
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-[2px] bg-red-600/60" />
        </div>
      </div>

      <style>{`
        .wf-line-gradient {
          background: linear-gradient(to right, transparent, rgba(220, 38, 38, 0.2) 30%, rgba(255, 255, 255, 0.1) 50%, rgba(220, 38, 38, 0.2) 70%, transparent);
        }
      `}</style>
    </div>
  );
}
