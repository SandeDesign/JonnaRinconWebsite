import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Lock, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl?: string;
  spotifyUrl?: string;
  duration?: number;
  membersOnly?: boolean;
}

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  minimal?: boolean;
}

export default function MusicPlayer({ tracks, currentTrackIndex = 0, onTrackChange, minimal = false }: MusicPlayerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentTrackIndex);

  const currentTrack = tracks[activeIndex];
  const isLocked = currentTrack?.membersOnly && !user;

  useEffect(() => {
    setActiveIndex(currentTrackIndex);
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback(() => {
    if (isLocked) return;
    if (!audioRef.current || !currentTrack?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isLocked, currentTrack]);

  const playTrack = (index: number) => {
    const track = tracks[index];
    if (track?.membersOnly && !user) return;

    setActiveIndex(index);
    onTrackChange?.(index);
    setIsPlaying(true);

    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const skipNext = () => {
    let next: number;
    if (isShuffled) {
      next = Math.floor(Math.random() * tracks.length);
    } else {
      next = (activeIndex + 1) % tracks.length;
    }
    playTrack(next);
  };

  const skipPrev = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prev = activeIndex === 0 ? tracks.length - 1 : activeIndex - 1;
    playTrack(prev);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || activeIndex < tracks.length - 1) {
      skipNext();
    } else {
      setIsPlaying(false);
    }
  };

  if (!currentTrack || tracks.length === 0) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Minimal inline player
  if (minimal) {
    return (
      <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
        <img src={currentTrack.cover} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
          <p className="text-[10px] text-white/30">{currentTrack.artist}</p>
        </div>
        {isLocked ? (
          <Lock size={16} className="text-white/20 flex-shrink-0" />
        ) : (
          <button onClick={togglePlay} className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
            {isPlaying ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" fill="white" />}
          </button>
        )}
        {currentTrack.audioUrl && (
          <audio
            ref={audioRef}
            src={currentTrack.audioUrl}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={handleEnded}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Fixed bottom player */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ${isExpanded ? 'h-screen' : ''}`}>
        {/* Expanded view — full screen */}
        {isExpanded && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4">
              <button onClick={() => setIsExpanded(false)} className="p-2 rounded-full hover:bg-white/10 transition-all">
                <ChevronDown size={20} className="text-white/60" />
              </button>
              <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Now Playing</p>
              <button onClick={() => setIsExpanded(false)} className="p-2 rounded-full hover:bg-white/10 transition-all">
                <X size={20} className="text-white/60" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-lg mx-auto w-full">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8">
                <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="text-center mb-8 w-full">
                <h2 className="text-2xl font-black text-white truncate">{currentTrack.title}</h2>
                <p className="text-white/40 mt-1">{currentTrack.artist}</p>
              </div>

              {/* Progress */}
              <div className="w-full mb-6">
                <div
                  ref={progressRef}
                  className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-red-500 rounded-full relative transition-all group-hover:h-2"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-white/30">{formatTime(currentTime)}</span>
                  <span className="text-[10px] text-white/30">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <button onClick={() => setIsShuffled(!isShuffled)} className={`p-2 rounded-full transition-all ${isShuffled ? 'text-red-400' : 'text-white/30 hover:text-white/60'}`}>
                  <Shuffle size={18} />
                </button>
                <button onClick={skipPrev} className="p-2 text-white/60 hover:text-white transition-all">
                  <SkipBack size={22} fill="currentColor" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying
                    ? <Pause size={28} className="text-black" fill="black" />
                    : <Play size={28} className="text-black ml-1" fill="black" />
                  }
                </button>
                <button onClick={skipNext} className="p-2 text-white/60 hover:text-white transition-all">
                  <SkipForward size={22} fill="currentColor" />
                </button>
                <button
                  onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                  className={`p-2 rounded-full transition-all relative ${repeatMode !== 'off' ? 'text-red-400' : 'text-white/30 hover:text-white/60'}`}
                >
                  <Repeat size={18} />
                  {repeatMode === 'one' && <span className="absolute -top-0.5 -right-0.5 text-[8px] font-black text-red-400">1</span>}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 mt-8">
                <button onClick={() => setIsMuted(!isMuted)} className="text-white/30 hover:text-white/60 transition-all">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                  className="w-28 accent-red-500"
                />
              </div>
            </div>

            {/* Queue */}
            <div className="px-6 pb-6 max-h-48 overflow-y-auto">
              <p className="text-xs text-white/20 uppercase tracking-widest font-bold mb-3">Queue</p>
              <div className="space-y-1">
                {tracks.map((track, i) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(i)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                      i === activeIndex ? 'bg-white/10' : 'hover:bg-white/[0.04]'
                    } ${track.membersOnly && !user ? 'opacity-40' : ''}`}
                  >
                    <img src={track.cover} alt="" className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${i === activeIndex ? 'text-red-400' : 'text-white/70'}`}>{track.title}</p>
                      <p className="text-[10px] text-white/25">{track.artist}</p>
                    </div>
                    {track.membersOnly && !user && <Lock size={12} className="text-white/20" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compact bar */}
        <div className="bg-black/80 backdrop-blur-2xl border-t border-white/[0.06]" style={{ WebkitBackdropFilter: 'blur(40px)' }}>
          {/* Progress line */}
          <div
            ref={!isExpanded ? progressRef : undefined}
            className="w-full h-1 bg-white/[0.06] cursor-pointer group"
            onClick={!isExpanded ? handleProgressClick : undefined}
          >
            <div className="h-full bg-red-500 transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex items-center gap-3 px-4 md:px-6 py-2.5">
            {/* Track info */}
            <button onClick={() => setIsExpanded(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
              <img src={currentTrack.cover} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                <p className="text-[10px] text-white/30">{currentTrack.artist}</p>
              </div>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isLocked ? (
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-[10px] font-bold text-white/40 uppercase tracking-wider hover:bg-white/10 transition-all"
                >
                  <Lock size={10} />
                  Sign up
                </button>
              ) : (
                <>
                  <button onClick={skipPrev} className="p-1.5 text-white/40 hover:text-white transition-all hidden md:block">
                    <SkipBack size={16} fill="currentColor" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying
                      ? <Pause size={16} className="text-black" fill="black" />
                      : <Play size={16} className="text-black ml-0.5" fill="black" />
                    }
                  </button>
                  <button onClick={skipNext} className="p-1.5 text-white/40 hover:text-white transition-all hidden md:block">
                    <SkipForward size={16} fill="currentColor" />
                  </button>
                </>
              )}

              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-white/20 hover:text-white/50 transition-all ml-1">
                <ChevronUp size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Volume — desktop only */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/20 hover:text-white/50 transition-all">
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                className="w-20 accent-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={handleEnded}
        />
      )}
    </>
  );
}
