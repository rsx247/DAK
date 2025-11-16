# Icon Migration Guide

This guide helps you migrate from inline icon definitions to the centralized icon system.

## Overview

All icons are now centralized in `components/Layout/Icons.tsx` with:
- Consistent 24x24 viewBox
- 2px stroke width
- Standardized className prop handling
- TypeScript support

## Migration Steps

### 1. EventDetail.tsx

**Before:**
```tsx
const ClockIcon = () => <svg ...>...</svg>;
const AccessIcon = () => <svg ...>...</svg>;
// ... more inline icons
```

**After:**
```tsx
import { 
  ClockIcon, 
  AccessIcon, 
  RecurrenceIcon, 
  CostIcon, 
  PinIcon, 
  SaladIcon, 
  CalendarIcon, 
  LinkIcon, 
  PhoneIcon, 
  EmailIcon 
} from '../Layout/Icons';
```

**Changes needed:**
- Remove all inline icon definitions (lines 35-44)
- Add import statement at top
- Icons will work with existing usage

### 2. EventListItem.tsx

**Before:**
```tsx
const PinIcon: React.FC = () => <svg ...>...</svg>;
const ClockIcon: React.FC = () => <svg ...>...</svg>;
// ... more inline icons
```

**After:**
```tsx
import { 
  PinIcon, 
  ClockIcon, 
  CalendarIcon, 
  AccessLevelIcon, 
  CostIcon, 
  DietaryIcon 
} from '../Layout/Icons';
```

**Changes needed:**
- Remove inline icon definitions (lines 30-77)
- Add import statement
- Replace `AccessLevelIcon` usage (already centralized)
- Replace `CostIcon` usage (now accepts `cost` prop)
- Replace `DietaryIcon` usage (now accepts `tag` prop)

### 3. VenueCard.tsx

**Before:**
```tsx
const ReligiousIcon: React.FC<{className?: string}> = ({className}) => <svg ...>...</svg>;
const CommunityIcon: React.FC<{className?: string}> = ({className}) => <svg ...>...</svg>;
// ... more inline icons
```

**After:**
```tsx
import { 
  ReligiousIcon, 
  CommunityIcon, 
  FoodBankIcon, 
  CommercialIcon,
  PinIcon 
} from '../Layout/Icons';
```

**Changes needed:**
- Remove inline icon definitions (lines 5-22, 65-69)
- Add import statement
- Icons will work with existing usage

### 4. GeolocationStatusBar.tsx

**Before:**
```tsx
const SpinnerIcon: React.FC = () => <svg ...>...</svg>;
const GpsTrackingIcon: React.FC = () => <svg ...>...</svg>;
```

**After:**
```tsx
import { SpinnerIcon, GpsTrackingIcon } from './Icons';
```

**Changes needed:**
- Remove inline icon definitions (lines 30-45)
- Add import statement
- Icons will work with existing usage

### 5. AdminEventListItem.tsx

**Before:**
```tsx
const SourceLinkIcon: React.FC<{ url: string }> = ({ url }) => (
  <a href={url} ...>
    <svg ...>...</svg>
  </a>
);
```

**After:**
```tsx
import { LinkIcon } from '../Layout/Icons';

const SourceLinkIcon: React.FC<{ url: string }> = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent flex-shrink-0" title="Bekijk bron">
    <LinkIcon className="h-4 w-4" />
  </a>
);
```

**Changes needed:**
- Replace inline SVG with `LinkIcon` component
- Keep the `<a>` wrapper for functionality

## Icon Mapping Reference

| Old Inline Icon | New Centralized Icon | Notes |
|----------------|---------------------|-------|
| `ClockIcon` (EventDetail) | `ClockIcon` | Same name, different design |
| `ClockIcon` (EventListItem) | `ClockIcon` | Same name, different design |
| `AccessIcon` (EventDetail) | `AccessIcon` | Same name, different design |
| `AccessIcon` (FilterControls) | `AccessIcon` | Same name, different design |
| `PinIcon` (multiple files) | `PinIcon` | Unified design |
| `CalendarIcon` (multiple files) | `CalendarIcon` | Unified design |
| `CostIcon` (EventDetail) | `CostIcon` | Now accepts `cost` prop |
| `CostIcon` (EventListItem) | `CostIcon` | Now accepts `cost` prop |
| `SaladIcon` | `SaladIcon` | Same name |
| `DietaryIcon` (EventListItem) | `DietaryIcon` | Now accepts `tag` prop |
| `LinkIcon` / `SourceLinkIcon` | `LinkIcon` | Unified |
| `RecurrenceIcon` | `RecurrenceIcon` | New centralized |
| `PhoneIcon` | `PhoneIcon` | New centralized |
| `EmailIcon` | `EmailIcon` | New centralized |
| `AccessLevelIcon` | `AccessLevelIcon` | Now accepts `level` prop |
| `ReligiousIcon` | `ReligiousIcon` | New centralized |
| `CommunityIcon` | `CommunityIcon` | New centralized |
| `FoodBankIcon` | `FoodBankIcon` | New centralized |
| `SpinnerIcon` | `SpinnerIcon` | New centralized |
| `GpsTrackingIcon` | `GpsTrackingIcon` | New centralized |

## Component-Specific Updates

### FilterControls.tsx
✅ Already using centralized icons - no changes needed

### TimelineHeader.tsx
✅ Already using centralized icons - no changes needed

## Benefits of Migration

1. **Consistency**: All icons use the same design system
2. **Maintainability**: Update once, changes everywhere
3. **Performance**: Icons are defined once, reused many times
4. **Type Safety**: TypeScript support for all icons
5. **Flexibility**: Easy to swap icon sets or add variants

## Testing Checklist

After migration, verify:
- [ ] All icons render correctly
- [ ] Icons maintain proper sizing (className prop works)
- [ ] Color theming still works
- [ ] No console errors
- [ ] Visual appearance matches original
- [ ] All interactive elements still work

## Rollback Plan

If issues arise, you can:
1. Keep old inline icons temporarily
2. Import both old and new icons
3. Gradually migrate component by component
4. Use feature flags if needed


