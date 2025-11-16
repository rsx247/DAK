# 🆘 **NoodApp** - Universal Crisis Resource Platform
## Multi-Service Timeline Infrastructure

## 🎯 **Concept: One System, Multiple Resource Types**

The **Gratis Eten Rotterdam** app proved a timeline-based discovery interface works perfectly for showing:
- **WHERE** resources are (distance-sorted venues)
- **WHEN** they're available (horizontal timeline)
- **WHAT** they offer (event details)

This same infrastructure can be **reskinned** for ANY time-based crisis resource:

### **Core Resource Categories**
1. 🍽️ **Eten** (Food) - Already built
2. 🛏️ **Slaapplaats** (Shelter/Bed)
3. 🚿 **Douche** (Shower facilities)
4. 🧺 **Wasgelegenheid** (Laundry)
5. 🏥 **Gezondheidszorg** (Healthcare/Medical)
6. 📦 **Kleding** (Clothing distribution)
7. 💼 **Dagopvang** (Day shelter/Support)
8. 🔌 **Oplaadpunten** (Phone charging/WiFi)

---

## 🏗️ **System Architecture: Resource-Agnostic Design**

### **Same Core, Different Skin**

The fundamental architecture remains **identical**:

```
TIMELINE INFRASTRUCTURE (Universal)
├── Horizontal time axis (24h/week view)
├── Vertical venue lanes (sorted by distance)
├── Red "current time" line
├── Event blocks (start/end times)
└── Filters (distance, access, type)

RESOURCE-SPECIFIC LAYER (Swappable)
├── Event type definitions
├── Venue categories
├── Filter options
├── Icon sets
└── Color schemes
```

---

## 📊 **Data Model: Abstracted for Multi-Service**

### **Universal Base Types**

```typescript
// CORE INFRASTRUCTURE (stays same across all services)
interface ResourceEvent {
  id: string;
  title: string;
  description: string;
  venue: Venue;
  startTime: Date;
  endTime: Date;
  
  // FLEXIBLE: Changes based on resource type
  resourceType: ResourceType;      // "FOOD" | "SHELTER" | "SHOWER" etc.
  serviceDetails: ServiceDetails;  // Type-specific data
  accessLevel: AccessLevel;        // "WALK_IN" | "REGISTRATION" | "REFERRAL"
  capacity?: Capacity;             // Availability info
  
  // UNIVERSAL ACTIONS
  actionType: ActionType;          // "NAVIGATE" | "REGISTER" | "CALL" | "BOOK"
  actionUrl?: string;
  actionPhone?: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  
  // FLEXIBLE: Different category sets per resource type
  category: string;               // e.g., "SHELTER", "COMMUNITY_CENTER", "HOSPITAL"
  
  // UNIVERSAL
  about: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  
  // MULTI-SERVICE: A venue can offer multiple resource types
  offeredServices: ResourceType[]; // ["FOOD", "SHOWER", "LAUNDRY"]
}

// RESOURCE TYPE REGISTRY
type ResourceType = 
  | "FOOD" 
  | "SHELTER" 
  | "SHOWER" 
  | "LAUNDRY" 
  | "HEALTHCARE" 
  | "CLOTHING" 
  | "DAY_CENTER" 
  | "CHARGING";

// TYPE-SPECIFIC DETAILS (polymorphic)
type ServiceDetails = 
  | FoodServiceDetails 
  | ShelterServiceDetails 
  | ShowerServiceDetails 
  | LaundryServiceDetails
  // ... etc

interface FoodServiceDetails {
  foodType: string;              // "Hot meal", "Package", "Snacks"
  dietaryTags: string[];         // ["halal", "vegan"]
  quantity?: string;
  cost?: string;
}

interface ShelterServiceDetails {
  bedType: string;               // "Single bed", "Family room", "Emergency mat"
  gender: string;                // "All", "Men only", "Women only", "Families"
  ageRestriction?: string;       // "18+", "Youth 16-25", "All ages"
  petFriendly: boolean;
  maxStayDuration?: string;      // "1 night", "1 week", "30 days"
  bedsAvailable?: number;
}

interface ShowerServiceDetails {
  towelsProvided: boolean;
  soapProvided: boolean;
  timeLimitMinutes?: number;
  privateStalls: boolean;
  wheelchairAccessible: boolean;
}

interface LaundryServiceDetails {
  washersAvailable: number;
  dryersAvailable: number;
  detergentProvided: boolean;
  costPerLoad?: string;
  maxLoadsPerPerson?: number;
}

interface Capacity {
  total?: number;                // Total capacity
  available?: number;            // Currently available
  status: "AVAILABLE" | "LIMITED" | "FULL" | "UNKNOWN";
  lastUpdated?: Date;
}
```

---

## 🎨 **UI Configuration: Per-Resource Customization**

### **Resource Config System**

Each resource type has a **configuration file** that defines its UI:

```typescript
// /src/config/resources/food.config.ts
export const FoodResourceConfig: ResourceConfig = {
  id: "FOOD",
  name: "Eten",
  icon: "🍽️",
  colorScheme: {
    primary: "#FF6B35",      // Warm orange
    secondary: "#004E89",
    accent: "#2A9D8F"
  },
  
  filters: [
    {
      id: "type",
      label: "Type",
      options: ["Maaltijden", "Pakketten", "Mobiel", "Alles"]
    },
    {
      id: "access",
      label: "Toegang",
      options: ["Vrije inloop", "Alles"]
    },
    {
      id: "distance",
      label: "Afstand",
      options: ["1km", "2km", "5km", "Alles"]
    }
  ],
  
  venueCategories: [
    { id: "COMMUNITY", label: "Gemeenschap", color: "#2A9D8F", icon: "🏘️" },
    { id: "RELIGIOUS", label: "Religieus", color: "#004E89", icon: "⛪" },
    { id: "FOOD_BANK", label: "Voedselbank", color: "#E63946", icon: "📦" },
    { id: "FOOD_RESCUE", label: "Voedselredding", color: "#2A9D8F", icon: "♻️" }
  ],
  
  emptyStateMessage: "Geen gratis eten beschikbaar",
  nextAvailableMessage: "Volgend beschikbaar"
};

// /src/config/resources/shelter.config.ts
export const ShelterResourceConfig: ResourceConfig = {
  id: "SHELTER",
  name: "Slaapplaats",
  icon: "🛏️",
  colorScheme: {
    primary: "#6A4C93",      // Calming purple
    secondary: "#1982C4",
    accent: "#8AC926"
  },
  
  filters: [
    {
      id: "type",
      label: "Type",
      options: ["Noodopvang", "Winteropvang", "Jongeren", "Gezinnen", "Alles"]
    },
    {
      id: "availability",
      label: "Beschikbaarheid",
      options: ["Nu beschikbaar", "Alles"]
    },
    {
      id: "distance",
      label: "Afstand",
      options: ["1km", "2km", "5km", "Alles"]
    }
  ],
  
  venueCategories: [
    { id: "EMERGENCY", label: "Noodopvang", color: "#E63946", icon: "🚨" },
    { id: "TEMPORARY", label: "Tijdelijk", color: "#F4A261", icon: "🏨" },
    { id: "WINTER", label: "Winteropvang", color: "#1982C4", icon: "❄️" },
    { id: "YOUTH", label: "Jeugd", color: "#8AC926", icon: "👥" }
  ],
  
  emptyStateMessage: "Geen bedden beschikbaar op dit moment",
  nextAvailableMessage: "Eerstvolgende beschikbaarheid"
};

// /src/config/resources/shower.config.ts
export const ShowerResourceConfig: ResourceConfig = {
  id: "SHOWER",
  name: "Douche",
  icon: "🚿",
  colorScheme: {
    primary: "#1982C4",      // Clean blue
    secondary: "#8AC926",
    accent: "#FFCA3A"
  },
  
  filters: [
    {
      id: "amenities",
      label: "Voorzieningen",
      options: ["Handdoeken", "Zeep", "Toegankelijk", "Alles"]
    },
    {
      id: "access",
      label: "Toegang",
      options: ["Vrije inloop", "Alles"]
    },
    {
      id: "distance",
      label: "Afstand",
      options: ["1km", "2km", "5km", "Alles"]
    }
  ],
  
  venueCategories: [
    { id: "COMMUNITY_CENTER", label: "Buurtcentrum", color: "#1982C4", icon: "🏢" },
    { id: "SHELTER", label: "Opvang", color: "#6A4C93", icon: "🏠" },
    { id: "SWIMMING_POOL", label: "Zwembad", color: "#8AC926", icon: "🏊" }
  ],
  
  emptyStateMessage: "Geen douchevoorzieningen open",
  nextAvailableMessage: "Eerstvolgende openingstijd"
};
```

---

## 🎛️ **Multi-Service Mode Toggle**

### **Option 1: Separate Apps (Simple)**
- Each resource type is a separate deployment
- `gratiseten.nl` → Food timeline
- `noodslaap.nl` → Shelter timeline
- `douchevoorziening.nl` → Shower timeline

**Pros:** Focused, simple, easy to share specific links  
**Cons:** User has to switch between apps

### **Option 2: Tabbed Interface (Medium)**
```
┌────────────────────────────────────────────────┐
│ 🆘 NoodApp Rotterdam                          │
│ [🍽️ Eten] [🛏️ Bed] [🚿 Douche] [🧺 Was] ... │ ← Tabs
├────────────────────────────────────────────────┤
│ Timeline for selected resource type            │
└────────────────────────────────────────────────┘
```

**Pros:** Single app, easy to switch resources  
**Cons:** More complex UI, harder to focus

### **Option 3: Multi-Layer View (Advanced)**
```
┌────────────────────────────────────────────────┐
│ 🆘 NoodApp - Alles Weergeven                  │
│ Filters: [✓ Eten] [✓ Bed] [ ] Douche          │ ← Multi-select
├──────────┬─────────────────────────────────────┤
│ Venue    │  12:00    18:00    21:00            │
│          │    │        │         │              │
│ Pauluskerk│  🍽️      🍽️       🛏️             │ ← Multiple resource types
│ 0.8km    │  [Food]  [Food]  [Beds]             │
│ ─────────│─────────────────────────────────────│
│ Leger des│  🚿🛏️            🍽️                │
│ Heils    │ [Shower] [Beds] [Food]              │
└──────────┴─────────────────────────────────────┘
```

**Pros:** See everything at once, discover co-located services  
**Cons:** Can be overwhelming, complex filtering

**Recommendation:** Start with **Option 1** (separate focused apps), later combine into **Option 2** (tabbed) if users request it.

---

## 🗂️ **File Structure: Modular Resource System**

```
/src
  /core                          ← Universal timeline infrastructure
    /components
      Timeline/
        TimelineGrid.tsx         ← Works for ANY resource type
        CurrentTimeLine.tsx      ← Universal red line
        EmptyState.tsx           ← Configurable messaging
      Events/
        EventBlock.tsx           ← Generic event display
        EventDetail.tsx          ← Polymorphic details panel
      Venues/
        VenueCard.tsx            ← Distance-sorted lanes
        VenueInfo.tsx            ← Organization info
      Layout/
        Header.tsx               ← Logo + resource selector
        FilterBar.tsx            ← Config-driven filters
    /hooks
      useGeolocation.ts          ← Universal location
      useFilteredEvents.ts       ← Generic filtering logic
      useTimeView.ts             ← Time window management
    /utils
      distance.ts                ← Distance calculations
      time.ts                    ← Time formatting
  
  /resources                     ← RESOURCE-SPECIFIC CONFIGS
    /food
      food.config.ts             ← Food-specific settings
      foodData.ts                ← Food venues & events
      FoodEventDetail.tsx        ← Food-specific detail view
    /shelter
      shelter.config.ts
      shelterData.ts
      ShelterEventDetail.tsx
    /shower
      shower.config.ts
      showerData.ts
      ShowerEventDetail.tsx
    /laundry
      laundry.config.ts
      laundryData.ts
      LaundryEventDetail.tsx
    // ... etc
  
  /types
    core.ts                      ← Universal interfaces
    resources.ts                 ← Resource-specific types
  
  App.tsx                        ← Loads appropriate resource config
  main.tsx
```

---

## 🔄 **Deployment Strategy: Multi-App from Single Codebase**

### **Environment-Based Build**

```bash
# Build separate apps from same codebase
npm run build:food       # → gratiseten.nl
npm run build:shelter    # → noodslaap.nl
npm run build:shower     # → douchevoorziening.nl
npm run build:all        # → noodapp.nl (combined)
```

### **Build Config**

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const resourceType = process.env.VITE_RESOURCE_TYPE || 'food';
  
  return {
    define: {
      'import.meta.env.RESOURCE_TYPE': JSON.stringify(resourceType)
    },
    build: {
      outDir: `dist/${resourceType}`
    }
  };
});

// App.tsx
const resourceConfig = getResourceConfig(import.meta.env.RESOURCE_TYPE);
```

---

## 🌐 **Rotterdam Shelter/Support Services Data**

Based on research, here are **real Rotterdam services** for other resource types:

### **🛏️ Shelter (Slaapplaats)**

1. **Leger des Heils - Nachtopvang**
   - Multiple locations in Rotterdam
   - Emergency overnight shelter
   - `WALK_IN` for emergency beds
   - Men, women, couples

2. **Pauluskerk - Winteropvang**
   - Seasonal (November - March)
   - Emergency night shelter
   - Open evenings, 18:00-08:00

3. **De Tussenvoorziening**
   - Temporary housing (max 6 months)
   - Requires referral from social services
   - `REGISTRATION_REQ`

4. **Maatwerk aan de Maas**
   - Youth shelter (16-27 years)
   - Crisis beds + longer-term support

### **🚿 Shower Facilities**

1. **Pauluskerk**
   - Open daily 9:00-21:00
   - Free showers, towels provided
   - `WALK_IN`

2. **Leger des Heils Dagopvang**
   - Shower facilities, laundry, lockers
   - Open daytime hours
   - `WALK_IN`

3. **Buurtcentra** (various locations)
   - Some offer shower facilities
   - Check individual center schedules

### **🧺 Laundry Services**

1. **Leger des Heils**
   - Free laundry service
   - Detergent provided
   - Limited loads per week

2. **Community Centers**
   - Some have laundry facilities
   - Small fee or free with support card

### **🏥 Healthcare**

1. **Dokters van de Wereld**
   - Free healthcare for uninsured
   - Walk-in clinic hours
   - No registration needed

2. **GGD Rotterdam Street Nurses**
   - Mobile health services
   - Specific route schedules

---

## 🎨 **Branding Strategy: Family of Apps**

### **Unified Brand Identity**

```
Master Brand: NoodApp Rotterdam
├── 🍽️ Gratis Eten Rotterdam
├── 🛏️ Nood Slaapplaats Rotterdam
├── 🚿 Douche Voorzieningen Rotterdam
├── 🧺 Was Voorzieningen Rotterdam
└── 🏥 Gratis Zorg Rotterdam
```

### **Shared Visual Language**
- Same typography (Inter)
- Same layout structure (timeline)
- Same interaction patterns
- Same red "current time" line
- **Different color schemes** per resource type (color psychology)

### **Cross-Promotion**
- Footer links: "Zoek ook: [🍽️ Eten] [🛏️ Bed] [🚿 Douche]"
- Empty states: "Geen douches beschikbaar? Zoek [🍽️ gratis eten] in plaats daarvan"

---

## 🚀 **Implementation Phases**

### **Phase 1: Build Food App** (Already planned)
- Validates timeline UI/UX
- Proves location-based filtering works
- Tests with real Rotterdam users

### **Phase 2: Extract Core Infrastructure**
- Refactor food app to separate core from config
- Create `ResourceConfig` abstraction
- Build resource plugin system

### **Phase 3: Add Shelter Module**
- Create `shelter.config.ts`
- Gather Rotterdam shelter data
- Deploy as separate app (`noodslaap.nl`)
- Test with homeless outreach organizations

### **Phase 4: Add Shower/Laundry**
- Smaller resource types, faster to implement
- Validate multi-service architecture scales

### **Phase 5: Unified Platform** (Optional)
- Combine into single `noodapp.nl` with tabs
- Multi-layer view for power users
- Cross-service recommendations

---

## 💡 **Why This Architecture Works**

### **Technical Benefits**
✅ **DRY:** Timeline logic written once, used everywhere  
✅ **Scalable:** Add new resource types without touching core  
✅ **Maintainable:** Bug fixes propagate to all apps  
✅ **Testable:** Core components tested once  
✅ **Deployable:** Independent deploys per resource type  

### **User Benefits**
✅ **Familiar:** Once you learn food app, shelter app is identical  
✅ **Focused:** Each app solves one specific need  
✅ **Discoverable:** Cross-links help users find related resources  
✅ **Accessible:** Same high-quality UX across all services  

### **Social Impact**
✅ **Modular Roll-out:** Start with food (universal need), add services based on demand  
✅ **Partnerships:** Each resource type can have different organizational partners  
✅ **Data Portability:** Same data format means easier data sharing between services  
✅ **Scalable to Other Cities:** Port to Amsterdam, Den Haag, Utrecht with city-specific data  

---

## 🎯 **Example User Journey: Multi-Service**

**Persona:** Mark, 34, recently homeless in Rotterdam

**Monday 14:00**
- Opens **Gratis Eten** app
- Sees BuurtBuik dinner at 18:00
- Scrolls timeline, also sees Pauluskerk open until 21:00

**Monday 17:00**
- Goes to BuurtBuik, gets free meal
- Asks staff about shower facilities
- Staff mentions Pauluskerk has showers

**Monday 17:30**
- Opens **Douche Voorzieningen** app (saw footer link in food app)
- Sees Pauluskerk has showers until 21:00
- Clicks venue → sees they're only 0.3km away
- Navigates there

**Monday 19:00**
- After shower, sees notice about night shelter
- Opens **Nood Slaapplaats** app
- Sees Leger des Heils emergency beds available
- Registers for bed

**Result:** One timeline UI pattern → solved 3 immediate needs (food, shower, shelter)

---

## 🔮 **Long-Term Vision**

This platform becomes the **Google Maps for crisis resources** in Rotterdam:
- Timeline view for "What's available NOW and SOON"
- Map view for "What's nearby"
- List view for "All services of this type"
- Notification system: "Bed available 0.5km away" or "Free dinner starting in 30 min"

**Scale to other cities** with same codebase, different data:
- Amsterdam
- Den Haag
- Utrecht
- Eindhoven

**Partner with national organizations:**
- Voedselbanken Nederland
- Leger des Heils
- Stichting de Regenboog Groep
- HVO-Querido

**Open data initiative:**
- Standardize crisis resource data format
- API for organizations to publish their schedules
- Crowdsourced updates (verified)

---

**This is not just an app—it's a platform architecture for crisis resource discovery that can scale to any city, any resource type, helping the most vulnerable find help when they need it most.** 🆘





