import { useState, useEffect } from 'react';
import { Track } from '../lib/firebase/types';
import { trackService } from '../lib/firebase/services';

export const useTracks = (filters?: {
  status?: Track['status'];
  featured?: boolean;
  genre?: string;
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);

    const unsubscribe = trackService.subscribeToTracks(
      (tracksData) => {
        setTracks(tracksData);
        setError(null);
        setLoading(false);
      },
      filters,
      (error) => {
        setError(error.message || 'Failed to load tracks');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters?.status, filters?.featured, filters?.genre]);

  return { tracks, loading, error, setError };
};

export const useFeaturedTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredTracks = await trackService.getFeaturedTracks();
        setTracks(featuredTracks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { tracks, loading, error };
};

export const useTrackGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setError(null);
        const genresList = await trackService.getGenres();
        setGenres(genresList);
      } catch (err: any) {
        setError(err.message || 'Failed to load genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};
