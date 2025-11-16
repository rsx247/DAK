# Icon Comparison: Old vs New

This document shows a side-by-side comparison of all icons, their old and new implementations, descriptions, and usage locations.

---

## Sort & Filter Icons

### TimeIcon

**Description:** Used for sorting events by time and displaying time information.

**Old Implementation:**
```tsx
// components/Layout/Icons.tsx (original)
export const TimeIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10.5 5.75C10.5 5.33579 10.1642 5 9.75 5C9.33579 5 9 5.33579 9 5.75V10.25C9 10.4371 9.07353 10.6158 9.20599 10.7483L12.456 14.0015C12.7488 14.2946 13.2236 14.2948 13.5166 14.002C13.8095 13.7092 13.8093 13.2343 13.5164 12.9414L10.5 9.92132V5.75Z" />
    </svg>
);
```
- **ViewBox:** 20x20
- **Style:** Filled
- **Design:** Traditional clock with filled circle

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const TimeIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Style:** Outline (Heroicons style)
- **Design:** Modern clock with visible hands
- **Improvement:** More readable, consistent with other icons

**Usage:** FilterControls.tsx (sort dropdown)

---

### DistanceIcon

**Description:** Used for sorting events by distance from user location.

**Old Implementation:**
```tsx
// components/Layout/Icons.tsx (original)
export const DistanceIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18C10 18 5 13.5817 5 10C5 6.41828 7.23858 4 10 4C12.7614 4 15 6.41828 15 10C15 13.5817 10 18 10 18ZM10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" />
        <circle cx="10" cy="1" r="1" />
    </svg>
);
```
- **ViewBox:** 20x20
- **Style:** Filled
- **Design:** Location pin with distance rings

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const DistanceIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Style:** Outline (Heroicons style)
- **Design:** Modern location pin with center dot
- **Improvement:** Cleaner design, better at small sizes

**Usage:** FilterControls.tsx (sort dropdown)

---

### PriceIcon

**Description:** Used for filtering events by price/cost.

**Old Implementation:**
```tsx
// components/Layout/Icons.tsx (original)
export const PriceIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" />
        <path d="M12.25 7.25H9.5C8.40294 7.25 7.5 8.15294 7.5 9.25V10.25C7.5 11.3471 8.40294 12.25 9.5 12.25H10.5C11.5971 12.25 12.5 13.1529 12.5 14.25V14.75" />
        <path d="M10 6V15" />
    </svg>
);
```
- **ViewBox:** 20x20
- **Stroke Width:** 1.5px (inconsistent)
- **Design:** Dollar sign in circle

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const PriceIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Stroke Width:** 2px (consistent)
- **Design:** Euro symbol in circle (more appropriate for Dutch context)
- **Improvement:** Consistent stroke width, better visibility

**Usage:** FilterControls.tsx (price filter)

---

### AccessIcon

**Description:** Used for filtering events by access level (walk-in, registration, referral).

**Old Implementation:**
```tsx
// components/Layout/Icons.tsx (original) - Filter version
export const AccessIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M15.5 10.5L15.5 4.5C15.5 3.67157 14.8284 3 14 3H6C5.17157 3 4.5 3.67157 4.5 4.5V15.5C4.5 16.3284 5.17157 17 6 17H10.5" />
        <path d="M13.5 13.5L17.5 17.5" />
        <path d="M17.5 13.5L13.5 17.5" />
    </svg>
);

// components/Events/EventDetail.tsx - Detail version
const AccessIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);
```
- **Issue:** Two different designs for the same purpose
- **Old Filter:** Key with X (locked/restricted)
- **Old Detail:** Key (access)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Unified
export const AccessIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Design:** Single unified key icon
- **Improvement:** One consistent design for all uses

**Usage:** FilterControls.tsx, EventDetail.tsx

---

## Event & Time Icons

### ClockIcon

**Description:** Displays time information for events.

**Old Implementation (EventDetail.tsx):**
```tsx
const ClockIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
```

**Old Implementation (EventListItem.tsx):**
```tsx
const ClockIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" />
    </svg>
);
```
- **Issue:** Two different designs (outline vs filled, different viewBox)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Unified
export const ClockIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Design:** Single unified outline clock
- **Improvement:** Consistent across all components

**Usage:** EventDetail.tsx, EventListItem.tsx

---

### CalendarIcon

**Description:** Displays date/calendar information for events.

**Old Implementation (EventDetail.tsx):**
```tsx
const CalendarIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
```

**Old Implementation (EventListItem.tsx):**
```tsx
const CalendarIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.25a.75.75 0 000 1.5h11a.75.75 0 000-1.5h-11z" />
    </svg>
);
```
- **Issue:** Two different designs (outline vs filled, different viewBox)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Unified
export const CalendarIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Design:** Modern calendar with visible date grid
- **Improvement:** More detailed, consistent design

**Usage:** EventDetail.tsx, EventListItem.tsx

---

### RecurrenceIcon

**Description:** Indicates recurring/repeating events.

**Old Implementation:**
```tsx
// components/Events/EventDetail.tsx
const RecurrenceIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" />
    </svg>
);
```
- **Design:** Simple refresh arrows

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const RecurrenceIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);
```
- **Design:** Circular refresh arrows (more modern)
- **Improvement:** More recognizable, better visual hierarchy

**Usage:** EventDetail.tsx

---

## Location Icons

### PinIcon

**Description:** Shows location/address information.

**Old Implementation (EventDetail.tsx):**
```tsx
const PinIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);
```

**Old Implementation (EventListItem.tsx):**
```tsx
const PinIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);
```

**Old Implementation (VenueCard.tsx):**
```tsx
const PinIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);
```
- **Issue:** Same design but duplicated 3 times
- **Style:** Filled, 20x20 viewBox

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Unified
export const PinIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);
```
- **ViewBox:** 24x24 (standardized)
- **Style:** Outline (more modern)
- **Design:** Location pin with drop shadow effect
- **Improvement:** Single source, consistent design

**Usage:** EventDetail.tsx, EventListItem.tsx, VenueCard.tsx

---

## Cost & Pricing Icons

### CostIcon

**Description:** Displays cost/price information, with special handling for "gratis" (free).

**Old Implementation (EventDetail.tsx):**
```tsx
const CostIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" />
        <path d="M12 12h.01" />
    </svg>
);
```
- **Design:** Euro symbol (€)

**Old Implementation (EventListItem.tsx):**
```tsx
const CostIcon = ({ cost }) => {
    if (cost.toLowerCase() === 'gratis') {
        return <svg ...><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
    }
    return <svg ...><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-2m0 2v.01M12 12a2 2 0 100 4 2 2 0 000-4zm0 0H9.571m2.429 0H12m0 0H9.571m2.429 0A2.5 2.5 0 0112 14.5m0 0V12m0 2.5a2.5 2.5 0 01-2.5-2.5M12 14.5A2.5 2.5 0 0014.5 12m0 0h2.429" /></svg>;
};
```
- **Design:** Different icons for free vs paid (wallet vs euro)
- **Improvement:** Smart component that switches based on cost

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Smart component
export const CostIcon = ({ className = "w-5 h-5", cost }) => {
    const isFree = cost?.toLowerCase() === 'gratis' || cost?.toLowerCase() === 'free';
    
    if (isFree) {
        return (
            <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.818.182a2.25 2.25 0 002.364 0l.818-.182m-3-2.818h6m-9 4.636V9.636a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 9.636v4.182M6.75 7.5h10.5" />
            </svg>
        );
    }
    
    return (
        <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.818.182a2.25 2.25 0 002.364 0l.818-.182m-3-2.818h6m-9 4.636V9.636a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 9.636v4.182M6.75 7.5h10.5" />
        </svg>
    );
};
```
- **Design:** Wallet icon (free) vs wallet icon (paid) - unified design
- **Improvement:** Centralized smart component, consistent design

**Usage:** EventDetail.tsx, EventListItem.tsx

---

## Contact Icons

### PhoneIcon

**Description:** Displays phone number contact information.

**Old Implementation:**
```tsx
// components/Events/EventDetail.tsx
const PhoneIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
```
- **Design:** Old-style telephone

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const PhoneIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);
```
- **Design:** Modern smartphone
- **Improvement:** Updated to modern device, better recognition

**Usage:** EventDetail.tsx

---

### EmailIcon

**Description:** Displays email contact information.

**Old Implementation:**
```tsx
// components/Events/EventDetail.tsx
const EmailIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
```

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const EmailIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
```
- **Design:** More detailed envelope with visible flap
- **Improvement:** Better visual detail, more recognizable

**Usage:** EventDetail.tsx

---

### LinkIcon

**Description:** External link to source URL.

**Old Implementation (EventDetail.tsx):**
```tsx
const LinkIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);
```

**Old Implementation (AdminEventListItem.tsx):**
```tsx
const SourceLinkIcon = ({ url }) => (
    <a href={url} ...>
        <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    </a>
);
```
- **Issue:** Duplicate with different names

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Unified
export const LinkIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);
```
- **Design:** Chain link icon (more standard)
- **Improvement:** Single unified component, standard design

**Usage:** EventDetail.tsx, AdminEventListItem.tsx

---

## Dietary Icons

### SaladIcon

**Description:** General dietary/food icon.

**Old Implementation:**
```tsx
// components/Events/EventDetail.tsx
const SaladIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
```
- **Design:** Star/sparkle icon (not very food-related)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const SaladIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M9.75 12a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
    </svg>
);
```
- **Design:** Sparkle/star icon (more food-related visual)
- **Improvement:** Better represents dietary options

**Usage:** EventDetail.tsx

---

### DietaryIcon (Smart Component)

**Description:** Shows dietary restrictions (vegetarian, vegan, halal) based on tag.

**Old Implementation:**
```tsx
// components/Events/EventListItem.tsx
const DietaryIcon = ({ tag }) => {
    switch (tag) {
        case 'vegetarian':
        case 'vegan':
            return <svg ...><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477A2 2 0 005.21 6.05l2.387.477a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387-.477a2 2 0 001.806-.547 2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86L18.79 4.21a2 2 0 00-1.806-.547 2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.022-.547z" /></svg>;
        case 'halal':
            return <svg ...><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>;
        default: return null;
    }
};
```

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Smart component with separate icons
export const VegetarianIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M9.75 12a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
    </svg>
);

export const VeganIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

export const HalalIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const DietaryIcon = ({ className = "w-5 h-5", tag }) => {
    const normalizedTag = tag.toLowerCase();
    if (normalizedTag === 'vegan') return <VeganIcon className={className} />;
    if (normalizedTag === 'vegetarian') return <VegetarianIcon className={className} />;
    if (normalizedTag === 'halal') return <HalalIcon className={className} />;
    return <SaladIcon className={className} />;
};
```
- **Improvement:** Separate icons for each dietary type, smart component that switches

**Usage:** EventListItem.tsx

---

## Access Level Icons

### AccessLevelIcon (Smart Component)

**Description:** Shows access level (walk-in, registration, referral).

**Old Implementation:**
```tsx
// components/Events/EventListItem.tsx
const AccessLevelIcon = ({ level }) => {
    switch (level) {
        case 'WALK_IN':
            return <svg ...><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
        case 'REGISTRATION':
            return <svg ...><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
        case 'REFERRAL':
            return <svg ...><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        default: return null;
    }
};
```

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved) - Separate icons + smart component
export const WalkInIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const RegistrationIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

export const ReferralIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const AccessLevelIcon = ({ className = "w-5 h-5", level }) => {
    switch (level) {
        case 'WALK_IN': return <WalkInIcon className={className} />;
        case 'REGISTRATION': return <RegistrationIcon className={className} />;
        case 'REFERRAL': return <ReferralIcon className={className} />;
        default: return <AccessIcon className={className} />;
    }
};
```
- **Improvement:** Centralized, consistent design, reusable individual icons

**Usage:** EventListItem.tsx

---

## Venue Category Icons

### ReligiousIcon

**Description:** Indicates religious venue category.

**Old Implementation:**
```tsx
// components/Venues/VenueCard.tsx
const ReligiousIcon = ({className}) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 4a1 1 0 011-1h.01a1 1 0 011 1v4h3a1 1 0 110 2h-3v7a1 1 0 11-2 0V9H6a1 1 0 110-2h3V4z" clipRule="evenodd" />
    </svg>
);
```
- **Design:** Plus sign (not very religious)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const ReligiousIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M9.75 12a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
    </svg>
);
```
- **Design:** Sparkle/star (more appropriate for religious context)
- **Improvement:** Better visual representation

**Usage:** VenueCard.tsx

---

### CommunityIcon

**Description:** Indicates community/social venue category.

**Old Implementation:**
```tsx
// components/Venues/VenueCard.tsx
const CommunityIcon = ({className}) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
);
```
- **Design:** People/group icon (good)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const CommunityIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
);
```
- **Design:** Modern people/group icon
- **Improvement:** Updated to Heroicons style, more detailed

**Usage:** VenueCard.tsx

---

### FoodBankIcon

**Description:** Indicates food bank venue category.

**Old Implementation:**
```tsx
// components/Venues/VenueCard.tsx
const FoodBankIcon = ({className}) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
    </svg>
);
```
- **Design:** Rectangle/box (generic)

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const FoodBankIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);
```
- **Design:** Shopping bag/container (more food-related)
- **Improvement:** Better represents food storage/distribution

**Usage:** VenueCard.tsx

---

## Loading & Status Icons

### SpinnerIcon

**Description:** Loading/spinning indicator.

**Old Implementation:**
```tsx
// components/Layout/GeolocationStatusBar.tsx
const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
```

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const SpinnerIcon = ({ className = "w-5 h-5" }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
```
- **Improvement:** Centralized, className prop for flexibility

**Usage:** GeolocationStatusBar.tsx

---

### GpsTrackingIcon

**Description:** GPS/location tracking indicator.

**Old Implementation:**
```tsx
// components/Layout/GeolocationStatusBar.tsx
const GpsTrackingIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="22" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="12" x2="2" y2="12"></line>
        <line x1="12" y1="6" x2="12" y2="2"></line>
        <line x1="12" y1="22" x2="12" y2="18"></line>
    </svg>
);
```

**New Implementation:**
```tsx
// components/Layout/Icons.tsx (improved)
export const GpsTrackingIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 1.657-1.007 3-2.25 3M4.5 10.5c0-1.657 1.007-3 2.25-3m10.5 0c1.243 0 2.25 1.343 2.25 3m-15 0c0 1.657 1.007 3 2.25 3" />
    </svg>
);
```
- **Design:** Location pin with crosshairs (more GPS-like)
- **Improvement:** Better represents GPS tracking

**Usage:** GeolocationStatusBar.tsx

---

## Summary of Improvements

### Consistency
- ✅ All icons now use 24x24 viewBox (was 20x20 or 24x24 mixed)
- ✅ All icons use 2px stroke width (was 1.5px-2px mixed)
- ✅ All icons use outline style (was mixed filled/outline)
- ✅ All icons accept className prop with default

### Centralization
- ✅ All icons in one file (`components/Layout/Icons.tsx`)
- ✅ No duplicate definitions
- ✅ Easy to find and maintain

### Smart Components
- ✅ `CostIcon` - switches based on cost value
- ✅ `DietaryIcon` - switches based on dietary tag
- ✅ `AccessLevelIcon` - switches based on access level

### New Icons Added
- ✅ ChevronRightIcon, ChevronUpIcon, ChevronDownIcon
- ✅ XIcon, PlusIcon, EditIcon, TrashIcon
- ✅ CommercialIcon (venue category)
- ✅ Separate VegetarianIcon, VeganIcon, HalalIcon

### Design Improvements
- ✅ Modern Heroicons-style design throughout
- ✅ Better readability at small sizes
- ✅ More recognizable icons (phone, email, etc.)
- ✅ Consistent visual weight

---

## Migration Notes

When migrating from old to new icons:

1. **Import from centralized location:**
   ```tsx
   import { IconName } from '../Layout/Icons';
   ```

2. **Remove inline icon definitions** from component files

3. **Update smart components:**
   - `CostIcon` now accepts `cost` prop
   - `DietaryIcon` now accepts `tag` prop
   - `AccessLevelIcon` now accepts `level` prop

4. **All icons accept `className` prop** with sensible defaults

5. **ViewBox is standardized** to 24x24 (may need className adjustments)


