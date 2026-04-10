import React, { useEffect, useRef } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { setCurrentTrack, getIsPlaying, getCurrentTrack } from './GlobalAudioPlayer';
import TrackListItem from './TrackListItem';

interface AlbumTrack {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  audioUrl?: string;
  coverArt?: string;
  trackNumber?: number;
  bpm?: number;
  key?: string;
}

interface AlbumModalProps {
  album: {
    name: string;
    type: 'Album' | 'EP';
    artwork: string;
    artist: string;
    year?: number;
    tracks: AlbumTrack[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlbumModal({ album, isOpen, onClose }: AlbumModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !album) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-full text-white/60 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
            {/* Album Cover */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src={album.artwork}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Album Meta */}
              <div className="mt-6 space-y-2">
                <div className="inline-block px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  {album.type}
                </div>
                {album.year && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">Year</span>
                    <span className="text-white font-bold">{album.year}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Album Details & Tracklist */}
            <div className="flex-1 flex flex-col">
              <div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                  {album.name}
                </h2>
                <p className="text-white/60 text-base mb-6">{album.artist}</p>

                <div className="mb-6">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-4">
                    {album.tracks.length} Track{album.tracks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Tracks List */}
              <div className="space-y-1 mt-6">
                {album.tracks.map((track, index) => (
                  <TrackListItem
                    key={track.id}
                    track={{
                      ...track,
                      trackNumber: track.trackNumber || index + 1,
                    }}
                    onClickTrack={() => {
                      // Open track detail if needed
                    }}
                    onTogglePlay={() => {
                      setCurrentTrack(track, album.tracks);
                    }}
                    isAlbumTrack={true}
                    trackNumber={track.trackNumber || index + 1}
                    showMetadata={true}
                    showType={false}
                    showCover={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
