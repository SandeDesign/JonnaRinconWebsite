import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { setCurrentTrack, getCurrentTrack } from './GlobalAudioPlayer';
import { getPlayButtonContainerClass, getRowHighlightClass } from '../lib/utils/buttonStyles';

interface TrackListItemProps {
  track: any;
  onPlay?: (track: any) => void;
  onClickTrack?: (track: any) => void;
  allTracks?: any[];
  showType?: boolean;
  showYear?: boolean;
  showGenre?: boolean;
  showBPM?: boolean;
  showMetadata?: boolean;
}

export default function TrackListItem({
  track,
  onPlay,
  onClickTrack,
  allTracks = [],
  showType = true,
  showYear = true,
  showGenre = true,
  showBPM = true,
  showMetadata = false,
}: TrackListItemProps) {
  const currentTrack = getCurrentTrack();
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (onPlay) {
      onPlay(track);
    } else {
      const queue = allTracks.length > 0 ? allTracks : [track];
      setCurrentTrack(track, queue);
    }
  };

  return (
    <div
      className={`rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-all duration-300 border backdrop-blur-md ${
        isCurrentTrack ? 'border-red-500/50 bg-white/[0.08]' : 'bg-white/[0.04] border-white/[0.06]'
      } ${getRowHighlightClass(isCurrentTrack)}`}
    >
      {/* Cover Art */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/40 to-red-900/20 border border-white/[0.08] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {track.coverArt ? (
          <img
            src={track.coverArt}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music size={20} className="text-white/30" />
        )}
      </div>

      {/* Track Info */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onClickTrack?.(track)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm md:text-base truncate">
            {track.artist}
          </span>
          <span className="text-white/40 text-sm md:text-base truncate">
            {track.title}
          </span>
          {showType && (
            <span className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-wider flex-shrink-0">
              {track.type}
            </span>
          )}
        </div>

        {/* Metadata */}
        {showMetadata && (
          <div className="flex flex-wrap gap-2 text-[10px] text-white/30 uppercase tracking-wider mt-1">
            {showYear && (
              <>
                <span>{track.year}</span>
                <span>•</span>
              </>
            )}
            {showGenre && (
              <>
                <span>{track.genre}</span>
                <span>•</span>
              </>
            )}
            {showBPM && track.bpm && (
              <>
                <span>{track.bpm} BPM</span>
                <span>•</span>
              </>
            )}
            <span>{track.duration}</span>
            {track.remixType && (
              <>
                <span>•</span>
                <span className="text-red-400">{track.remixType}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Play Button */}
      <button
        onClick={handlePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all bg-red-600 hover:bg-red-500 hover:scale-110 ${
          isCurrentTrack ? 'scale-110' : ''
        } ${getPlayButtonContainerClass(isCurrentTrack)}`}
        title={isCurrentTrack ? "Pause track" : "Play track"}
      >
        {isCurrentTrack ? (
          <Pause size={16} className="text-red-500" fill="currentColor" />
        ) : (
          <Play size={16} className="text-gray-400 ml-0.5" fill="currentColor" />
        )}
      </button>
    </div>
  );
}
