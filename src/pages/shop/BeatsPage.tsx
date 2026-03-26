import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3x3, List, Play, Pause, ShoppingCart, X } from 'lucide-react';
import { Beat } from '../../lib/firebase/types';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useCyberDecodeInView } from '../../hooks/useCyberDecode';
import { toDirectUrl } from '../../lib/utils/urlUtils';
import { setCurrentTrack, getCurrentTrack } from '../../components/GlobalAudioPlayer';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const BeatsShop: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<{
    genre?: string;
    search?: string;
    sortBy: 'newest' | 'popular' | 'price_low' | 'price_high';
  }>({
    sortBy: 'newest',
  });

  const heroTitle = useCyberDecodeInView('BEATSTORE');

  // Use same real-time Firebase listener as homepage BeatStore component
  useEffect(() => {
    setLoading(true);

    const beatsQuery = query(
      collection(db, 'beats'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      beatsQuery,
      (snapshot) => {
        const beatsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            audioUrl: toDirectUrl(data.audioUrl || ''),
            artworkUrl: toDirectUrl(data.artworkUrl || ''),
          } as Beat;
        });
        setBeats(beatsData);
        setLoading(false);
      },
      (err) => {
        console.error('Firebase error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const isCurrentBeatPlaying = (beatId: string) => {
    const currentTrack = getCurrentTrack();
    return currentTrack?.id === beatId;
  };

  const handlePlayBeat = (beat: Beat) => {
    // Convert beat to track format
    const trackBeat = {
      id: beat.id,
      title: beat.title,
      artist: beat.producer || 'Unknown',
      audioUrl: beat.audioUrl,
      coverArt: beat.artworkUrl,
      duration: '0:00',
      genre: beat.genre || '',
      type: 'Single' as const,
      year: new Date().getFullYear(),
      collab: 'Solo' as const,
      createdAt: beat.createdAt?.seconds ? beat.createdAt.seconds * 1000 : Date.now(),
    };

    // Use global player
    setCurrentTrack(trackBeat, [trackBeat]);
  };

  const genres = ['Trap', 'Hip Hop', 'Drill', 'R&B', 'Pop', 'Electronic', 'Afrobeat'];
  const hasActiveFilters = !!(filter.genre || filter.search);

  // Apply client-side filtering and sorting
  const filteredBeats = (() => {
    let result = [...beats];

    if (filter.genre) {
      result = result.filter((b) => b.genre === filter.genre);
    }

    if (filter.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.artist.toLowerCase().includes(search) ||
          b.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    result.sort((a, b) => {
      switch (filter.sortBy) {
        case 'newest':
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        case 'popular':
          return b.plays - a.plays;
        case 'price_low':
          return (a.licenses.basic?.price || 0) - (b.licenses.basic?.price || 0);
        case 'price_high':
          return (b.licenses.basic?.price || 0) - (a.licenses.basic?.price || 0);
        default:
          return 0;
      }
    });

    return result;
  })();

  const featuredBeats = filteredBeats.filter(b => b.featured);
  const trendingBeats = filteredBeats.filter(b => b.trending);

  return (
    <div className="min-h-screen text-white">
      {/* Fixed JEIGHTENESIS Background */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img src="/JEIGHTENESIS.jpg" alt="" className="w-full h-full object-cover" style={{objectPosition: 'center'}} />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <Navigation isDarkOverlay={true} />

      {/* Hero - same layout as Releases, Contact, Socials */}
      <section className="relative min-h-[60vh] flex items-end pb-16 md:pb-24 pt-40 px-6 md:px-12">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <p className="text-[10px] md:text-xs text-red-500/60 uppercase tracking-[0.4em] mb-4">Beat Store</p>
          <h1
            ref={heroTitle.ref as React.RefObject<HTMLHeadingElement>}
            className="text-6xl md:text-[8rem] lg:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter neon-glow"
          >
            {heroTitle.display}
          </h1>
          <p className="text-white/30 text-sm md:text-base mt-6 max-w-lg">
            High-quality beats crafted by Jonna Rincon. Find your next hit.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section className="sticky top-0 z-20 px-6 md:px-12 py-4 backdrop-blur-xl bg-black/40 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search beats..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-11 pr-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-white placeholder-white/25 focus:outline-none focus:border-red-500/40 transition-all text-sm"
            />
          </div>

          {/* Genre Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <select
              value={filter.genre || ''}
              onChange={(e) => setFilter({ ...filter, genre: e.target.value || undefined })}
              className="w-full md:w-40 pl-9 pr-3 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-white text-sm focus:outline-none focus:border-red-500/40 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-black">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-black">{genre}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as typeof filter.sortBy })}
            className="w-full md:w-44 px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-full text-white text-sm focus:outline-none focus:border-red-500/40 transition-all appearance-none cursor-pointer"
          >
            <option value="newest" className="bg-black">Newest First</option>
            <option value="popular" className="bg-black">Most Popular</option>
            <option value="price_low" className="bg-black">Price: Low to High</option>
            <option value="price_high" className="bg-black">Price: High to Low</option>
          </select>

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-white/40 hover:text-white/70 hover:bg-white/[0.10] transition-all flex-shrink-0"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => setFilter({ sortBy: 'newest' })}
              className="p-2.5 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 hover:bg-red-600/30 transition-all flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* Featured Beats */}
        {!loading && featuredBeats.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">Featured</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredBeats.slice(0, 4).map((beat) => (
                <Link
                  key={beat.id}
                  to={`/shop/beats/${beat.id}`}
                  className="group relative bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                      Featured
                    </span>
                  </div>

                  <div className="relative aspect-square">
                    <img src={beat.artworkUrl || '/JEIGHTENESIS.jpg'} alt={beat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button
                      onClick={(e) => { e.preventDefault(); handlePlayBeat(beat); }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        {isCurrentBeatPlaying(beat.id) ? (
                          <Pause className="w-6 h-6 text-white" fill="currentColor" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                        )}
                      </div>
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-base md:text-lg text-white truncate">{beat.title}</h3>
                      <p className="text-xs text-white/50 truncate">{beat.artist}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1.5">
                          <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{beat.bpm} BPM</span>
                          <span className="px-2 py-0.5 bg-white/10 rounded text-xs">{beat.key}</span>
                        </div>
                        <span className="text-lg font-black text-red-500">
                          &euro;{beat.licenses.basic?.price.toFixed(0) || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {!loading && trendingBeats.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8">Trending</h2>
            <div className="space-y-2">
              {trendingBeats.slice(0, 5).map((beat, index) => (
                <Link
                  key={beat.id}
                  to={`/shop/beats/${beat.id}`}
                  className="flex items-center gap-3 md:gap-5 p-3 md:p-4 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl group hover:bg-white/[0.06] transition-all"
                >
                  <span className="text-2xl md:text-3xl font-black text-white/15 w-8 md:w-12 text-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <img src={beat.artworkUrl || '/JEIGHTENESIS.jpg'} alt={beat.title} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.preventDefault(); handlePlayBeat(beat); }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      {isCurrentBeatPlaying(beat.id) ? (
                        <Pause className="w-5 h-5 text-white" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-base truncate">{beat.title}</h3>
                    <p className="text-xs text-white/40 truncate">{beat.artist}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-xs text-white/30">
                    <span>{beat.plays.toLocaleString()} plays</span>
                    <span>{beat.genre}</span>
                    <span>{beat.bpm} BPM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base md:text-lg font-black text-red-500">
                      &euro;{beat.licenses.basic?.price.toFixed(0) || '0'}
                    </span>
                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-all">
                      View
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {!loading && (featuredBeats.length > 0 || trendingBeats.length > 0) && (
          <div className="my-12 border-t border-white/[0.06]" />
        )}

        {/* All Beats Section */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">All Beats</h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-12 h-12 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
            <p className="text-sm text-white/30 uppercase tracking-widest">Loading beats...</p>
          </div>
        ) : filteredBeats.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-xl font-bold mb-2">No beats found</p>
              <p className="text-white/40 text-sm">
                {hasActiveFilters ? 'Try adjusting your search filters' : 'Beats will appear here once published'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilter({ sortBy: 'newest' })}
                  className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredBeats.map((beat) => (
              <Link
                key={beat.id}
                to={`/shop/beats/${beat.id}`}
                className="group bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="relative aspect-square">
                  <img
                    src={beat.artworkUrl || '/JEIGHTENESIS.jpg'}
                    alt={beat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    {beat.featured && (
                      <span className="px-2 py-0.5 bg-red-600 rounded-full text-[10px] font-bold uppercase shadow-lg">
                        Featured
                      </span>
                    )}
                    {beat.trending && (
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase">
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={(e) => { e.preventDefault(); handlePlayBeat(beat); }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      {isCurrentBeatPlaying(beat.id) ? (
                        <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" />
                      )}
                    </div>
                  </button>

                  {/* Playing indicator */}
                  {isCurrentBeatPlaying(beat.id) && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-red-600/80 backdrop-blur-sm rounded-full">
                      <div className="flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-white rounded-full animate-pulse" style={{height: '40%', animationDelay: '0ms'}} />
                        <div className="w-0.5 bg-white rounded-full animate-pulse" style={{height: '70%', animationDelay: '150ms'}} />
                        <div className="w-0.5 bg-white rounded-full animate-pulse" style={{height: '50%', animationDelay: '300ms'}} />
                        <div className="w-0.5 bg-white rounded-full animate-pulse" style={{height: '80%', animationDelay: '100ms'}} />
                      </div>
                      <span className="text-xs font-medium">Playing</span>
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-sm md:text-base truncate">{beat.title}</h3>
                  <p className="text-xs text-white/40 truncate mt-0.5">{beat.artist}</p>

                  <div className="flex gap-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-xs text-white/50">{beat.bpm} BPM</span>
                    <span className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-xs text-white/50">{beat.key}</span>
                    <span className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-xs text-white/50 hidden md:inline">{beat.genre}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                    <div>
                      <div className="text-[10px] text-white/25 uppercase tracking-wider">From</div>
                      <div className="text-base md:text-lg font-black text-red-500">
                        &euro;{beat.licenses.basic?.price.toFixed(0) || '0'}
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition-all group-hover:scale-105">
                      View Beat
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-2">
            {filteredBeats.map((beat, index) => (
              <Link
                key={beat.id}
                to={`/shop/beats/${beat.id}`}
                className="flex items-center gap-3 md:gap-5 p-3 md:p-4 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl group hover:bg-white/[0.06] transition-all"
              >
                <span className="text-lg md:text-xl font-black text-white/15 w-6 md:w-10 text-center flex-shrink-0">
                  {index + 1}
                </span>

                <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <img src={beat.artworkUrl || '/JEIGHTENESIS.jpg'} alt={beat.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.preventDefault(); handlePlayBeat(beat); }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  >
                    {playingId === beat.id ? (
                      <Pause className="w-5 h-5 text-white" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm md:text-base truncate">{beat.title}</h3>
                    {beat.featured && (
                      <span className="px-2 py-0.5 bg-red-600 rounded-full text-[10px] font-bold flex-shrink-0 uppercase">F</span>
                    )}
                    {beat.trending && (
                      <span className="px-2 py-0.5 bg-white/15 rounded-full text-[10px] font-bold flex-shrink-0 uppercase">T</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 truncate">{beat.artist}</p>
                </div>

                <div className="hidden md:flex items-center gap-3 text-xs text-white/30 flex-shrink-0">
                  <span>{beat.genre}</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span>{beat.bpm} BPM</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span>{beat.key}</span>
                </div>

                <div className="hidden md:flex items-center gap-4 text-xs text-white/20 flex-shrink-0">
                  <span>{beat.plays.toLocaleString()} plays</span>
                  <span>{beat.likes.toLocaleString()} likes</span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-base md:text-lg font-black text-red-500">
                    &euro;{beat.licenses.basic?.price.toFixed(0) || '0'}
                  </span>
                  <span className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition-all group-hover:scale-105">
                    View
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredBeats.length > 0 && (
          <div className="mt-10 text-center">
            <span className="text-[10px] uppercase tracking-widest text-white/20">
              Showing {filteredBeats.length} beat{filteredBeats.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BeatsShop;
