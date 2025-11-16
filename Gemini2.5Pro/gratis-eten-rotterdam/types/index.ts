
export type AccessLevel = "WALK_IN" | "REGISTRATION" | "REFERRAL";
export type VenueCategory = "COMMUNITY" | "RELIGIOUS" | "FOOD_BANK" | "FOOD_RESCUE" | "COMMERCIAL";
export type VerificationStatus = 'VERIFIED' | 'NEEDS_VERIFICATION' | 'UNVERIFIED';

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: "Rotterdam" | "Schiedam" | "Vlaardingen";
  lat: number;
  lng: number;
  category: VenueCategory;
  about: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  lastVerified?: string;
  dataSource?: string;
  verificationStatus: VerificationStatus;
}

export interface FoodEvent {
  id: string;
  title: string;
  description: string;
  venueId: string; 
  startTime: Date;
  endTime: Date;
  foodType: string;
  dietaryTags: string[];
  accessLevel: AccessLevel;
  registrationUrl?: string;
  registrationPhone?: string;
  quantity?: string;
  cost?: string;
  lastVerified?: string;
  dataSource?: string;
  verificationStatus: VerificationStatus;
  venue: Venue;
}

export interface FoodEventWithDistance extends FoodEvent {
  venue: VenueWithDistance;
}

export interface VenueWithDistance extends Venue {
  distance: number; // in kilometers
}

export interface FilterState {
  distance: number; 
  accessLevel: "ALL" | "WALK_IN";
  eventType: "ALL" | "MEALS" | "PACKAGES";
  dietary: "ALL" | "HALAL" | "VEGETARIAN" | "VEGAN";
}

export type TimeViewMode = "TODAY" | "NEXT_24H" | "WEEK";

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}
