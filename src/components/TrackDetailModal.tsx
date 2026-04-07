import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, ShoppingCart, Download } from 'lucide-react';
import { getCurrentTrack } from './GlobalAudioPlayer';

interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  coverArt?: string;
  genre?: string;
  duration?: string;
  year?: number;
  type?: string;
  bpm?: number;
  price?: number;
  isFree?: boolean;
  licenses?: { exclusive?: { price: number } };
}

interface TrackDetailModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  isPlaying?: boolean;
  onPlay?: (track: Track) => void;
  onBuy?: (track: Track) => void;
  cartItems?: any[];
}

export default function TrackDetailModal({
  track,
  isOpen,
  onClose,
  isPlaying = false,
  onPlay,
  onBuy,
  cartItems = [],
}: TrackDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isHoveringCover, setIsHoveringCover] = useState(false);

  // Handle play button click on cover
  const handleCoverClick = () => {
    if (onPlay && track) {
      onPlay(track);
    }
  };

  // Check if track is already in cart
  const isInCart = track ? cartItems.some(item => item.id === track.id) : false;

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

  if (!isOpen || !track) return null;

  const isCurrentTrackPlaying = getCurrentTrack()?.id === track.id;

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
          {/* Artwork */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setIsHoveringCover(true)}
              onMouseLeave={() => setIsHoveringCover(false)}
              onClick={handleCoverClick}
            >
              <img
                src={track.coverArt || '/JEIGHTENESIS.jpg'}
                alt={track.title}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isHoveringCover ? 'scale-105 brightness-75' : 'scale-100 brightness-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Play Button Overlay - appears on hover */}
              {onPlay && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCoverClick();
                  }}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    isHoveringCover ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    {isCurrentTrackPlaying ? (
                      <Pause className="w-7 h-7 text-red-500 ml-0" fill="currentColor" />
                    ) : (
                      <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                    )}
                  </div>
                </button>
              )}
            </div>

            {/* Track Meta Info */}
            <div className="mt-4 space-y-2">
              {track.year && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Year</span>
                  <span className="text-white font-bold">{track.year}</span>
                </div>
              )}
              {track.genre && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Genre</span>
                  <span className="text-white font-bold">{track.genre}</span>
                </div>
              )}
              {track.type && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Type</span>
                  <span className="text-white font-bold">{track.type}</span>
                </div>
              )}
              {track.bpm && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">BPM</span>
                  <span className="text-white font-bold">{track.bpm}</span>
                </div>
              )}
              {track.price && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Price</span>
                  <span className="text-red-400 font-bold">€{track.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-tight">
                {track.title}
              </h2>
              <p className="text-white/40 text-sm md:text-base mb-6">{track.artist}</p>

              {/* Duration */}
              {track.duration && (
                <div className="mb-6">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Duration</p>
                  <p className="text-white text-sm">{track.duration}</p>
                </div>
              )}

              {/* Message */}
              <div className="p-4 bg-white/[0.06] border border-white/[0.1] rounded-2xl mb-6">
                <p className="text-white/80 text-sm leading-relaxed">
                  🎵 <span className="text-red-400 font-bold">Free · Ad-Free · High Quality</span>
                </p>
                <p className="text-white/60 text-xs mt-2">
                  Listen to original tracks and support the artist directly on their own platform
                </p>
              </div>
            </div>

            {/* Download Button - if track has audioUrl */}
            {track.audioUrl && (
              <a
                href={track.audioUrl}
                download
                className="w-full px-6 py-3 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 mb-3 bg-red-600/80 hover:bg-red-600 hover:scale-[1.02] active:scale-95"
              >
                <Download size={18} />
                <span>Download Track</span>
              </a>
            )}

            {/* Buy Button - for non-free tracks with a price */}
            {onBuy && track && !track.isFree && track.licenses?.exclusive?.price && (
              <button
                onClick={() => !isInCart && onBuy(track)}
                disabled={isInCart}
                className={`w-full px-6 py-3 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 mb-3 ${
                  isInCart
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-[1.02] active:scale-95'
                }`}
              >
                <ShoppingCart size={18} />
                <span>
                  {isInCart ? 'In Cart' : `Add to Cart — €${track.licenses.exclusive.price.toFixed(2)}`}
                </span>
              </button>
            )}

            {/* Close Button for Mobile */}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/[0.1] hover:bg-white/[0.15] text-white rounded-xl font-bold uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
