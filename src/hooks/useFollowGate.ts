import { useState, useEffect } from 'react';
import { followGateService } from '../lib/firebase/services/followGateService';
import { FollowGateCompletion } from '../lib/firebase/types';
import { useAuth } from './useAuth';

export function useFollowGateCompletions() {
  const { user, isAuthenticated } = useAuth();
  const [completions, setCompletions] = useState<FollowGateCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.uid) {
      setCompletions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = followGateService.subscribeToUserCompletions(user.uid, (data) => {
      setCompletions(data);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [user?.uid, isAuthenticated]);

  const activeCompletions = completions.filter(c => !followGateService.isExpired(c.expiresAt));
  const expiredCompletions = completions.filter(c => followGateService.isExpired(c.expiresAt));

  return { completions, activeCompletions, expiredCompletions, loading, error };
}

export function useFollowGate() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeFollowGate = async (data: {
    productId: string;
    productType: 'remix' | 'track' | 'edit' | 'beat';
    productTitle: string;
    artworkUrl?: string;
    audioUrl?: string;
    downloadUrl?: string;
  }): Promise<FollowGateCompletion | null> => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const completion = await followGateService.createCompletion(data);
      return completion;
    } catch (err: any) {
      setError(err.message || 'Failed to complete follow gate');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkExistingAccess = async (productId: string): Promise<FollowGateCompletion | null> => {
    if (!user?.uid) return null;
    try {
      const existing = await followGateService.getUserCompletion(user.uid, productId);
      if (existing && !followGateService.isExpired(existing.expiresAt)) {
        return existing;
      }
      return null;
    } catch {
      return null;
    }
  };

  return { completeFollowGate, checkExistingAccess, loading, error };
}
