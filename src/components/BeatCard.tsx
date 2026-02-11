import { Play, Pause, ShoppingCart } from 'lucide-react';
import { Beat } from '../lib/types';
import { useState, useRef } from 'react';

interface BeatCardProps {
  beat: Beat;
  onAddToCart: (beat: Beat, license: 'basic' | 'premium' | 'exclusive') => void;
}

export default function BeatCard({ beat, onAddToCart }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<'basic' | 'premium' | 'exclusive'>('basic');
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getLicensePrice = () => {
    switch (selectedLicense) {
      case 'basic':
        return beat.price;
      case 'premium':
        return beat.price * 1.5;
      case 'exclusive':
        return beat.price * 3;
      default:
        return beat.price;
    }
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden hover-lift hover:neon-border transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={beat.artwork_url}
          alt={beat.title}
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center neon-border hover:scale-125 active:scale-95 transition-all duration-300 shadow-2xl"
        >
          {isPlaying ? (
            <Pause className="w-10 h-10" fill="currentColor" />
          ) : (
            <Play className="w-10 h-10 ml-1" fill="currentColor" />
          )}
        </button>

        {beat.featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold neon-border-subtle animate-pulse">
            ⭐ FEATURED
          </div>
        )}

        <audio ref={audioRef} src={beat.audio_url} onEnded={() => setIsPlaying(false)} />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-purple-200">{beat.title}</h3>
        <p className="text-gray-400 mb-4">{beat.artist}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-900/30 rounded-full text-sm border border-purple-500/30">
            {beat.bpm} BPM
          </span>
          <span className="px-3 py-1 bg-purple-900/30 rounded-full text-sm border border-purple-500/30">
            {beat.key}
          </span>
          <span className="px-3 py-1 bg-purple-900/30 rounded-full text-sm border border-purple-500/30">
            {beat.genre}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {beat.license_basic && (
            <button
              onClick={() => setSelectedLicense('basic')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLicense === 'basic'
                  ? 'bg-purple-600 text-white neon-border-subtle'
                  : 'bg-purple-900/20 text-purple-300 hover:bg-purple-900/40'
              }`}
            >
              Basic
            </button>
          )}
          {beat.license_premium && (
            <button
              onClick={() => setSelectedLicense('premium')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLicense === 'premium'
                  ? 'bg-purple-600 text-white neon-border-subtle'
                  : 'bg-purple-900/20 text-purple-300 hover:bg-purple-900/40'
              }`}
            >
              Premium
            </button>
          )}
          {beat.license_exclusive && (
            <button
              onClick={() => setSelectedLicense('exclusive')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLicense === 'exclusive'
                  ? 'bg-purple-600 text-white neon-border-subtle'
                  : 'bg-purple-900/20 text-purple-300 hover:bg-purple-900/40'
              }`}
            >
              Exclusive
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(199,125,255,0.5)]">
            €{getLicensePrice().toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(beat, selectedLicense)}
            className="group/btn flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-full font-bold transition-all duration-300 neon-border-subtle hover:scale-110 active:scale-95 shadow-xl hover:shadow-purple-500/50"
          >
            <ShoppingCart className="w-5 h-5 group-hover/btn:animate-bounce" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
