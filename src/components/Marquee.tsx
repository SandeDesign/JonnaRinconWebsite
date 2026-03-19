export default function Marquee() {
  const items = [
    'JONNA RINCON',
    'MUSIC PRODUCER',
    'BEATS',
    'ART',
    'DESIGN',
    'ARTIST',
    'AUDIO ENGINEER',
    'JONATHAN',
    'VIDEO EDITOR',
    'BEATMAKER',
  ];

  const text = items.join(' \u00B7 ') + ' \u00B7 ';

  return (
    <div className="relative overflow-hidden py-8 md:py-12 bg-transparent">
      <div className="marquee-track flex whitespace-nowrap">
        <span className="marquee-content text-2xl md:text-5xl font-black uppercase tracking-[0.15em] text-white/90">
          {text}
        </span>
        <span className="marquee-content text-2xl md:text-5xl font-black uppercase tracking-[0.15em] text-white/90" aria-hidden="true">
          {text}
        </span>
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
        }
        .marquee-content {
          flex-shrink: 0;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
