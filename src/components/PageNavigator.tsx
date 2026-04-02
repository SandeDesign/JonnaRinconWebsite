import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface PageNavItem {
  id: string;
  label: string;
}

interface PageNavigatorProps {
  pages: PageNavItem[];
  activePageId: string;
  onPageChange: (pageId: string) => void;
}

export default function PageNavigator({
  pages,
  activePageId,
  onPageChange,
}: PageNavigatorProps) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: 2 items, Desktop: 3 items
  const itemsPerPage = isMobile ? 2 : 3;

  // Get current visible pages
  const visiblePages = useMemo(() => {
    return pages.slice(scrollOffset, scrollOffset + itemsPerPage);
  }, [pages, scrollOffset, itemsPerPage]);

  const handleNext = () => {
    const maxOffset = Math.max(0, pages.length - itemsPerPage);
    setScrollOffset(Math.min(scrollOffset + 1, maxOffset));
  };

  const handlePrev = () => {
    setScrollOffset(Math.max(scrollOffset - 1, 0));
  };

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        disabled={scrollOffset === 0}
        className="flex-shrink-0 p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
        aria-label="Previous pages"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Pages Display */}
      <div className="flex-1 flex items-center justify-center gap-6">
        {visiblePages.map((page, index) => {
          const pageNumber = scrollOffset + index + 1;
          const isActive = page.id === activePageId;

          return (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className="text-center group transition-all"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
                {String(pageNumber).padStart(2, '0')} {page.label}
              </p>
              <div
                className={`h-0.5 mx-auto transition-all ${
                  isActive
                    ? 'w-full bg-white/60'
                    : 'w-0 bg-white/20 group-hover:w-full'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        disabled={scrollOffset >= Math.max(0, pages.length - itemsPerPage)}
        className="flex-shrink-0 p-2 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
        aria-label="Next pages"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
