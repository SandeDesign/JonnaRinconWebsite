import { Music2, ListMusic, Youtube, Instagram, Music as MusicIcon } from 'lucide-react';
import { useState } from 'react';

export default function Music() {
  const [currentPlaylist, setCurrentPlaylist] = useState(0);
  
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

  return (
    <>
      {/* MUSIC SECTIE */}
      <section id="music" className="py-12 md:py-24 px-4 bg-transparent md:min-h-0 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full scale-85 md:scale-100 origin-center">
          {/* Header - Mobile: playlist naam, Desktop: "Music" */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-bold neon-glow">
              <span className="md:hidden">{spotifyPlaylists[currentPlaylist].name}</span>
              <span className="hidden md:block">Music</span>
            </h2>
          </div>

          {/* Spotify Player */}
          <div className="glass rounded-2xl p-8 neon-border-subtle">
            {/* Switcher bolletjes - Mobile: gecentreerd, Desktop: met playlist naam */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Desktop: playlist naam links van bolletjes */}
              <p className="hidden md:block text-2xl md:text-3xl font-bold neon-glow">
                {spotifyPlaylists[currentPlaylist].name}
              </p>

              {/* Bolletjes - altijd gecentreerd */}
              <div className="flex gap-3">
                {spotifyPlaylists.map((playlist, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPlaylist(index)}
                    className={`w-4 h-4 rounded-full transition-all ${
                      currentPlaylist === index
                        ? 'bg-purple-500 w-8'
                        : 'bg-gray-600 hover:bg-gray-500'
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
              className="mt-6 w-full inline-block text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all neon-border-subtle hover:scale-105"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </section>

      {/* COMPILATIONS - Mobile: header "Playlists", Desktop: geen header */}
      <section id="compilations" className="py-12 md:py-0 px-4 bg-transparent md:min-h-0 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header - ALLEEN MOBILE */}
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-bold neon-glow">Playlists</h2>
          </div>

          <div className="glass rounded-2xl p-8 neon-border-subtle">
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
                    <h4 className="text-sm font-bold mb-2 text-purple-300 truncate">
                      {compilation.name}
                    </h4>
                    
                    <div className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-all glass neon-border-subtle hover:neon-border">
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

      {/* YOUTUBE - Mobile: scale 70% (30% kleiner), Desktop: normaal */}
      <section id="youtube" className="py-12 md:py-44 md:mt-96 px-4 bg-transparent md:min-h-0 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full scale-[0.70] md:scale-100 origin-center">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-bold mb-4 neon-glow">YouTube</h2>
            <p className="text-base md:text-xl text-gray-400">Watch my latest DJ sets and vlogs</p>
          </div>

          <div className="glass rounded-2xl p-8 neon-border-subtle">
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
              className="mt-6 w-full inline-block text-center py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all neon-border-subtle hover:scale-105"
            >
              Visit Channel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}