import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3x3, List, Play, Pause, ShoppingCart, Music, Headphones, TrendingUp, Sparkles, X } from 'lucide-react';
import { beatService } from '../../lib/firebase/services/beatService';
import { Beat } from '../../lib/firebase/types';
import Navigation from '../../components/Navigation';
import { useCyberDecodeInView } from '../../hooks/useCyberDecode';

const BeatsShop: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [filter, setFilter] = useState<{
    genre?: string;
    search?: string;
    sortBy: 'newest' | 'popular' | 'price_low' | 'price_high';
  }>({
    sortBy: 'newest',
  });

  const heroTitle = useCyberDecodeInView('BEAT STORE');

  useEffect(() => {
    loadBeats();
  }, [filter]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playingId) {
      const beat = beats.find(b => b.id === playingId);
      const url = beat?.audioUrl || '';
      if (url && audioRef.current.src !== url) {
        audioRef.current.src = url;
      }
      if (url) audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [playingId, beats]);

  const loadBeats = async () => {
    try {
      setLoading(true);
      const allBeats = await beatService.getPublishedBeats();

      let filtered = allBeats;

      if (filter.genre) {
        filtered = filtered.filter((b) => b.genre === filter.genre);
      }

      if (filter.search) {
        const search = filter.search.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title.toLowerCase().includes(search) ||
            b.artist.toLowerCase().includes(search) ||
            b.tags.some((tag) => tag.toLowerCase().includes(search))
        );
      }

      filtered.sort((a, b) => {
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

      setBeats(filtered);
    } catch (error) {
      console.error('Failed to load beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const genres = ['Trap', 'Hip Hop', 'Drill', 'R&B', 'Pop', 'Electronic', 'Afrobeat'];
  const featuredBeats = beats.filter(b => b.featured);
  const trendingBeats = beats.filter(b => b.trending);
  const hasActiveFilters = !!(filter.genre || filter.search);

  return (
    <div className="min-h-screen text-white">
      {/* Fixed JEIGHTENESIS Background */}
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img src="/JEIGHTENESIS.jpg" alt="" className="w-full h-full object-cover" style={{objectPosition: 'center'}} />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <Navigation isDarkOverlay={true} />
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Headphones className="w-4 h-4 text-red-500" />
            <span className="text-xs uppercase tracking-widest text-white/50">Premium Instrumentals</span>
          </div>
          <h1
            ref={heroTitle.ref as React.RefObject<HTMLHeadingElement>}
            className="text-5xl md:text-8xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] neon-glow mb-6"
          >
            {heroTitle.display}
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto tracking-wide">
            High-quality beats crafted by Jonna Rincon. Find your next hit.
          </p>

          {/* Quick Stats */}
          {!loading && beats.length > 0 && (
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-10">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white">{beats.length}</div>
                <div className="text-xs uppercase tracking-widest text-white/30 mt-1">Beats</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white">{genres.length}</div>
                <div className="text-xs uppercase tracking-widest text-white/30 mt-1">Genres</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-red-500">{featuredBeats.length}</div>
                <div className="text-xs uppercase tracking-widest text-white/30 mt-1">Featured</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">

        {/* Featured Beats Horizontal Scroll */}
        {!loading && featuredBeats.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Featured</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredBeats.slice(0, 4).map((beat) => (
                <div
                  key={beat.id}
                  className="group relative glass rounded-xl overflow-hidden hover-lift"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                      Featured
                    </span>
                  </div>

                  <div className="relative aspect-square">
                    <img
                      src={beat.artworkUrl || '/JEIGHTENESIS.jpg'}
                      alt={beat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button
                      onClick={(e) => { e.preventDefault(); setPlayingId(playingId === beat.id ? null : beat.id); }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        {playingId === beat.id ? (
                          <Pause className="w-6 h-6 text-white" fill="currentColor" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                        )}
                      </div>
                    </button>

                    {/* Bottom overlay info */}
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {!loading && trendingBeats.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Trending</h2>
            </div>
            <div className="space-y-2">
              {trendingBeats.slice(0, 5).map((beat, index) => (
                <div
                  key={beat.id}
                  className="glass rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-5 group hover:bg-white/[0.08] transition-all"
                >
                  <span className="text-2xl md:text-3xl font-black text-white/15 w-8 md:w-12 text-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <img src={beat.artworkUrl || '/JEIGHTENESIS.jpg'} alt={beat.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPlayingId(playingId === beat.id ? null : beat.id)}
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
                    <Link
                      to={`/shop/beats/${beat.id}`}
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-all hover:scale-105"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-12 border-t border-white/[0.06]" />

        {/* All Beats Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-red-500" />
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">All Beats</h2>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 glass rounded-lg text-white/50 hover:text-white transition-all"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="glass rounded-xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search beats by name, artist, or tag..."
                value={filter.search || ''}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.08] transition-all text-sm"
              />
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <select
                value={filter.genre || ''}
                onChange={(e) => setFilter({ ...filter, genre: e.target.value || undefined })}
                className="w-full md:w-44 pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-black">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-black">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter({ ...filter, sortBy: e.target.value as typeof filter.sortBy })
              }
              className="w-full md:w-48 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="newest" className="bg-black">Newest First</option>
              <option value="popular" className="bg-black">Most Popular</option>
              <option value="price_low" className="bg-black">Price: Low to High</option>
              <option value="price_high" className="bg-black">Price: High to Low</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={() => setFilter({ sortBy: 'newest' })}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
              <span className="text-xs text-white/30 uppercase tracking-wider">Active:</span>
              {filter.genre && (
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/60">
                  {filter.genre}
                </span>
              )}
              {filter.search && (
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/60">
                  "{filter.search}"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-12 h-12 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
            <p className="text-sm text-white/30 uppercase tracking-widest">Loading beats...</p>
          </div>
        ) : beats.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
              <Music className="w-12 h-12 text-white/20 mx-auto mb-4" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {beats.map((beat) => (
              <Link
                key={beat.id}
                to={`/shop/beats/${beat.id}`}
                className="group glass rounded-xl overflow-hidden hover-lift"
              >
                {/* Artwork */}
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
                      <span className="px-2 py-0.5 bg-red-600 rounded-full text-xs font-bold uppercase shadow-lg">
                        Featured
                      </span>
                    )}
                    {beat.trending && (
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase">
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={(e) => { e.preventDefault(); setPlayingId(playingId === beat.id ? null : beat.id); }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      {playingId === beat.id ? (
                        <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" />
                      )}
                    </div>
                  </button>

                  {/* Playing indicator */}
                  {playingId === beat.id && (
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

                {/* Info */}
                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-sm md:text-base truncate">{beat.title}</h3>
                  <p className="text-xs text-white/40 truncate mt-0.5">{beat.artist}</p>

                  <div className="flex gap-1.5 mt-2">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-xs text-white/50">{beat.bpm} BPM</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-xs text-white/50">{beat.key}</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-xs text-white/50 hidden md:inline">{beat.genre}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div>
                      <div className="text-xs text-white/25">From</div>
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
            {beats.map((beat, index) => (
              <Link
                key={beat.id}
                to={`/shop/beats/${beat.id}`}
                className="glass rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-5 group hover:bg-white/[0.08] transition-all"
              >
                <span className="text-lg md:text-xl font-black text-white/15 w-6 md:w-10 text-center flex-shrink-0">
                  {index + 1}
                </span>

                <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <img src={beat.artworkUrl || '/JEIGHTENESIS.jpg'} alt={beat.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.preventDefault(); setPlayingId(playingId === beat.id ? null : beat.id); }}
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
                      <span className="px-2 py-0.5 bg-red-600 rounded-full text-xs font-bold flex-shrink-0">F</span>
                    )}
                    {beat.trending && (
                      <span className="px-2 py-0.5 bg-white/15 rounded-full text-xs font-bold flex-shrink-0">T</span>
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
                  <div className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition-all group-hover:scale-105">
                    View
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && beats.length > 0 && (
          <div className="mt-10 text-center">
            <span className="text-xs uppercase tracking-widest text-white/20">
              Showing {beats.length} beat{beats.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatsShop;
