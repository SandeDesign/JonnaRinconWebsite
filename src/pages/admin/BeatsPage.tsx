import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LinkInput from '../../components/admin/LinkInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useBeats } from '../../hooks/useBeats';
import { beatService } from '../../lib/firebase/services';
import { Beat } from '../../lib/firebase/types';
import { Plus, Edit, Trash2, Play, Pause, ArrowUp, ArrowDown } from 'lucide-react';

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

  const moveBeatUp = async (beatId: string) => {
    const index = beats.findIndex(b => b.id === beatId);
    if (index > 0) {
      const beat = beats[index];
      const prevBeat = beats[index - 1];

      // Swap sortOrder values
      const tempSort = beat.sortOrder ?? index;
      await beatService.updateBeat(beat.id, { sortOrder: prevBeat.sortOrder ?? (index - 1) });
      await beatService.updateBeat(prevBeat.id, { sortOrder: tempSort });
    }
  };

  const moveBeatDown = async (beatId: string) => {
    const index = beats.findIndex(b => b.id === beatId);
    if (index < beats.length - 1) {
      const beat = beats[index];
      const nextBeat = beats[index + 1];

      // Swap sortOrder values
      const tempSort = beat.sortOrder ?? index;
      await beatService.updateBeat(beat.id, { sortOrder: nextBeat.sortOrder ?? (index + 1) });
      await beatService.updateBeat(nextBeat.id, { sortOrder: tempSort });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Beats Management</h1>
            <p className="text-white/40 mt-2">Manage your beat catalog</p>
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
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Beats</p>
            <p className="text-2xl font-bold text-white mt-1">{beats.length}</p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Published</p>
            <p className="text-2xl font-bold text-white mt-1">
              {beats.filter((b) => b.status === 'published').length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Featured</p>
            <p className="text-2xl font-bold text-white mt-1">
              {beats.filter((b) => b.featured).length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Plays</p>
            <p className="text-2xl font-bold text-white mt-1">
              {beats.reduce((sum, b) => sum + b.plays, 0)}
            </p>
          </div>
        </div>

        {/* Beats Table */}
        <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.06]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">
                    Beat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">
                    Genre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">
                    BPM / Key
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/60">
                    Plays
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12">
                      <LoadingSpinner text="Loading beats..." />
                    </td>
                  </tr>
                ) : beats.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                      No beats yet. Create your first beat!
                    </td>
                  </tr>
                ) : (
                  beats.map((beat) => (
                    <tr key={beat.id} className="hover:bg-white/[0.06]">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={beat.artworkUrl}
                            alt={beat.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-white">{beat.title}</p>
                            <p className="text-sm text-white/40">{beat.artist}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                          {beat.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {beat.bpm} BPM / {beat.key}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            beat.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : beat.status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-white/[0.06] text-white/40'
                          }`}
                        >
                          {beat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm capitalize ${
                            beat.beatType === 'free'
                              ? 'bg-green-500/20 text-green-400'
                              : beat.beatType === 'exclusive'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {beat.beatType || 'free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">{beat.plays}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => moveBeatUp(beat.id)}
                            disabled={beats.findIndex(b => b.id === beat.id) === 0}
                            className="p-2 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                            title="Move up"
                          >
                            <ArrowUp size={18} />
                          </button>
                          <button
                            onClick={() => moveBeatDown(beat.id)}
                            disabled={beats.findIndex(b => b.id === beat.id) === beats.length - 1}
                            className="p-2 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
                            title="Move down"
                          >
                            <ArrowDown size={18} />
                          </button>
                          <button
                            onClick={() => togglePlay(beat.id)}
                            className="p-2 text-white/40 hover:text-purple-400 transition-colors"
                            title="Play preview"
                          >
                            {currentlyPlaying === beat.id ? <Pause size={18} /> : <Play size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(beat)}
                            className="p-2 text-white/40 hover:text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(beat.id)}
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
    stemsUrl: beat?.stemsUrl || '',
    slug: beat?.slug || '',
    status: beat?.status || 'draft',
    beatType: beat?.beatType || 'free',
    featured: beat?.featured || false,
    exclusivePrice: beat?.licenses?.exclusive?.price || 199,
  });
  const [saving, setSaving] = useState(false);

  // Update form data when beat prop changes (for editing)
  React.useEffect(() => {
    if (beat) {
      setFormData({
        title: beat.title || '',
        artist: beat.artist || 'Jonna Rincon',
        bpm: beat.bpm || 120,
        key: beat.key || '',
        genre: beat.genre || '',
        tags: beat.tags?.join(', ') || '',
        audioUrl: beat.audioUrl || '',
        artworkUrl: beat.artworkUrl || '',
        stemsUrl: beat.stemsUrl || '',
        slug: beat.slug || '',
        status: beat.status || 'draft',
        beatType: beat.beatType || 'free',
        featured: beat.featured || false,
        exclusivePrice: beat.licenses?.exclusive?.price || 199,
      });
    }
  }, [beat]);

  // Parse beat filename and auto-fill fields
  const parseAudioUrl = (url: string) => {
    try {
      // Extract filename from URL (everything after the last /)
      const filename = url.split('/').pop() || '';
      // Remove file extension
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

      // Pattern: <titel> - <bpm> - <key> - <genre,genre2> - prod by <artiest>
      // Example: GUITTARA - 118 BPM - A Minor - Urban, Rap - Prod by Jonna Rincon
      const regex = /^(.+?)\s*-\s*(\d+)\s*BPM\s*-\s*([A-Za-z#♭\s]+)\s*-\s*(.+?)\s*-\s*(?:prod|Prod)\s+by\s+(.+)$/i;
      const match = nameWithoutExt.match(regex);

      if (match) {
        const [, title, bpm, key, genres, artist] = match;

        return {
          title: title.trim(),
          bpm: parseInt(bpm, 10),
          key: key.trim(),
          genre: genres.trim(), // Keep all genres
          artist: artist.trim(),
          tags: genres, // Use all genres as tags
        };
      }
    } catch (error) {
      console.error('Error parsing audio URL:', error);
    }

    return null;
  };

  const handleAudioUrlChange = (url: string) => {
    setFormData({ ...formData, audioUrl: url });

    // Auto-fill fields if parsing succeeds
    const parsed = parseAudioUrl(url);
    if (parsed) {
      setFormData(prev => ({
        ...prev,
        title: parsed.title,
        bpm: parsed.bpm,
        key: parsed.key,
        genre: parsed.genre,
        artist: parsed.artist,
        tags: parsed.tags,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Ensure exclusive price is a valid number
      const exclusivePrice = typeof formData.exclusivePrice === 'string'
        ? parseFloat(formData.exclusivePrice)
        : formData.exclusivePrice;

      if (isNaN(exclusivePrice) || exclusivePrice < 0) {
        alert('Please enter a valid exclusive price');
        setSaving(false);
        return;
      }

      const beatData: any = {
        title: formData.title,
        artist: formData.artist,
        bpm: formData.bpm,
        key: formData.key,
        genre: formData.genre,
        tags: formData.tags.split(',').map((t) => t.trim()),
        audioUrl: formData.audioUrl,
        artworkUrl: formData.artworkUrl,
        stemsUrl: formData.stemsUrl || undefined,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        status: formData.status,
        beatType: formData.beatType,
        featured: formData.featured,
        trending: false,
      };

      // Always include the complete licenses object with exclusive license
      beatData.licenses = {
        exclusive: {
          type: 'exclusive' as const,
          price: exclusivePrice,
          features: ['All files', 'Exclusive rights', 'Full ownership', 'Unlimited use'],
          downloads: -1,
          streams: -1,
          videos: -1,
          distribution: true,
        },
      };

      if (beat) {
        // For updates, merge with existing licenses to preserve other license data
        const existingBeat = beat as any;
        if (existingBeat.licenses && Object.keys(existingBeat.licenses).length > 0) {
          beatData.licenses = {
            ...existingBeat.licenses,
            exclusive: beatData.licenses.exclusive,
          };
        }

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white/[0.10] backdrop-blur-2xl border border-white/[0.10] rounded-2xl max-w-2xl w-full my-auto max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-white/[0.08] bg-white/[0.10] flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">
            {beat ? 'Edit Beat' : 'Add New Beat'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Beat['status'] })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Beat Type</label>
              <select
                value={formData.beatType}
                onChange={(e) => setFormData({ ...formData, beatType: e.target.value as any })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              >
                <option value="free">Free</option>
                <option value="exclusive">Exclusive</option>
              </select>
              <p className="text-xs text-white/40 mt-1">
                Classify this beat (free beats have no cost, exclusive beats require purchase)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
              placeholder="trap, dark, atmospheric"
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

          {/* Audio and Artwork URLs */}
          <div className="grid grid-cols-2 gap-4">
            <LinkInput
              label="Audio URL"
              name="audioUrl"
              type="audio"
              onChange={handleAudioUrlChange}
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

          <div>
            <LinkInput
              label="Stems URL (Zip File)"
              name="stemsUrl"
              type="audio"
              onChange={(url) => setFormData({ ...formData, stemsUrl: url })}
              defaultValue={formData.stemsUrl}
              placeholder="https://nextcloud.example.com/index.php/s/xyz789"
            />
            <p className="text-xs text-white/30 mt-1">Link to a zip file containing the beat stems (optional)</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Exclusive License Price (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.exclusivePrice}
                onChange={(e) => setFormData({ ...formData, exclusivePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-white/[0.06] border border-white/[0.08] rounded-lg text-white"
                placeholder="199"
                required
              />
              <p className="text-xs text-white/40 mt-1">Price for exclusive license (full ownership, unlimited rights)</p>
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
              <span className="text-sm text-white/60">Featured Beat</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/[0.06] bg-white/[0.10] -mx-6 px-6 py-4 flex-shrink-0">
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
              {saving ? 'Saving...' : beat ? 'Update Beat' : 'Create Beat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeatsPage;
