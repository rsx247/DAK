export type AccessLevel = 'WALK_IN' | 'REGISTRATION' | 'REFERRAL';

export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION';

export type VenueCategory = 'RELIGIOUS' | 'COMMUNITY' | 'FOOD_BANK' | 'FOOD_RESCUE' | 'COMMERCIAL';

export type TimeViewMode = 'TODAY' | 'NEXT_24H' | 'WEEK';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WeekOfMonth = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'LAST';

export interface RecurrenceRule {
  frequency: 'NONE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  // For WEEKLY
  daysOfWeek?: DayOfWeek[];
  // For BIWEEKLY and MONTHLY (by day of week)
  dayOfWeek?: DayOfWeek;
  // For MONTHLY
  monthDay?: number; // e.g., 15
  weeksOfMonth?: WeekOfMonth[]; // e.g., ['FIRST', 'THIRD']
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  logoUrl?: string;
  about: string;
  category: VenueCategory;
  verificationStatus: VerificationStatus;
}

export interface VenueWithDistance extends Venue {
    distance: number;
}

export interface FoodEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  venueId: string;
  venue: Venue;
  foodType: string;
  dietaryTags: string[];
  accessLevel: AccessLevel;
  cost: string;
  verificationStatus: VerificationStatus;
  sourceUrl?: string;
  registrationDeadline?: Date;
  recurrence?: RecurrenceRule;
}

export type EventData = Omit<FoodEvent, 'venue'>;

export interface FilterState {
  distance: number;
  accessLevel: 'ALL' | AccessLevel;
  eventType: 'ALL' | 'MEALS' | 'PACKAGES';
  dietary: 'ALL' | 'vegetarian' | 'vegan' | 'halal';
  cost: 'ALL' | 'FREE';
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface VenueSubmissionData {
    id?: string;
    name: string;
    address: string;
    category: VenueCategory;
    logoUrl?: string;
}

export interface EventSubmissionData {
    id?: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    foodType: string;
    dietaryTags: string[];
    accessLevel: AccessLevel;
    cost: string;
    verificationStatus: VerificationStatus;
    sourceUrl?: string;
    registrationDeadline?: Date;
    venueId?: string;
    newVenue?: {
        name: string;
        address: string;
        category: VenueCategory;
        logoUrl?: string;
    };
    recurrence?: RecurrenceRule;
}
