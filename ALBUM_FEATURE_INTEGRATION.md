# Album Management Feature - Complete Integration Guide

## Overview
This document describes the comprehensive album management system that has been integrated into the Jonna Rincon website. The system allows for full album creation, management, and display with flexible pricing options.

## Features Implemented

### 1. Album Type Definition
**File**: `src/lib/firebase/types.ts`

Added complete `Album` interface with:
- Basic metadata (title, artist, description, genre, subGenre, mood, tags)
- Cover image and artwork URLs
- Track management (trackIds array, trackCount)
- Pricing system:
  - `perTrackPrice`: Individual track purchase price
  - `fullAlbumPrice`: Discounted full album price
  - `isFree`: Boolean flag for free albums
- Status management (draft, published, archived)
- Featured flag for promotion
- Statistics (plays, downloads, likes)
- SEO metadata (metaTitle, metaDescription, slug)
- Timestamps and creator info

Updated `Track` interface to include:
- `albumId`: Optional reference to parent Album
- `sortOrder`: Track order within album

### 2. Album Service (Firebase Backend)
**File**: `src/lib/firebase/services/albumService.ts`

Complete CRUD operations:
- `createAlbum()`: Create new albums with validation
- `getAlbumById()`: Fetch specific album
- `getAllAlbums()`: Query albums with filtering options
- `getPublishedAlbums()`: Get only published albums
- `updateAlbum()`: Update album metadata
- `deleteAlbum()`: Remove albums
- `getFeaturedAlbums()`: Get featured albums for homepage
- `getAlbumsByArtist()`: Query by artist
- `subscribeToAlbums()`: Real-time album updates
- `addTrackToAlbum()`: Link track to album
- `removeTrackFromAlbum()`: Unlink track from album
- `incrementPlays()` & `incrementDownloads()`: Statistics tracking

### 3. useAlbums Hook
**File**: `src/hooks/useAlbums.ts`

React hooks for album data:
- `useAlbums()`: Hook with optional filtering by status and featured flag
- `useFeaturedAlbums()`: Specialized hook for featured albums
- Includes loading states and error handling
- Real-time Firestore subscription support

### 4. Admin Album Management Page
**File**: `src/pages/admin/AlbumsPage.tsx`

Complete admin interface for album management:

#### Features:
- Create new albums
- Edit existing albums
- Delete albums
- Toggle featured status
- Toggle publish/draft status
- Bulk track selection for album
- Album artwork URL management
- Pricing configuration:
  - Per-track price
  - Full album price
  - Free album toggle
- Album statistics display (track count, plays, downloads)

#### UI Components:
- Album grid display with cover images
- Modal form for creation/editing
- Status indicators (Featured, Published)
- Track selection interface (scrollable list)
- Pricing display with calculations

### 5. Album Detail Modal (Public View)
**File**: `src/components/AlbumDetailModal.tsx`

User-facing modal for album viewing and purchasing:

#### Display Features:
- Album cover with hover play effect
- Artist and title information
- Genre and mood tags
- Full album description
- Statistics (track count, plays, downloads)
- Tracklist with:
  - Track number
  - Play/pause controls
  - Artist name
  - Genre and BPM
  - Individual track pricing
  - Add to cart buttons

#### Pricing Display:
- Per-track pricing for individual purchases
- Full album pricing with bundle discount
- Savings calculation and percentage display
- Free album indicator
- "In Cart" status for selected items

#### User Actions:
- Play album from first track
- Play individual tracks
- Add full album to cart
- Add individual tracks to cart
- Responsive design for all screen sizes

### 6. Album Card Component (Public Display)
**File**: `src/components/AlbumCard.tsx`

Grid-friendly album display card:
- Album cover with hover effects
- Title and artist
- Track count and genre
- Pricing information
- Featured and savings badges
- Click to open detail modal
- Hover play button

## Integration Points

### Admin Panel Navigation
**File**: `src/components/admin/AdminLayout.tsx`
- Added "Albums" menu item under music management
- Links to `/admin/albums` route

### Admin Routes
**File**: `src/App.admin.tsx`
- Imported `AlbumsPage` component
- Added protected route: `/admin/albums`
- Requires admin authentication

### Service Exports
**File**: `src/lib/firebase/services/index.ts`
- Exported `albumService` for use throughout app

### Admin Pages Index
**File**: `src/pages/admin/index.ts`
- Added `AlbumsPage` export for lazy loading

## How to Use

### For Admin Users

#### Creating an Album
1. Navigate to Admin Panel > Albums
2. Click "Create Album"
3. Fill in album details:
   - Title, Artist, Description
   - Genre and Sub-genre
   - Cover image URL
   - Per-track and full album pricing
4. Select tracks from available list
5. Set status (Draft/Published)
6. Toggle featured if desired
7. Click "Create Album"

#### Editing an Album
1. Find album in grid
2. Click "Edit" button
3. Modify any fields
4. Update track selection
5. Click "Update Album"

#### Managing Album Visibility
- **Publish/Unpublish**: Click eye icon to change status
- **Feature/Unfeature**: Click star icon to toggle featured status
- **Delete**: Click trash icon and confirm

### For Public Users

#### Viewing Albums
Albums can be displayed on the public tracks page:
1. Albums appear in dedicated section
2. Click album card to open detail modal
3. View full tracklist and details
4. Purchase individual tracks or full album

#### Purchasing
- **Individual Track**: Click cart icon next to track in modal
- **Full Album**: Click "Buy Album" button
- Both options add to shopping cart for checkout

## Pricing Logic

### Album vs. Individual Track Pricing

**Full Album Discount Calculation:**
```
Savings = (perTrackPrice × trackCount) - fullAlbumPrice
Savings % = (Savings / (perTrackPrice × trackCount)) × 100
```

Example:
- 10 tracks × $2.99 per track = $29.90
- Full album price: $19.99
- Savings: 33% off

**Free Albums:**
- Set `isFree: true` to make entire album free
- All tracks become free
- Displays "Free Download" instead of pricing

### Per-Track Pricing
- Each track can optionally have individual price override
- Falls back to album's `perTrackPrice` if not set
- Displayed in tracklist

## Database Structure

### Albums Collection (`albums`)
```
{
  id: string,
  title: string,
  artist: string,
  description: string,
  releaseDate: Timestamp,
  genre: string,
  subGenre?: string,
  mood?: string[],
  tags: string[],
  coverImageUrl: string,
  artworkUrl: string,
  trackIds: string[],
  trackCount: number,
  duration?: number,
  perTrackPrice: number,
  fullAlbumPrice: number,
  isFree: boolean,
  status: 'draft' | 'published' | 'archived',
  featured: boolean,
  plays: number,
  downloads: number,
  likes: number,
  metaTitle?: string,
  metaDescription?: string,
  slug: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt?: Timestamp,
  createdBy: string,
  lastUpdatedBy: string
}
```

### Tracks Collection Updates
Added fields to Track type:
- `albumId?: string` - Reference to parent album
- `sortOrder?: number` - Order within album

## File Structure

```
src/
├── components/
│   ├── AlbumDetailModal.tsx          # Album detail view modal
│   ├── AlbumCard.tsx                 # Grid card component
│   └── admin/
│       └── AdminLayout.tsx           # Updated navigation
├── pages/
│   ├── admin/
│   │   ├── AlbumsPage.tsx           # Admin management interface
│   │   └── index.ts                 # Updated exports
│   ├── TracksPage.tsx               # Public tracks page (ready for integration)
│   └── index.ts
├── hooks/
│   └── useAlbums.ts                 # React hooks for albums
├── lib/
│   └── firebase/
│       ├── types.ts                 # Updated Album type
│       └── services/
│           ├── albumService.ts      # Firebase backend service
│           └── index.ts             # Updated exports
├── App.admin.tsx                     # Updated routes
└── ALBUM_FEATURE_INTEGRATION.md      # This file
```

## Next Steps for Full Public Integration

To fully integrate albums into the public tracks page:

### Option 1: Dedicated Albums Section
Add a new tab or section in `src/pages/TracksPage.tsx`:
```tsx
{activeTab === 'albums' && (
  <section>
    <h2>Albums</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {albums.map(album => (
        <AlbumCard 
          key={album.id}
          album={album}
          trackCount={tracks.filter(t => album.trackIds.includes(t.id)).length}
          onViewAlbum={(album) => {
            // Open AlbumDetailModal
          }}
        />
      ))}
    </div>
  </section>
)}
```

### Option 2: Mixed Display
Integrate albums with existing track display:
- Show featured albums at top
- Mix albums and singles in main grid
- Filter options for album/track types

### Option 3: Albums as Playlist-like Collections
Use albums to group related tracks on tracks page with expandable sections

## Features Ready to Implement

1. **Shopping Cart Integration**: Update cart to handle both individual tracks and full albums
2. **Album Search & Filtering**: Add genre, artist, year filters
3. **Album Statistics Dashboard**: Show album performance metrics
4. **Album Sharing**: Share individual albums on social media
5. **Album Reviews/Ratings**: User feedback system
6. **Album Recommendations**: Show similar albums based on genre
7. **Download Tracking**: Track which albums are most downloaded
8. **Licensing by Album**: Group licenses by album instead of individual tracks

## Permissions

Albums require admin role for:
- Create operations
- Update operations
- Delete operations
- All service methods check user role

Non-admin users can:
- View published albums
- Play album tracks
- Purchase from albums
- View album details

## Error Handling

All service methods include:
- Try-catch error handling
- User authentication checks
- Firestore operation validation
- Console logging for debugging
- User-friendly error messages

## Best Practices

1. **Pricing Strategy**:
   - Always set `fullAlbumPrice` lower than sum of individual tracks
   - Incentivize full album purchases with meaningful discounts
   - Consider free samples of popular albums

2. **Organization**:
   - Use consistent naming conventions
   - Keep album artwork in consistent size (e.g., 1000x1000px)
   - Add relevant tags for discoverability

3. **Publishing Workflow**:
   - Save as draft first
   - Review album details and tracklist
   - Publish when ready for public release
   - Archive old albums instead of deleting

4. **Statistics**:
   - Monitor which albums get most plays
   - Track download vs. play ratio
   - Use data to improve album promotion

## Support & Troubleshooting

### Common Issues

**Issue**: Album not appearing in public view
- **Solution**: Check album status is 'published'

**Issue**: Tracks not showing in album
- **Solution**: Verify track IDs in trackIds array match actual track IDs

**Issue**: Pricing calculations incorrect
- **Solution**: Ensure perTrackPrice and fullAlbumPrice are set to numbers, not strings

**Issue**: Admin can't create albums
- **Solution**: Verify user has admin role in auth service

## API Reference

See `src/lib/firebase/services/albumService.ts` for complete method signatures and documentation.

---

**Last Updated**: April 2026
**Version**: 1.0
