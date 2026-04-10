/**
 * ALBUM INTEGRATION FOR PUBLIC TRACKS PAGE
 *
 * This file demonstrates how to integrate the album system into the TracksPage.tsx
 * Choose one of the integration patterns below based on your UX needs.
 */

// ============================================
// IMPORTS TO ADD
// ============================================

import { useAlbums } from '../hooks/useAlbums';
import AlbumDetailModal from '../components/AlbumDetailModal';
import AlbumCard from '../components/AlbumCard';
import { Album, Track } from '../lib/firebase/types';
import { albumService } from '../lib/firebase/services';

// ============================================
// STATE ADDITIONS
// ============================================

// Add to TracksPage component state:

// Album state
const { albums: firebaseAlbums, loading: albumsLoading } = useAlbums({ status: 'published' });
const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

// Convert Firebase albums to local Album interface if needed
const albums: Album[] = firebaseAlbums;

// ============================================
// HANDLERS
// ============================================

// Add album-related handlers
const handleViewAlbum = (album: Album) => {
  setSelectedAlbum(album);
  setIsAlbumModalOpen(true);
};

const handleBuyAlbum = (album: Album) => {
  // Add full album to cart with all tracks
  const albumTracks = tracks.filter(track =>
    album.trackIds.includes(track.id)
  );

  // Add as bundle item
  // This depends on your cart implementation
  // Example: addAlbumToCart(album, albumTracks);
  console.log('Buy album:', album.title, 'with', albumTracks.length, 'tracks');
};

const handleBuyAlbumTrack = (track: Track) => {
  handleBuyTrack(track);
};

// ============================================
// INTEGRATION PATTERN 1: DEDICATED ALBUMS TAB
// ============================================

// Add this to the tab buttons:
const buttons = [
  // ... existing buttons
  { id: 'albums', label: 'Albums', icon: Disc3 },
];

// Add this section to render method:
{activeTab === 'albums' && (
  <section className="px-6 md:px-12 py-16 md:py-24">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Albums
          </h2>
          <p className="text-white/25 text-sm mt-2">
            Complete album collections and special releases
          </p>
        </div>
      </div>

      {albumsLoading ? (
        <div className="text-center py-12">
          <p className="text-white/60">Loading albums...</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.05] rounded-lg border border-white/[0.1]">
          <p className="text-white/60">No albums available yet</p>
        </div>
      ) : (
        <>
          {/* Featured Albums Section */}
          {albums.filter(a => a.featured).length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-red-500">★</span> Featured Albums
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {albums
                  .filter(album => album.featured)
                  .map(album => {
                    const albumTrackCount = tracks.filter(t =>
                      album.trackIds.includes(t.id)
                    ).length;
                    return (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        trackCount={albumTrackCount}
                        onViewAlbum={handleViewAlbum}
                      />
                    );
                  })}
              </div>
            </div>
          )}

          {/* All Albums Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">All Albums</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums
                .filter(album => !album.featured)
                .map(album => {
                  const albumTrackCount = tracks.filter(t =>
                    album.trackIds.includes(t.id)
                  ).length;
                  return (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      trackCount={albumTrackCount}
                      onViewAlbum={handleViewAlbum}
                    />
                  );
                })}
            </div>
          </div>

          {/* Discography Footer */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/[0.1]">
            <p className="text-[10px] md:text-xs text-red-500/60 uppercase tracking-[0.4em]">
              Discography
            </p>
            <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-widest">
              {albums.length} Album{albums.length !== 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}
    </div>
  </section>
)}

// ============================================
// INTEGRATION PATTERN 2: FEATURED ALBUMS HERO
// ============================================

// Add after hero section, before tracks section:
{activeTab === 'tracks' && albums.filter(a => a.featured).length > 0 && (
  <section className="px-6 md:px-12 py-12 md:py-16 border-b border-white/[0.1]">
    <div className="max-w-7xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-red-500">★</span> Featured Albums
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {albums
          .filter(album => album.featured)
          .slice(0, 6)
          .map(album => {
            const albumTrackCount = tracks.filter(t =>
              album.trackIds.includes(t.id)
            ).length;
            return (
              <AlbumCard
                key={album.id}
                album={album}
                trackCount={albumTrackCount}
                onViewAlbum={handleViewAlbum}
              />
            );
          })}
      </div>
    </div>
  </section>
)}

// ============================================
// INTEGRATION PATTERN 3: INLINE WITH TRACKS
// ============================================

// This pattern mixes albums and tracks in a single grid
// Group tracks by album and show album cards at the beginning

{activeTab === 'tracks' && (
  <section className="px-6 md:px-12 py-16 md:py-24">
    <div className="max-w-7xl mx-auto">
      {/* ... existing header ... */}

      {/* Albums at top */}
      {albums.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Albums & Collections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {albums
              .filter(a => selectedGenre === 'All' || a.genre === selectedGenre)
              .map(album => {
                const albumTrackCount = tracks.filter(t =>
                  album.trackIds.includes(t.id)
                ).length;
                return (
                  <AlbumCard
                    key={album.id}
                    album={album}
                    trackCount={albumTrackCount}
                    onViewAlbum={handleViewAlbum}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* ... existing tracks section ... */}
    </div>
  </section>
)}

// ============================================
// ALBUM DETAIL MODAL COMPONENT PLACEMENT
// ============================================

// Add this at the end of the component, before closing tags:

{selectedAlbum && (
  <AlbumDetailModal
    album={selectedAlbum}
    tracks={tracks}
    isOpen={isAlbumModalOpen}
    onClose={() => {
      setIsAlbumModalOpen(false);
      setSelectedAlbum(null);
    }}
    onPlayTrack={handlePlayTrack}
    onBuyAlbum={handleBuyAlbum}
    onBuyTrack={handleBuyAlbumTrack}
    currentPlayingId={getCurrentTrack()?.id}
    isPlaying={isPlaying}
    cartItems={cartItems}
  />
)}

// ============================================
// CART INTEGRATION
// ============================================

/**
 * To handle album purchases in your cart system:
 *
 * 1. Update cart item type to include album items:
 *    type CartItem = {
 *      id: string;
 *      type: 'track' | 'album';
 *      item: Track | Album;
 *      price: number;
 *      quantity: number;
 *    }
 *
 * 2. Create addAlbumToCart function:
 *    const addAlbumToCart = (album: Album, tracks: Track[]) => {
 *      const item = {
 *        id: album.id,
 *        type: 'album',
 *        item: album,
 *        price: album.fullAlbumPrice,
 *        quantity: 1,
 *      };
 *      // Add to cart state
 *    };
 *
 * 3. Update checkout to handle album items:
 *    - For album items, add all track IDs to order
 *    - Set albumId in order metadata
 *    - Grant access to all tracks in album
 */

// ============================================
// FILTERING ENHANCEMENT
// ============================================

// To add album filtering:

{selectedTypeTab === 'Albums & EPs' && (
  // Show albums + EP type tracks
  <>
    <div className="space-y-3">
      {albums.map(album => {
        const albumTrackCount = tracks.filter(t =>
          album.trackIds.includes(t.id)
        ).length;
        return (
          <div
            key={album.id}
            className="p-4 bg-white/[0.05] border border-white/[0.1] rounded-lg cursor-pointer hover:bg-white/[0.08] transition-all"
            onClick={() => handleViewAlbum(album)}
          >
            <div className="flex items-center gap-4">
              <img
                src={album.coverImageUrl}
                alt={album.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white">{album.title}</h3>
                <p className="text-sm text-white/60">{album.artist}</p>
                <p className="text-xs text-white/40">
                  {albumTrackCount} Tracks • {album.genre}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">
                  ${album.fullAlbumPrice.toFixed(2)}
                </p>
                <p className="text-xs text-white/60">Full Album</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </>
)}

// ============================================
// INCREMENTAL PLAY/DOWNLOAD TRACKING
// ============================================

// Add album tracking when tracks are played:
const handlePlayTrack = async (track: Track) => {
  // Existing track play logic...

  // Also increment album plays if track belongs to album
  const albumWithTrack = albums.find(a => a.trackIds.includes(track.id));
  if (albumWithTrack) {
    await albumService.incrementPlays(albumWithTrack.id).catch(error => {
      console.error('Failed to increment album plays:', error);
    });
  }
};

// ============================================
// EXPORT FOR USE
// ============================================

export default TracksPage;
