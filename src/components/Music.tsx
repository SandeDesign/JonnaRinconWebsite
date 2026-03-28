import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Music() {
  const navigate = useNavigate();
  const musicTitle = useCyberDecodeInView('My Tracks');
  const { ref: revealRef, isVisible } = useScrollReveal();
  const youtubeTitle = useCyberDecodeInView('YouTube');

  const compilations = [
    {
      id: 'This Is Jonna Rincon',
      name: 'This Is',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3LPWh3?si=9f9b5ebdf6de4887',
      cover: 'ThisIsJonna.png'
    },
    {
      id: 'DJ Sets',
      name: 'DJ SETS',
      url: 'https://youtube.com/playlist?list=PLgWPe6V88vwBmK5X5WCsj5kvvCb4IXjkM&si=iC-9_BTA0seIFWfr',
      cover: 'TN-DJSet.jpg'
    },
    {
      id: 'Mix & Master',
      name: 'Mix & Master',
      url: 'https://open.spotify.com/playlist/5smfHiU4egb6uyHYzgmqdC?si=b9cc2a2438b640ef',
      cover: 'MixedBy.png'
    },
    {
      id: 'Moombahton',
      name: 'Moombah Time',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3LPWh3?si=3cf757f3a9604be9',
      cover: 'MoombahTime.png'
    },
    {
      id: 'Vlog',
      name: 'Vlogs',
      url: 'https://youtube.com/playlist?list=PLgWPe6V88vwAoxr8xVTv85989fwEe5a10&si=yGwkn0Y3sYluSLcs',
      cover: 'Vlog Foto.png',
      isYoutube: true
    }
  ];

  return (
    <>
      {/* MUSIC */}
      <section ref={revealRef as React.RefObject<HTMLElement>} id="music" className={`py-16 md:py-32 px-4 sm:min-h-0 min-h-auto flex items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-10 md:mb-16">
            <h2 ref={musicTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-4xl md:text-7xl font-black uppercase tracking-wider text-white">
              {musicTitle.display}
            </h2>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 md:p-8">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/tracks?tab=tracks')}
                className="group px-8 py-3 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.06] text-white font-bold"
              >
                My Tracks
              </button>
              <button
                onClick={() => navigate('/tracks?tab=remixes')}
                className="group px-8 py-3 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.06] text-white font-bold"
              >
                Remixes & Edits
              </button>
              <button
                onClick={() => navigate('/shop/beats')}
                className="group px-8 py-3 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.06] text-white font-bold"
              >
                Beat Store
              </button>
              <button
                onClick={() => navigate('/tracks?tab=spotify')}
                className="group px-8 py-3 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.06] text-white font-bold"
              >
                Spotify Playlists
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section id="youtube" className="py-16 md:py-32 px-4 sm:min-h-0 min-h-auto flex items-center">
        <div className="max-w-6xl mx-auto w-full scale-[0.70] md:scale-100 origin-center">
          <div className="text-center mb-10 md:mb-16">
            <h2 ref={youtubeTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-4xl md:text-7xl font-black mb-3 uppercase tracking-wider text-white">{youtubeTitle.display}</h2>
            <p className="text-base md:text-lg text-white/40">Watch my latest DJ sets and vlogs</p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 md:p-8">
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <div
                className="absolute inset-0 z-10 transition-opacity duration-500 group-[.playing]:opacity-0 group-[.playing]:pointer-events-none"
                onClick={(e) => {
                  const container = e.currentTarget.closest('.relative');
                  container?.classList.add('playing');
                  const iframe = container?.querySelector('iframe') as HTMLIFrameElement;
                  if (iframe) {
                    const currentSrc = iframe.src;
                    iframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'autoplay=1';
                  }
                }}
              >
                <img
                  src="DJI_20251017150728_0019_D.JPG"
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <iframe
                width="100%"
                height="500"
                src="https://www.youtube.com/embed/videoseries?si=-lcpC5aW0SSgSOXa&amp;list=PLgWPe6V88vwBmK5X5WCsj5kvvCb4IXjkM"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ borderRadius: '16px' }}
              ></iframe>
            </div>

            <a
              href="https://youtube.com/@jonnarincon?si=zp6ECLUFUSCXIhhn"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-block text-center py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
            >
              Visit Channel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
