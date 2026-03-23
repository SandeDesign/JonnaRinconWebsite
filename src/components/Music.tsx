import { useState } from 'react';
import { useCyberDecodeInView } from '../hooks/useCyberDecode';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface MusicProps {
  isLightMode?: boolean;
}

export default function Music({ isLightMode = false }: MusicProps) {
  const [currentPlaylist, setCurrentPlaylist] = useState(0);
  const musicTitle = useCyberDecodeInView('My Tracks');
  const { ref: revealRef, isVisible } = useScrollReveal();
  const youtubeTitle = useCyberDecodeInView('YouTube');

  const spotifyPlaylists = [
    {
      name: 'Top Tracks',
      embedUrl: 'https://open.spotify.com/embed/artist/6o3BlWTeK4EKUyByo35y6F?utm_source=generator'
    },
    {
      name: 'Playlist 2',
      embedUrl: 'https://open.spotify.com/embed/playlist/5SaEeqVSV9vyLUvqsrrfJ7?utm_source=generator&theme=0'
    },
    {
      name: 'Playlist 3',
      embedUrl: 'https://open.spotify.com/embed/playlist/7mIjrYgNeQxVw2lBBsEDjE?utm_source=generator&theme=0'
    },
    {
      name: 'Playlist 4',
      embedUrl: 'https://open.spotify.com/embed/playlist/5smfHiU4egb6uyHYzgmqdC?utm_source=generator'
    },
    {
      name: 'This is Jonna Rincon',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO3LPWh3?utm_source=generator'
    }
  ];

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

  const cardBg = isLightMode ? 'bg-black/[0.03] border-black/[0.08]' : 'bg-white/5 border-white/10';
  const subtleText = isLightMode ? 'text-black/50' : 'text-gray-400';
  const dotActive = isLightMode ? 'bg-black' : 'bg-white';
  const dotInactive = isLightMode ? 'bg-black/20 hover:bg-black/30' : 'bg-gray-600 hover:bg-gray-500';
  const btnStyle = isLightMode
    ? 'bg-black text-white hover:bg-gray-800'
    : 'bg-white text-black hover:bg-gray-200';

  return (
    <>
      {/* MUSIC SECTIE */}
      <section ref={revealRef as React.RefObject<HTMLElement>} id="music" className={`py-12 md:py-24 px-4 md:min-h-0 min-h-screen flex items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto w-full scale-85 md:scale-100 origin-center">
          <div className="text-center mb-8 md:mb-16">
            <h2 ref={musicTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-3xl md:text-6xl font-black uppercase tracking-wider">
              <span className="md:hidden">{spotifyPlaylists[currentPlaylist].name}</span>
              <span className="hidden md:block">{musicTitle.display}</span>
            </h2>
          </div>

          {/* Spotify Player */}
          <div className={`${cardBg} border rounded-2xl p-6 md:p-8 transition-colors duration-700`}>
            <div className="flex items-center justify-center gap-6 mb-6">
              <p className={`hidden md:block text-2xl md:text-3xl font-bold ${isLightMode ? 'text-black' : 'text-white'} transition-colors duration-700`}>
                {spotifyPlaylists[currentPlaylist].name}
              </p>

              <div className="flex gap-3">
                {spotifyPlaylists.map((playlist, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPlaylist(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      currentPlaylist === index
                        ? `${dotActive} w-8`
                        : `${dotInactive} w-3`
                    }`}
                    title={playlist.name}
                    aria-label={`Switch to ${playlist.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden relative">
              {spotifyPlaylists.map((playlist, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    index === currentPlaylist ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src={playlist.embedUrl}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              ))}
            </div>

            <a
              href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 w-full inline-block text-center py-3 ${btnStyle} rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]`}
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </section>

      {/* COMPILATIONS */}
      <section id="compilations" className="py-12 md:py-0 px-4 md:min-h-0 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-black uppercase tracking-wider">Playlists</h2>
          </div>

          <div className={`${cardBg} border rounded-2xl p-6 md:p-8 transition-colors duration-700`}>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3 max-w-5xl">
                {compilations.map((compilation) => (
                  <a
                    key={compilation.id}
                    href={compilation.url.replace('/embed/', '/')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-center"
                  >
                    <h4 className={`text-sm font-bold mb-2 ${subtleText} truncate transition-colors duration-700`}>
                      {compilation.name}
                    </h4>

                    <div className={`aspect-square rounded-xl overflow-hidden hover:scale-105 transition-all border ${isLightMode ? 'border-black/[0.08]' : 'border-white/10'}`}>
                      <img
                        src={compilation.cover}
                        alt={compilation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section id="youtube" className="py-12 md:py-20 px-4 md:min-h-0 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full scale-[0.70] md:scale-100 origin-center">
          <div className="text-center mb-12 md:mb-16">
            <h2 ref={youtubeTitle.ref as React.RefObject<HTMLHeadingElement>} className="text-3xl md:text-6xl font-black mb-4 uppercase tracking-wider">{youtubeTitle.display}</h2>
            <p className={`text-base md:text-xl ${subtleText} transition-colors duration-700`}>Watch my latest DJ sets and vlogs</p>
          </div>

          <div className={`${cardBg} border rounded-2xl p-6 md:p-8 transition-colors duration-700`}>
            <div className="relative rounded-xl overflow-hidden group cursor-pointer">
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
                style={{ borderRadius: '12px' }}
              ></iframe>
            </div>

            <a
              href="https://youtube.com/@jonnarincon?si=zp6ECLUFUSCXIhhn"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 w-full inline-block text-center py-3 ${btnStyle} rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]`}
            >
              Visit Channel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
