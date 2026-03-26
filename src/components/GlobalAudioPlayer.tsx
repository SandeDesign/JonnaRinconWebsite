import React, { useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { X } from 'lucide-react';
import 'react-h5-audio-player/lib/styles.css';
import './GlobalAudioPlayer.css';

interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  coverArt?: string;
}

interface PlayerStore {
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
}

// Global player state
const playerStore: PlayerStore = {
  currentTrack: null,
  queue: [],
  currentIndex: 0,
};

let setPlayerUI: ((store: PlayerStore) => void) | null = null;
let togglePlayerVisibility: (() => void) | null = null;
let isPlayerVisible = true;

export function setCurrentTrack(track: Track, queue: Track[] = []) {
  playerStore.currentTrack = track;
  playerStore.queue = queue.length > 0 ? queue : [track];
  playerStore.currentIndex = playerStore.queue.findIndex((t) => t.id === track.id);
  isPlayerVisible = true;
  if (setPlayerUI) setPlayerUI({ ...playerStore });
}

export function getCurrentTrack() {
  return playerStore.currentTrack;
}

export function getIsPlayerVisible() {
  return isPlayerVisible;
}

export function togglePlayerOpen() {
  isPlayerVisible = !isPlayerVisible;
  if (togglePlayerVisibility) togglePlayerVisibility();
}

export function openPlayer() {
  isPlayerVisible = true;
  if (togglePlayerVisibility) togglePlayerVisibility();
}

export default function GlobalAudioPlayer() {
  const audioRef = useRef<any>(null);
  const [store, setStore] = useState<PlayerStore>(playerStore);
  const [isVisible, setIsVisible] = useState(isPlayerVisible);

  // Register UI updaters
  React.useEffect(() => {
    setPlayerUI = (newStore) => {
      setStore({ ...newStore });
    };
    togglePlayerVisibility = () => {
      setIsVisible(!isVisible);
    };
  }, [isVisible]);

  if (!store.currentTrack || !isVisible) {
    return null;
  }

  const handleNext = () => {
    if (store.queue.length === 0) return;
    const nextIndex = (store.currentIndex + 1) % store.queue.length;
    const nextTrack = store.queue[nextIndex];
    if (nextTrack) {
      setCurrentTrack(nextTrack, store.queue);
    }
  };

  const handlePrevious = () => {
    if (store.queue.length === 0) return;
    let prevIndex = store.currentIndex - 1;
    if (prevIndex < 0) prevIndex = store.queue.length - 1;
    const prevTrack = store.queue[prevIndex];
    if (prevTrack) {
      setCurrentTrack(prevTrack, store.queue);
    }
  };

  const handleClose = () => {
    togglePlayerOpen();
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 jonna-audio-player">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-4 z-50 text-white/40 hover:text-white/70 transition-colors"
            title="Close player"
          >
            <X size={20} />
          </button>
          <AudioPlayer
            ref={audioRef}
            autoPlay
            src={store.currentTrack.audioUrl || ''}
            onClickNext={handleNext}
            onClickPrevious={handlePrevious}
            showFilledVolume
            layout="horizontal-reverse"
          />
        </div>
      </div>
      <style>{`
        body {
          padding-bottom: ${store.currentTrack ? '140px' : '0'};
        }
      `}</style>
    </>
  );
}
