export default function WaveformDivider() {
  // Generate bar heights for the waveform pattern
  const barCount = 80;
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Create a natural waveform shape — peaks in the center
    const center = barCount / 2;
    const dist = Math.abs(i - center) / center;
    const base = 1 - dist * dist; // parabolic falloff
    const variation = Math.sin(i * 0.7) * 0.3 + Math.cos(i * 1.3) * 0.2;
    return Math.max(0.08, base * 0.85 + variation * 0.4);
  });

  return (
    <div className="relative py-10 md:py-16 select-none overflow-hidden">
      {/* Waveform visualization */}
      <div className="flex items-center justify-center gap-[2px] md:gap-[3px] h-20 md:h-28 px-4">
        {bars.map((height, i) => (
          <div
            key={i}
            className="wf-bar flex-shrink-0 rounded-full"
            style={{
              width: '3px',
              height: `${height * 100}%`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      {/* Center label — floating over the waveform */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-6 md:px-10 py-2 md:py-3 rounded-full border border-white/[0.08]">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/50">
            Now Playing
          </span>
        </div>
      </div>

      <style>{`
        .wf-bar {
          background: linear-gradient(to top, rgba(220, 38, 38, 0.6), rgba(255, 255, 255, 0.3));
          animation: wf-pulse 2.5s ease-in-out infinite alternate;
        }
        .wf-bar:nth-child(odd) {
          animation-direction: alternate-reverse;
        }
        @keyframes wf-pulse {
          0% {
            transform: scaleY(0.6);
            opacity: 0.4;
          }
          50% {
            transform: scaleY(1);
            opacity: 0.8;
          }
          100% {
            transform: scaleY(0.7);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
