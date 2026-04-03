import { useState, useEffect } from 'react';
import { Art } from '../lib/firebase/types';
import { artService } from '../lib/firebase/services';

export const useArt = (filters?: {
  status?: Art['status'];
  featured?: boolean;
}) => {
  const [art, setArt] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = artService.subscribeToArt(
      (artData) => {
        setArt(artData);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [filters?.status, filters?.featured]);

  return { art, loading, error, setError };
};

export const useArtById = (id: string) => {
  const [artItem, setArtItem] = useState<Art | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchArt = async () => {
      try {
        const artData = await artService.getArtById(id);
        setArtItem(artData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArt();
  }, [id]);

  return { artItem, loading, error, setError };
};

export const useFeaturedArt = () => {
  const [art, setArt] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredArt = await artService.getFeaturedArt();
        setArt(featuredArt);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { art, loading, error };
};
