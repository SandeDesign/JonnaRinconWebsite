import { useState, useEffect } from 'react';
import { Beat } from '../lib/firebase/types';
import { beatService } from '../lib/firebase/services';

export const useBeats = (filters?: {
  status?: Beat['status'];
  featured?: boolean;
  genre?: string;
}) => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = beatService.subscribeToBeats(
      (beatsData) => {
        setBeats(beatsData);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [filters?.status, filters?.featured, filters?.genre]);

  return { beats, loading, error, setError };
};

export const useBeat = (id: string) => {
  const [beat, setBeat] = useState<Beat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const unsubscribe = beatService.subscribeToBeat(id, (beatData) => {
      setBeat(beatData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  return { beat, loading, error, setError };
};

export const useFeaturedBeats = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredBeats = await beatService.getFeaturedBeats();
        setBeats(featuredBeats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { beats, loading, error };
};

export const useTrendingBeats = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingBeats = await beatService.getTrendingBeats();
        setBeats(trendingBeats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return { beats, loading, error };
};

export const useGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      const genresList = await beatService.getGenres();
      setGenres(genresList);
      setLoading(false);
    };

    fetchGenres();
  }, []);

  return { genres, loading };
};
