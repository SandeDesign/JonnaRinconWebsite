import { useState, useEffect } from 'react';
import { Content, ContentType, ContentStatus } from '../lib/firebase/types';
import { contentService } from '../lib/firebase/services';

export const useContent = (filters?: {
  type?: ContentType;
  status?: ContentStatus;
  featured?: boolean;
}) => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = contentService.subscribeToContent(
      (contentData) => {
        setContent(contentData);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [filters?.type, filters?.status, filters?.featured]);

  return { content, loading };
};

export const usePublishedContent = (type?: ContentType) => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const publishedContent = await contentService.getPublishedContent(type);
        setContent(publishedContent);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type]);

  return { content, loading, error };
};

export const useFeaturedContent = (type?: ContentType) => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const featuredContent = await contentService.getFeaturedContent(type);
        setContent(featuredContent);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type]);

  return { content, loading, error };
};
