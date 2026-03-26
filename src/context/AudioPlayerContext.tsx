import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  artist: string;
  title: string;
  type: 'Album' | 'EP' | 'Single' | 'Exclusive' | 'Remix';
  year: number;
  coverArt?: string;
  coverArtUrl?: string; // URL to uploaded cover art
  audioUrl?: string; // URL to uploaded audio file
  spotifyUrl?: string;
  genre: string;
  bpm?: number;
  duration: string;
  collab: 'Solo' | 'Collab';
  collabArtists?: string[];
  createdAt?: number;
}

export interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queue: Track[];
  currentQueueIndex: number;
  volume: number;
  repeat: 'off' | 'one' | 'all';
  shuffle: boolean;
}

export interface AudioPlayerContextType {
  state: AudioPlayerState;
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setRepeat: (mode: 'off' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentQueueIndex: -1,
    volume: 1,
    repeat: 'off',
    shuffle: false,
  });

  // Handle audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      setState((prev) => {
        if (prev.repeat === 'one') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
          return prev;
        } else {
          // Play next track
          const nextIndex = (prev.currentQueueIndex + 1) % prev.queue.length;
          if (nextIndex === 0 && prev.repeat === 'off') {
            return { ...prev, isPlaying: false, currentTrack: null };
          } else {
            return prev;
          }
        }
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const play = useCallback((track: Track, queue?: Track[]) => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;

    audio.src = track.audioUrl;
    audio.volume = state.volume;
    audio.play().catch((err) => console.error('Play error:', err));

    const newQueue = queue || [track];
    const queueIndex = newQueue.findIndex((t) => t.id === track.id);

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      queue: newQueue,
      currentQueueIndex: queueIndex >= 0 ? queueIndex : 0,
      duration: 0,
      currentTime: 0,
    }));
  }, [state.volume]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => console.error('Resume error:', err));
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [state.isPlaying, pause, resume]);

  const next = useCallback(() => {
    if (state.queue.length === 0) return;

    const nextIndex = (state.currentQueueIndex + 1) % state.queue.length;
    const nextTrack = state.queue[nextIndex];
    play(nextTrack, state.queue);
    setState((prev) => ({ ...prev, currentQueueIndex: nextIndex }));
  }, [state.queue, state.currentQueueIndex, play]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If more than 3 seconds into track, restart it
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (state.currentQueueIndex > 0) {
      const prevIndex = state.currentQueueIndex - 1;
      const prevTrack = state.queue[prevIndex];
      play(prevTrack, state.queue);
      setState((prev) => ({ ...prev, currentQueueIndex: prevIndex }));
    }
  }, [state.queue, state.currentQueueIndex, play]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const audio = audioRef.current;
    if (audio) {
      audio.volume = clampedVolume;
    }
    setState((prev) => ({ ...prev, volume: clampedVolume }));
  }, []);

  const setRepeat = useCallback((mode: 'off' | 'one' | 'all') => {
    setState((prev) => ({ ...prev, repeat: mode }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((prev) => {
      const newShuffle = !prev.shuffle;
      if (newShuffle) {
        const shuffled = [...prev.queue].sort(() => Math.random() - 0.5);
        return { ...prev, shuffle: newShuffle, queue: shuffled, currentQueueIndex: 0 };
      } else {
        return { ...prev, shuffle: newShuffle };
      }
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const clearQueue = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setState((prev) => ({
      ...prev,
      queue: [],
      currentTrack: null,
      isPlaying: false,
      currentQueueIndex: -1,
    }));
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        state,
        play,
        pause,
        resume,
        togglePlayPause,
        next,
        previous,
        seek,
        setVolume,
        setRepeat,
        toggleShuffle,
        addToQueue,
        clearQueue,
        audioRef,
      }}
    >
      <audio ref={audioRef} crossOrigin="anonymous" />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
}
