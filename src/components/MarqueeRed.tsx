export default function MarqueeRed() {
  const items = [
    'BINNE BEN',
    'BINNE BEN 2',
    'IF YOU',
    'LAST',
    'LIQA IN MY CUP',
    'PRODUCER',
    'LIVE STREAMER',
    'BEATMAKER',
    'JEIGHTENESIS',
    'SOCIALS',
    'CONTENT CREATOR',
    'MIXING',
    'MASTERING',
    'JONNA RINCON',
    'ARTIST',
  ];

  const highlighted = new Set(['JEIGHTENESIS']);

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

  const strokeColor = 'rgb(255, 255, 255)';

  return (
    <div className="overflow-hidden py-6 md:py-10 select-none flex flex-col gap-2 md:gap-3">
      <div className="marquee-red-row marquee-red-ltr">
        <div className="marquee-red-inner">
          <span className="marquee-red-text">{renderRow()}</span>
          <span className="marquee-red-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      <div className="marquee-red-row marquee-red-rtl">
        <div className="marquee-red-inner">
          <span className="marquee-red-text">{renderRow()}</span>
          <span className="marquee-red-text" aria-hidden="true">{renderRow()}</span>
        </div>
      </div>

      <div className="marquee-red-row marquee-red-ltr-slow">
        <div className="marquee-red-inner">
          <span className="marquee-red-text">{renderRow()}</span>
          <span className="marquee-red-text" aria-hidden="true">{renderRow()}</span>
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
          color: transparent !important;
          -webkit-text-stroke: 2px white !important;
          white-space: nowrap;
          flex-shrink: 0;
          font-family: 'Arial', 'Helvetica', sans-serif;
        }
        .marquee-red-filled {
          color: white;
          -webkit-text-stroke: 0;
          font-weight: 900;
          background: none;
          padding: 0;
          border-radius: 0;
          display: inline-block;
          margin: 0 0.1em;
          font-style: normal;
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
