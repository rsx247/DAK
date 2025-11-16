
import { useMemo } from 'react';
import type { FoodEvent, FilterState, UserLocation, VenueWithDistance, TimeViewMode } from '../types';
import { calculateDistance } from '../utils/distance';

export const useFilteredEvents = (
  allEvents: FoodEvent[],
  filters: FilterState,
  userLocation: UserLocation | null,
  timeView: TimeViewMode
) => {
  return useMemo(() => {
    if (!userLocation) {
      return { venues: [], eventsByVenue: new Map(), totalEvents: 0 };
    }

    const now = new Date();
    let startTimeLimit: Date;
    let endTimeLimit: Date;

    switch (timeView) {
      case 'NEXT_24H':
        startTimeLimit = now;
        endTimeLimit = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'WEEK':
        startTimeLimit = new Date(now);
        startTimeLimit.setHours(0, 0, 0, 0);
        endTimeLimit = new Date(startTimeLimit.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'TODAY':
      default:
        startTimeLimit = new Date(now);
        startTimeLimit.setHours(0, 0, 0, 0);
        endTimeLimit = new Date(now);
        endTimeLimit.setHours(23, 59, 59, 999);
        break;
    }

    const eventsWithDistance = allEvents.map(event => {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, event.venue.lat, event.venue.lng);
      return {
        ...event,
        venue: {
          ...event.venue,
          distance,
        }
      };
    });

    const filteredEvents = eventsWithDistance.filter(event => {
      // Time filter
      const eventStarts = event.startTime;
      const eventEnds = event.endTime;
      if (eventEnds < startTimeLimit || eventStarts > endTimeLimit) {
        return false;
      }
      
      // Distance filter
      if (event.venue.distance > filters.distance) return false;

      // Access level filter
      if (filters.accessLevel === 'WALK_IN' && event.accessLevel !== 'WALK_IN') return false;

      // Event type filter
      if (filters.eventType !== 'ALL' && event.foodType !== filters.eventType) return false;
      
      // Dietary filter
      if (filters.dietary !== 'ALL' && !event.dietaryTags.includes(filters.dietary.toLowerCase())) return false;
      
      return true;
    });

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
  }, [allEvents, filters, userLocation, timeView]);
};
