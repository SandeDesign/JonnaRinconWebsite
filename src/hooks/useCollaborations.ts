import { useState, useEffect } from 'react';
import { Collaboration, CollaborationStatus, CollaborationType } from '../lib/firebase/types';
import { collaborationService } from '../lib/firebase/services';

export const useCollaborations = (filters?: {
  status?: CollaborationStatus;
  type?: CollaborationType;
}) => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = collaborationService.subscribeToCollaborations(
        (collabsData) => {
          setCollaborations(collabsData);
          setLoading(false);
        },
        filters
      );

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [filters?.status, filters?.type]);

  return { collaborations, loading, error };
};

export const useCollaborationStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statistics = await collaborationService.getCollaborationStats();
        setStats(statistics);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: async () => {
    setLoading(true);
    const statistics = await collaborationService.getCollaborationStats();
    setStats(statistics);
    setLoading(false);
  }};
};
