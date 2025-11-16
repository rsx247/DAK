import { UserLocation } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance from user location to a point
 */
export function distanceFromUser(
  userLocation: UserLocation,
  lat: number,
  lng: number
): number {
  return calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
}

/**
 * Format distance for display
 * @param km Distance in kilometers
 * @returns Formatted string like "0.8km" or "1.2km"
 */
export function formatDistance(km: number): string {
  if (km < 0.1) {
    return '<100m';
  }
  return `${km.toFixed(1)}km`;
}


