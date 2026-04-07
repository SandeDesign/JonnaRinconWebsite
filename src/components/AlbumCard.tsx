import React, { useState } from 'react';
import { Play, Music } from 'lucide-react';
import { Album } from '../lib/firebase/types';

interface AlbumCardProps {
  album: Album;
  trackCount: number;
  onViewAlbum: (album: Album) => void;
  isHovered?: boolean;
}

export default function AlbumCard({
  album,
  trackCount,
  onViewAlbum,
  isHovered = false,
}: AlbumCardProps) {
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const savingsPercent =
    album.fullAlbumPrice < album.perTrackPrice * trackCount
      ? Math.round(
          ((album.perTrackPrice * trackCount - album.fullAlbumPrice) /
            (album.perTrackPrice * trackCount)) *
            100
        )
      : 0;

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHoveringCard(true)}
      onMouseLeave={() => setIsHoveringCard(false)}
      onClick={() => onViewAlbum(album)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/[0.05] border border-white/[0.1] group-hover:border-white/[0.2] transition-all">
        <img
          src={album.coverImageUrl || album.artworkUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay */}
        {isHoveringCard && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <button className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors transform scale-100 hover:scale-110">
              <Play size={24} fill="white" className="text-white ml-1" />
            </button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {album.featured && (
            <div className="px-2 py-1 bg-yellow-500/80 rounded-full backdrop-blur-sm">
              <span className="text-xs font-bold text-white">★ Featured</span>
            </div>
          )}
          {savingsPercent > 0 && (
            <div className="px-2 py-1 bg-red-500/80 rounded-full backdrop-blur-sm">
              <span className="text-xs font-bold text-white">Save {savingsPercent}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div>
          <h3 className="font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
            {album.title}
          </h3>
          <p className="text-sm text-white/60">{album.artist}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Music size={14} />
            <span>{trackCount} Tracks</span>
          </div>
          <span>{album.genre}</span>
        </div>

        {/* Pricing */}
        {!album.isFree && (
          <div className="pt-2 space-y-1 border-t border-white/[0.1]">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Per Track:</span>
              <span className="font-semibold text-white">
                ${album.perTrackPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Full Album:</span>
              <span className="font-semibold text-white">
                ${album.fullAlbumPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}
        {album.isFree && (
          <div className="pt-2 border-t border-white/[0.1]">
            <span className="text-xs font-semibold text-green-400">Free Download</span>
          </div>
        )}
      </div>
    </div>
  );
}
