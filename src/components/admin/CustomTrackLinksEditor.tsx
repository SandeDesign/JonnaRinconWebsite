import React, { useState } from 'react';
import { CustomTrackLink } from '../../lib/firebase/types';
import { useTracks } from '../../hooks/useTracks';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface CustomTrackLinksEditorProps {
  customLinks: CustomTrackLink[];
  onLinksChange: (links: CustomTrackLink[]) => void;
}

type LinkMode = 'custom' | 'existing';

const CustomTrackLinksEditor: React.FC<CustomTrackLinksEditorProps> = ({
  customLinks,
  onLinksChange,
}) => {
  const { tracks } = useTracks({ status: 'published' });
  const [expandEditor, setExpandEditor] = useState(false);
  const [mode, setMode] = useState<LinkMode>('custom');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState('');

  const handleAddCustomLink = () => {
    if (!newTitle.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!newUrl.trim()) {
      alert('Please enter an audio URL');
      return;
    }

    const newLink: CustomTrackLink = {
      title: newTitle,
      audioUrl: newUrl,
    };

    onLinksChange([...customLinks, newLink]);
    setNewTitle('');
    setNewUrl('');
  };

  const handleAddExistingTrack = () => {
    if (!selectedTrackId) {
      alert('Please select a track');
      return;
    }

    const track = tracks.find((t) => t.id === selectedTrackId);
    if (!track) {
      alert('Track not found');
      return;
    }

    const newLink: CustomTrackLink = {
      title: track.title,
      audioUrl: track.audioUrl,
      trackId: track.id,
    };

    onLinksChange([...customLinks, newLink]);
    setSelectedTrackId('');
  };

  const handleRemoveLink = (index: number) => {
    onLinksChange(customLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <LinkIcon size={20} className="text-blue-400" />
          Custom Track Links
        </h3>
        <button
          onClick={() => setExpandEditor(!expandEditor)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
        >
          {expandEditor ? 'Hide' : 'Add Link'}
        </button>
      </div>

      {/* Editor */}
      {expandEditor && (
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg p-4 space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="linkMode"
                value="custom"
                checked={mode === 'custom'}
                onChange={(e) => setMode(e.target.value as LinkMode)}
                className="w-4 h-4"
              />
              <span className="text-white text-sm">Custom Link</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="linkMode"
                value="existing"
                checked={mode === 'existing'}
                onChange={(e) => setMode(e.target.value as LinkMode)}
                className="w-4 h-4"
              />
              <span className="text-white text-sm">Existing Track</span>
            </label>
          </div>

          {/* Custom Link Mode */}
          {mode === 'custom' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">
                  Link Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Spotify, SoundCloud, etc."
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">
                  Audio URL
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAddCustomLink}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                <Plus size={16} />
                Add Custom Link
              </button>
            </div>
          )}

          {/* Existing Track Mode */}
          {mode === 'existing' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">
                  Select Published Track
                </label>
                <select
                  value={selectedTrackId}
                  onChange={(e) => setSelectedTrackId(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose a track...</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.title} - {track.artist}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddExistingTrack}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                <Plus size={16} />
                Add Track Link
              </button>
            </div>
          )}
        </div>
      )}

      {/* Links Table */}
      {customLinks.length > 0 ? (
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/[0.08] border-b border-white/[0.08]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-white/60 w-12">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {customLinks.map((link, index) => (
                <tr key={index} className="hover:bg-white/[0.04] transition">
                  <td className="px-4 py-3 text-sm text-white">{link.title}</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    {link.trackId ? (
                      <span className="inline-block bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                        Existing Track
                      </span>
                    ) : (
                      <span className="inline-block bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
                        Custom Link
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemoveLink(index)}
                      className="inline-flex items-center justify-center p-1 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white/[0.06] border border-dashed border-white/[0.2] rounded-lg p-6 text-center">
          <p className="text-white/40 text-sm">No custom links added yet</p>
        </div>
      )}
    </div>
  );
};

export default CustomTrackLinksEditor;
