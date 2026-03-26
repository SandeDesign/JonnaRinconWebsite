import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

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

// GLOBAL AUDIO - Created outside React to avoid context issues
const audio = new Audio();
audio.volume = 0.8;

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

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ONLY update time every 500ms to avoid excessive renders
  useEffect(() => {
    const timer = setInterval(() => {
      if (!audio.paused && !isNaN(audio.currentTime)) {
        setState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
        }));
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const onEnded = () => {
      const current = stateRef.current;
      if (current.repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (current.repeat === 'all' && current.queue.length > 0) {
        const nextIdx = (current.currentQueueIndex + 1) % current.queue.length;
        const nextTrack = current.queue[nextIdx];
        if (nextTrack) {
          audio.src = nextTrack.audioUrl || '';
          audio.play().catch(() => {});
          setState((prev) => ({
            ...prev,
            currentTrack: nextTrack,
            currentQueueIndex: nextIdx,
            currentTime: 0,
          }));
        }
      } else {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const play = useCallback((track: Track, queue: Track[] = []) => {
    audio.src = track.audioUrl || '';
    audio.currentTime = 0;
    setState({
      currentTrack: track,
      isPlaying: true,
      queue: queue.length > 0 ? queue : [track],
      currentQueueIndex: queue.length > 0 ? queue.findIndex((t) => t.id === track.id) : 0,
      currentTime: 0,
      duration: 0,
      volume: state.volume,
      repeat: state.repeat,
      shuffle: state.shuffle,
    });
    audio.play().catch(() => {});
  }, [state.volume, state.repeat, state.shuffle]);

  const pause = useCallback(() => {
    audio.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audio.play().catch(() => {});
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [state.isPlaying, pause, resume]);

  const next = useCallback(() => {
    const current = stateRef.current;
    if (!current.queue.length) return;

    let nextIdx = current.currentQueueIndex + 1;
    if (current.shuffle) {
      nextIdx = Math.floor(Math.random() * current.queue.length);
    } else if (nextIdx >= current.queue.length) {
      if (current.repeat === 'all') {
        nextIdx = 0;
      } else {
        return;
      }
    }

    const nextTrack = current.queue[nextIdx];
    if (nextTrack) {
      audio.src = nextTrack.audioUrl || '';
      audio.currentTime = 0;
      setState((prev) => ({
        ...prev,
        currentTrack: nextTrack,
        currentQueueIndex: nextIdx,
        currentTime: 0,
      }));
      audio.play().catch(() => {});
    }
  }, []);

  const previous = useCallback(() => {
    const current = stateRef.current;
    if (!current.queue.length) return;

    let prevIdx = current.currentQueueIndex - 1;
    if (prevIdx < 0) prevIdx = current.queue.length - 1;

    const prevTrack = current.queue[prevIdx];
    if (prevTrack) {
      audio.src = prevTrack.audioUrl || '';
      audio.currentTime = 0;
      setState((prev) => ({
        ...prev,
        currentTrack: prevTrack,
        currentQueueIndex: prevIdx,
        currentTime: 0,
      }));
      audio.play().catch(() => {});
    }
  }, []);

  const seek = useCallback((time: number) => {
    const validTime = Math.max(0, Math.min(time, audio.duration || time));
    audio.currentTime = validTime;
    setState((prev) => ({ ...prev, currentTime: validTime }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    audio.volume = clamped;
    setState((prev) => ({ ...prev, volume: clamped }));
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
    audio.pause();
    audio.src = '';
    setState({
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
  }, []);

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
