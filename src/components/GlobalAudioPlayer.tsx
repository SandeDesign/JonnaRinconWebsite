import React, { useRef, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
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

// Global player state - simple, no React
const playerStore: PlayerStore = {
  currentTrack: null,
  queue: [],
  currentIndex: 0,
};

let setPlayerUI: ((store: PlayerStore) => void) | null = null;

export function setCurrentTrack(track: Track, queue: Track[] = []) {
  playerStore.currentTrack = track;
  playerStore.queue = queue.length > 0 ? queue : [track];
  playerStore.currentIndex = playerStore.queue.findIndex((t) => t.id === track.id);
  if (setPlayerUI) setPlayerUI({ ...playerStore });
}

export function getCurrentTrack() {
  return playerStore.currentTrack;
}

export default function GlobalAudioPlayer() {
  const audioRef = useRef<any>(null);
  const [store, setStore] = useState<PlayerStore>(playerStore);

  // Register UI updater
  React.useEffect(() => {
    setPlayerUI = (newStore) => {
      setStore({ ...newStore });
    };
  }, []);

  if (!store.currentTrack) {
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

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 jonna-audio-player">
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
      <style>{`
        body {
          padding-bottom: ${store.currentTrack ? '90px' : '0'};
        }
      `}</style>
    </>
  );
}
