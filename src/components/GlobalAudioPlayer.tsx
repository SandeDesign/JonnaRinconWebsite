import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, Shuffle } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const { state, play, pause, resume, next, previous, seek, setVolume, setRepeat, toggleShuffle } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    return state.repeat === 'one' ? Repeat1 : Repeat;
  };

  // Don't show player if no current track
  if (!state.currentTrack) {
    return null;
  }

  const RepeatIcon = getRepeatIcon();
  const progressPercent = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.06] flex-shrink-0 flex items-center justify-center overflow-hidden">
              {state.currentTrack.coverArt ? (
                <img src={state.currentTrack.coverArt} alt={state.currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-600/40 to-red-900/20" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{state.currentTrack.artist}</p>
              <p className="text-white/40 text-xs truncate">{state.currentTrack.title}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md flex items-center gap-2">
            <span className="text-white/40 text-xs">{formatTime(state.currentTime)}</span>
            <div
              className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group hover:h-1.5 transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seek(percent * state.duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-white/40 text-xs">{formatTime(state.duration)}</span>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              onClick={previous}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Previous track"
            >
              <SkipBack size={18} />
            </button>

            {/* Play/Pause */}
            <button
              onClick={state.isPlaying ? pause : resume}
              className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all text-white"
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
            </button>

            {/* Next */}
            <button
              onClick={next}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Next track"
            >
              <SkipForward size={18} />
            </button>

            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-all ${
                state.shuffle ? 'bg-red-600/20 text-red-400' : 'hover:bg-white/10 text-white/60 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            {/* Repeat */}
            <button
              onClick={() => {
                const nextMode = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
                setRepeat(nextMode);
              }}
              className={`p-2 rounded-full transition-all ${
                state.repeat !== 'off' ? 'bg-red-600/20 text-red-400' : 'hover:bg-white/10 text-white/60 hover:text-white'
              }`}
              title="Repeat"
            >
              <RepeatIcon size={18} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
              <button className="p-2 text-white/60 hover:text-white transition-all">
                {state.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600"
                title="Volume"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout (Compact) */}
        <div className="flex md:hidden items-center gap-3">
          {/* Track Info */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.06] flex-shrink-0 flex items-center justify-center overflow-hidden">
            {state.currentTrack.coverArt ? (
              <img src={state.currentTrack.coverArt} alt={state.currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-600/40 to-red-900/20" />
            )}
          </div>

          {/* Track Text */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-xs truncate">{state.currentTrack.artist}</p>
            <p className="text-white/40 text-[10px] truncate">{state.currentTrack.title}</p>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={state.isPlaying ? pause : resume}
              className="p-2 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all text-white"
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
            </button>

            <button
              onClick={next}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Next track"
            >
              <SkipForward size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar (Mobile) */}
        <div className="md:hidden mt-3">
          <div
            className="h-1 bg-white/10 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seek(percent * state.duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-white/40 text-[10px] mt-1">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
