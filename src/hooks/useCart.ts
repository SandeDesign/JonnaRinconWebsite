import { useState, useEffect } from 'react';
import { Beat } from '../lib/firebase/types';

const CART_STORAGE_KEY = 'jonna_beats_cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<Beat[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCartItems(parsed);
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
    setCartItems([...cartItems, beat]);
  };

  const removeFromCart = (beatId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== beatId));
  };

  const removeItemByIndex = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.licenses.exclusive?.price || 0), 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    removeItemByIndex,
    clearCart,
    getTotalPrice,
    isLoaded,
  };
}
