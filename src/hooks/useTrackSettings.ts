import { useState, useEffect, useCallback } from 'react';
import { settingsService, TrackSettings } from '../lib/firebase/services/settingsService';

export const useTrackSettings = () => {
  const [settings, setSettings] = useState<TrackSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const trackSettings = await settingsService.getTrackSettings();
        setSettings(trackSettings);
      } catch (err: any) {
        setError(err.message || 'Failed to load track settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (updatedSettings: TrackSettings) => {
    try {
      await settingsService.saveTrackSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err: any) {
      setError(err.message || 'Failed to save track settings');
      throw err;
    }
  }, []);

  return { settings, loading, error, updateSettings };
};
