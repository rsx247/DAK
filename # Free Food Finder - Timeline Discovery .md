# Free Food Finder - Timeline Discovery App

## The Concept & Why It Works

**The Problem:** Free food events (community meals, restaurant samples, festival giveaways, campus events, food bank distributions) are scattered across time and space. People miss opportunities because they don't know what's happening nearby RIGHT NOW.

**The Solution:** A visual timeline interface that answers three questions instantly:

1. **What's available now?** (red vertical line shows current time)
2. **Where's the closest?** (left sidebar sorted by distance)
3. **What's coming up?** (horizontal timeline shows next 24 hours)

**Why This Design Wins:**

- **Festival timetable UX** - proven pattern people understand immediately (see reference images)
- **Location-aware** - auto-detects your position, calculates distances in real-time
- **Time-contextual** - defaults to 24hr view, but you can pan to see tomorrow/next week
- **Filtered for free** - focuses only on €/gratis options (with filter to include paid if desired)
- **Dietary-friendly** - vegan/halal/allergen filters built in
- **Mobile-first** - optimized for on-the-go discovery while you're out

## Technical Architecture

### Tech Stack

- **Frontend:** React + TypeScript + Vite (fast dev, modern tooling)
- **Styling:** Tailwind CSS (rapid UI development, responsive utilities)
- **Maps:** Leaflet.js (open-source, no API costs)
- **Geolocation:** Browser Geolocation API + fallback to manual selection
- **State Management:** React Context + hooks (simple, no over-engineering)
- **Deployment:** Vercel/Netlify (free hosting, instant deploys)

### Core Components

1. **Timeline Grid** (`TimelineGrid.tsx`)

   - Horizontal axis: 24-hour time slots (30-min increments)
   - Vertical axis: Venues/locations (rows)
   - Red vertical line component overlaid at current time
   - Pan/scroll horizontally to explore different times
   - Responsive: collapses to single-column on mobile

2. **Venue Cards** (`VenueCard.tsx`)

   - Left sidebar showing venue name, distance, logo/icon
   - Color-coded by category (restaurant=red, community=green, campus=blue, etc.)
   - Sorted by distance from user location
   - **Click venue header/icon** → Opens organization info panel (about, website, social, opening hours)

3. **Event Blocks** (`EventBlock.tsx`)

   - Positioned on timeline grid (row=venue, column=time)
   - Shows: food type, time range, dietary icons
   - Click to open detail panel
   - Size proportional to event duration

4. **Detail Panel** (`DetailPanel.tsx`)

   - Slides in from right (or bottom on mobile)
   - Shows: full description, images, provider info, dietary tags, navigation button
   - Social share buttons (WhatsApp, Twitter, copy link)

5. **Filter Bar** (`FilterBar.tsx`)

   - Top navigation with dropdowns (matching your sketch):
     - Distance filter: walking distance (500m, 1km, 2km, 5km, all)
     - Diet filter: vegan, vegetarian, halal, kosher, gluten-free, nut-free
     - Price filter: free only, all prices
   - Mobile: hamburger menu with filters

6. **Location Selector** (`LocationSelector.tsx`)

   - Auto-detects on first load (browser geolocation)
   - Manual override: search address or click map
   - Recalculates distances when changed

### Data Model

```typescript
interface FoodEvent {
  id: string;
  title: string;
  description: string;
  venue: Venue;
  startTime: Date;
  endTime: Date;
  foodType: string; // "Pizza", "Sandwiches", "Hot Meal", etc.
  dietaryTags: DietaryTag[]; // vegan, halal, etc.
  quantity?: string; // "50 servings", "While supplies last"
  imageUrl?: string;
  provider?: string; // "Red Cross", "Campus Dining", "Luigi's Pizza"
  registrationRequired?: boolean;
  registrationUrl?: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  logoUrl?: string;
  category: VenueCategory; // restaurant, campus, community, etc.
}
```

### Sample Data Sources (for realistic mock data)

**Geographic Focus:** Rotterdam, Schiedam, Vlaardingen area

I'll include realistic free food event types specific to this region:

- **EUR (Erasmus University):** Study association events, international student welcome, guest lectures
- **Community centers:** Voedselbank Rotterdam, Buurtcentra, neighborhood events
- **Restaurants:** Rotterdam Centraal area sampling, Markthal vendors, new openings in Witte de Withstraat
- **Religious institutions:** Grote of Sint-Laurenskerk events, mosque community dinners, Keti Koti celebrations
- **Corporate events:** Rotterdam Science Tower meetups, innovation hubs (Yes!Delft satellite), tech community events
- **Festivals/Markets:** Fenix Food Factory samples, Afrikaanderwijk market, Schiedamse Vestdagen

Data will be hardcoded initially but structured as if coming from an API, making it easy to swap in real data later.

## UI/UX Design Decisions

### Color System

- **Red:** Current time line (high contrast, urgency)
- **Venue categories:** Color-coded for quick scanning
  - Red: Restaurants/food businesses
  - Green: Community/environmental
  - Blue: Educational/campus
  - Purple: Cultural/religious
  - Yellow: Festivals/events

### Layout (Desktop)

```
┌─────────────────────────────────────────────────────┐
│ [Logo] [Distance ▼] [Diet ▼] [Price ▼]    [Map 🗺️] │
├──────────┬──────────────────────────────────────────┤
│ Venues   │  00:00  06:00  12:00  18:00  24:00      │
│ (sorted  │    │      │      │      │      │         │
│  by dist)│────┼──────┼──────┼──────┼──────          │
│          │    │      │  [Event] │  │                │
│ Venue A  │────┼──────┼──────┼──────┼──────          │
│ 0.8km    │    │  [Event]    |🔴    │                │
│          │────┼──────┼──────┼──────┼──────          │
│ Venue B  │    │      │      |🔴[Event]              │
│ 1.2km    │────┼──────┼──────┼──────┼──────          │
│          │              RED LINE (now)              │
└──────────┴──────────────────────────────────────────┘
```

### Layout (Mobile)

- Filters collapse to hamburger menu
- Timeline rotates to vertical scroll
- Venue cards stack above timeline
- Detail panel slides up from bottom

### Key Features from Your Sketch

✅ **Dropdown filters** (lopen/navi, dieet/vegan, €/gratis)

✅ **Distance badges** on venue cards (0.8km, 1.2km)

✅ **Vertical red line** for current time

✅ **Detail panel** with title, description, info badges

✅ **Logo/branding** top-left

✅ **Color-coded venues** for quick identification

## Implementation Phases

### Phase 1: Core Timeline (MVP)

- Setup React + Vite + Tailwind project
- Create timeline grid with 24-hour horizontal axis
- Add vertical red line that updates in real-time
- Mock data: 20-30 realistic free food events across 5-7 venues
- Basic event blocks positioned on timeline

### Phase 2: Location & Distance

- Implement geolocation API with permission handling
- Calculate distances from user to all venues
- Sort venue list by proximity
- Add distance badges to venue cards
- Manual location override (address search)

### Phase 3: Filters & Interactivity

- Build filter bar with dropdowns (distance, diet, price)
- Filter events in real-time
- Click event block to open detail panel
- Detail panel with full info, images, navigation button
- Responsive mobile layout

### Phase 4: Polish & Enhancement

- Add venue logos/icons
- Implement smooth animations (timeline pan, panel slide)
- Social sharing functionality
- Map view toggle (Leaflet integration)
- "Navigate to venue" button (opens Google Maps/Apple Maps)
- Time range selector (24hr, 48hr, week view)

## Why This Will Work

1. **Immediate value:** Open the app, see what's available RIGHT NOW nearby
2. **Planning ahead:** Scroll timeline to see what's coming in 2 hours, tonight, tomorrow
3. **Discovery:** Find free food sources you didn't know existed
4. **Accessibility:** Free food often serves communities in need - this makes it findable
5. **Sustainability:** Reduces food waste by connecting surplus food with hungry people
6. **Social good:** Community meals, food banks, and cultural events get more visibility

## Future Enhancements (Post-MVP)

- User-submitted events (crowdsourced data)
- Notifications: "Free pizza 0.3km away starting in 10 min!"
- Favorites/saved venues
- Historical data: "This place has free bagels every Tuesday 9am"
- Integration with Eventbrite, Meetup.com, campus calendars
- AR mode: point phone to see nearby free food with overlays

## File Structure

```
/src
  /components
    Timeline/
      TimelineGrid.tsx
      TimeSlots.tsx
      CurrentTimeLine.tsx
    Events/
      EventBlock.tsx
      DetailPanel.tsx
    Venues/
      VenueCard.tsx
      VenueList.tsx
    Filters/
      FilterBar.tsx
      DistanceFilter.tsx
      DietFilter.tsx
    Location/
      LocationSelector.tsx
      LocationContext.tsx
  /data
    mockEvents.ts
    mockVenues.ts
  /hooks
    useGeolocation.ts
    useDistance.ts
    useFilteredEvents.ts
  /types
    index.ts
  /utils
    dateUtils.ts
    distanceUtils.ts
  App.tsx
  main.tsx
```

This app solves a real problem with an intuitive, visual interface. The timeline paradigm is proven (festivals, transportation apps), location-awareness makes it personal, and focusing on "free" gives it clear purpose. It's useful for students, budget-conscious folks, and anyone who wants to discover community food events.