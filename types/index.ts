// --- Enums & String Unions ---

export type VenueCategory = 'RELIGIOUS' | 'COMMUNITY' | 'FOOD_BANK' | 'COMMERCIAL';
export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION';
export type FoodType = 'MEALS' | 'PACKAGES';
export type AccessLevel = 'WALK_IN' | 'REGISTRATION' | 'REFERRAL';
export type DietaryTag = 'vegetarian' | 'vegan' | 'halal';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WeekOfMonth = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'LAST';
export type TimeViewMode = 'TODAY' | 'NEXT_24H' | 'WEEK';
export type ViewMode = 'TIMELINE' | 'LIST' | 'GRID' | 'CHRONO_GRID' | 'ADMIN' | 'SUPERADMIN';
export type SortByType = 'distance' | 'time' | 'alphabetical';

// --- Interfaces & Complex Types ---

export interface Venue {
    id: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    category: VenueCategory;
    about: string;
    logoUrl?: string;
    verificationStatus: VerificationStatus;
}

export interface VenueWithDistance extends Venue {
    distance: number;
}

export type RecurrenceRule = 
    | { frequency: 'NONE' }
    | { frequency: 'WEEKLY', daysOfWeek?: DayOfWeek[], dayOfWeek?: DayOfWeek }
    | { frequency: 'BIWEEKLY', dayOfWeek: DayOfWeek }
    | { frequency: 'MONTHLY', monthDay?: number, weeksOfMonth?: WeekOfMonth[], dayOfWeek?: DayOfWeek };

export interface RegistrationInfo {
    type: 'URL' | 'EMAIL' | 'PHONE' | 'TEXT';
    value?: string;
    notes?: string;
}

export type RecurrenceDeadline = {
    daysBefore: number;
    time: string;
};

export interface EventData {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    venueId: string;
    foodType: FoodType;
    dietaryTags: DietaryTag[];
    accessLevel: AccessLevel;
    cost: string;
    verificationStatus: VerificationStatus;
    sourceUrl?: string;
    recurrence?: RecurrenceRule;
    registrationDeadline?: RecurrenceDeadline | Date;
    registrationInfo?: RegistrationInfo;
}

export interface FoodEvent extends EventData {
    venue: Venue;
    costValue?: number;
}

export interface FilterState {
    distance: number;
    maxCost: number;
    accessLevels: AccessLevel[];
    eventTypes: FoodType[];
    dietaryNeeds: DietaryTag[];
}

export interface UserLocation {
    lat: number;
    lng: number;
    accuracy: number;
    name?: string;
}

export interface NewVenueData {
    name: string;
    address: string;
    category: VenueCategory;
    logoUrl: string;
}

export interface VenueSubmissionData {
    id?: string;
    name: string;
    address: string;
    category: VenueCategory;
    logoUrl?: string;
}

export interface EventSubmissionData extends Omit<EventData, 'id' | 'venueId' | 'registrationDeadline'> {
    id?: string;
    venueId?: string;
    newVenue?: NewVenueData;
    registrationDeadline?: RecurrenceDeadline;
}

export interface DailyEventGrouping {
  date: Date;
  venues: VenueWithDistance[];
  eventsByVenue: Map<string, FoodEvent[]>;
}

export interface VenueEventGrouping {
    venues: VenueWithDistance[];
    eventsByVenue: Map<string, FoodEvent[]>;
}