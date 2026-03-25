import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

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

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  // Create or get audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = state.volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.repeat]);

  const play = (track: Track, queue: Track[] = []) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.src = track.audioUrl || '';
    audio.volume = state.volume;

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      queue: queue.length > 0 ? queue : [track],
      currentQueueIndex: queue.length > 0 ? queue.findIndex((t) => t.id === track.id) : 0,
      currentTime: 0,
    }));

    audio.play().catch((err) => console.error('Error playing audio:', err));
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.error('Error resuming audio:', err));
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const next = () => {
    setState((prev) => {
      let nextIndex = prev.currentQueueIndex + 1;

      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      } else if (nextIndex >= prev.queue.length) {
        if (prev.repeat === 'all') {
          nextIndex = 0;
        } else {
          return prev;
        }
      }

      const nextTrack = prev.queue[nextIndex];
      if (!nextTrack || !audioRef.current) return prev;

      audioRef.current.src = nextTrack.audioUrl || '';
      audioRef.current.play().catch((err) => console.error('Error playing next track:', err));

      return {
        ...prev,
        currentTrack: nextTrack,
        currentQueueIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
      };
    });
  };

  const previous = () => {
    setState((prev) => {
      let prevIndex = prev.currentQueueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = prev.queue.length - 1;
      }

      const prevTrack = prev.queue[prevIndex];
      if (!prevTrack || !audioRef.current) return prev;

      audioRef.current.src = prevTrack.audioUrl || '';
      audioRef.current.play().catch((err) => console.error('Error playing previous track:', err));

      return {
        ...prev,
        currentTrack: prevTrack,
        currentQueueIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
      };
    });
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  };

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setState((prev) => ({ ...prev, volume: clampedVolume }));
  };

  const setRepeat = (mode: 'off' | 'one' | 'all') => {
    setState((prev) => ({ ...prev, repeat: mode }));
  };

  const toggleShuffle = () => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const addToQueue = (track: Track) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  const clearQueue = () => {
    pause();
    setState((prev) => ({
      ...prev,
      queue: [],
      currentQueueIndex: -1,
      currentTrack: null,
    }));
  };

  const value: AudioPlayerContextType = {
    state,
    play,
    pause,
    resume,
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
