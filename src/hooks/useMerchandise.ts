import { useState, useEffect } from 'react';
import { merchandiseService } from '../lib/firebase/services';
import { Merchandise } from '../lib/firebase/types';

export function useMerchandise() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = merchandiseService.subscribeToMerchandise((data) => {
      setMerchandise(data);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  return { merchandise, loading, error };
}

export function useMerchandiseById(id: string) {
  const [item, setItem] = useState<Merchandise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const data = await merchandiseService.getMerchandiseById(id);
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  return { item, loading, error };
}

export function useFeaturedMerchandise() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await merchandiseService.getFeaturedMerchandise();
        setMerchandise(data);
      } catch (error) {
        console.error('Failed to fetch featured merchandise:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { merchandise, loading };
}
