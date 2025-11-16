import { useMemo } from 'react';
import { FoodEvent, FoodEventWithDistance, FilterState, UserLocation, VenueWithDistance } from '../types';
import { distanceFromUser } from '../utils/distance';
import { getTimeWindow, isHappeningNow } from '../utils/time';

export function useFilteredEvents(
  events: FoodEvent[],
  userLocation: UserLocation | null,
  filters: FilterState,
  timeViewMode: 'TODAY' | 'NEXT_24H' | 'WEEK'
) {
  const filteredEvents = useMemo(() => {
    if (!userLocation) return [];

    const timeWindow = getTimeWindow(timeViewMode);

    // Add distance to events
    const eventsWithDistance: FoodEventWithDistance[] = events.map(event => {
      const distance = distanceFromUser(userLocation, event.venue.lat, event.venue.lng);
      
      return {
        ...event,
        venue: {
          ...event.venue,
          distance,
        } as VenueWithDistance,
      };
    });

    // Filter by time window - show events that are happening during the window
    let filtered = eventsWithDistance.filter(event => {
      // Include event if it overlaps with the time window
      return event.endTime >= timeWindow.start && event.startTime <= timeWindow.end;
    });

    // Filter by distance
    if (filters.distance !== Infinity) {
      filtered = filtered.filter(event => event.venue.distance <= filters.distance);
    }

    // Filter by access level
    if (filters.accessLevel === 'WALK_IN') {
      filtered = filtered.filter(event => event.accessLevel === 'WALK_IN');
    }

    // Filter by event type
    if (filters.eventType !== 'ALL') {
      filtered = filtered.filter(event => {
        switch (filters.eventType) {
          case 'MEALS':
            return event.foodType.toLowerCase().includes('meal') || 
                   event.foodType.toLowerCase().includes('maaltijd');
          case 'PACKAGES':
            return event.foodType.toLowerCase().includes('package') || 
                   event.foodType.toLowerCase().includes('pakket');
          case 'MOBILE':
            return event.venue.category === 'FOOD_RESCUE' && 
                   event.venue.name.toLowerCase().includes('mobiel');
          default:
            return true;
        }
      });
    }

    // Filter by dietary requirements
    if (filters.dietary !== 'ALL') {
      filtered = filtered.filter(event => {
        switch (filters.dietary) {
          case 'HALAL':
            return event.dietaryTags.includes('halal');
          case 'VEGETARIAN':
            return event.dietaryTags.includes('vegetarian') || 
                   event.dietaryTags.includes('vegetarian-option');
          case 'VEGAN':
            return event.dietaryTags.includes('vegan') || 
                   event.dietaryTags.includes('vegan-option');
          default:
            return true;
        }
      });
    }

    // Filter by "Open Now" - show only events happening right now
    if (filters.openNow) {
      filtered = filtered.filter(event => isHappeningNow(event.startTime, event.endTime));
    }

    // Filter by "No Registration" - show only walk-in events
    if (filters.noRegistration) {
      filtered = filtered.filter(event => event.accessLevel === 'WALK_IN');
    }

    // Sort by distance (closest first)
    return filtered.sort((a, b) => a.venue.distance - b.venue.distance);
  }, [events, userLocation, filters, timeViewMode]);

  // Get unique venues with distance
  const venues = useMemo(() => {
    if (!userLocation) return [];

    const venueMap = new Map<string, VenueWithDistance>();

    filteredEvents.forEach(event => {
      if (!venueMap.has(event.venue.id)) {
        venueMap.set(event.venue.id, event.venue);
      }
    });

    // Convert to array and sort by distance
    return Array.from(venueMap.values()).sort((a, b) => a.distance - b.distance);
  }, [filteredEvents, userLocation]);

  return {
    events: filteredEvents,
    venues,
  };
}


