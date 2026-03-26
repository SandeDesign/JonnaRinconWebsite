import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LinkInput from '../../components/admin/LinkInput';
import { useTracks } from '../../hooks/useTracks';
import { trackService } from '../../lib/firebase/services';
import { Track } from '../../lib/firebase/types';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';

const TracksPage: React.FC = () => {
  const { tracks, loading } = useTracks();
  const [showModal, setShowModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

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

  const togglePlay = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
    }
  };

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

        <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.06]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Track</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Genre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">BPM / Key</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">Plays</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                      Loading tracks...
                    </td>
                  </tr>
                ) : tracks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                      No tracks yet. Create your first track!
                    </td>
                  </tr>
                ) : (
                  tracks.map((track) => (
                    <tr key={track.id} className="hover:bg-white/[0.06]">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={track.artworkUrl}
                            alt={track.title}
                            className="w-12 h-12 rounded object-cover"
                          />
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
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => togglePlay(track.id)}
                            className="p-2 text-white/40 hover:text-purple-400 transition-colors"
                            title="Play preview"
                          >
                            {currentlyPlaying === track.id ? <Pause size={18} /> : <Play size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(track)}
                            className="p-2 text-white/40 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(track.id)}
                            className="p-2 text-white/40 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

const TrackFormModal: React.FC<TrackFormModalProps> = ({ track, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: track?.title || '',
    artist: track?.artist || 'Jonna Rincon',
    bpm: track?.bpm || 120,
    key: track?.key || '',
    genre: track?.genre || '',
    tags: track?.tags?.join(', ') || '',
    audioUrl: track?.audioUrl || '',
    artworkUrl: track?.artworkUrl || '',
    slug: track?.slug || '',
    status: track?.status || 'draft',
    featured: track?.featured || false,
    basicPrice: track?.licenses?.basic?.price || 9,
    premiumPrice: track?.licenses?.premium?.price || 19,
    exclusivePrice: track?.licenses?.exclusive?.price || 99,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const trackData: any = {
        title: formData.title,
        artist: formData.artist,
        bpm: formData.bpm,
        key: formData.key,
        genre: formData.genre,
        tags: formData.tags.split(',').map((t) => t.trim()),
        audioUrl: formData.audioUrl,
        artworkUrl: formData.artworkUrl,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        status: formData.status,
        featured: formData.featured,
        licenses: {
          basic: {
            type: 'basic' as const,
            price: formData.basicPrice,
            features: ['MP3 Download', 'Non-exclusive rights', 'Personal use'],
            downloads: 1,
            streams: 10000,
            videos: 1,
            distribution: false,
          },
          premium: {
            type: 'premium' as const,
            price: formData.premiumPrice,
            features: ['WAV + MP3', 'Non-exclusive rights', 'Commercial use', 'Unlimited streams'],
            downloads: 5,
            streams: 1000000,
            videos: 5,
            distribution: true,
          },
          exclusive: {
            type: 'exclusive' as const,
            price: formData.exclusivePrice,
            features: ['All files', 'Exclusive rights', 'Full ownership', 'Unlimited use'],
            downloads: -1,
            streams: -1,
            videos: -1,
            distribution: true,
          },
        },
      };

      if (track) {
        await trackService.updateTrack(track.id, trackData);
        alert('Track updated successfully');
      } else {
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white/[0.10] backdrop-blur-2xl border border-white/[0.10] rounded-2xl max-w-2xl w-full my-8">
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
              <label className="block text-sm font-medium text-white/60 mb-2">BPM</label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Key</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                required
              />
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Basic Price (€)</label>
              <input
                type="number"
                value={formData.basicPrice}
                onChange={(e) => setFormData({ ...formData, basicPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Premium Price (€)</label>
              <input
                type="number"
                value={formData.premiumPrice}
                onChange={(e) => setFormData({ ...formData, premiumPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Exclusive Price (€)</label>
              <input
                type="number"
                value={formData.exclusivePrice}
                onChange={(e) => setFormData({ ...formData, exclusivePrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              />
            </div>
          </div>

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
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : track ? 'Update Track' : 'Create Track'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TracksPage;
