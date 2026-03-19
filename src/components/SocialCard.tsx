import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface SocialCardProps {
  imageSrc: string;
  imageAlt: string;
  location: string;
  caption: string;
  imageHeight?: string;
  initialLikes?: number;
  delay?: number;
}

export default function SocialCard({
  imageSrc,
  imageAlt,
  location,
  caption,
  imageHeight = 'h-[250px] md:h-[320px]',
  initialLikes,
  delay = 0,
}: SocialCardProps) {
  const [liked, setLiked] = useState(false);
  const [popping, setPopping] = useState(false);
  const [likes] = useState(() => initialLikes ?? Math.floor(Math.random() * 700) + 200);
  const [ref, isInView] = useInView();

  const handleLike = () => {
    setLiked((prev) => !prev);
    if (!liked) {
      setPopping(true);
    }
  };

  useEffect(() => {
    if (popping) {
      const timer = setTimeout(() => setPopping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [popping]);

  const displayLikes = liked ? likes + 1 : likes;

  return (
    <div
      ref={ref}
      className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
          <img src="/Logo.png" alt="J18" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">Jonna Rincon</p>
          <p className="text-xs text-gray-400 leading-tight">{location}</p>
        </div>
        <MoreHorizontal size={18} className="text-gray-400 flex-shrink-0" />
      </div>

      {/* Photo */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className={`w-full ${imageHeight} object-cover`}
      />

      {/* Action row */}
      <div className="flex items-center gap-4 px-3 pt-3 pb-1">
        <button
          onClick={handleLike}
          className="transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart
            size={22}
            className={`transition-colors duration-200 ${
              liked ? 'text-red-500 fill-red-500' : 'text-white'
            } ${popping ? 'heart-pop' : ''}`}
          />
        </button>
        <MessageCircle size={22} className="text-white cursor-pointer hover:text-gray-300 transition-colors" />
        <Send size={22} className="text-white cursor-pointer hover:text-gray-300 transition-colors" />
        <div className="flex-1" />
        <Bookmark size={22} className="text-white cursor-pointer hover:text-gray-300 transition-colors" />
      </div>

      {/* Like count */}
      <p className="px-3 pt-1 text-sm font-semibold text-white">
        {displayLikes.toLocaleString()} likes
      </p>

      {/* Caption */}
      <div className="px-3 pb-3 pt-1">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">jonnarincon</span>{' '}
          {caption}
        </p>
      </div>
    </div>
  );
}
