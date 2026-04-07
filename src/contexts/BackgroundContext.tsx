import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteBackground } from '../lib/firebase/types';
import { settingsService } from '../lib/firebase/services';

interface BackgroundContextType {
  activeBackground: SiteBackground | null;
  loading: boolean;
  error: string | null;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeBackground, setActiveBackground] = useState<SiteBackground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time background updates
    const unsubscribe = settingsService.subscribeToBackgrounds((backgrounds) => {
      try {
        const active = backgrounds.find((bg) => bg.isActive) || null;
        setActiveBackground(active);
        setError(null);
      } catch (err: any) {
        console.error('Error processing backgrounds:', err);
        setError(err.message || 'Failed to load background');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <BackgroundContext.Provider value={{ activeBackground, loading, error }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
