import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, Shuffle } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const { state, togglePlayPause, next, previous, seek, setVolume, setRepeat, toggleShuffle } = useAudioPlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!state.currentTrack) {
    return null; // Don't show player if no track is playing
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <>
      {/* Fixed Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-t border-white/[0.06]">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/[0.08] cursor-pointer group">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max={state.duration || 0}
            value={state.currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Player Content */}
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-6">
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {/* Cover Art */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-red-600/40 to-red-900/20 border border-white/[0.08] flex items-center justify-center overflow-hidden">
                  {state.currentTrack.coverArt ? (
                    <img
                      src={state.currentTrack.coverArt}
                      alt={state.currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white/30 text-xs">No Cover</div>
                  )}
                </div>

                {/* Title & Artist */}
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-bold text-white truncate">
                    {state.currentTrack.artist}
                  </p>
                  <p className="text-xs md:text-sm text-white/50 truncate">
                    {state.currentTrack.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Shuffle Button */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-all ${
                  state.shuffle
                    ? 'bg-red-600/30 text-red-400 hover:bg-red-600/40'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
                }`}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>

              {/* Previous Button */}
              <button
                onClick={previous}
                className="p-2 rounded-full text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                title="Previous"
              >
                <SkipBack size={18} />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all flex-shrink-0"
                title={state.isPlaying ? 'Pause' : 'Play'}
              >
                {state.isPlaying ? (
                  <Pause size={20} className="text-white ml-0.5" fill="white" />
                ) : (
                  <Play size={20} className="text-white ml-1" fill="white" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={next}
                className="p-2 rounded-full text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                title="Next"
              >
                <SkipForward size={18} />
              </button>

              {/* Repeat Button */}
              <button
                onClick={() => {
                  const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
                  const currentIndex = modes.indexOf(state.repeat);
                  const nextMode = modes[(currentIndex + 1) % modes.length];
                  setRepeat(nextMode);
                }}
                className={`p-2 rounded-full transition-all ${
                  state.repeat !== 'off'
                    ? 'bg-red-600/30 text-red-400 hover:bg-red-600/40'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
                }`}
                title={`Repeat: ${state.repeat}`}
              >
                {state.repeat === 'one' ? (
                  <Repeat1 size={18} />
                ) : (
                  <Repeat size={18} />
                )}
              </button>

              {/* Volume Control */}
              <div className="hidden md:flex items-center gap-2 bg-white/[0.06] rounded-full px-3 py-1">
                <VolumeX size={16} className="text-white/40" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.volume * 100}
                  onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                  className="w-20 h-1 bg-white/[0.12] rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(220, 38, 38) 0%, rgb(220, 38, 38) ${state.volume * 100}%, rgb(255, 255, 255, 0.12) ${state.volume * 100}%, rgb(255, 255, 255, 0.12) 100%)`,
                  }}
                />
                <Volume2 size={16} className="text-white/40" />
              </div>

              {/* Time Display */}
              <div className="hidden sm:block text-xs md:text-sm text-white/50 w-12 md:w-16 text-right flex-shrink-0">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add bottom padding to body to prevent content from hiding under player */}
      <style>{`
        body {
          padding-bottom: ${state.currentTrack ? '80px' : '0'};
        }
      `}</style>
    </>
  );
}
