// Access level for events
export type AccessLevel = "WALK_IN" | "REGISTRATION" | "REFERRAL";

// Venue categories
export type VenueCategory = "COMMUNITY" | "RELIGIOUS" | "FOOD_BANK" | "FOOD_RESCUE" | "COMMERCIAL";

// Action types for event interactions
export type ActionType = "NAVIGATE" | "REGISTER" | "CALL";

// Verification status for data quality tracking
export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'UNVERIFIED';

// Main Venue interface
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  category: VenueCategory;
  about: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  // Data verification tracking
  lastVerified?: string; // ISO date string
  dataSource?: string; // "website", "phone_call", "site_visit", "official_document"
  verificationStatus: VerificationStatus;
}

// Food Event interface
export interface FoodEvent {
  id: string;
  title: string;
  description: string;
  venue: Venue;
  startTime: Date;
  endTime: Date;
  foodType: string;           // "Warm meal", "Food package", "Snacks"
  dietaryTags: string[];      // ["halal", "vegan", "vegetarian"]
  accessLevel: AccessLevel;
  registrationUrl?: string;
  registrationPhone?: string;
  quantity?: string;          // "50 servings", "While stocks last"
  cost?: string;              // "Free", "€1", "€5 or free with referral"
  // Data verification tracking
  lastVerified?: string; // ISO date string
  dataSource?: string; // "website", "phone_call", "site_visit", "official_document"
  verificationStatus: VerificationStatus;
}

// Venue with calculated distance from user
export interface VenueWithDistance extends Venue {
  distance: number;  // in kilometers
}

// Event with venue distance
export interface FoodEventWithDistance extends FoodEvent {
  venue: VenueWithDistance;
}

// Filter state
export type FilterState = {
  distance: number;           // in km (1, 2, 5, or Infinity for "Alles")
  accessLevel: "ALL" | "WALK_IN";
  eventType: "ALL" | "MEALS" | "PACKAGES" | "MOBILE";
  dietary: "ALL" | "HALAL" | "VEGETARIAN" | "VEGAN";
  openNow: boolean;          // Show only events happening now
  noRegistration: boolean;   // Show only walk-in events
}

// Time view modes
export type TimeViewMode = "TODAY" | "NEXT_24H" | "WEEK";

// User location
export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Geolocation state
export interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

// Venue category config for UI
export interface VenueCategoryConfig {
  id: VenueCategory;
  label: string;
  color: string;
  icon: string;
}
