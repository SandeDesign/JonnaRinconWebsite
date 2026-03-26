import React, { useState, useRef, useEffect } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const { state, togglePlayPause, next, previous, seek, setVolume } = useAudioPlayer();
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!state.currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(percent * state.duration, state.duration));
    seek(newTime);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  useEffect(() => {
    const handleMouseUpEvent = () => setIsDragging(false);
    document.addEventListener('mouseup', handleMouseUpEvent);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpEvent);
    };
  }, []);

  return (
    <>
      {/* Fixed Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/[0.04] backdrop-blur-md border-t border-white/[0.06]">
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-1 bg-white/[0.08] cursor-pointer group"
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Player Content */}
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {/* Cover Art */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex-shrink-0 bg-gradient-to-br from-red-600/40 to-red-900/20 border border-white/[0.08] flex items-center justify-center overflow-hidden">
                  {state.currentTrack.coverArt ? (
                    <img
                      src={state.currentTrack.coverArt}
                      alt={state.currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white/30 text-xs">♪</div>
                  )}
                </div>

                {/* Title & Artist */}
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-bold text-white truncate">
                    {state.currentTrack.artist}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {state.currentTrack.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Display */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/50 flex-shrink-0">
              <span className="w-10 text-right">{formatTime(state.currentTime)}</span>
              <span className="w-10">{formatTime(state.duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Previous Button */}
              <button
                onClick={previous}
                className="p-2 rounded-full text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                title="Previous"
              >
                <SkipBack size={16} />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all flex-shrink-0"
                title={state.isPlaying ? 'Pause' : 'Play'}
              >
                {state.isPlaying ? (
                  <Pause size={18} className="text-white ml-0.5" fill="white" />
                ) : (
                  <Play size={18} className="text-white ml-0.5" fill="white" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={next}
                className="p-2 rounded-full text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                title="Next"
              >
                <SkipForward size={16} />
              </button>

              {/* Volume Control */}
              <div className="hidden md:flex items-center gap-2 bg-white/[0.06] rounded-full px-3 py-1">
                <VolumeX size={14} className="text-white/40 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.volume * 100}
                  onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                  className="w-16 h-1 bg-white/[0.12] rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(220, 38, 38) 0%, rgb(220, 38, 38) ${state.volume * 100}%, rgb(255, 255, 255, 0.12) ${state.volume * 100}%, rgb(255, 255, 255, 0.12) 100%)`,
                  }}
                  title="Volume"
                />
                <Volume2 size={14} className="text-white/40 flex-shrink-0" />
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
