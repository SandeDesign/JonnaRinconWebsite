/**
 * Utility functions for play button styling
 */

export const getPlayButtonContainerClass = (isCurrentlyPlaying: boolean): string => {
  if (isCurrentlyPlaying) {
    // Red button, fully visible, no blur
    return '';
  }
  // Blur effect on inactive buttons
  return 'backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity';
};

export const getPlayButtonSymbolClass = (isCurrentlyPlaying: boolean): string => {
  if (isCurrentlyPlaying) {
    // Red symbol for currently playing
    return 'text-red-500';
  }
  // Gray symbol for inactive
  return 'text-gray-400';
};

export const getRowHighlightClass = (isCurrentlyPlaying: boolean): string => {
  if (isCurrentlyPlaying) {
    return 'bg-opacity-30 bg-red-500';
  }
  return '';
};
