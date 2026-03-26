import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function GlobalAudioPlayer() {
  const { state, togglePlayPause, next, previous, seek, setVolume } = useAudioPlayer();

  if (!state.currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <AudioPlayer
        autoPlay={state.isPlaying}
        src={state.currentTrack.audioUrl || ''}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={(e: any) => seek(e)}
        onVolumeChange={(e: any) => setVolume(e / 100)}
        onClickNext={next}
        onClickPrevious={previous}
        volume={state.volume * 100}
        currentTime={state.currentTime}
        duration={state.duration}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          color: 'white',
        }}
      />
      <style>{`
        body {
          padding-bottom: ${state.currentTrack ? '80px' : '0'};
        }
        .rhap_container {
          background: rgba(255, 255, 255, 0.04) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
        }
        .rhap_controls-section button {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .rhap_controls-section button:hover {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .rhap_play-pause-button {
          background: rgb(220, 38, 38) !important;
          color: white !important;
          border-radius: 50% !important;
        }
      `}</style>
    </div>
  );
}
