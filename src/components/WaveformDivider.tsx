export default function WaveformDivider() {
  const items = [
    'JEIGHTENESIS',
    'WAKE UP',
    'J18 LOFI TRIP ON EARTH',
    'BINNE BEN',
    'JEIGHTEEN EP',
    'LISTO (MOVE MY BODY)',
    'PROD BY JONNA RINCON',
    'CLUB JEIGHTEEN',
    'CHINATON',
    'FL STUDIO',
    'LOGIC PRO',
  ];

  const highlighted = new Set(['JEIGHTENESIS', 'JEIGHTEEN EP', 'CLUB JEIGHTEEN', 'LISTO (MOVE MY BODY)']);

  const renderItems = () =>
    items.map((item, i) => (
      <span key={i}>
        {highlighted.has(item) ? (
          <span className="marquee-tracks-filled">{item}</span>
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

  return (
    <div className="overflow-hidden py-6 md:py-10 select-none flex flex-col gap-2 md:gap-3">
      {/* Row 1: left to right */}
      <div className="marquee-tracks-row marquee-tracks-ltr">
        <div className="marquee-tracks-inner">
          <span className="marquee-tracks-text">{renderRow()}</span>
          <span className="marquee-tracks-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      {/* Row 2: right to left */}
      <div className="marquee-tracks-row marquee-tracks-rtl">
        <div className="marquee-tracks-inner">
          <span className="marquee-tracks-text">{renderRow()}</span>
          <span className="marquee-tracks-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      <style>{`
        .marquee-tracks-row {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-tracks-inner {
          display: inline-flex;
          width: max-content;
        }
        .marquee-tracks-text {
          display: inline-block;
          font-size: clamp(1.2rem, 3vw, 2.8rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(220, 38, 38, 0.35);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .marquee-tracks-filled {
          color: #dc2626;
          -webkit-text-stroke: 0;
          font-weight: 900;
          opacity: 0.7;
        }
        .marquee-tracks-ltr .marquee-tracks-inner {
          animation: marquee-tracks-scroll-ltr 140s linear infinite;
        }
        .marquee-tracks-rtl .marquee-tracks-inner {
          animation: marquee-tracks-scroll-rtl 160s linear infinite;
        }
        @keyframes marquee-tracks-scroll-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-tracks-scroll-rtl {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
