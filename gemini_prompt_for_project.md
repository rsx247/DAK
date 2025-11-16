# Prompt for Google Gemini 2.5 Pro - Gratis Eten Rotterdam App

## Project Overview

Build a **Free Food Finder App** for Rotterdam, Schiedam, and Vlaardingen that uses a **timeline-based discovery interface** to help people find free food events happening nearby RIGHT NOW.

### Core Concept
The app answers three questions instantly:
1. **What's available now?** (red vertical line shows current time)
2. **Where's the closest?** (left sidebar sorted by distance)
3. **What's coming up?** (horizontal timeline shows next 24 hours)

Think: **Festival timetable UX** but for food events in the city.

---

## Tech Stack Requirements

- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (responsive, mobile-first)
- **Maps:** Leaflet.js (no API keys needed)
- **Geolocation:** Browser Geolocation API with manual fallback
- **State Management:** React hooks (useState, useEffect, useMemo) - no Redux
- **Package Manager:** npm
- **Build Tool:** Vite

### Required Dependencies
```
"react": "^19.1.1"
"react-dom": "^19.1.1"
"react-leaflet": "^5.0.0"
"leaflet": "^1.9.4"
"tailwindcss": "^3.3.0"
"typescript": "~5.9.3"
```

---

## UI/UX Design System

### Color Palette (Airbnb-inspired)
- **Background:** `#FFFFFF`
- **Surface:** `#F7F7F7`
- **Border:** `#EBEBEB`
- **Text Primary:** `#222222`
- **Text Secondary:** `#717171`
- **Accent (Red):** `#FF5A5F` (for current time line)
- **Shadows:** Subtle (`0 1px 2px rgba(0,0,0,0.08)`)

### Venue Category Colors
- **Red:** Religious organizations
- **Green:** Community centers
- **Blue:** Food banks
- **Purple:** Commercial/restaurants

### Typography
- Font: System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)
- Headers: `font-weight: 600`
- Body: `font-size: 14px`, `line-height: 1.5`

---

## Layout Structure

### Desktop Layout
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Gratis Eten Rotterdam                         │
│ [Distance ▼] [Access ▼] [Type ▼] [Dietary ▼]        │
├──────────┬──────────────────────────────────────────┤
│ Venues   │ Timeline: 00:00  06:00  12:00  18:00  24:00│
│ (sorted  │ ────────┼───────┼───────┼───────┼───────  │
│ by dist) │         │       │  🔴   │       │        │
│          │         │  [Event Block] │      │        │
│ Venue A  │ ────────┼───────┼───────┼───────┼───────  │
│ 0.8km    │         │       │       │🔴[Event] │      │
│          │         │ [Event]│      │       │        │
│ Venue B  │ ────────┼───────┼───────┼───────┼───────  │
│ 1.2km    │              RED LINE (current time)       │
└──────────┴──────────────────────────────────────────┘
```

### Mobile Layout
- Collapsible venue list at top
- Horizontal scrollable timeline below
- Click event → Full-screen detail modal

---

## Component Architecture

### 1. **TimelineGrid** (`components/Timeline/TimelineGrid.tsx`)
- **Purpose:** Main visualization component
- **Features:**
  - Horizontal axis: 24-hour timeline (30-min slots = 48 slots)
  - Vertical axis: Venue rows (sorted by distance)
  - Red vertical line at current time position
  - Event blocks positioned by start/end time
  - Horizontal scroll for panning through time
  - Click event block → Opens detail panel

### 2. **VenueCard** (`components/Venues/VenueCard.tsx`)
- **Purpose:** Left sidebar venue list item
- **Displays:**
  - Venue name
  - Distance from user (e.g., "0.8 km")
  - Category icon/color
  - Click → Opens venue info panel

### 3. **EventBlock** (`components/Events/EventBlock.tsx`)
- **Purpose:** Individual event visualization on timeline
- **Displays:**
  - Food type (e.g., "Warm meal", "Food package")
  - Time range overlay
  - Color-coded by venue category
  - Width = duration (proportional)
  - Click → Opens event detail

### 4. **EventDetail** (`components/Events/EventDetail.tsx`)
- **Purpose:** Modal/drawer with full event information
- **Displays:**
  - Full description
  - Venue information
  - Access level (WALK_IN, REGISTRATION, REFERRAL)
  - Dietary tags (halal, vegan, etc.)
  - Cost information
  - Google Maps navigation button
  - Phone number (if available)

### 5. **FilterBar** (`components/Layout/FilterBar.tsx`)
- **Purpose:** Top filter controls
- **Filters:**
  - Distance: 1km, 2km, 5km, All
  - Access: All, Walk-in only
  - Event Type: All, Meals, Packages, Mobile
  - Dietary: All, Halal, Vegetarian, Vegan

### 6. **Header** (`components/Layout/Header.tsx`)
- Logo/title
- Location indicator
- Time view selector: TODAY, NEXT_24H, WEEK

### 7. **CurrentTimeLine** (`components/Timeline/CurrentTimeLine.tsx`)
- Red vertical line component
- Positioned at current time
- Updates every minute

### 8. **VenueInfo** (`components/Venues/VenueInfo.tsx`)
- Panel showing venue details
- About text, website, phone
- All events at this venue

---

## Data Model (TypeScript Interfaces)

```typescript
// Access levels
type AccessLevel = "WALK_IN" | "REGISTRATION" | "REFERRAL";

// Venue categories
type VenueCategory = "COMMUNITY" | "RELIGIOUS" | "FOOD_BANK" | "FOOD_RESCUE" | "COMMERCIAL";

// Verification status
type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'UNVERIFIED';

// Venue interface
interface Venue {
  id: string;
  name: string;
  address: string;
  city: string; // "Rotterdam" | "Schiedam" | "Vlaardingen"
  lat: number;
  lng: number;
  category: VenueCategory;
  about: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  lastVerified?: string; // ISO date
  dataSource?: string; // "website", "phone_call", etc.
  verificationStatus: VerificationStatus;
}

// Food Event interface
interface FoodEvent {
  id: string;
  title: string;
  description: string;
  venue: Venue;
  startTime: Date;
  endTime: Date;
  foodType: string; // "Warm meal", "Food package", "Coffee & snacks"
  dietaryTags: string[]; // ["halal", "vegan", "vegetarian"]
  accessLevel: AccessLevel;
  registrationUrl?: string;
  registrationPhone?: string;
  quantity?: string; // "50 servings"
  cost?: string; // "Gratis", "€2-€6"
  lastVerified?: string;
  dataSource?: string;
  verificationStatus: VerificationStatus;
}

// Event with calculated distance
interface FoodEventWithDistance extends FoodEvent {
  venue: VenueWithDistance;
}

interface VenueWithDistance extends Venue {
  distance: number; // in kilometers
}

// Filter state
interface FilterState {
  distance: number; // in km (1, 2, 5, or Infinity)
  accessLevel: "ALL" | "WALK_IN";
  eventType: "ALL" | "MEALS" | "PACKAGES" | "MOBILE";
  dietary: "ALL" | "HALAL" | "VEGETARIAN" | "VEGAN";
  openNow: boolean;
  noRegistration: boolean;
}

// Time view modes
type TimeViewMode = "TODAY" | "NEXT_24H" | "WEEK";

// User location
interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}
```

---

## Core Features

### 1. **Geolocation**
- Auto-detect user location on first load
- Calculate distances to all venues
- Sort venues by distance (closest first)
- Manual location override (search address)

### 2. **Timeline Visualization**
- 24-hour horizontal timeline
- 30-minute time slots (48 slots total)
- Current time indicator (red vertical line)
- Event blocks positioned by start/end time
- Event width = duration (proportional)

### 3. **Filtering**
- Filter by distance (1km, 2km, 5km, all)
- Filter by access level (walk-in only)
- Filter by event type (meals, packages)
- Filter by dietary requirements (halal, vegan)
- Filter "open now" (show only current events)

### 4. **Event Details**
- Click event → Full detail view
- Show venue information
- Google Maps navigation link
- Phone number (if available)
- Registration link/phone (if required)

### 5. **Responsive Design**
- Desktop: Sidebar + timeline grid
- Mobile: Collapsible list + horizontal scroll timeline
- Touch-friendly event blocks
- Mobile-optimized detail modal

### 6. **Time Management**
- Show events for TODAY (default)
- Option: NEXT_24H (next 24 hours)
- Option: WEEK (full week view)
- Handle recurring events (weekly patterns)

---

## Sample Data Structure

The app needs **sample data** for 5-10 food events in Rotterdam:

**Example Event:**
```typescript
{
  id: 'event-pauluskerk-koffie-broodjes',
  title: 'Koffie & Broodjes',
  description: 'Koffie en broodjes voor iedereen die het nodig heeft.',
  venue: {
    id: 'pauluskerk',
    name: 'Pauluskerk Rotterdam',
    address: 'Pauluskerkplein 1, 3011 DA Rotterdam',
    city: 'Rotterdam',
    lat: 51.9225,
    lng: 4.4792,
    category: 'RELIGIOUS',
    about: 'Historische kerk in het centrum van Rotterdam die gratis maaltijden biedt.',
    phone: '010-411-2020',
    website: 'https://pauluskerk.nl',
    verificationStatus: 'VERIFIED'
  },
  startTime: new Date(/* Sunday 09:00 this week */),
  endTime: new Date(/* Sunday 21:00 this week */),
  foodType: 'Coffee & snacks',
  dietaryTags: [],
  accessLevel: 'WALK_IN',
  cost: 'Gratis',
  verificationStatus: 'VERIFIED'
}
```

**Include venues like:**
- Pauluskerk Rotterdam
- Rotterdamse Voedsel Service (Food Bank)
- Stichting Thuisgekookt
- Leger des Heils Rotterdam
- Community centers in different neighborhoods

---

## Key Implementation Details

### 1. **Time Calculation**
Use `getDateThisWeek()` helper function to calculate event times:
```typescript
const getDateThisWeek = (dayOffset: number, hours: number, minutes: number = 0): Date => {
  const now = new Date();
  const date = new Date(now);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
};
```

### 2. **Distance Calculation**
Use Haversine formula for distance between GPS coordinates:
```typescript
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Returns distance in kilometers
}
```

### 3. **Timeline Positioning**
- Calculate event left position: `(startHour * 60 + startMinute) / 30 * 40` (40px per 30-min slot)
- Calculate event width: `((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 30 * 40`

### 4. **Current Time Line**
- Position: `(currentHour * 60 + currentMinute) / 30 * 40`
- Update every minute: `setInterval(() => setCurrentTime(new Date()), 60000)`

### 5. **Event Filtering Hook**
Create `useFilteredEvents` hook that:
- Filters events by distance
- Filters by access level
- Filters by event type
- Filters by dietary tags
- Filters by "open now"
- Sorts venues by distance
- Handles time view mode (TODAY, NEXT_24H, WEEK)

---

## File Structure

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind
│
├── components/
│   ├── Events/
│   │   ├── EventBlock.tsx    # Timeline event block
│   │   └── EventDetail.tsx   # Event detail modal
│   ├── Layout/
│   │   ├── Header.tsx        # Top header
│   │   ├── FilterBar.tsx    # Filter controls
│   │   ├── LoadingSkeleton.tsx
│   │   └── MobileEventList.tsx # Mobile list view
│   ├── Timeline/
│   │   ├── TimelineGrid.tsx  # Main timeline component
│   │   ├── CurrentTimeLine.tsx # Red time indicator
│   │   └── EmptyState.tsx    # No events message
│   └── Venues/
│       ├── VenueCard.tsx     # Venue sidebar item
│       └── VenueInfo.tsx     # Venue detail panel
│
├── data/
│   ├── events.ts             # Food events data
│   └── venues.ts             # Venues data
│
├── hooks/
│   ├── useFilteredEvents.ts  # Event filtering logic
│   └── useGeolocation.ts     # Location detection
│
├── types/
│   └── index.ts              # TypeScript interfaces
│
└── utils/
    ├── distance.ts           # Distance calculations
    └── time.ts               # Time formatting helpers
```

---

## Specific Requirements

1. **Mobile-First Design:** Optimize for mobile phones first, then desktop
2. **Dutch Language:** All UI text in Dutch (Rotterdam context)
3. **Performance:** Use React.memo and useMemo for optimization
4. **Accessibility:** Keyboard navigation, ARIA labels
5. **Error Handling:** Graceful fallback if geolocation fails
6. **Loading States:** Skeleton screens while loading
7. **Empty States:** Friendly messages when no events match filters

---

## Design References

The app should look like a **festival timetable** with:
- Clean, minimal design (Airbnb-style)
- Clear typography hierarchy
- Color-coded categories
- Intuitive timeline scrolling
- Touch-friendly mobile interface

---

## Deliverables

1. **Complete React + TypeScript codebase**
2. **Working timeline visualization**
3. **Functional filters**
4. **Sample data** (5-10 events in Rotterdam)
5. **Responsive design** (mobile + desktop)
6. **Google Maps integration** for navigation
7. **README.md** with setup instructions

---

## Testing Requirements

- App loads without errors
- Timeline displays events correctly
- Filters work as expected
- Geolocation calculates distances
- Events show correct times
- Mobile layout is usable
- Detail modals open/close properly

---

**Start building this project step by step, ensuring each component works before moving to the next. Focus on getting the core timeline visualization working first, then add filtering and details.**

