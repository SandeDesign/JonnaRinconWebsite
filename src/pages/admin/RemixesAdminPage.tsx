import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LinkInput from '../../components/admin/LinkInput';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Demo remixes
const demoRemixes = [
  {
    id: 'r1',
    artist: 'Jonna Rincon',
    title: 'Original Track',
    remixType: 'Remix',
    year: 2023,
    genre: 'Electronic',
    duration: '5:32',
    audioUrl: '',
    coverArtUrl: '',
  },
  {
    id: 'r2',
    artist: 'Jonna Rincon',
    title: 'Popular Hit',
    remixType: 'Edit',
    year: 2023,
    genre: 'Hip-Hop',
    duration: '4:15',
    audioUrl: '',
    coverArtUrl: '',
  },
];

const RemixesAdminPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingRemix, setEditingRemix] = useState<any | null>(null);
  const [remixes, setRemixes] = useState(demoRemixes);
  const [audioUrl, setAudioUrl] = useState('');
  const [coverArtUrl, setCoverArtUrl] = useState('');

  const handleCreate = () => {
    setEditingRemix(null);
    setAudioUrl('');
    setCoverArtUrl('');
    setShowModal(true);
  };

  const handleEdit = (remix: any) => {
    setEditingRemix(remix);
    setAudioUrl(remix.audioUrl || '');
    setCoverArtUrl(remix.coverArtUrl || '');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this remix?')) return;
    setRemixes(remixes.filter(r => r.id !== id));
  };

  const handleSave = (remix: any) => {
    const remixData = {
      ...remix,
      audioUrl,
      coverArtUrl,
    };

    if (editingRemix) {
      setRemixes(remixes.map(r => r.id === remix.id ? remixData : r));
    } else {
      setRemixes([...remixes, { ...remixData, id: 'r' + Date.now() }]);
    }

    // Reset states
    setAudioUrl('');
    setCoverArtUrl('');
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Remixes Management</h1>
            <p className="text-white/40 mt-2">Manage remixes, edits & bootlegs</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add Remix</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Remixes</p>
            <p className="text-2xl font-bold text-white mt-1">{remixes.length}</p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Remixes</p>
            <p className="text-2xl font-bold text-white mt-1">
              {remixes.filter(r => r.remixType === 'Remix').length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Edits</p>
            <p className="text-2xl font-bold text-white mt-1">
              {remixes.filter(r => r.remixType === 'Edit').length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Bootlegs</p>
            <p className="text-2xl font-bold text-white mt-1">
              {remixes.filter(r => r.remixType === 'Bootleg').length}
            </p>
          </div>
        </div>

        {/* Remixes List */}
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/[0.08] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Artist</th>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Year</th>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Audio</th>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Cover</th>
                <th className="px-6 py-4 text-left text-white text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {remixes.map(remix => (
                <tr key={remix.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white">{remix.artist}</td>
                  <td className="px-6 py-4 text-white">{remix.title}</td>
                  <td className="px-6 py-4 text-white/60">{remix.remixType}</td>
                  <td className="px-6 py-4 text-white/60">{remix.year}</td>
                  <td className="px-6 py-4 text-white/60">
                    {remix.audioUrl ? <span className="text-emerald-400">✓</span> : <span className="text-white/30">-</span>}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {remix.coverArtUrl ? <span className="text-emerald-400">✓</span> : <span className="text-white/30">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(remix)}
                        className="p-2 hover:bg-white/[0.08] rounded transition text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(remix.id)}
                        className="p-2 hover:bg-white/[0.08] rounded transition text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-white/[0.1] my-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingRemix ? 'Edit Remix' : 'Add Remix'}
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  id: editingRemix?.id || 'r' + Date.now(),
                  artist: formData.get('artist') as string,
                  title: formData.get('title') as string,
                  remixType: formData.get('remixType') as string,
                  year: parseInt(formData.get('year') as string),
                  genre: formData.get('genre') as string,
                  duration: formData.get('duration') as string,
                });
              }}>
                <input
                  type="text"
                  name="artist"
                  placeholder="Artist"
                  defaultValue={editingRemix?.artist || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                  required
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  defaultValue={editingRemix?.title || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                  required
                />
                <select
                  name="remixType"
                  defaultValue={editingRemix?.remixType || 'Remix'}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white mb-4"
                >
                  <option value="Remix">Remix</option>
                  <option value="Edit">Edit</option>
                  <option value="Bootleg">Bootleg</option>
                </select>
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  defaultValue={editingRemix?.year || new Date().getFullYear()}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                  required
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre (e.g., Electronic, Hip-Hop)"
                  defaultValue={editingRemix?.genre || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 5:32)"
                  defaultValue={editingRemix?.duration || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-6"
                />

                {/* URL Inputs */}
                <LinkInput
                  label="Audio URL"
                  name="audioUrl"
                  type="audio"
                  onChange={setAudioUrl}
                  defaultValue={editingRemix?.audioUrl}
                  placeholder="https://nextcloud.example.com/index.php/s/abc123"
                />

                <LinkInput
                  label="Cover Art URL"
                  name="coverArtUrl"
                  type="image"
                  onChange={setCoverArtUrl}
                  defaultValue={editingRemix?.coverArtUrl}
                  placeholder="https://nextcloud.example.com/index.php/s/xyz789"
                />

                <div className="flex gap-2 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-semibold transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white/[0.08] hover:bg-white/[0.12] text-white py-2 rounded font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RemixesAdminPage;
