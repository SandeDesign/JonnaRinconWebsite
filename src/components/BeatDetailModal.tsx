import React, { useEffect, useRef } from 'react';
import { X, ShoppingCart, Play, Pause } from 'lucide-react';
import { Beat } from '../lib/firebase/types';
import { getCurrentTrack } from './GlobalAudioPlayer';

interface BeatDetailModalProps {
  beat: Beat | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (beat: Beat) => void;
  isPlaying: boolean;
  onPlay: (beat: Beat) => void;
  cartCount: number;
}

export default function BeatDetailModal({
  beat,
  isOpen,
  onClose,
  onAddToCart,
  isPlaying,
  onPlay,
  cartCount,
}: BeatDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen || !beat) return null;

  const isCurrentBeatPlaying = getCurrentTrack()?.id === beat.id;
  const basicLicense = beat.licenses.basic;

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
        className="relative w-full max-w-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-full text-white/60 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
          {/* Artwork */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <img
                src={beat.artworkUrl || '/JEIGHTENESIS.jpg'}
                alt={beat.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Play Button Overlay */}
              <button
                onClick={() => onPlay(beat)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isCurrentBeatPlaying ? (
                    <Pause className="w-7 h-7 text-red-500 ml-0" fill="currentColor" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                  )}
                </div>
              </button>
            </div>

            {/* Beat Meta Info */}
            <div className="mt-4 space-y-2">
              {beat.bpm && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">BPM</span>
                  <span className="text-white font-bold">{beat.bpm}</span>
                </div>
              )}
              {beat.key && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Key</span>
                  <span className="text-white font-bold">{beat.key}</span>
                </div>
              )}
              {beat.genre && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Genre</span>
                  <span className="text-white font-bold">{beat.genre}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-tight">
                {beat.title}
              </h2>
              <p className="text-white/40 text-sm md:text-base mb-6">{beat.artist}</p>

              {/* Description */}
              {beat.description && (
                <p className="text-white/30 text-sm leading-relaxed mb-6">
                  {beat.description}
                </p>
              )}

              {/* Tags */}
              {beat.tags && beat.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {beat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-white/[0.08] border border-white/[0.1] rounded-full text-xs text-white/60 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* License Info - Hidden for now, code preserved for future */}
              {false && basicLicense && (
                <div className="mb-6 space-y-2">
                  <p className="text-white/40 text-xs uppercase tracking-wider">License Type</p>
                  <p className="text-white text-sm">{basicLicense.type}</p>
                  {basicLicense.useRights && (
                    <p className="text-white/50 text-xs">{basicLicense.useRights}</p>
                  )}
                </div>
              )}
            </div>

            {/* Stats - Only show plays */}
            <div className="grid grid-cols-1 gap-3 mb-6 pt-6 border-t border-white/[0.1]">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Plays</p>
                <p className="text-white text-lg font-bold">{beat.plays?.toLocaleString() || '0'}</p>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Price</p>
                <p className="text-3xl md:text-4xl font-black text-red-500">
                  €{basicLicense?.price.toFixed(2) || '0.00'}
                </p>
              </div>

              <button
                onClick={() => {
                  onAddToCart(beat);
                  onClose();
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all hover:scale-[1.05] flex items-center gap-2 whitespace-nowrap"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
