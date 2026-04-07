import React, { useEffect, useRef, useState } from 'react';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Merchandise } from '../lib/firebase/types';

interface MerchandiseDetailModalProps {
  merchandise: Merchandise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (merchandise: Merchandise) => void;
  cartItems?: any[];
}

export default function MerchandiseDetailModal({
  merchandise,
  isOpen,
  onClose,
  onAddToCart,
  cartItems = [],
}: MerchandiseDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Combine main image with gallery
  const allImages = merchandise
    ? [merchandise.image, ...(merchandise.gallery || [])]
    : [];

  const isInCart = merchandise
    ? cartItems.some(item => item.id === merchandise.id && item.type === 'merchandise')
    : false;

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsImageLoading(true);
    }
  }, [isOpen, merchandise?.id]);

  if (!isOpen || !merchandise) return null;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
    setIsImageLoading(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
    setIsImageLoading(true);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(merchandise);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-full text-white/60 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.06]">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/[0.06]">
                  <div className="text-white/40">Loading...</div>
                </div>
              )}
              <img
                src={allImages[currentImageIndex]}
                alt={merchandise.name}
                className="w-full h-full object-cover"
                onLoad={() => setIsImageLoading(false)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-full text-white/60 hover:text-white transition-all"
                    title="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/[0.1] hover:bg-white/[0.15] rounded-full text-white/60 hover:text-white transition-all"
                    title="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 rounded-full text-xs font-semibold text-white">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsImageLoading(true);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all border ${
                      currentImageIndex === index
                        ? 'border-pink-500 ring-2 ring-pink-500'
                        : 'border-white/[0.1] hover:border-white/[0.2]'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${merchandise.name} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Title & Info */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">
                {merchandise.name}
              </h2>

              {/* Category & Price */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/40 text-sm font-semibold uppercase tracking-wider">
                  {merchandise.category}
                </span>
                <span className="text-2xl font-black text-pink-500">
                  ${merchandise.price.toFixed(2)}
                </span>
              </div>

              {/* Divider */}
              <div className="border-b border-white/[0.1] mb-4" />

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-2">
                  Description
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {merchandise.description}
                </p>
              </div>

              {/* Meta Info */}
              {merchandise.metaDescription && (
                <div className="p-4 bg-white/[0.06] border border-white/[0.08] rounded-xl mb-6">
                  <p className="text-white/60 text-sm">
                    {merchandise.metaDescription}
                  </p>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    merchandise.status === 'published'
                      ? 'bg-green-500/20 text-green-300'
                      : merchandise.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {merchandise.status.charAt(0).toUpperCase() + merchandise.status.slice(1)}
                </span>
                {merchandise.featured && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold uppercase">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`w-full px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-green-600/20 text-green-400 border border-green-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white'
              }`}
            >
              <ShoppingCart size={18} />
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </button>

            {/* Close Button for Mobile */}
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2 bg-white/[0.1] hover:bg-white/[0.15] text-white/60 hover:text-white rounded-xl font-semibold transition-all md:hidden"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
