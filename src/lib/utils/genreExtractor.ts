/**
 * Utility function to extract unique genres from data objects
 */

export interface GenreExtractorOptions {
  separator?: string;
  trimWhitespace?: boolean;
  sort?: boolean;
  includeAll?: boolean;
}

/**
 * Extract all unique genres from an array of objects with a genre field
 * Handles comma-separated genres and returns a sorted, deduplicated list
 *
 * @param items - Array of objects with a genre field
 * @param options - Configuration options
 * @returns Array of unique genre strings
 */
export function extractUniqueGenres<T extends { genre?: string }>(
  items: T[],
  options: GenreExtractorOptions = {}
): string[] {
  const {
    separator = ',',
    trimWhitespace = true,
    sort = true,
    includeAll = false,
  } = options;

  const genres = new Set<string>();

  // Extract all genres from items
  items.forEach((item) => {
    if (item.genre) {
      // Split by separator if present
      const genreList = item.genre.split(separator);

      genreList.forEach((genre) => {
        // Trim whitespace if enabled
        let processedGenre = trimWhitespace ? genre.trim() : genre;

        // Only add non-empty genres
        if (processedGenre) {
          genres.add(processedGenre);
        }
      });
    }
  });

  // Convert to array
  let result = Array.from(genres);

  // Sort alphabetically if enabled
  if (sort) {
    result.sort((a, b) => a.localeCompare(b));
  }

  // Add "All" option at the beginning if enabled
  if (includeAll) {
    result = ['All', ...result];
  }

  return result;
}

/**
 * Extract genres and filter function for use in UI
 * Returns genres array and a filter function for the data
 */
export function createGenreFilter<T extends { genre?: string }>(
  items: T[],
  options?: GenreExtractorOptions
) {
  const genres = extractUniqueGenres(items, { ...options, includeAll: false });

  return {
    genres,
    isInGenre: (item: T, selectedGenre: string | 'All') => {
      if (selectedGenre === 'All') return true;
      if (!item.genre) return false;

      // Check if the genre string contains the selected genre
      // This handles both single genres and comma-separated genres
      const genreList = item.genre.split(',').map(g => g.trim());
      return genreList.includes(selectedGenre);
    },
  };
}
