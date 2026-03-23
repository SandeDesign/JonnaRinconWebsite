import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const spotifyPlaylists = [
  { name: 'Top Tracks', embedUrl: 'https://open.spotify.com/embed/artist/6o3BlWTeK4EKUyByo35y6F?utm_source=generator' },
  { name: 'Playlist 2', embedUrl: 'https://open.spotify.com/embed/playlist/5SaEeqVSV9vyLUvqsrrfJ7?utm_source=generator&theme=0' },
  { name: 'Playlist 3', embedUrl: 'https://open.spotify.com/embed/playlist/7mIjrYgNeQxVw2lBBsEDjE?utm_source=generator&theme=0' },
  { name: 'Playlist 4', embedUrl: 'https://open.spotify.com/embed/playlist/5smfHiU4egb6uyHYzgmqdC?utm_source=generator' },
  { name: 'This is Jonna Rincon', embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO3LPWh3?utm_source=generator' },
];

const compilations = [
  { id: 'this-is', name: 'This Is Jonna Rincon', url: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3LPWh3', cover: 'ThisIsJonna.png', type: 'Playlist' },
  { id: 'dj-sets', name: 'DJ SETS', url: 'https://youtube.com/playlist?list=PLgWPe6V88vwBmK5X5WCsj5kvvCb4IXjkM', cover: 'TN-DJSet.jpg', type: 'Video Series' },
  { id: 'mix-master', name: 'Mix & Master', url: 'https://open.spotify.com/playlist/5smfHiU4egb6uyHYzgmqdC', cover: 'MixedBy.png', type: 'Production' },
  { id: 'moombahton', name: 'Moombah Time', url: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO3LPWh3', cover: 'MoombahTime.png', type: 'Genre' },
  { id: 'vlogs', name: 'Vlogs', url: 'https://youtube.com/playlist?list=PLgWPe6V88vwAoxr8xVTv85989fwEe5a10', cover: 'Vlog Foto.png', type: 'Video Series' },
];

export default function TracksPage() {
  const [currentPlaylist, setCurrentPlaylist] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation isDarkOverlay={true} isLightMode={false} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-16 md:pb-24 pt-40 px-6 md:px-12">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-[0.4em] mb-4">Discography</p>
          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter">
            My<br />Tracks
          </h1>
          <p className="text-white/30 text-sm md:text-base mt-6 max-w-md">
            Explore the full catalog — from original productions to DJ sets, mixes, and curated playlists.
          </p>
        </div>
      </section>

      {/* Spotify Player Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Listen Now</h2>
              <p className="text-white/25 text-sm mt-2">Stream on Spotify</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPlaylist(Math.max(0, currentPlaylist - 1))}
                className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] transition-all"
                disabled={currentPlaylist === 0}
              >
                <ChevronLeft size={18} className={currentPlaylist === 0 ? 'text-white/10' : 'text-white/40'} />
              </button>
              <button
                onClick={() => setCurrentPlaylist(Math.min(spotifyPlaylists.length - 1, currentPlaylist + 1))}
                className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] transition-all"
                disabled={currentPlaylist === spotifyPlaylists.length - 1}
              >
                <ChevronRight size={18} className={currentPlaylist === spotifyPlaylists.length - 1 ? 'text-white/10' : 'text-white/40'} />
              </button>
            </div>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <p className="text-lg font-bold text-white">{spotifyPlaylists[currentPlaylist].name}</p>
              <div className="flex gap-2">
                {spotifyPlaylists.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPlaylist(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentPlaylist ? 'bg-red-500 w-6' : 'bg-white/10 w-1.5 hover:bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden relative">
              {spotifyPlaylists.map((playlist, i) => (
                <div key={i} className={`transition-opacity duration-500 ${i === currentPlaylist ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                  <iframe
                    style={{ borderRadius: '16px' }}
                    src={playlist.embedUrl}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <a
              href="https://open.spotify.com/artist/6o3BlWTeK4EKUyByo35y6F"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-block text-center py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </section>

      {/* Compilations Grid */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">Collections</h2>
          <p className="text-white/25 text-sm mb-10">Curated playlists and compilations</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {compilations.map((comp) => (
              <a
                key={comp.id}
                href={comp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] mb-3">
                  <img src={comp.cover} alt={comp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">{comp.name}</h3>
                <p className="text-[10px] text-white/25 uppercase tracking-wider">{comp.type}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">YouTube</h2>
          <p className="text-white/25 text-sm mb-10">Watch DJ sets and vlogs</p>

          <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-5 md:p-8">
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <div
                className="absolute inset-0 z-10 transition-opacity duration-500 group-[.playing]:opacity-0 group-[.playing]:pointer-events-none"
                onClick={(e) => {
                  const container = e.currentTarget.closest('.relative');
                  container?.classList.add('playing');
                  const iframe = container?.querySelector('iframe') as HTMLIFrameElement;
                  if (iframe) {
                    const src = iframe.src;
                    iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                  }
                }}
              >
                <img src="DJI_20251017150728_0019_D.JPG" alt="YouTube thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
              />
            </div>

            <a
              href="https://youtube.com/@jonnarincon"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-block text-center py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
            >
              Visit Channel
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Want a Custom Beat?</h2>
          <p className="text-white/30 text-sm md:text-base mb-8 max-w-md mx-auto">
            Browse the beat store or get in touch for custom productions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop/beats" className="px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all hover:scale-105 rounded-2xl">
              Beat Store
            </Link>
            <Link to="/contact" className="px-8 py-3.5 bg-white/[0.06] border border-white/[0.08] text-white font-bold text-sm uppercase tracking-widest hover:bg-white/[0.10] transition-all hover:scale-105 rounded-2xl">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
