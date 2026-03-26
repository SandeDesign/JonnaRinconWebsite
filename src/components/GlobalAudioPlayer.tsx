import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './GlobalAudioPlayer.css';

export default function GlobalAudioPlayer() {
  const { state, next, previous, seek, setVolume } = useAudioPlayer();

  if (!state.currentTrack) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 jonna-audio-player">
        <AudioPlayer
          autoPlay={state.isPlaying}
          src={state.currentTrack.audioUrl || ''}
          onSeek={(e: any) => seek(e)}
          onVolumeChange={(e: any) => setVolume(e)}
          onClickNext={next}
          onClickPrevious={previous}
          volume={state.volume}
          currentTime={state.currentTime}
          duration={state.duration}
          showFilledVolume
        />
      </div>
      <style>{`
        body {
          padding-bottom: ${state.currentTrack ? '90px' : '0'};
        }
      `}</style>
    </>
  );
}
