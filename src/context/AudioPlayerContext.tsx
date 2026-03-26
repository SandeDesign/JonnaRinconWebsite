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

// Create audio outside React completely
const audioElement = new Audio();

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
  const isMountedRef = useRef(true);

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Unmount flag
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Setup time update polling
  useEffect(() => {
    const timerInter = setInterval(() => {
      if (!audioElement.paused && !isNaN(audioElement.currentTime) && isMountedRef.current) {
        setState((prev) => {
          if (Math.abs(prev.currentTime - audioElement.currentTime) > 0.1) {
            return { ...prev, currentTime: audioElement.currentTime };
          }
          return prev;
        });
      }
    }, 1000);

    return () => clearInterval(timerInter);
  }, []);

  // Setup audio element events - NO setState in callbacks
  useEffect(() => {
    const handleMetadata = () => {
      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, duration: audioElement.duration }));
      }
    };

    const handleEnded = () => {
      if (!isMountedRef.current) return;
      const s = stateRef.current;

      if (s.repeat === 'one') {
        audioElement.currentTime = 0;
        audioElement.play().catch(() => {});
      } else if (s.repeat === 'all' && s.queue.length > 0) {
        const nextIdx = (s.currentQueueIndex + 1) % s.queue.length;
        const nextTrack = s.queue[nextIdx];
        if (nextTrack) {
          audioElement.src = nextTrack.audioUrl || '';
          setState((prev) => ({
            ...prev,
            currentTrack: nextTrack,
            currentQueueIndex: nextIdx,
            currentTime: 0,
            isPlaying: true,
          }));
          audioElement.play().catch(() => {});
        }
      } else {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    audioElement.addEventListener('loadedmetadata', handleMetadata);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleMetadata);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  const play = useCallback((track: Track, queue: Track[] = []) => {
    const newQueue = queue.length > 0 ? queue : [track];
    const idx = newQueue.findIndex((t) => t.id === track.id);

    audioElement.src = track.audioUrl || '';
    audioElement.currentTime = 0;

    setState({
      currentTrack: track,
      isPlaying: true,
      queue: newQueue,
      currentQueueIndex: idx >= 0 ? idx : 0,
      currentTime: 0,
      duration: 0,
      volume: stateRef.current.volume,
      repeat: stateRef.current.repeat,
      shuffle: stateRef.current.shuffle,
    });

    audioElement.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioElement.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audioElement.play().catch(() => {});
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (stateRef.current.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [pause, resume]);

  const next = useCallback(() => {
    const s = stateRef.current;
    if (!s.queue.length) return;

    let nextIdx = s.currentQueueIndex + 1;
    if (s.shuffle) {
      nextIdx = Math.floor(Math.random() * s.queue.length);
    } else if (nextIdx >= s.queue.length) {
      if (s.repeat === 'all') {
        nextIdx = 0;
      } else {
        return;
      }
    }

    const nextTrack = s.queue[nextIdx];
    if (!nextTrack) return;

    audioElement.src = nextTrack.audioUrl || '';
    audioElement.currentTime = 0;

    setState((prev) => ({
      ...prev,
      currentTrack: nextTrack,
      currentQueueIndex: nextIdx,
      currentTime: 0,
      isPlaying: true,
    }));

    audioElement.play().catch(() => {});
  }, []);

  const previous = useCallback(() => {
    const s = stateRef.current;
    if (!s.queue.length) return;

    let prevIdx = s.currentQueueIndex - 1;
    if (prevIdx < 0) prevIdx = s.queue.length - 1;

    const prevTrack = s.queue[prevIdx];
    if (!prevTrack) return;

    audioElement.src = prevTrack.audioUrl || '';
    audioElement.currentTime = 0;

    setState((prev) => ({
      ...prev,
      currentTrack: prevTrack,
      currentQueueIndex: prevIdx,
      currentTime: 0,
      isPlaying: true,
    }));

    audioElement.play().catch(() => {});
  }, []);

  const seek = useCallback((time: number) => {
    const validTime = Math.max(0, Math.min(time, audioElement.duration || time));
    audioElement.currentTime = validTime;
    setState((prev) => ({ ...prev, currentTime: validTime }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    audioElement.volume = clamped;
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
    audioElement.pause();
    audioElement.src = '';
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
