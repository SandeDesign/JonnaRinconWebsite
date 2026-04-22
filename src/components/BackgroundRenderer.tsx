import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';

const FALLBACK_URL = '/JEIGHTENESIS.jpg';

const setHtmlBackground = (url: string) => {
  document.documentElement.style.backgroundImage = `url('${url}')`;
};

const BackgroundRenderer: React.FC = () => {
  const { activeBackground } = useBackground();
  const [currentImageUrl, setCurrentImageUrl] = React.useState<string | null>(null);

  // Set fallback immediately on mount
  React.useEffect(() => {
    if (!document.documentElement.style.backgroundImage) {
      setHtmlBackground(FALLBACK_URL);
    }
  }, []);

  React.useEffect(() => {
    const imageUrl = activeBackground?.imageUrl || FALLBACK_URL;

    if (imageUrl === currentImageUrl) return;

    const img = new Image();

    img.onload = () => {
      setHtmlBackground(imageUrl);
      setCurrentImageUrl(imageUrl);
    };

    img.onerror = () => {
      setHtmlBackground(FALLBACK_URL);
      setCurrentImageUrl(FALLBACK_URL);
    };

    const timeoutId = setTimeout(() => {
      setHtmlBackground(FALLBACK_URL);
    }, 10000);

    img.src = imageUrl;

    return () => {
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [activeBackground?.imageUrl]);

  return null;
};

export default BackgroundRenderer;
