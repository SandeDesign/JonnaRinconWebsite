import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';

export interface Track {
  id: string;
  artist: string;
  title: string;
  type: 'Album' | 'EP' | 'Single' | 'Exclusive' | 'Remix' | 'Edit' | 'Bootleg';
  year: number;
  coverArt?: string;
  audioUrl?: string;
  spotifyUrl?: string;
  genre: string;
  bpm?: number;
  duration: string;
  collab: 'Solo' | 'Collab';
  collabArtists?: string[];
  createdAt: number;
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
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Singleton audio element - lives outside React to avoid lifecycle issues
let globalAudio: HTMLAudioElement | null = null;
function getAudio(): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio();
  }
  return globalAudio;
}

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentQueueIndex: -1,
    volume: 0.8,
    repeat: 'off',
    shuffle: false,
  });

  // Refs to avoid stale closures in callbacks
  const stateRef = useRef(state);
  stateRef.current = state; // Always up to date, no useEffect needed

  const timeUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop a polling interval for currentTime instead of using timeupdate event
  // This batches updates to ~4/sec instead of ~60/sec, preventing React error #310
  const startTimePolling = useCallback(() => {
    if (timeUpdateInterval.current) return;
    timeUpdateInterval.current = setInterval(() => {
      const audio = getAudio();
      if (!audio.paused && !isNaN(audio.currentTime)) {
        setState((prev) => {
          if (Math.abs(prev.currentTime - audio.currentTime) < 0.15) return prev;
          return { ...prev, currentTime: audio.currentTime };
        });
      }
    }, 250);
  }, []);

  const stopTimePolling = useCallback(() => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  }, []);

  // Set up audio event listeners (only metadata and ended - NOT timeupdate)
  useEffect(() => {
    const audio = getAudio();

    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      setState((prev) => ({ ...prev, duration: dur }));
    };

    const handleEnded = () => {
      const s = stateRef.current;
      if (s.repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        // Move to next track
        let nextIndex = s.currentQueueIndex + 1;
        if (s.shuffle) {
          nextIndex = Math.floor(Math.random() * s.queue.length);
        } else if (nextIndex >= s.queue.length) {
          if (s.repeat === 'all') {
            nextIndex = 0;
          } else {
            // Stop playback
            stopTimePolling();
            setState((prev) => ({ ...prev, isPlaying: false }));
            return;
          }
        }
        const nextTrack = s.queue[nextIndex];
        if (nextTrack) {
          audio.src = nextTrack.audioUrl || '';
          audio.play().catch(() => {});
          setState((prev) => ({
            ...prev,
            currentTrack: nextTrack,
            currentQueueIndex: nextIndex,
            isPlaying: true,
            currentTime: 0,
          }));
        }
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      stopTimePolling();
    };
  }, [stopTimePolling]);

  // Sync volume to audio element
  useEffect(() => {
    getAudio().volume = state.volume;
  }, [state.volume]);

  const play = useCallback((track: Track, queue: Track[] = []) => {
    const audio = getAudio();
    audio.src = track.audioUrl || '';

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      queue: queue.length > 0 ? queue : [track],
      currentQueueIndex: queue.length > 0 ? queue.findIndex((t) => t.id === track.id) : 0,
      currentTime: 0,
      duration: 0,
    }));

    audio.play().catch((err) => console.error('Error playing audio:', err));
    startTimePolling();
  }, [startTimePolling]);

  const pause = useCallback(() => {
    getAudio().pause();
    stopTimePolling();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [stopTimePolling]);

  const resume = useCallback(() => {
    getAudio().play().catch((err) => console.error('Error resuming audio:', err));
    setState((prev) => ({ ...prev, isPlaying: true }));
    startTimePolling();
  }, [startTimePolling]);

  const togglePlayPause = useCallback(() => {
    if (stateRef.current.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [pause, resume]);

  const next = useCallback(() => {
    const s = stateRef.current;
    let nextIndex = s.currentQueueIndex + 1;

    if (s.shuffle) {
      nextIndex = Math.floor(Math.random() * s.queue.length);
    } else if (nextIndex >= s.queue.length) {
      if (s.repeat === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    const nextTrack = s.queue[nextIndex];
    if (!nextTrack) return;

    const audio = getAudio();
    audio.src = nextTrack.audioUrl || '';
    audio.play().catch((err) => console.error('Error playing next track:', err));
    startTimePolling();

    setState((prev) => ({
      ...prev,
      currentTrack: nextTrack,
      currentQueueIndex: nextIndex,
      isPlaying: true,
      currentTime: 0,
    }));
  }, [startTimePolling]);

  const previous = useCallback(() => {
    const s = stateRef.current;
    let prevIndex = s.currentQueueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = s.queue.length - 1;
    }

    const prevTrack = s.queue[prevIndex];
    if (!prevTrack) return;

    const audio = getAudio();
    audio.src = prevTrack.audioUrl || '';
    audio.play().catch((err) => console.error('Error playing previous track:', err));
    startTimePolling();

    setState((prev) => ({
      ...prev,
      currentTrack: prevTrack,
      currentQueueIndex: prevIndex,
      isPlaying: true,
      currentTime: 0,
    }));
  }, [startTimePolling]);

  const seek = useCallback((time: number) => {
    const audio = getAudio();
    const validTime = Math.max(0, Math.min(time, audio.duration || time));
    audio.currentTime = validTime;
    setState((prev) => ({ ...prev, currentTime: validTime }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    getAudio().volume = clampedVolume;
    setState((prev) => ({ ...prev, volume: clampedVolume }));
  }, []);

  const setRepeat = useCallback((mode: 'off' | 'one' | 'all') => {
    setState((prev) => ({ ...prev, repeat: mode }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const clearQueue = useCallback(() => {
    getAudio().pause();
    stopTimePolling();
    setState((prev) => ({
      ...prev,
      queue: [],
      currentQueueIndex: -1,
      currentTrack: null,
      isPlaying: false,
    }));
  }, [stopTimePolling]);

  const value: AudioPlayerContextType = {
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
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};
