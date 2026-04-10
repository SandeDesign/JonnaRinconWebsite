# Album Feature - Quick Start Guide

## What Was Added

A complete album management system has been added to the Jonna Rincon website. This includes:

- **Admin Panel** - Manage albums (create, edit, delete)
- **Album Database** - Firebase Firestore collection for albums
- **Public Modal** - Display album details and purchase tracks
- **Pricing System** - Per-track and full-album pricing with discounts
- **Track Linking** - Connect tracks to albums
- **Components** - Ready-to-use React components for display

## Getting Started (5 Minutes)

### Step 1: Access the Admin Panel

1. Go to `/admin` and log in with your admin credentials
2. You should now see "Albums" in the sidebar menu between "Tracks" and "Remixes"

### Step 2: Create Your First Album

1. Click on "Albums" in the admin sidebar
2. Click "Create Album" button
3. Fill in the form:
   - **Album Title**: Name your album
   - **Artist**: Artist name
   - **Genre**: Primary genre
   - **Cover Image URL**: Link to album cover image
   - **Per-Track Price**: Price for individual track purchase (e.g., $2.99)
   - **Full Album Price**: Discount price for full album (e.g., $19.99)
4. Scroll down and select tracks from the "Select Tracks" section
5. Set status to "Published" to make it public
6. Optional: Check "Featured Album" to highlight it
7. Click "Create Album"

### Step 3: View Your Album in Admin

Back on the Albums page, you'll see:
- Album cover with title and artist
- Track count and genre
- Pricing information
- Edit/Delete buttons
- Feature/Publish toggles

## How Users Will See It

Once integrated into the public tracks page, users will:

1. **View Albums**: See album cards with cover art
2. **Open Album Detail Modal**: Click to see full album info
3. **See Tracklist**: View all tracks with individual pricing
4. **Buy Options**:
   - Individual tracks at per-track price
   - Full album at discounted price
5. **Add to Cart**: Purchase their preferred option

## Files Created

### Core Files
- `src/lib/firebase/services/albumService.ts` - Backend service
- `src/hooks/useAlbums.ts` - React hooks
- `src/pages/admin/AlbumsPage.tsx` - Admin interface
- `src/components/AlbumDetailModal.tsx` - Public modal
- `src/components/AlbumCard.tsx` - Grid card

### Updated Files
- `src/lib/firebase/types.ts` - Added Album type
- `src/App.admin.tsx` - Added route
- `src/components/admin/AdminLayout.tsx` - Added nav item
- `src/lib/firebase/services/index.ts` - Added export

### Documentation
- `ALBUM_FEATURE_INTEGRATION.md` - Complete reference
- `ALBUM_TRACKS_PAGE_INTEGRATION.tsx` - Integration examples
- `ALBUM_QUICKSTART.md` - This file

## Key Features

### Admin Features
✓ Create/Edit/Delete albums
✓ Select and manage tracks
✓ Set pricing (per-track and full album)
✓ Publish/Draft status
✓ Feature albums
✓ View statistics (plays, downloads)

### User Features
✓ View album details
✓ See tracklist with metadata
✓ Preview individual tracks
✓ Buy individual tracks
✓ Buy full album with discount
✓ Add items to cart

### Backend Features
✓ Real-time Firestore sync
✓ Statistics tracking (plays, downloads)
✓ Role-based access control
✓ Publishing workflow
✓ Album-track relationships

## Pricing Examples

**Example Album Setup:**
- 10 tracks per album
- Per-track price: $2.99 (Total: $29.90)
- Full album price: $19.99
- Savings: $9.91 (33% discount)

Admin shows:
```
Per Track Price:    $2.99
Full Album Price:   $19.99
Save 33%
```

## Integration with Public Page

The album system is **ready to integrate** but NOT YET connected to the public tracks page.

To add albums to the public site:

1. **Option A - New Albums Tab**
   - Add "Albums" to main navigation
   - Display albums in dedicated section
   - Uses `AlbumCard` and `AlbumDetailModal`

2. **Option B - Featured Section**
   - Show featured albums at top of Tracks page
   - Keep existing track view
   - Best for existing user experience

3. **Option C - Mixed Grid**
   - Show albums and tracks together
   - Filter by album/single/remix
   - Most modern approach

See `ALBUM_TRACKS_PAGE_INTEGRATION.tsx` for code examples.

## Common Tasks

### Create an Album
1. Admin > Albums > Create Album
2. Fill form with album details
3. Select tracks from list
4. Set pricing and status
5. Save

### Edit an Album
1. Admin > Albums
2. Find album in grid
3. Click Edit
4. Modify any fields
5. Update

### Delete an Album
1. Admin > Albums
2. Find album
3. Click Delete button
4. Confirm deletion

### Feature an Album
1. Admin > Albums
2. Click star icon on album card
3. Album now appears in featured section

### Publish an Album
1. Admin > Albums
2. Click eye icon on album card
3. Changes status from Draft to Published
4. Now visible to public (when integrated)

## Pricing Strategy Tips

### Good Pricing:
- Per-track: $1.99 - $4.99
- Full album (10 tracks): $9.99 - $19.99
- Discount: 25-40% off combined price
- Free samples: Some tracks/albums for promotion

### Why Bundle Discount Works:
- Encourages larger purchases
- Increases average order value
- Incentivizes exploring all tracks
- Standard music industry practice

## Troubleshooting

**Q: Albums not showing in admin**
- Check you're logged in as admin
- Try refreshing the page
- Check browser console for errors

**Q: Can't select tracks**
- Create tracks first in Tracks admin
- Tracks must exist to add to albums
- Try refreshing after creating tracks

**Q: Pricing not displaying correctly**
- Ensure numbers not strings: `2.99` not `"2.99"`
- Check fullAlbumPrice < perTrackPrice × trackCount
- Verify no null/undefined values

**Q: Album not saving**
- Check all required fields filled
- Verify at least 1 track selected
- Check browser console for errors
- Try again or contact support

## API Reference Quick

### Create Album
```typescript
await albumService.createAlbum({
  title: 'Album Name',
  artist: 'Artist Name',
  description: 'Description',
  genre: 'Electronic',
  coverImageUrl: 'https://...',
  trackIds: ['track1', 'track2'],
  trackCount: 2,
  perTrackPrice: 2.99,
  fullAlbumPrice: 4.99,
  isFree: false,
  status: 'published',
  featured: false,
  slug: 'album-name',
  plays: 0,
  downloads: 0,
  likes: 0,
});
```

### Get Album
```typescript
const album = await albumService.getAlbumById('albumId');
```

### Update Album
```typescript
await albumService.updateAlbum('albumId', {
  title: 'New Title',
  featured: true,
});
```

### Delete Album
```typescript
await albumService.deleteAlbum('albumId');
```

### Hook Usage
```typescript
const { albums, loading, error } = useAlbums();
const { albums: featured } = useFeaturedAlbums();
```

## Next Steps

1. **Try it out**: Create a test album with existing tracks
2. **Test the UI**: Preview in admin panel
3. **Decide Integration**: Choose how to show on public page
4. **Implement Integration**: Use code from `ALBUM_TRACKS_PAGE_INTEGRATION.tsx`
5. **Test Public View**: Verify album displays correctly
6. **Configure Pricing**: Set optimal prices for your content

## Support

For detailed information, see:
- `ALBUM_FEATURE_INTEGRATION.md` - Complete reference guide
- `ALBUM_TRACKS_PAGE_INTEGRATION.tsx` - Code integration examples
- Admin panel - Live interface for management

---

**Ready to sell albums!** 🎵
