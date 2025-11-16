# Icon Inventory & Analysis

## Overview
This document catalogs all icons used in the Gratis Eten Rotterdam project, their functions, locations, and current implementation status.

---

## Icon Categories

### 1. Sort & Filter Icons
**Location:** `components/Layout/Icons.tsx`

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `TimeIcon` | Sort by time | FilterControls.tsx (sort dropdown) | ✅ Centralized |
| `DistanceIcon` | Sort by distance | FilterControls.tsx (sort dropdown) | ✅ Centralized |
| `PriceIcon` | Filter by price/cost | FilterControls.tsx (price filter) | ✅ Centralized |
| `AccessIcon` | Filter by access level | FilterControls.tsx (access filter) | ⚠️ Duplicate in EventDetail.tsx |
| `EventTypeIcon` | Filter by event type | FilterControls.tsx (event type filter) | ✅ Centralized |
| `DietIcon` | Filter by dietary needs | FilterControls.tsx (diet filter) | ✅ Centralized |

### 2. Utility Icons
**Location:** `components/Layout/Icons.tsx`

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `CheckIcon` | Checkmark/selected state | FilterControls.tsx (checkbox) | ✅ Centralized |
| `ChevronLeftIcon` | Collapse/expand indicator | TimelineHeader.tsx | ✅ Centralized |

### 3. Event Detail Icons
**Location:** `components/Events/EventDetail.tsx` (inline definitions)

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `ClockIcon` | Display event time | EventDetail.tsx (time display) | ⚠️ Duplicate in EventListItem.tsx |
| `AccessIcon` | Display access level | EventDetail.tsx (access display) | ⚠️ Duplicate (different design) |
| `RecurrenceIcon` | Show recurring event | EventDetail.tsx (recurrence info) | ❌ Not centralized |
| `CostIcon` | Display cost/price | EventDetail.tsx (cost display) | ⚠️ Duplicate in EventListItem.tsx |
| `PinIcon` | Location/address | EventDetail.tsx (address display) | ⚠️ Duplicate in multiple files |
| `SaladIcon` | Dietary information | EventDetail.tsx (dietary tags) | ⚠️ Duplicate in EventListItem.tsx |
| `CalendarIcon` | Date/calendar | EventDetail.tsx (date display) | ⚠️ Duplicate in EventListItem.tsx |
| `LinkIcon` | External link | EventDetail.tsx (source link) | ⚠️ Duplicate in AdminEventListItem.tsx |
| `PhoneIcon` | Phone number | EventDetail.tsx (contact info) | ❌ Not centralized |
| `EmailIcon` | Email address | EventDetail.tsx (contact info) | ❌ Not centralized |

### 4. Event List Icons
**Location:** `components/Events/EventListItem.tsx` (inline definitions)

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `PinIcon` | Location indicator | EventListItem.tsx (venue location) | ⚠️ Duplicate |
| `ClockIcon` | Time indicator | EventListItem.tsx (time display) | ⚠️ Duplicate |
| `CalendarIcon` | Date indicator | EventListItem.tsx (date display) | ⚠️ Duplicate |
| `AccessLevelIcon` | Access level badge | EventListItem.tsx (access display) | ❌ Not centralized |
| `CostIcon` | Cost indicator | EventListItem.tsx (cost display) | ⚠️ Duplicate |
| `DietaryIcon` | Dietary tags | EventListItem.tsx (dietary info) | ❌ Not centralized |

### 5. Venue Icons
**Location:** `components/Venues/VenueCard.tsx` (inline definitions)

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `ReligiousIcon` | Religious venue category | VenueCard.tsx (category badge) | ❌ Not centralized |
| `CommunityIcon` | Community venue category | VenueCard.tsx (category badge) | ❌ Not centralized |
| `FoodBankIcon` | Food bank venue category | VenueCard.tsx (category badge) | ❌ Not centralized |
| `PinIcon` | Location indicator | VenueCard.tsx (address) | ⚠️ Duplicate |

### 6. Geolocation Icons
**Location:** `components/Layout/GeolocationStatusBar.tsx` (inline definitions)

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `SpinnerIcon` | Loading state | GeolocationStatusBar.tsx (loading) | ❌ Not centralized |
| `GpsTrackingIcon` | GPS/location tracking | GeolocationStatusBar.tsx (location status) | ❌ Not centralized |

### 7. Admin Icons
**Location:** `components/Admin/AdminEventListItem.tsx` (inline definition)

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `SourceLinkIcon` | External source link | AdminEventListItem.tsx (source URL) | ⚠️ Duplicate (same as LinkIcon) |

### 8. Favicon
**Location:** `index.html`

| Icon Name | Function | Usage Location | Status |
|-----------|----------|----------------|--------|
| `favicon` | Browser tab icon | index.html | ⚠️ Uses default Vite SVG |

---

## Issues Identified

### 1. **Duplication**
- `PinIcon` defined in 3+ locations with slight variations
- `ClockIcon` defined in 2+ locations with different designs
- `CalendarIcon` defined in 2+ locations with different designs
- `AccessIcon` has 2 different designs (filter vs detail)
- `CostIcon` has 2 different designs
- `LinkIcon` duplicated as `SourceLinkIcon`

### 2. **Inconsistency**
- Different viewBox sizes (20x20 vs 24x24)
- Different stroke widths (1.5 vs 2)
- Mixed fill vs stroke styles
- Inconsistent className handling

### 3. **Missing Icons**
- No centralized loading/spinner icon
- No centralized GPS/location icon
- No centralized contact icons (phone, email)
- No centralized recurrence icon
- No centralized dietary icons (vegetarian, vegan, halal)
- No centralized access level icons

### 4. **Design Issues**
- Some icons are too complex for small sizes
- Inconsistent visual weight
- Mixed icon styles (outline vs filled)

---

## Recommendations

### Priority 1: Consolidate Duplicates
- Create single source of truth for all icons
- Standardize viewBox (24x24 recommended)
- Consistent stroke width (2px)
- Unified className prop handling

### Priority 2: Complete Icon Set
- Add missing icons (phone, email, recurrence, etc.)
- Create variant icons (filled vs outline)
- Add size variants (sm, md, lg)

### Priority 3: Improve Design
- Use consistent icon library style (Heroicons recommended)
- Ensure all icons are optimized for small sizes
- Add proper accessibility attributes

---

## Icon Usage Statistics

- **Total Unique Icons:** ~25
- **Centralized Icons:** 8 (32%)
- **Duplicate Icons:** 12 (48%)
- **Inline Icons:** 17 (68%)
- **Missing from Central:** 17 (68%)

---

## Next Steps

1. ✅ Create comprehensive icon inventory (this document)
2. ⏳ Consolidate all icons into `components/Layout/Icons.tsx`
3. ⏳ Update all components to use centralized icons
4. ⏳ Add missing icons
5. ⏳ Standardize icon design system
6. ⏳ Add TypeScript types for icon props
7. ⏳ Create icon storybook/documentation


