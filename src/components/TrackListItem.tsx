import { Track } from '../context/AudioPlayerContext';
import { Play, Music } from 'lucide-react';

interface TrackListItemProps {
  track: Track;
  onPlay: (track: Track) => void;
  showType?: boolean;
  showMetadata?: boolean;
}

export default function TrackListItem({ track, onPlay, showType = true, showMetadata = true }: TrackListItemProps) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex items-center gap-4 group">
      {/* Cover Art */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.06] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {track.coverArt ? (
          <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <Music size={20} className="text-white/30" />
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm md:text-base">{track.artist}</span>
          <span className="text-white/40 text-sm">{track.title}</span>
          {showType && (
            <span className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-wider">
              {track.type}
            </span>
          )}
        </div>

        {showMetadata && (
          <div className="flex flex-wrap gap-2 text-[10px] text-white/30 uppercase tracking-wider mt-1">
            <span>{track.year}</span>
            <span>•</span>
            <span>{track.genre}</span>
            {track.bpm && (
              <>
                <span>•</span>
                <span>{track.bpm} BPM</span>
              </>
            )}
            <span>•</span>
            <span>{track.duration}</span>
          </div>
        )}
      </div>

      {/* Play Button */}
      <button
        onClick={() => onPlay(track)}
        disabled={!track.audioUrl}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 group-hover:scale-110 ${
          track.audioUrl
            ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
        title={track.audioUrl ? 'Play' : 'No audio file'}
      >
        <Play size={16} fill="white" className="ml-0.5" />
      </button>
    </div>
  );
}
