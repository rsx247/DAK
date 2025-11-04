import { useMemo } from 'react';
import type { FoodEvent, FilterState, UserLocation, VenueWithDistance, TimeViewMode } from '../types';
import { calculateDistance } from '../utils/distance';
import { generateOccurrences } from '../utils/recurrence';

export const useFilteredEvents = (
  allEvents: FoodEvent[],
  filters: FilterState,
  userLocation: UserLocation | null,
  timeView: TimeViewMode,
  showDrafts: boolean = false
) => {
  return useMemo(() => {
    if (!userLocation) {
      return { venues: [], eventsByVenue: new Map(), totalEvents: 0 };
    }

    const now = new Date();
    let windowStart: Date;
    let windowEnd: Date;

    switch (timeView) {
      case 'NEXT_24H':
        windowStart = now;
        windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'WEEK':
        windowStart = new Date(now);
        windowStart.setHours(0, 0, 0, 0);
        windowEnd = new Date(windowStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'TODAY':
      default:
        windowStart = new Date(now);
        windowStart.setHours(0, 0, 0, 0);
        windowEnd = new Date(now);
        windowEnd.setHours(23, 59, 59, 999);
        break;
    }

    // Step 1: Generate all occurrences within the time window
    const allOccurrences = allEvents.flatMap(event => {
        // If showing drafts, we don't need to generate occurrences, just show the base event
        if (showDrafts) {
            return event.verificationStatus === 'NEEDS_VERIFICATION' ? [event] : [];
        }
        if (event.verificationStatus === 'VERIFIED') {
            return generateOccurrences(event, windowStart, windowEnd);
        }
        return [];
    });
    
    // Step 2: Add distance to each event's venue
    const eventsWithDistance = allOccurrences.map(event => {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, event.venue.lat, event.venue.lng);
      return {
        ...event,
        venue: {
          ...event.venue,
          distance,
        }
      };
    });

    // Step 3: Apply user filters
    const filteredEvents = eventsWithDistance.filter(event => {
      // Distance filter
      if (event.venue.distance > filters.distance) return false;

      // Access level filter
      if (filters.accessLevel === 'WALK_IN' && event.accessLevel !== 'WALK_IN') return false;
      if (filters.accessLevel === 'REGISTRATION' && event.accessLevel !== 'REGISTRATION') return false;
      if (filters.accessLevel === 'REFERRAL' && event.accessLevel !== 'REFERRAL') return false;

      // Event type filter
      if (filters.eventType !== 'ALL' && event.foodType !== filters.eventType) return false;
      
      // Dietary filter
      if (filters.dietary !== 'ALL' && !event.dietaryTags.includes(filters.dietary.toLowerCase())) return false;

      // Cost filter
      if (filters.cost === 'FREE' && event.cost?.toLowerCase() !== 'gratis') return false;
      
      return true;
    });

    // Step 4: Group events by venue and sort venues by distance
    const uniqueVenues = new Map<string, VenueWithDistance>();
    const eventsByVenue = new Map<string, FoodEvent[]>();

    filteredEvents.forEach(event => {
      if (!uniqueVenues.has(event.venue.id)) {
        uniqueVenues.set(event.venue.id, event.venue);
      }
      if (!eventsByVenue.has(event.venue.id)) {
        eventsByVenue.set(event.venue.id, []);
      }
      eventsByVenue.get(event.venue.id)?.push(event);
    });

    const sortedVenues = Array.from(uniqueVenues.values()).sort((a, b) => a.distance - b.distance);

    return { venues: sortedVenues, eventsByVenue, totalEvents: filteredEvents.length };
  }, [allEvents, filters, userLocation, timeView, showDrafts]);
};
