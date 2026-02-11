import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { beatService } from '../../lib/firebase/services/beatService';
import { Beat } from '../../lib/firebase/types';
import Navigation from '../../components/Navigation';

const BeatsShop: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    genre?: string;
    search?: string;
    sortBy: 'newest' | 'popular' | 'price_low' | 'price_high';
  }>({
    sortBy: 'newest',
  });

  useEffect(() => {
    loadBeats();
  }, [filter]);

  const loadBeats = async () => {
    try {
      setLoading(true);
      const allBeats = await beatService.getPublishedBeats();

      // Filter beats
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

      // Sort beats
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Premium Beats</h1>
          <p className="text-xl text-gray-400">Explore high-quality beats by Jonna Rincon</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search beats..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />

            {/* Genre Filter */}
            <select
              value={filter.genre || ''}
              onChange={(e) => setFilter({ ...filter, genre: e.target.value || undefined })}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter({ ...filter, sortBy: e.target.value as typeof filter.sortBy })
              }
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>

            {/* Clear Filters */}
            {(filter.genre || filter.search) && (
              <button
                onClick={() => setFilter({ sortBy: 'newest' })}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Beats Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading beats...</div>
          </div>
        ) : beats.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <div className="text-4xl mb-4">🎵</div>
            <p className="text-xl mb-2">No beats found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beats.map((beat) => (
              <Link
                key={beat.id}
                to={`/shop/beats/${beat.id}`}
                className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-200"
              >
                {/* Beat Artwork */}
                <div className="relative">
                  <img
                    src={beat.artworkUrl || '/placeholder-beat.png'}
                    alt={beat.title}
                    className="w-full h-48 object-cover"
                  />
                  {beat.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                  {beat.trending && (
                    <div className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded text-xs font-bold">
                      🔥 TRENDING
                    </div>
                  )}
                </div>

                {/* Beat Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{beat.title}</h3>
                  <div className="text-sm text-gray-400 mb-3">{beat.artist}</div>

                  {/* Beat Details */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{beat.bpm} BPM</span>
                    <span>•</span>
                    <span>{beat.key}</span>
                    <span>•</span>
                    <span>{beat.genre}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span>▶️ {beat.plays.toLocaleString()}</span>
                    <span>❤️ {beat.likes.toLocaleString()}</span>
                    <span>⬇️ {beat.downloads.toLocaleString()}</span>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                    <div>
                      <div className="text-xs text-gray-400">Starting at</div>
                      <div className="font-bold text-lg">
                        €{beat.licenses.basic?.price.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition">
                      View Beat
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && beats.length > 0 && (
          <div className="mt-8 text-center text-gray-400">
            Showing {beats.length} beat{beats.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatsShop;
