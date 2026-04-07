import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';

/**
 * BackgroundRenderer applies the active background from Firebase to the page
 * Should be placed in the root of the app to affect all pages
 */
const BackgroundRenderer: React.FC = () => {
  const { activeBackground } = useBackground();

  React.useEffect(() => {
    if (activeBackground?.imageUrl) {
      // Apply background image to body element
      const style = document.documentElement.style;
      style.backgroundImage = `url('${activeBackground.imageUrl}')`;
      style.backgroundAttachment = 'fixed';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
      style.backgroundSize = 'cover';
      style.zIndex = '-1';

      // Also set on body as fallback
      document.body.style.backgroundImage = `url('${activeBackground.imageUrl}')`;
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
    } else {
      // Clear background if none is active (fallback to black)
      const style = document.documentElement.style;
      style.backgroundImage = 'none';
      document.body.style.backgroundImage = 'none';
    }

    return () => {
      // Cleanup on unmount
      const style = document.documentElement.style;
      style.backgroundImage = 'none';
      document.body.style.backgroundImage = 'none';
    };
  }, [activeBackground]);

  // This component doesn't render anything visible
  return null;
};

export default BackgroundRenderer;
