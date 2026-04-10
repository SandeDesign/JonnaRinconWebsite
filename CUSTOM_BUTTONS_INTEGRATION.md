# Custom Track Buttons Integration Guide

## Overview

The custom button system allows admins to configure up to 2 custom buttons globally that can be displayed on track cards and in modals. These buttons are managed through the admin tracks page and stored in global settings.

## Files Added/Modified

### New Files
- `src/components/admin/CustomButtonConfig.tsx` - Admin UI for configuring custom buttons
- `src/components/CustomButtonGroup.tsx` - Reusable component to display custom buttons
- `src/hooks/useTrackSettings.ts` - Hook to manage track settings
- `src/lib/utils/customButtonUtils.ts` - Utility functions for button handling

### Modified Files
- `src/lib/firebase/services/settingsService.ts` - Added CustomButton type and methods
- `src/pages/admin/TracksPage.tsx` - Integrated CustomButtonConfig into filter section

## How to Use

### 1. Admin Configuration

The custom button configuration is accessible in the admin tracks page at `/admin/tracks`:

- Look for the "Custom Track Buttons" section next to the filters
- Enable/disable buttons with checkboxes
- Configure each button:
  - **Label**: The text displayed on the button (e.g., "Download", "Shop", "Learn More")
  - **URL/Link**: The destination URL (supports full URLs with protocol)
  - **Color**: Choose from 8 color options (Blue, Purple, Pink, Red, Green, Cyan, Yellow, Indigo)
- Click "Save Custom Buttons" to persist settings globally

### 2. Display Buttons in Track Cards

To display custom buttons on track cards, import and use the `CustomButtonGroup` component:

```tsx
import CustomButtonGroup from '../CustomButtonGroup';
import { useTrackSettings } from '../../hooks/useTrackSettings';

function TrackCard({ track }) {
  const { settings } = useTrackSettings();

  return (
    <div className="track-card">
      {/* Track info */}
      
      {/* Custom buttons */}
      <CustomButtonGroup
        button1={settings?.customButton1}
        button2={settings?.customButton2}
        variant="full"
        className="mt-4"
      />
    </div>
  );
}
```

### 3. Display Buttons in Track Modals

Add custom buttons to track detail modals:

```tsx
import CustomButtonGroup from '../CustomButtonGroup';
import { useTrackSettings } from '../../hooks/useTrackSettings';

function TrackDetailModal({ track, isOpen, onClose }) {
  const { settings } = useTrackSettings();

  return (
    <div className="modal">
      {/* Track details */}
      
      {/* Custom buttons - compact variant for modals */}
      <CustomButtonGroup
        button1={settings?.customButton1}
        button2={settings?.customButton2}
        variant="compact"
        className="mt-6"
      />
    </div>
  );
}
```

## API Reference

### useTrackSettings Hook

```typescript
const { settings, loading, error, updateSettings } = useTrackSettings();

// settings.customButton1 - First custom button config (if enabled)
// settings.customButton2 - Second custom button config (if enabled)
// loading - Boolean indicating if settings are being loaded
// error - Error message if loading fails
// updateSettings(newSettings) - Save settings to Firebase
```

### CustomButton Type

```typescript
interface CustomButton {
  label: string;      // Button text
  url: string;        // Destination URL
  color: string;      // CSS color class (e.g., 'bg-blue-600 hover:bg-blue-700')
}
```

### CustomButtonGroup Component

```typescript
interface CustomButtonGroupProps {
  button1?: CustomButton;      // First button config
  button2?: CustomButton;      // Second button config
  variant?: 'compact' | 'full'; // 'compact' for smaller buttons (default: 'full')
  className?: string;           // Additional CSS classes
}
```

### Utility Functions

#### `isValidCustomButton(button: CustomButton | undefined): boolean`
Validates that a button has all required fields.

#### `openCustomButtonUrl(url: string): void`
Safely opens a URL in a new tab (adds protocol if needed).

#### `getButtonColorClasses(color: string): string`
Gets the full CSS classes for a button color.

## Styling

The component uses Tailwind CSS with these color options:

- **Blue**: `bg-blue-600 hover:bg-blue-700`
- **Purple**: `bg-purple-600 hover:bg-purple-700`
- **Pink**: `bg-pink-600 hover:bg-pink-700`
- **Red**: `bg-red-600 hover:bg-red-700`
- **Green**: `bg-green-600 hover:bg-green-700`
- **Cyan**: `bg-cyan-600 hover:bg-cyan-700`
- **Yellow**: `bg-yellow-600 hover:bg-yellow-700`
- **Indigo**: `bg-indigo-600 hover:bg-indigo-700`

## Examples

### Example 1: Track with Download and Shop Buttons

Admin configures:
- Button 1: Label="Download", URL="https://download.example.com/track", Color=Blue
- Button 2: Label="Shop", URL="https://shop.example.com", Color=Red

Displayed on track cards as two buttons.

### Example 2: Only One Button Enabled

If only Button 1 is enabled, only one button appears. Button 2 is ignored.

### Example 3: Custom Colors Per Button

Button 1 could be Blue (for information), Button 2 could be Pink (for calls-to-action).

## Firebase Storage

Settings are stored in Firestore under:
```
/settings/tracks
{
  customTab1Enabled: boolean,
  customTab1Label: string,
  customTab2Enabled: boolean,
  customTab2Label: string,
  customButton1?: {
    label: string,
    url: string,
    color: string
  },
  customButton2?: {
    label: string,
    url: string,
    color: string
  },
  updatedAt: timestamp,
  updatedBy: string
}
```

## Security Notes

- Button URLs open in new tabs with `rel="noopener noreferrer"` for security
- URL validation occurs on click (URLs without protocol get https:// prefix)
- Only admins can modify settings through the Firebase rules
- Settings are globally cached in React state to avoid repeated Firebase queries

## Troubleshooting

### Buttons Not Appearing
1. Check that buttons are enabled in the admin panel
2. Verify the custom buttons have a label and URL configured
3. Make sure the component using buttons is calling `useTrackSettings()`

### Settings Not Saving
1. Check Firebase authentication status
2. Verify user has admin role
3. Check browser console for error messages
4. Ensure internet connection is stable

### Button Styling Issues
1. Verify Tailwind CSS is properly configured in your project
2. Check that color classes are correctly formed
3. Ensure CustomButtonGroup component is properly imported

## Future Enhancements

Potential improvements:
- Add icon selection for buttons
- Support for conditional button display (show on certain track types)
- Analytics tracking for button clicks
- Button animation variations
- Reordering buttons for different pages/components
