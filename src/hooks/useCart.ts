import { useState, useEffect } from 'react';
import { Beat, Track } from '../lib/firebase/types';

const CART_STORAGE_KEY = 'jonna_beats_cart';

export interface CartItem {
  id: string;
  type: 'beat' | 'track';
  title: string;
  artist: string;
  artworkUrl: string;
  audioUrl: string;
  price: number;
  bpm?: number;
  key?: string;
  // Original data reference
  originalData: any;
}

function beatToCartItem(beat: Beat): CartItem {
  return {
    id: beat.id,
    type: 'beat',
    title: beat.title,
    artist: beat.artist,
    artworkUrl: beat.artworkUrl,
    audioUrl: beat.audioUrl,
    price: beat.licenses.exclusive?.price || 0,
    bpm: beat.bpm,
    key: beat.key,
    originalData: beat,
  };
}

function trackToCartItem(track: Track): CartItem {
  return {
    id: track.id,
    type: 'track',
    title: track.title,
    artist: track.artist,
    artworkUrl: track.artworkUrl,
    audioUrl: track.audioUrl,
    price: track.licenses.exclusive?.price || 0,
    bpm: track.bpm,
    key: track.key,
    originalData: track,
  };
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Handle migration from old Beat[] format
        if (parsed.length > 0 && !('type' in parsed[0] && ('beat' === parsed[0].type || 'track' === parsed[0].type))) {
          // Old format: Beat[] - convert to CartItem[]
          const migrated = parsed.map((beat: any) => ({
            id: beat.id,
            type: 'beat' as const,
            title: beat.title,
            artist: beat.artist,
            artworkUrl: beat.artworkUrl || '',
            audioUrl: beat.audioUrl || '',
            price: beat.licenses?.exclusive?.price || 0,
            bpm: beat.bpm,
            key: beat.key,
            originalData: beat,
          }));
          setCartItems(migrated);
        } else {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (beat: Beat) => {
    setCartItems([...cartItems, beatToCartItem(beat)]);
  };

  const addTrackToCart = (track: Track) => {
    // Don't add if already in cart
    if (cartItems.some(item => item.id === track.id)) return;
    setCartItems([...cartItems, trackToCartItem(track)]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const removeItemByIndex = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  return {
    cartItems,
    addToCart,
    addTrackToCart,
    removeFromCart,
    removeItemByIndex,
    clearCart,
    getTotalPrice,
    isLoaded,
  };
}
