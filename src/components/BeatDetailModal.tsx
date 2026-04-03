import React, { useEffect, useRef } from 'react';
import { X, ShoppingCart, Play, Pause, Music, Zap, Download, Globe, Disc3, TrendingUp, BadgeCheck } from 'lucide-react';
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
  const exclusiveLicense = beat.licenses?.exclusive;
  const hasStems = beat.stemsUrl && beat.stemsUrl.length > 0;

  // Premium features for exclusive license
  const premiumFeatures = [
    { icon: Globe, text: 'Commercial Use Rights' },
    { icon: Download, text: 'Full Ownership' },
    { icon: Music, text: 'Unlimited Downloads' },
    { icon: Zap, text: 'Exclusive License' },
    { icon: Disc3, text: 'Stems Available', available: hasStems },
    { icon: TrendingUp, text: 'Distribution Rights' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 max-h-screen overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] backdrop-blur-2xl border border-white/[0.2] rounded-3xl overflow-hidden shadow-2xl my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-white/[0.1] hover:bg-white/[0.2] rounded-full text-white/60 hover:text-white transition-all duration-200"
        >
          <X size={24} />
        </button>

        {/* Featured Badge */}
        {beat.featured && (
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30 rounded-full">
            <BadgeCheck size={14} className="text-purple-300" />
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">Featured</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Left Column - Artwork & Quick Stats */}
          <div className="md:col-span-2 bg-gradient-to-b from-white/[0.08] to-transparent p-8 border-b md:border-b-0 md:border-r border-white/[0.1]">
            {/* Artwork */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-8 group">
              <img
                src={beat.artworkUrl || '/JEIGHTENESIS.jpg'}
                alt={beat.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Play Button Overlay */}
              <button
                onClick={() => onPlay(beat)}
                className="absolute inset-0 flex items-center justify-center group/play"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center group-hover/play:scale-110 transition-transform duration-300">
                  {isCurrentBeatPlaying ? (
                    <Pause className="w-8 h-8 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  )}
                </div>
              </button>
            </div>

            {/* Beat Specs */}
            <div className="space-y-4">
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]">
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">Beat Specifications</p>
                <div className="space-y-3">
                  {beat.bpm && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-sm">BPM</span>
                      <span className="text-white font-bold text-lg">{beat.bpm}</span>
                    </div>
                  )}
                  {beat.key && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-sm">Key</span>
                      <span className="text-white font-bold text-lg">{beat.key}</span>
                    </div>
                  )}
                  {beat.genre && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-sm">Genre</span>
                      <span className="text-white font-bold text-lg capitalize">{beat.genre}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08] text-center">
                  <p className="text-white/40 text-xs uppercase tracking-wider">Plays</p>
                  <p className="text-white font-black text-xl mt-1">{beat.plays?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08] text-center">
                  <p className="text-white/40 text-xs uppercase tracking-wider">Type</p>
                  <p className="text-white font-black text-sm mt-1 uppercase">{beat.beatType || 'Free'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-3 p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight leading-tight">
                    {beat.title}
                  </h2>
                  <p className="text-lg text-white/60 font-semibold">By {beat.artist}</p>
                </div>
              </div>

              {/* License Type Badge */}
              {exclusiveLicense && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg mb-4">
                  <Zap size={16} className="text-orange-300" />
                  <span className="font-bold text-orange-200 uppercase text-xs tracking-wider">Exclusive License</span>
                </div>
              )}

              {/* Description */}
              {beat.description && (
                <p className="text-white/50 text-sm md:text-base leading-relaxed mt-4">
                  {beat.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {beat.tags && beat.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">Tags & Mood</p>
                <div className="flex flex-wrap gap-2">
                  {beat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-xs text-purple-200 uppercase tracking-wider font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Features */}
            {exclusiveLicense && (
              <div className="mb-6">
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">What You Get</p>
                <div className="grid grid-cols-2 gap-3">
                  {premiumFeatures.map((feature, idx) => {
                    const Icon = feature.icon;
                    const isAvailable = feature.available !== false;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                          isAvailable
                            ? 'bg-white/[0.05] border-white/[0.1] text-white/80'
                            : 'bg-white/[0.02] border-white/[0.05] text-white/30'
                        }`}
                      >
                        <Icon size={16} className={isAvailable ? 'text-purple-400' : 'text-white/20'} />
                        <span className="text-xs font-semibold uppercase tracking-wider">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stems Info */}
            {hasStems && (
              <div className="mb-6 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg flex items-start gap-2">
                <Disc3 size={16} className="text-blue-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Stems Available</p>
                  <p className="text-xs text-blue-200/60">Individual stems included with this beat</p>
                </div>
              </div>
            )}

            {/* License Description */}
            {exclusiveLicense && (
              <div className="mb-8 p-4 bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.1] rounded-xl">
                <p className="text-white/50 text-xs leading-relaxed">
                  <span className="font-bold text-white">Exclusive License includes:</span> Full ownership rights, unlimited commercial use, distribution across all platforms, unlimited downloads, and the ability to modify the beat as needed.
                </p>
              </div>
            )}

            {/* Price & Action */}
            <div className="space-y-4 border-t border-white/[0.1] pt-6">
              {exclusiveLicense && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Price</p>
                  <div className="flex items-end gap-2">
                    <p className="text-5xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      €{exclusiveLicense.price.toFixed(0)}
                    </p>
                    <p className="text-white/40 text-sm mb-2">One-time purchase</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  onAddToCart(beat);
                  onClose();
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2 group"
              >
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                <span>Add to Cart ({cartCount})</span>
              </button>

              <button
                onClick={() => onPlay(beat)}
                className="w-full px-6 py-3 border border-white/[0.2] hover:bg-white/[0.08] text-white rounded-xl font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isCurrentBeatPlaying ? (
                  <>
                    <Pause size={18} className="fill-current" />
                    <span>Now Playing</span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="fill-current" />
                    <span>Preview Beat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
