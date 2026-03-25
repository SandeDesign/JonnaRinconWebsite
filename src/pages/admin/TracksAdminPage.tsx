import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FileUploadInput from '../../components/admin/FileUploadInput';
import { Plus, Edit, Trash2 } from 'lucide-react';

// This is a placeholder for demo purposes
// In production, this would connect to Firebase for persistent storage
const demoTracks = [
  {
    id: '1',
    artist: 'Jonna Rincon',
    title: 'Sunrise Sessions Vol.1',
    type: 'Album',
    year: 2023,
    genre: 'Electronic',
    duration: '45:32',
    audioUrl: '',
    coverArtUrl: '',
  },
  {
    id: '2',
    artist: 'Jonna Rincon',
    title: 'Urban Beats Collection',
    type: 'Album',
    year: 2023,
    genre: 'Hip-Hop',
    duration: '38:15',
    audioUrl: '',
    coverArtUrl: '',
  },
];

const TracksAdminPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState<any | null>(null);
  const [tracks, setTracks] = useState(demoTracks);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);

  const handleCreate = () => {
    setEditingTrack(null);
    setAudioFile(null);
    setCoverArtFile(null);
    setShowModal(true);
  };

  const handleEdit = (track: any) => {
    setEditingTrack(track);
    setAudioFile(null);
    setCoverArtFile(null);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this track?')) return;
    setTracks(tracks.filter(t => t.id !== id));
  };

  const handleSave = (track: any) => {
    // Create file URLs for audio and cover art
    let audioUrl = track.audioUrl || '';
    let coverArtUrl = track.coverArtUrl || '';

    // If new audio file selected, create blob URL
    if (audioFile) {
      audioUrl = URL.createObjectURL(audioFile);
    }

    // If new cover art selected, create blob URL
    if (coverArtFile) {
      coverArtUrl = URL.createObjectURL(coverArtFile);
    }

    const trackData = {
      ...track,
      audioUrl,
      coverArtUrl,
    };

    if (editingTrack) {
      setTracks(tracks.map(t => t.id === track.id ? trackData : t));
    } else {
      setTracks([...tracks, { ...trackData, id: Date.now().toString() }]);
    }

    // Reset file states
    setAudioFile(null);
    setCoverArtFile(null);
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tracks Management</h1>
            <p className="text-white/40 mt-2">Manage your tracks, albums & EPs</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add Track</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Total Tracks</p>
            <p className="text-2xl font-bold text-white mt-1">{tracks.length}</p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">Albums</p>
            <p className="text-2xl font-bold text-white mt-1">
              {tracks.filter(t => t.type === 'Album').length}
            </p>
          </div>
          <div className="bg-white/[0.08] border border-white/[0.06] rounded-xl p-4">
            <p className="text-white/40 text-sm">EPs</p>
            <p className="text-2xl font-bold text-white mt-1">
              {tracks.filter(t => t.type === 'EP').length}
            </p>
          </div>
        </div>

        {/* Tracks List */}
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
              {tracks.map(track => (
                <tr key={track.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white">{track.artist}</td>
                  <td className="px-6 py-4 text-white">{track.title}</td>
                  <td className="px-6 py-4 text-white/60">{track.type}</td>
                  <td className="px-6 py-4 text-white/60">{track.year}</td>
                  <td className="px-6 py-4 text-white/60">
                    {track.audioUrl ? <span className="text-emerald-400">✓</span> : <span className="text-white/30">-</span>}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {track.coverArtUrl ? <span className="text-emerald-400">✓</span> : <span className="text-white/30">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(track)}
                        className="p-2 hover:bg-white/[0.08] rounded transition text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(track.id)}
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
                {editingTrack ? 'Edit Track' : 'Add Track'}
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  id: editingTrack?.id || Date.now().toString(),
                  artist: formData.get('artist') as string,
                  title: formData.get('title') as string,
                  type: formData.get('type') as string,
                  year: parseInt(formData.get('year') as string),
                  genre: formData.get('genre') as string,
                  duration: formData.get('duration') as string,
                  audioUrl: editingTrack?.audioUrl || '',
                  coverArtUrl: editingTrack?.coverArtUrl || '',
                });
              }}>
                <input
                  type="text"
                  name="artist"
                  placeholder="Artist"
                  defaultValue={editingTrack?.artist || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                  required
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  defaultValue={editingTrack?.title || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                  required
                />
                <select
                  name="type"
                  defaultValue={editingTrack?.type || 'Single'}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white mb-4"
                >
                  <option value="Album">Album</option>
                  <option value="EP">EP</option>
                  <option value="Single">Single</option>
                  <option value="Exclusive">Exclusive</option>
                </select>
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  defaultValue={editingTrack?.year || new Date().getFullYear()}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                  required
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre (e.g., Electronic, Hip-Hop)"
                  defaultValue={editingTrack?.genre || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-4"
                />
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration (e.g., 45:32)"
                  defaultValue={editingTrack?.duration || ''}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded px-4 py-2 text-white placeholder-white/40 mb-6"
                />

                {/* File Uploads */}
                <FileUploadInput
                  label="Audio File"
                  name="audioFile"
                  accept="audio/*"
                  onChange={setAudioFile}
                  defaultValue={editingTrack?.audioUrl}
                  maxSize={50 * 1024 * 1024}
                />

                <FileUploadInput
                  label="Cover Art"
                  name="coverArtFile"
                  accept="image/*"
                  onChange={setCoverArtFile}
                  defaultValue={editingTrack?.coverArtUrl}
                  maxSize={10 * 1024 * 1024}
                  preview
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

export default TracksAdminPage;
