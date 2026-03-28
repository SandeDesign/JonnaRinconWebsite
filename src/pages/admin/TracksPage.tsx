import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LinkInput from '../../components/admin/LinkInput';
import { useTracks } from '../../hooks/useTracks';
import { trackService } from '../../lib/firebase/services';
import { Track } from '../../lib/firebase/types';
import { Plus, Edit, Trash2, Play, Pause, ChevronDown } from 'lucide-react';
import { toDirectUrl } from '../../lib/utils/urlUtils';

const TracksPage: React.FC = () => {
  const { tracks, loading } = useTracks();
  const [showModal, setShowModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());

  const handleCreate = () => {
    setEditingTrack(null);
    setShowModal(true);
  };

  const handleEdit = (track: Track) => {
    setEditingTrack(track);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;
    try {
      await trackService.deleteTrack(id);
      alert('Track deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEditAlbum = (track: Track) => {
    // For album editing, set the track as the album reference
    setEditingTrack(track);
    setShowModal(true);
  };

  const handleDeleteAlbum = async (track: Track) => {
    const albumName = track.album || track.title;
    if (!confirm(`Are you sure you want to delete the entire album "${albumName}" with all its tracks?`)) return;
    try {
      // Get all tracks in this album and delete them
      // Filter by album name (use both album field and title as fallback)
      const albumTracks = tracks.filter(t => {
        const trackAlbumName = t.album || t.title;
        return trackAlbumName === albumName && (t.type === 'Album' || t.type === 'EP');
      });

      for (const t of albumTracks) {
        await trackService.deleteTrack(t.id);
      }
      alert(`Album "${albumName}" and all ${albumTracks.length} tracks deleted successfully`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const togglePlay = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
    }
  };

  const toggleAlbumExpand = (albumKey: string) => {
    const newExpanded = new Set(expandedAlbums);
    if (newExpanded.has(albumKey)) {
      newExpanded.delete(albumKey);
    } else {
      newExpanded.add(albumKey);
    }
    setExpandedAlbums(newExpanded);
  };

  // Group tracks by album for Album/EP types
  const groupedTracks = tracks.reduce((acc, track) => {
    if (track.type === 'Album' || track.type === 'EP') {
      // Use album field, fallback to title for backward compatibility
      const albumName = track.album || track.title;
      const albumKey = `${track.type}:${albumName}`;

      if (!acc[albumKey]) {
        acc[albumKey] = {
          albumName: albumName,
          type: track.type,
          artwork: track.artworkUrl,
          tracks: [],
          displayTrack: track,
        };
      }
      acc[albumKey].tracks.push(track);
    } else {
      // Single tracks
      const singleKey = `single:${track.id}`;
      acc[singleKey] = {
        albumName: null,
        type: track.type,
        artwork: track.artworkUrl,
        tracks: [track],
        displayTrack: track,
      };
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tracks Management</h1>
            <p className="text-white/40 mt-2">Manage your track catalog</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Track</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Tracks</p>
            <p className="text-2xl font-bold text-white mt-1">{tracks.length}</p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Published</p>
            <p className="text-2xl font-bold text-white mt-1">
              {tracks.filter((t) => t.status === 'published').length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Featured</p>
            <p className="text-2xl font-bold text-white mt-1">
              {tracks.filter((t) => t.featured).length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Plays</p>
            <p className="text-2xl font-bold text-white mt-1">
              {tracks.reduce((sum, t) => sum + t.plays, 0)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-12 text-center text-white/40">
              Loading tracks...
            </div>
          ) : tracks.length === 0 ? (
            <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-12 text-center text-white/40">
              No tracks yet. Create your first track!
            </div>
          ) : (
            Object.entries(groupedTracks).map(([albumKey, group]) => {
              const isAlbum = group.albumName && (group.type === 'Album' || group.type === 'EP');
              const isExpanded = expandedAlbums.has(albumKey);

              return isAlbum ? (
                <div key={albumKey} className="bg-white/[0.08] border border-white/[0.06] rounded-xl overflow-hidden">
                  {/* Album Header */}
                  <div className="px-6 py-4 flex items-center gap-4 border-b border-white/[0.06] hover:bg-white/[0.06] transition-all">
                    <button
                      onClick={() => toggleAlbumExpand(albumKey)}
                      className="flex-1 flex items-center gap-4 text-left"
                    >
                      <img
                        src={group.artwork}
                        alt={group.albumName}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white">{group.albumName}</p>
                        <p className="text-sm text-white/40">{group.tracks.length} tracks</p>
                      </div>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm flex-shrink-0">
                        {group.type}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`flex-shrink-0 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Action Buttons - Album Level */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditAlbum(group.displayTrack)}
                        className="p-2 text-white/40 hover:text-blue-400 transition-colors"
                        title="Edit Album"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(group.displayTrack)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete Album"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Album Tracks - Expandible */}
                  {isExpanded && (
                    <div className="border-t border-white/[0.06]">
                      <table className="w-full">
                        <tbody className="divide-y divide-white/[0.06]">
                          {group.tracks.map((track, index) => (
                            <tr key={track.id} className="hover:bg-white/[0.06]">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-white/40 font-mono w-6 text-right">{index + 1}</span>
                                  <div>
                                    <p className="font-medium text-white">{track.title}</p>
                                    <p className="text-sm text-white/40">{track.artist}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                                  {track.genre}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-white/60">
                                {track.bpm} BPM / {track.key}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 rounded text-sm ${
                                    track.status === 'published'
                                      ? 'bg-green-500/20 text-green-400'
                                      : track.status === 'draft'
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-white/[0.06] text-white/40'
                                  }`}
                                >
                                  {track.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-white/60">{track.plays}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                // Single Track
                <div key={albumKey} className="bg-white/[0.08] border border-white/[0.06] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        <tr className="hover:bg-white/[0.06]">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={group.displayTrack.artworkUrl}
                                alt={group.displayTrack.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium text-white">{group.displayTrack.title}</p>
                                <p className="text-sm text-white/40">{group.displayTrack.artist}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                              {group.displayTrack.genre}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/60">
                            {group.displayTrack.bpm} BPM / {group.displayTrack.key}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                group.displayTrack.status === 'published'
                                  ? 'bg-green-500/20 text-green-400'
                                  : group.displayTrack.status === 'draft'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-white/[0.06] text-white/40'
                              }`}
                            >
                              {group.displayTrack.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/60">{group.displayTrack.plays}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => togglePlay(group.displayTrack.id)}
                                className="p-2 text-white/40 hover:text-purple-400 transition-colors"
                                title="Play preview"
                              >
                                {currentlyPlaying === group.displayTrack.id ? <Pause size={18} /> : <Play size={18} />}
                              </button>
                              <button
                                onClick={() => handleEdit(group.displayTrack)}
                                className="p-2 text-white/40 hover:text-blue-400 transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(group.displayTrack.id)}
                                className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <TrackFormModal
          track={editingTrack}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            setEditingTrack(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

interface TrackFormModalProps {
  track: Track | null;
  onClose: () => void;
  onSave: () => void;
}

interface TracklistItem {
  id: string;
  title: string;
  audioUrl: string;
  duration?: string;
}

const TrackFormModal: React.FC<TrackFormModalProps> = ({ track, onClose, onSave }) => {
  const currentYear = new Date().getFullYear();
  const isEditing = !!track;

  // Determine if this is editing an album/EP (check type first, then album field)
  const isEditingAlbum = isEditing && (track?.type === 'Album' || track?.type === 'EP');

  const [formData, setFormData] = useState({
    // For albums/EPs: use album name. For single tracks: use track title
    title: isEditingAlbum ? (track?.album || track?.title || '') : (track?.title || ''),
    artist: track?.artist || 'Jonna Rincon',
    genre: track?.genre || '',
    type: track?.type || 'Single',
    year: track?.year || currentYear,
    collab: track?.collab || 'Solo',
    tags: track?.tags?.join(', ') || '',
    audioUrl: track?.audioUrl || '',
    artworkUrl: track?.artworkUrl || '',
    slug: track?.slug || '',
    status: track?.status || 'draft',
    featured: track?.featured || false,
  });

  const [tracklist, setTracklist] = useState<TracklistItem[]>([]);
  const [saving, setSaving] = useState(false);
  const { tracks: allTracks } = useTracks();

  // Load album tracks when editing an album
  React.useEffect(() => {
    if (isEditingAlbum && track) {
      // Use album field to find all tracks of this album
      const albumName = track.album || track.title;
      const albumTracks = allTracks
        .filter(t => t.album === albumName && (t.type === 'Album' || t.type === 'EP'))
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0))
        .map((t) => ({
          id: t.id,
          title: t.title,
          audioUrl: t.audioUrl,
        }));
      setTracklist(albumTracks);
    }
  }, [isEditingAlbum, track?.album, track?.title, allTracks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const baseTrackData: any = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        type: formData.type,
        year: formData.year,
        collab: formData.collab,
        tags: formData.tags.split(',').map((t) => t.trim()),
        artworkUrl: formData.artworkUrl,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        status: formData.status,
        featured: formData.featured,
        licenses: {
          basic: {
            type: 'basic' as const,
            price: 9,
            features: ['MP3 Download', 'Non-exclusive rights', 'Personal use'],
            downloads: 1,
            streams: 10000,
            videos: 1,
            distribution: false,
          },
          premium: {
            type: 'premium' as const,
            price: 19,
            features: ['WAV + MP3', 'Non-exclusive rights', 'Commercial use', 'Unlimited streams'],
            downloads: 5,
            streams: 1000000,
            videos: 5,
            distribution: true,
          },
          exclusive: {
            type: 'exclusive' as const,
            price: 99,
            features: ['All files', 'Exclusive rights', 'Full ownership', 'Unlimited use'],
            downloads: -1,
            streams: -1,
            videos: -1,
            distribution: true,
          },
        },
      };

      // For Album/EP with tracklist
      if ((formData.type === 'Album' || formData.type === 'EP') && tracklist.length > 0) {
        if (isEditingAlbum) {
          // Update existing album tracks
          const existingTrackIds = allTracks
            .filter(t => t.album === track?.album)
            .map(t => t.id);

          for (let i = 0; i < tracklist.length; i++) {
            const item = tracklist[i];
            const trackData = {
              ...baseTrackData,
              title: item.title,
              audioUrl: item.audioUrl,
              album: formData.title,
              trackNumber: i + 1,
            };

            if (item.id && existingTrackIds.includes(item.id)) {
              // Update existing track
              await trackService.updateTrack(item.id, trackData);
              existingTrackIds.splice(existingTrackIds.indexOf(item.id), 1);
            } else {
              // Create new track
              await trackService.createTrack(trackData);
            }
          }

          // Delete tracks that were removed
          for (const deletedId of existingTrackIds) {
            await trackService.deleteTrack(deletedId);
          }
          alert(`Updated ${formData.type.toLowerCase()} with ${tracklist.length} tracks`);
        } else {
          // Create new album with tracks
          for (let i = 0; i < tracklist.length; i++) {
            const item = tracklist[i];
            const trackData = {
              ...baseTrackData,
              title: item.title,
              audioUrl: item.audioUrl,
              album: formData.title,
              trackNumber: i + 1,
            };
            await trackService.createTrack(trackData);
          }
          alert(`Created ${tracklist.length} tracks in ${formData.type.toLowerCase()}`);
        }
      } else if (track) {
        // Update single track
        const trackData = {
          ...baseTrackData,
          audioUrl: formData.audioUrl,
        };
        await trackService.updateTrack(track.id, trackData);
        alert('Track updated successfully');
      } else {
        // Create single track
        const trackData = {
          ...baseTrackData,
          audioUrl: formData.audioUrl,
        };
        await trackService.createTrack(trackData);
        alert('Track created successfully');
      }

      onSave();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addTrackToList = () => {
    setTracklist([
      ...tracklist,
      {
        id: Date.now().toString(),
        title: '',
        audioUrl: '',
      },
    ]);
  };

  const removeTrackFromList = (id: string) => {
    setTracklist(tracklist.filter((t) => t.id !== id));
  };

  const updateTrackInList = (id: string, field: string, value: string) => {
    if (field === 'audioUrl') {
      // Apply URL transformation for audio files (adds /download if needed)
      value = toDirectUrl(value);
    }
    setTracklist(tracklist.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto p-4">
      <div className="bg-white/[0.10] backdrop-blur-2xl border border-white/[0.10] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/[0.08]">
          <h2 className="text-2xl font-bold text-white">
            {track ? 'Edit Track' : 'Add New Track'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Artist</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Album' | 'EP' | 'Single' | 'Exclusive' })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              >
                <option value="Single">Single</option>
                <option value="EP">EP</option>
                <option value="Album">Album</option>
                <option value="Exclusive">Exclusive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Collab</label>
              <select
                value={formData.collab}
                onChange={(e) => setFormData({ ...formData, collab: e.target.value as 'Solo' | 'Collab' })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              >
                <option value="Solo">Solo</option>
                <option value="Collab">Collab</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Track['status'] })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              placeholder="electronic, remix, bootleg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              placeholder="auto-generated from title"
            />
          </div>

          {/* Show audio URL only for single tracks */}
          {!(formData.type === 'Album' || formData.type === 'EP') && (
            <div className="grid grid-cols-2 gap-4">
              <LinkInput
                label="Audio URL"
                name="audioUrl"
                type="audio"
                onChange={(url) => setFormData({ ...formData, audioUrl: url })}
                defaultValue={formData.audioUrl}
                placeholder="https://nextcloud.example.com/index.php/s/abc123"
              />
              <LinkInput
                label="Artwork URL"
                name="artworkUrl"
                type="image"
                onChange={(url) => setFormData({ ...formData, artworkUrl: url })}
                defaultValue={formData.artworkUrl}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {/* Show artwork URL for album/EP */}
          {(formData.type === 'Album' || formData.type === 'EP') && (
            <div>
              <LinkInput
                label="Artwork URL (Album/EP Cover)"
                name="artworkUrl"
                type="image"
                onChange={(url) => setFormData({ ...formData, artworkUrl: url })}
                defaultValue={formData.artworkUrl}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {/* Tracklist section for Album/EP */}
          {(formData.type === 'Album' || formData.type === 'EP') && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/60">Tracks</label>
                  <button
                    type="button"
                    onClick={addTrackToList}
                    className="px-3 py-1 bg-white/[0.10] hover:bg-white/[0.15] text-white/70 text-sm rounded transition-all"
                  >
                    + Add Track
                  </button>
                </div>
                <p className="text-xs text-red-400/60">Album/EP requires at least one track with title and audio URL</p>
              </div>

              <div className="space-y-3 bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
                {tracklist.length === 0 ? (
                  <p className="text-white/40 text-sm">No tracks added yet</p>
                ) : (
                  tracklist.map((item, index) => (
                    <div key={item.id} className="space-y-2 p-3 bg-white/[0.05] rounded border border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-white/40">Track {index + 1}</label>
                        <button
                          type="button"
                          onClick={() => removeTrackFromList(item.id)}
                          className="text-red-400 hover:text-red-300 text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Track Title"
                        value={item.title}
                        onChange={(e) => updateTrackInList(item.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.08] rounded text-white text-sm"
                      />
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Audio URL"
                          value={item.audioUrl}
                          onChange={(e) => {
                            const url = e.target.value;
                            updateTrackInList(item.id, 'audioUrl', url);
                          }}
                          className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.08] rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-white/60">Featured Track</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-white/40 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                saving ||
                ((formData.type === 'Album' || formData.type === 'EP') &&
                  (tracklist.length === 0 || tracklist.some((t) => !t.title || !t.audioUrl)))
              }
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : isEditing
                ? 'Update Track'
                : (formData.type === 'Album' || formData.type === 'EP')
                ? `Create ${formData.type}`
                : 'Create Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TracksPage;
