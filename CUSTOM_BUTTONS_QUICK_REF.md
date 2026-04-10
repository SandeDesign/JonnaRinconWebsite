# Custom Buttons - Quick Reference Guide

## TL;DR

Custom buttons are globally configured in the admin panel and automatically displayed on tracks via a reusable component.

## Quick Start (3 steps)

### Step 1: Configure Buttons (Admin)
1. Go to `/admin/tracks`
2. Find "Custom Track Buttons" section
3. Enable buttons, set label, URL, and color
4. Click "Save"

### Step 2: Use in Your Component
```tsx
import CustomButtonGroup from '../CustomButtonGroup';
import { useTrackSettings } from '../../hooks/useTrackSettings';

function YourComponent() {
  const { settings } = useTrackSettings();

  return (
    <CustomButtonGroup
      button1={settings?.customButton1}
      button2={settings?.customButton2}
      variant="full"
    />
  );
}
```

### Step 3: Done!
Buttons automatically appear with the configured settings.

## Component Usage

### Basic (Full Size)
```tsx
<CustomButtonGroup
  button1={settings?.customButton1}
  button2={settings?.customButton2}
/>
```

### Compact (For Modals)
```tsx
<CustomButtonGroup
  button1={settings?.customButton1}
  button2={settings?.customButton2}
  variant="compact"
/>
```

### With Custom Styling
```tsx
<CustomButtonGroup
  button1={settings?.customButton1}
  button2={settings?.customButton2}
  className="mt-4 flex-col"
/>
```

## Hook Usage

```tsx
const { settings, loading, error, updateSettings } = useTrackSettings();

// Check if buttons exist
if (settings?.customButton1) {
  console.log(settings.customButton1.label); // e.g., "Download"
  console.log(settings.customButton1.url);   // e.g., "https://..."
  console.log(settings.customButton1.color); // e.g., "bg-blue-600..."
}
```

## Button Configuration
Each button has:
- `label` - Display text (e.g., "Download", "Shop")
- `url` - Destination URL (e.g., "https://example.com")
- `color` - CSS classes (e.g., "bg-blue-600 hover:bg-blue-700")

## Color Options
```
Blue, Purple, Pink, Red, Green, Cyan, Yellow, Indigo
```

## File Locations
- Admin Config: `src/components/admin/CustomButtonConfig.tsx`
- Display Component: `src/components/CustomButtonGroup.tsx`
- Hook: `src/hooks/useTrackSettings.ts`
- Utils: `src/lib/utils/customButtonUtils.ts`
- Settings Service: `src/lib/firebase/services/settingsService.ts`

## Common Patterns

### Track Card
```tsx
function TrackCard({ track }) {
  const { settings } = useTrackSettings();
  return (
    <div>
      {/* track info */}
      <CustomButtonGroup button1={settings?.customButton1} button2={settings?.customButton2} />
    </div>
  );
}
```

### Modal
```tsx
function Modal() {
  const { settings } = useTrackSettings();
  return (
    <div>
      {/* modal content */}
      <CustomButtonGroup button1={settings?.customButton1} button2={settings?.customButton2} variant="compact" />
    </div>
  );
}
```

### With Conditions
```tsx
if (settings?.customButton1 || settings?.customButton2) {
  return <CustomButtonGroup button1={settings?.customButton1} button2={settings?.customButton2} />;
}
```

## Variants
- `"full"` - Standard size buttons (default)
- `"compact"` - Smaller buttons for modals

## Admin Panel
- **Location**: `/admin/tracks` page
- **Section**: "Custom Track Buttons" (next to Filters)
- **Expandable**: Yes, click header to collapse/expand
- **Features**:
  - Enable/disable individual buttons
  - Live preview
  - 8 color options
  - Save with feedback

## Data Storage
- **Database**: Firebase Firestore
- **Collection**: `settings`
- **Document**: `tracks`
- **Fields**: `customButton1`, `customButton2` (optional)

## Error Handling
```tsx
const { settings, error } = useTrackSettings();

if (error) {
  console.error('Failed to load settings:', error);
  // Gracefully degrade - don't show buttons
}
```

## URLs
- Automatically get `https://` prefix if missing
- Open in new tab (safe window)
- Validated on click

## Props Quick Ref

### CustomButtonGroup
```typescript
{
  button1?: CustomButton,      // First button
  button2?: CustomButton,      // Second button
  variant?: 'compact' | 'full', // Size (default: 'full')
  className?: string            // Extra CSS classes
}
```

### CustomButton
```typescript
{
  label: string,   // "Download", "Shop", etc.
  url: string,     // "https://example.com"
  color: string    // "bg-blue-600 hover:bg-blue-700"
}
```

## Styling Hook
```tsx
import { getButtonColorClasses } from '../lib/utils/customButtonUtils';

const cssClasses = getButtonColorClasses(button.color);
```

## Validation
```tsx
import { isValidCustomButton } from '../lib/utils/customButtonUtils';

if (isValidCustomButton(settings?.customButton1)) {
  // Button is fully configured
}
```

## URL Opening
```tsx
import { openCustomButtonUrl } from '../lib/utils/customButtonUtils';

openCustomButtonUrl("https://example.com");
```

## Debugging
```tsx
// Log button settings
console.log('Button 1:', settings?.customButton1);
console.log('Button 2:', settings?.customButton2);

// Check loading state
console.log('Loading:', loading);

// Check for errors
console.log('Error:', error);
```

## Common Issues & Fixes

### Buttons not showing?
1. Check they're enabled in admin
2. Check label and URL are set
3. Check `{ settings }` has the button data
4. Check loading state

### Button styling wrong?
1. Verify color was selected
2. Clear browser cache
3. Check Tailwind CSS is loaded

### Click not working?
1. Check URL is valid
2. Check browser console for errors
3. Verify component is imported correctly

## One-Liner Examples

Show only if button exists:
```tsx
{settings?.customButton1 && <CustomButtonGroup button1={settings.customButton1} />}
```

With loading state:
```tsx
{!loading && <CustomButtonGroup button1={settings?.customButton1} button2={settings?.customButton2} />}
```

Conditional variant:
```tsx
<CustomButtonGroup button1={settings?.customButton1} variant={isMobile ? "compact" : "full"} />
```

## Resources
- Full Setup: `CUSTOM_BUTTONS_SETUP.md`
- Integration Guide: `CUSTOM_BUTTONS_INTEGRATION.md`
- Code Examples: `INTEGRATION_EXAMPLE.tsx`
