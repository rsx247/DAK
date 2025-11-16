import { useMemo } from 'react';
import type { FoodEvent, FilterState, UserLocation, VenueWithDistance, TimeViewMode, SortByType, AccessLevel } from '../types';
import { calculateDistance } from '../utils/distance';
import { generateOccurrences } from '../utils/recurrence';
import { parseCost } from '../utils/cost';

export const useFilteredEvents = (
  allEvents: FoodEvent[],
  filters: FilterState,
  userLocation: UserLocation,
  timeView: TimeViewMode,
  showDrafts: boolean = false,
  sortBy: SortByType = 'distance'
) => {
  return useMemo(() => {
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
    
    const unfilteredTotal = allOccurrences.length;

    // Step 2: Add distance to each event's venue and parse cost
    const eventsWithDistanceAndCost = allOccurrences.map(event => {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, event.venue.lat, event.venue.lng);
      const costValue = parseCost(event.cost);
      return {
        ...event,
        costValue,
        venue: {
          ...event.venue,
          distance,
        }
      };
    });

    // Step 3: Apply user filters
    const filteredEvents = eventsWithDistanceAndCost.filter(event => {
      // Distance filter
      if (event.venue.distance > filters.distance) return false;

      // Cost filter
      if (event.costValue > filters.maxCost) return false;

      // Access level filter (multi-select)
      if (filters.accessLevels.length > 0 && !filters.accessLevels.includes(event.accessLevel)) return false;

      // Event type filter (multi-select)
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.foodType as 'MEALS' | 'PACKAGES')) return false;
      
      // Dietary needs filter (multi-select)
      if (filters.dietaryNeeds.length > 0 && !filters.dietaryNeeds.some(need => event.dietaryTags.includes(need))) return false;
      
      return true;
    });

    // Step 4: Group events by venue
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
    
    // Step 5: Sort venues based on user's choice
    let sortedVenues: VenueWithDistance[];
    if (sortBy === 'time') {
        const earliestEventTimeByVenue = new Map<string, number>();
        uniqueVenues.forEach((venue, venueId) => {
            const eventsForVenue = eventsByVenue.get(venueId) || [];
            if (eventsForVenue.length > 0) {
                 const upcomingEvents = eventsForVenue.filter(e => e.startTime.getTime() >= now.getTime());
                 if (upcomingEvents.length > 0) {
                     const earliestTime = Math.min(...upcomingEvents.map(e => e.startTime.getTime()));
                     earliestEventTimeByVenue.set(venueId, earliestTime);
                 } else {
                     // If all events are in the past, sort them to the end
                     earliestEventTimeByVenue.set(venueId, Infinity);
                 }
            }
        });

        sortedVenues = Array.from(uniqueVenues.values()).sort((a, b) => {
            const timeA = earliestEventTimeByVenue.get(a.id) ?? Infinity;
            const timeB = earliestEventTimeByVenue.get(b.id) ?? Infinity;
            if (timeA === timeB) {
                return a.distance - b.distance; // Secondary sort by distance
            }
            return timeA - timeB;
        });

    } else { // Default sort by distance
        sortedVenues = Array.from(uniqueVenues.values()).sort((a, b) => a.distance - b.distance);
    }
    

    return { venues: sortedVenues, eventsByVenue, totalEvents: filteredEvents.length, unfilteredTotal };
  }, [allEvents, filters, userLocation, timeView, showDrafts, sortBy]);
};