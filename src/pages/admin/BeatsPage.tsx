import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useBeats } from '../../hooks/useBeats';
import { beatService, fileUploadService } from '../../lib/firebase/services';
import { Beat } from '../../lib/firebase/types';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';

const BeatsPage: React.FC = () => {
  const { beats, loading } = useBeats();
  const [showModal, setShowModal] = useState(false);
  const [editingBeat, setEditingBeat] = useState<Beat | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingBeat(null);
    setShowModal(true);
  };

  const handleEdit = (beat: Beat) => {
    setEditingBeat(beat);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this beat?')) return;

    try {
      await beatService.deleteBeat(id);
      alert('Beat deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const togglePlay = (beatId: string) => {
    if (currentlyPlaying === beatId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(beatId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Beats Management</h1>
            <p className="text-gray-400 mt-2">Manage your beat catalog</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Beat</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Beats</p>
            <p className="text-2xl font-bold text-white mt-1">{beats.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Published</p>
            <p className="text-2xl font-bold text-white mt-1">
              {beats.filter((b) => b.status === 'published').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Featured</p>
            <p className="text-2xl font-bold text-white mt-1">
              {beats.filter((b) => b.featured).length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Plays</p>
            <p className="text-2xl font-bold text-white mt-1">
              {beats.reduce((sum, b) => sum + b.plays, 0)}
            </p>
          </div>
        </div>

        {/* Beats Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Beat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Genre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    BPM / Key
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Plays
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Loading beats...
                    </td>
                  </tr>
                ) : beats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No beats yet. Create your first beat!
                    </td>
                  </tr>
                ) : (
                  beats.map((beat) => (
                    <tr key={beat.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={beat.artworkUrl}
                            alt={beat.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-white">{beat.title}</p>
                            <p className="text-sm text-gray-400">{beat.artist}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                          {beat.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {beat.bpm} BPM / {beat.key}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            beat.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : beat.status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {beat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{beat.plays}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => togglePlay(beat.id)}
                            className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                            title="Play preview"
                          >
                            {currentlyPlaying === beat.id ? <Pause size={18} /> : <Play size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(beat)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(beat.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
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

      {/* Beat Form Modal */}
      {showModal && (
        <BeatFormModal
          beat={editingBeat}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            setEditingBeat(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

interface BeatFormModalProps {
  beat: Beat | null;
  onClose: () => void;
  onSave: () => void;
}

const BeatFormModal: React.FC<BeatFormModalProps> = ({ beat, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: beat?.title || '',
    artist: beat?.artist || 'Jonna Rincon',
    bpm: beat?.bpm || 120,
    key: beat?.key || '',
    genre: beat?.genre || '',
    tags: beat?.tags?.join(', ') || '',
    audioUrl: beat?.audioUrl || '',
    artworkUrl: beat?.artworkUrl || '',
    slug: beat?.slug || '',
    status: beat?.status || 'draft',
    featured: beat?.featured || false,
    basicPrice: beat?.licenses?.basic?.price || 29,
    premiumPrice: beat?.licenses?.premium?.price || 49,
    exclusivePrice: beat?.licenses?.exclusive?.price || 199,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // @ts-ignore - Reserved for future file upload UI
  const handleFileUpload = async (
    file: File,
    type: 'audio' | 'image'
  ) => {
    setUploading(true);
    try {
      const response = await fileUploadService.uploadFile({
        file,
        type,
        folder: 'beats',
      });

      if (response.success && response.url) {
        if (type === 'audio') {
          setFormData({ ...formData, audioUrl: response.url });
        } else {
          setFormData({ ...formData, artworkUrl: response.url });
        }
      } else {
        alert(response.error || 'Upload failed');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const beatData: any = {
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
        trending: false,
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

      if (beat) {
        await beatService.updateBeat(beat.id, beatData);
        alert('Beat updated successfully');
      } else {
        await beatService.createBeat(beatData);
        alert('Beat created successfully');
      }

      onSave();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {beat ? 'Edit Beat' : 'Add New Beat'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">BPM</label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Key</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Beat['status'] })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="trap, dark, atmospheric"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="auto-generated from title"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Basic Price (€)</label>
              <input
                type="number"
                value={formData.basicPrice}
                onChange={(e) => setFormData({ ...formData, basicPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Premium Price (€)</label>
              <input
                type="number"
                value={formData.premiumPrice}
                onChange={(e) => setFormData({ ...formData, premiumPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Exclusive Price (€)</label>
              <input
                type="number"
                value={formData.exclusivePrice}
                onChange={(e) => setFormData({ ...formData, exclusivePrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
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
              <span className="text-sm text-gray-300">Featured Beat</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : beat ? 'Update Beat' : 'Create Beat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeatsPage;
