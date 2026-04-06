import { useState, useEffect } from 'react';
import { merchandiseService } from '../lib/firebase/services';
import type { Merchandise } from '../lib/firebase/types';

export function useMerchandise(filters?: { status?: string; featured?: boolean }) {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (filters?.status === 'published' && !filters?.featured) {
      // Get published merchandise
      merchandiseService
        .getPublishedMerchandise()
        .then((data) => {
          setMerchandise(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch merchandise');
          setLoading(false);
        });
    } else {
      // Subscribe to filtered merchandise
      const unsubscribe = merchandiseService.subscribeToMerchandise((data) => {
        setMerchandise(data);
        setLoading(false);
      }, filters);

      return () => unsubscribe();
    }
  }, [filters?.status, filters?.featured]);

  return { merchandise, loading, error };
}

export function useMerchandiseById(id: string) {
  const [merchandise, setMerchandise] = useState<Merchandise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setMerchandise(null);
      setLoading(false);
      return;
    }

    merchandiseService
      .getMerchandiseById(id)
      .then((data) => {
        setMerchandise(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch merchandise');
        setLoading(false);
      });
  }, [id]);

  return { merchandise, loading, error };
}

export function useFeaturedMerchandise() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    merchandiseService
      .getFeaturedMerchandise()
      .then((data) => {
        setMerchandise(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch featured merchandise');
        setLoading(false);
      });
  }, []);

  return { merchandise, loading, error };
}
