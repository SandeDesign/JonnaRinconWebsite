import { useState, useEffect } from 'react';
import { Album } from '../lib/firebase/types';
import { albumService } from '../lib/firebase/services';

export const useAlbums = (filters?: {
  status?: Album['status'];
  featured?: boolean;
}) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);

    const unsubscribe = albumService.subscribeToAlbums(
      (albumsData) => {
        setAlbums(albumsData);
        setError(null);
        setLoading(false);
      },
      filters,
      (error) => {
        setError(error.message || 'Failed to load albums');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters?.status, filters?.featured]);

  return { albums, loading, error, setError };
};

export const useFeaturedAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredAlbums = await albumService.getFeaturedAlbums();
        setAlbums(featuredAlbums);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { albums, loading, error };
};
