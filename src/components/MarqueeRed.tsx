interface MarqueeRedProps {
  isLightMode?: boolean;
}

export default function MarqueeRed({ isLightMode = false }: MarqueeRedProps) {
  const items = [
    'PRODUCER',
    'LIVE STREAMER',
    'BEATMAKER',
    'DJ',
    'SOCIALS',
    'CONTENT CREATOR',
    'MIXING',
    'MASTERING',
    'JONNA RINCON',
    'ARTIST',
  ];

  const highlighted = new Set(['PRODUCER', 'DJ', 'BEATMAKER', 'JONNA RINCON']);

  const renderItems = () =>
    items.map((item, i) => (
      <span key={i}>
        {highlighted.has(item) ? (
          <span className="marquee-red-filled">{item}</span>
        ) : (
          item
        )}
        <span className="mx-[0.4em]">&middot;</span>
      </span>
    ));

  const renderRow = () => (
    <>
      {renderItems()}
      {renderItems()}
      {renderItems()}
      {renderItems()}
    </>
  );

  // In light mode, use darker stroke colors
  const strokeColor = isLightMode ? 'rgba(220, 38, 38, 0.25)' : 'rgba(220, 38, 38, 0.6)';

  return (
    <div className="overflow-hidden py-6 md:py-10 select-none flex flex-col gap-2 md:gap-3">
      {/* Row 1: left to right */}
      <div className="marquee-red-row marquee-red-ltr">
        <div className="marquee-red-inner">
          <span className="marquee-red-text" style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}>{renderRow()}</span>
          <span className="marquee-red-text" aria-hidden="true" style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}>{renderRow()}</span>
        </div>
      </div>

      {/* Row 2: right to left */}
      <div className="marquee-red-row marquee-red-rtl">
        <div className="marquee-red-inner">
          <span className="marquee-red-text" style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}>{renderRow()}</span>
          <span className="marquee-red-text" aria-hidden="true" style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}>{renderRow()}</span>
        </div>
      </div>

      {/* Row 3: left to right, slower */}
      <div className="marquee-red-row marquee-red-ltr-slow">
        <div className="marquee-red-inner">
          <span className="marquee-red-text" style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}>{renderRow()}</span>
          <span className="marquee-red-text" aria-hidden="true" style={{ WebkitTextStroke: `1.5px ${strokeColor}` }}>{renderRow()}</span>
        </div>
      </div>

      <style>{`
        .marquee-red-row {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-red-inner {
          display: inline-flex;
          width: max-content;
        }
        .marquee-red-text {
          display: inline-block;
          font-size: clamp(1.5rem, 4vw, 3.5rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(220, 38, 38, 0.6);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .marquee-red-filled {
          color: #dc2626;
          -webkit-text-stroke: 0;
          font-weight: 900;
        }
        .marquee-red-ltr .marquee-red-inner {
          animation: marquee-red-scroll-ltr 160s linear infinite;
        }
        .marquee-red-rtl .marquee-red-inner {
          animation: marquee-red-scroll-rtl 140s linear infinite;
        }
        .marquee-red-ltr-slow .marquee-red-inner {
          animation: marquee-red-scroll-ltr 200s linear infinite;
        }
        @keyframes marquee-red-scroll-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-red-scroll-rtl {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
