/**
 * INTEGRATION EXAMPLE
 *
 * This file shows how to integrate custom buttons into existing track display components.
 * The example uses the public TracksPage and TrackDetailModal components.
 *
 * Copy these patterns to your own components.
 */

// ============================================
// EXAMPLE 1: Adding Custom Buttons to Track Lists
// ============================================

import CustomButtonGroup from './src/components/CustomButtonGroup';
import { useTrackSettings } from './src/hooks/useTrackSettings';

/**
 * Example of integrating custom buttons into a track list component
 */
function TrackListWithCustomButtons() {
  const { settings, loading } = useTrackSettings();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="track-list">
      {/* Your track list items */}
      {tracks.map((track) => (
        <div key={track.id} className="track-item">
          <h3>{track.title}</h3>
          <p>{track.artist}</p>

          {/* Add custom buttons below track info */}
          <CustomButtonGroup
            button1={settings?.customButton1}
            button2={settings?.customButton2}
            variant="full"
            className="mt-4"
          />
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 2: Adding Custom Buttons to Track Detail Modal
// ============================================

/**
 * Example of adding custom buttons to a track detail modal
 * Place this in your TrackDetailModal component
 */
function TrackDetailModalWithCustomButtons({ track, isOpen, onClose }) {
  const { settings, loading } = useTrackSettings();

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Track details */}
        <h2>{track.title}</h2>
        <p>{track.artist}</p>

        {/* Track metadata */}
        <div className="metadata">
          {track.year && <span>{track.year}</span>}
          {track.genre && <span>{track.genre}</span>}
          {track.bpm && <span>{track.bpm} BPM</span>}
        </div>

        {/* Custom buttons - use compact variant for modals */}
        {!loading && (
          <CustomButtonGroup
            button1={settings?.customButton1}
            button2={settings?.customButton2}
            variant="compact"
            className="mt-6 pt-6 border-t border-white/10"
          />
        )}

        <button onClick={onClose} className="btn-close">
          Close
        </button>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Album Track Card with Buttons
// ============================================

/**
 * Example of album track card with custom buttons
 */
function AlbumTrackCard({ track, albumName }) {
  const { settings, loading } = useTrackSettings();

  return (
    <div className="album-track">
      <div className="track-info">
        <span className="track-number">{track.trackNumber}</span>
        <span className="track-title">{track.title}</span>
        <span className="track-duration">{track.duration}</span>
      </div>

      {/* Custom buttons visible on hover or always visible */}
      {!loading && (
        <div className="track-actions">
          <CustomButtonGroup
            button1={settings?.customButton1}
            button2={settings?.customButton2}
            variant="compact"
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Track Card Grid (Like Spotify)
// ============================================

/**
 * Example of track card in a grid layout
 */
function TrackCardGrid({ track }) {
  const { settings, loading } = useTrackSettings();

  return (
    <div className="track-card-grid">
      <img src={track.artwork} alt={track.title} className="card-image" />

      <div className="card-content">
        <h3>{track.title}</h3>
        <p className="artist">{track.artist}</p>

        {/* Metadata */}
        <div className="metadata-row">
          {track.year && <span className="badge">{track.year}</span>}
          {track.type && <span className="badge">{track.type}</span>}
        </div>

        {/* Custom buttons */}
        {!loading && (
          <CustomButtonGroup
            button1={settings?.customButton1}
            button2={settings?.customButton2}
            variant="full"
            className="mt-4 w-full"
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Conditional Button Display
// ============================================

/**
 * Example of showing buttons only for specific track types or conditions
 */
function SmartTrackCard({ track }) {
  const { settings, loading } = useTrackSettings();

  // Only show buttons for published tracks
  const shouldShowButtons =
    track.status === 'published' &&
    (settings?.customButton1 || settings?.customButton2);

  return (
    <div className="track-card">
      <h3>{track.title}</h3>

      {shouldShowButtons && (
        <CustomButtonGroup
          button1={settings?.customButton1}
          button2={settings?.customButton2}
          variant="full"
        />
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 6: Using Button Click Handler
// ============================================

/**
 * Example of handling button clicks and tracking analytics
 */
import { openCustomButtonUrl } from './src/lib/utils/customButtonUtils';

function TrackCardWithAnalytics({ track }) {
  const { settings, loading } = useTrackSettings();

  const handleCustomButtonClick = (buttonLabel, buttonUrl, buttonIndex) => {
    // Track analytics
    console.log(`User clicked custom button: ${buttonLabel} on track: ${track.title}`);

    // Log to analytics service if available
    // analytics.trackEvent('custom_button_click', {
    //   buttonLabel,
    //   trackId: track.id,
    //   trackTitle: track.title,
    //   buttonIndex
    // });

    // Open the URL
    openCustomButtonUrl(buttonUrl);
  };

  return (
    <div className="track-card">
      <h3>{track.title}</h3>

      {!loading && (
        <div className="button-group">
          {settings?.customButton1 && (
            <button
              onClick={() =>
                handleCustomButtonClick(
                  settings.customButton1.label,
                  settings.customButton1.url,
                  1
                )
              }
              className={`custom-btn ${settings.customButton1.color}`}
            >
              {settings.customButton1.label}
            </button>
          )}

          {settings?.customButton2 && (
            <button
              onClick={() =>
                handleCustomButtonClick(
                  settings.customButton2.label,
                  settings.customButton2.url,
                  2
                )
              }
              className={`custom-btn ${settings.customButton2.color}`}
            >
              {settings.customButton2.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 7: Styling Variations
// ============================================

/**
 * Example of different styling approaches for custom buttons
 */

// Dark theme
function TrackCardDarkTheme() {
  const { settings } = useTrackSettings();
  return (
    <CustomButtonGroup
      button1={settings?.customButton1}
      button2={settings?.customButton2}
      variant="full"
      className="dark:bg-gray-900 dark:text-white"
    />
  );
}

// With icons
function TrackCardWithIcons() {
  const { settings } = useTrackSettings();
  const button1Icon = settings?.customButton1?.label.includes('Download')
    ? '↓'
    : '🔗';

  return (
    <div className="button-group">
      {settings?.customButton1 && (
        <button className={settings.customButton1.color}>
          <span>{button1Icon}</span>
          <span>{settings.customButton1.label}</span>
        </button>
      )}
    </div>
  );
}

// Stacked layout (mobile)
function TrackCardMobileLayout() {
  const { settings } = useTrackSettings();
  return (
    <CustomButtonGroup
      button1={settings?.customButton1}
      button2={settings?.customButton2}
      variant="full"
      className="flex-col w-full gap-3"
    />
  );
}

// ============================================
// EXAMPLE 8: Error Handling
// ============================================

/**
 * Example of proper error handling
 */
function TrackCardWithErrorHandling({ track }) {
  const { settings, loading, error } = useTrackSettings();

  if (error) {
    // Silently fail - show track without buttons
    console.warn('Failed to load custom button settings:', error);
    return (
      <div className="track-card">
        <h3>{track.title}</h3>
        {/* Show track without buttons */}
      </div>
    );
  }

  return (
    <div className="track-card">
      <h3>{track.title}</h3>

      {!loading && (settings?.customButton1 || settings?.customButton2) && (
        <CustomButtonGroup
          button1={settings.customButton1}
          button2={settings.customButton2}
          variant="full"
        />
      )}
    </div>
  );
}

// ============================================
// QUICK START CHECKLIST
// ============================================

/**
 * To integrate custom buttons into your component:
 *
 * 1. Import the required hooks and components:
 *    import CustomButtonGroup from '../CustomButtonGroup';
 *    import { useTrackSettings } from '../../hooks/useTrackSettings';
 *
 * 2. Call the hook in your component:
 *    const { settings, loading, error } = useTrackSettings();
 *
 * 3. Add the CustomButtonGroup component where you want buttons:
 *    <CustomButtonGroup
 *      button1={settings?.customButton1}
 *      button2={settings?.customButton2}
 *      variant="full" | "compact"
 *    />
 *
 * 4. Test by:
 *    - Going to /admin/tracks
 *    - Configuring custom buttons
 *    - Viewing your component
 *    - Clicking the buttons to ensure they work
 *
 * Optional:
 * - Use variant="compact" for smaller buttons in modals
 * - Add custom className for styling adjustments
 * - Use openCustomButtonUrl() for custom click handling
 * - Check loading/error states before rendering
 */
