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
    'DJ',
  ];

  // Render each item with ARTIST getting special bold/filled styling
  const renderItems = () =>
    items.map((item, i) => (
      <span key={i}>
        {item === 'ARTIST' ? (
          <span className="marquee-filled">{item}</span>
        ) : (
          item
        )}
        <span className="mx-[0.4em]">&middot;</span>
      </span>
    ));

  // Repeat 4x for more visible text
  const renderRow = () => (
    <>
      {renderItems()}
      {renderItems()}
      {renderItems()}
      {renderItems()}
    </>
  );

  return (
    <div className="overflow-hidden py-6 md:py-10 bg-transparent select-none flex flex-col gap-2 md:gap-3">
      {/* Row 1: left to right */}
      <div className="marquee-row marquee-ltr">
        <div className="marquee-inner">
          <span className="marquee-text">{renderRow()}</span>
          <span className="marquee-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      {/* Row 2: right to left */}
      <div className="marquee-row marquee-rtl">
        <div className="marquee-inner">
          <span className="marquee-text">{renderRow()}</span>
          <span className="marquee-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      {/* Row 3: left to right, slower */}
      <div className="marquee-row marquee-ltr-slow">
        <div className="marquee-inner">
          <span className="marquee-text">{renderRow()}</span>
          <span className="marquee-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      <style>{`
        .marquee-row {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-inner {
          display: inline-flex;
          width: max-content;
        }
        .marquee-text {
          display: inline-block;
          font-size: clamp(1.5rem, 4vw, 3.5rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .marquee-filled {
          color: white;
          -webkit-text-stroke: 0;
          font-weight: 900;
        }
        .marquee-ltr .marquee-inner {
          animation: marquee-scroll-ltr 40s linear infinite;
        }
        .marquee-rtl .marquee-inner {
          animation: marquee-scroll-rtl 35s linear infinite;
        }
        .marquee-ltr-slow .marquee-inner {
          animation: marquee-scroll-ltr 50s linear infinite;
        }
        @keyframes marquee-scroll-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-rtl {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
