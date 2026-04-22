import React, { useRef, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX } from 'lucide-react';
import { formatDuration } from '../lib/utils/audioMetadata';
import {
  togglePlayPause,
  getCurrentTrack,
  getIsPlaying,
  toggleShuffle,
  getIsShuffle,
  getCurrentIndex,
  getQueue
} from './GlobalAudioPlayer';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  currentTime: number;
  duration: number;
  onProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  repeat: 'off' | 'all' | 'one';
  onRepeatToggle: () => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export default function PlayerModal({
  isOpen,
  onClose,
  audioRef,
  isPlaying,
  onPlayPauseClick,
  currentTime,
  duration,
  onProgressChange,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  repeat,
  onRepeatToggle,
  onPreviousClick,
  onNextClick,
}: PlayerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const track = getCurrentTrack();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen || !track) return null;

  const isShuffle = getIsShuffle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-black/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/[0.08] hover:bg-white/[0.15] rounded-full transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="pt-16 pb-8 px-6">
          {/* Cover Art */}
          {track.coverArt && (
            <div className="mb-8 aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img
                src={track.coverArt}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Track Info */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-white mb-2 truncate">{track.title}</h2>
            <p className="text-white/60 text-sm mb-2 truncate">{track.artist}</p>
            <p className="text-xs text-white/40">{formatDuration(duration)}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={onProgressChange}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                WebkitAppearance: 'none',
              }}
            />
            <style>{`
              input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                background: linear-gradient(to right, rgb(220, 38, 38) 0%, rgb(220, 38, 38) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255, 255, 255, 0.2) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255, 255, 255, 0.2) 100%);
                border-radius: 999px;
                width: 100%;
                height: 4px;
                cursor: pointer;
              }
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
              input[type="range"]::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
            `}</style>
            <div className="flex justify-between text-xs text-white/40 mt-2">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              className={`p-2 rounded-full transition-all ${isShuffle ? 'bg-red-600' : 'bg-white/[0.08] hover:bg-white/[0.15]'}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={20} className={isShuffle ? 'text-white' : 'text-white/70'} />
            </button>

            <button
              className="p-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-all"
              onClick={onPreviousClick}
              title="Previous"
            >
              <SkipBack size={20} className="text-white/70" />
            </button>

            <button
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
              onClick={onPlayPauseClick}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" fill="currentColor" />
              ) : (
                <Play size={32} className="text-white" fill="currentColor" />
              )}
            </button>

            <button
              className="p-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] transition-all"
              onClick={onNextClick}
              title="Next"
            >
              <SkipForward size={20} className="text-white/70" />
            </button>

            <button
              className={`p-2 rounded-full transition-all ${repeat !== 'off' ? 'bg-red-600' : 'bg-white/[0.08] hover:bg-white/[0.15]'}`}
              onClick={onRepeatToggle}
              title={repeat === 'off' ? 'Repeat off' : repeat === 'all' ? 'Repeat all' : 'Repeat 1x'}
              style={{ position: 'relative' }}
            >
              <Repeat size={20} className={repeat !== 'off' ? 'text-white' : 'text-white/70'} />
              {repeat === 'one' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    color: 'rgb(220, 38, 38)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    lineHeight: '1',
                  }}
                >
                  1
                </span>
              )}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4 px-2">
            <button
              className={`p-2 rounded-full transition-all ${isMuted ? 'bg-red-600' : 'bg-white/[0.08] hover:bg-white/[0.15]'}`}
              onClick={onMuteToggle}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} className="text-white/70" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              disabled={isMuted}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              title="Volume"
              style={{ opacity: isMuted ? 0.5 : 1, cursor: isMuted ? 'not-allowed' : 'pointer' }}
            />
          </div>

          {/* Queue Info */}
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <p className="text-xs text-white/40 text-center">
              {getQueue().length > 0 ? `Track ${(getCurrentIndex() || 0) + 1} of ${getQueue().length}` : 'No queue'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
