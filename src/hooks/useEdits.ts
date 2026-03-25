import { useState, useEffect } from 'react';
import { Edit } from '../lib/firebase/types';
import { editService } from '../lib/firebase/services';

export const useEdits = (filters?: {
  status?: Edit['status'];
  featured?: boolean;
  genre?: string;
}) => {
  const [edits, setEdits] = useState<Edit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = editService.subscribeToEdits(
      (editsData) => {
        setEdits(editsData);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [filters?.status, filters?.featured, filters?.genre]);

  return { edits, loading, error, setError };
};

export const useFeaturedEdits = () => {
  const [edits, setEdits] = useState<Edit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredEdits = await editService.getFeaturedEdits();
        setEdits(featuredEdits);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { edits, loading, error };
};

export const useEditGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      const genresList = await editService.getGenres();
      setGenres(genresList);
      setLoading(false);
    };

    fetchGenres();
  }, []);

  return { genres, loading };
};
