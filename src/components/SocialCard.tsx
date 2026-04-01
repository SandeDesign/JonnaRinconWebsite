import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import TypingCaption from './TypingCaption';

interface Slide {
  imageSrc: string;
  imageAlt: string;
  location: string;
  caption: ReactNode;
  likes: number;
}

interface SocialCardCarouselProps {
  slides: Slide[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export default function SocialCardCarousel({
  slides,
  activeIndex,
  onIndexChange,
}: SocialCardCarouselProps) {
  const [likedSlides, setLikedSlides] = useState<Set<number>>(new Set());
  const [popping, setPopping] = useState(false);
  const [ref, isInView] = useInView();
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());
  const [typingKey, setTypingKey] = useState(0);
  const prevIndexRef = useRef(activeIndex);

  const current = slides[activeIndex];

  // When activeIndex changes, check if we need to reset typing
  useEffect(() => {
    if (activeIndex !== prevIndexRef.current) {
      // Only reset typing if this is a new slide we haven't seen before
      if (!completedSlides.has(activeIndex)) {
        setTypingKey((prev) => prev + 1);
      }
      prevIndexRef.current = activeIndex;
    }
  }, [activeIndex, completedSlides]);

  const handleLike = () => {
    setLikedSlides((prev) => {
      const next = new Set(prev);
      if (next.has(activeIndex)) {
        next.delete(activeIndex);
      } else {
        next.add(activeIndex);
        setPopping(true);
      }
      return next;
    });
  };

  useEffect(() => {
    if (popping) {
      const timer = setTimeout(() => setPopping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [popping]);

  const goNext = useCallback(() => {
    if (activeIndex < slides.length - 1) onIndexChange(activeIndex + 1);
  }, [activeIndex, slides.length, onIndexChange]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) onIndexChange(activeIndex - 1);
  }, [activeIndex, onIndexChange]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (touchDeltaX.current < -50) goNext();
    else if (touchDeltaX.current > 50) goPrev();
    touchDeltaX.current = 0;
  };

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
    touchDeltaX.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.clientX - touchStartX.current;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (touchDeltaX.current < -50) goNext();
    else if (touchDeltaX.current > 50) goPrev();
    touchDeltaX.current = 0;
  };

  const isLiked = likedSlides.has(activeIndex);
  const displayLikes = current.likes + (isLiked ? 1 : 0);

  return (
    <div
      ref={ref}
      className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-700 ease-out w-full max-w-[420px] ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
          <img src="/icon-96x96.png" alt="J18" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">Jonna Rincon</p>
          <p className="text-xs text-gray-400 leading-tight">{current.location}</p>
        </div>
        <MoreHorizontal size={18} className="text-gray-400 flex-shrink-0" />
      </div>

      {/* Carousel photo area */}
      <div
        className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDragging.current = false; }}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <img
              key={i}
              src={slide.imageSrc}
              alt={slide.imageAlt}
              className="w-full h-[280px] md:h-[380px] object-cover flex-shrink-0"
              draggable={false}
            />
          ))}
        </div>

        {/* Nav arrows */}
        {activeIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
        )}
        {activeIndex < slides.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
        )}
      </div>

      {/* Action row + carousel dots */}
      <div className="flex items-center gap-4 px-3 pt-3 pb-1">
        <button
          onClick={handleLike}
          className="transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            size={22}
            className={`transition-colors duration-200 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-white'
            } ${popping && isLiked ? 'heart-pop' : ''}`}
          />
        </button>
        <MessageCircle size={22} className="text-white" />
        <Send size={22} className="text-white" />

        {/* Carousel dots — centered */}
        <div className="flex-1 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-white w-2 h-2' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        <Bookmark size={22} className="text-white" />
      </div>

      {/* Like count */}
      <p className="px-3 pt-1 text-sm font-semibold text-white">
        {displayLikes.toLocaleString()} likes
      </p>

      {/* Caption with typing animation */}
      <div className="px-3 pb-3 pt-1">
        <TypingCaption
          key={typingKey}
          content={
            <>
              <span className="font-semibold text-white">jonnarincon</span>{' '}
              {current.caption}
            </>
          }
          speed={30}
          className="text-sm text-gray-300 leading-relaxed"
          onComplete={() => {
            setCompletedSlides((prev) => new Set([...prev, activeIndex]));
          }}
        />
      </div>
    </div>
  );
}
