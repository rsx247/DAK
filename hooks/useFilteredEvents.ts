import { useMemo } from 'react';
import type { FoodEvent, FilterState, UserLocation, VenueWithDistance, TimeViewMode, SortByType, DailyEventGrouping, VenueEventGrouping } from '../types';
import { calculateDistance } from '../utils/distance';
import { generateOccurrences } from '../utils/recurrence';
import { parseCost } from '../utils/cost';

export const useFilteredEvents = (
  allEvents: FoodEvent[],
  filters: FilterState,
  userLocation: UserLocation,
  timeView: TimeViewMode,
  showDrafts: boolean = false,
  sortBy: SortByType = 'distance',
  nowOverride?: Date
) => {
  return useMemo(() => {
    const now = nowOverride || new Date();
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
      if (event.venue.distance > filters.distance) return false;
      if (event.costValue > filters.maxCost) return false;
      if (filters.accessLevels.length > 0 && !filters.accessLevels.includes(event.accessLevel)) return false;
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.foodType as 'MEALS' | 'PACKAGES')) return false;
      if (filters.dietaryNeeds.length > 0 && !filters.dietaryNeeds.some(need => event.dietaryTags.includes(need))) return false;
      return true;
    });

    // --- Data Grouping ---

    // A: Group by Date (for Timeline, List, ChronoGrid)
    const eventsByDate = new Map<string, (typeof filteredEvents)[number][]>();
    filteredEvents.forEach(event => {
      const d = event.startTime;
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!eventsByDate.has(dateKey)) eventsByDate.set(dateKey, []);
      eventsByDate.get(dateKey)!.push(event);
    });

    const dailyGroupings: DailyEventGrouping[] = [];
    const sortedDateKeys = Array.from(eventsByDate.keys()).sort();
    
    for (const dateKey of sortedDateKeys) {
      const dayEvents = eventsByDate.get(dateKey)!;
      const uniqueVenues = new Map<string, VenueWithDistance>();
      const eventsByVenue = new Map<string, FoodEvent[]>();
      
      dayEvents.forEach(event => {
        if (!uniqueVenues.has(event.venue.id)) uniqueVenues.set(event.venue.id, event.venue);
        if (!eventsByVenue.has(event.venue.id)) eventsByVenue.set(event.venue.id, []);
        eventsByVenue.get(event.venue.id)!.push(event);
      });
      
      const sortedVenues = Array.from(uniqueVenues.values()).sort((a,b) => a.distance - b.distance);
      
      dailyGroupings.push({
        date: new Date(dateKey + 'T12:00:00Z'),
        venues: sortedVenues,
        eventsByVenue,
      });
    }

    // B: Group by Venue (for original Grid view)
    const uniqueVenuesForGrid = new Map<string, VenueWithDistance>();
    const eventsByVenueForGrid = new Map<string, FoodEvent[]>();
    filteredEvents.forEach(event => {
        if (!uniqueVenuesForGrid.has(event.venue.id)) {
            uniqueVenuesForGrid.set(event.venue.id, event.venue);
        }
        if (!eventsByVenueForGrid.has(event.venue.id)) {
            eventsByVenueForGrid.set(event.venue.id, []);
        }
        eventsByVenueForGrid.get(event.venue.id)!.push(event);
    });

    let sortedVenuesForGrid: VenueWithDistance[];
    switch(sortBy) {
      // NOTE: Time sort for venue-based grid is complex; defaulting to distance for now.
      // A proper implementation would need to find the earliest event across all days for each venue.
      case 'time':
      case 'distance':
      default:
           sortedVenuesForGrid = Array.from(uniqueVenuesForGrid.values()).sort((a, b) => a.distance - b.distance);
           break;
      case 'alphabetical':
          sortedVenuesForGrid = Array.from(uniqueVenuesForGrid.values()).sort((a, b) => a.name.localeCompare(b.name));
          break;
    }
    
    const venueGroupings: VenueEventGrouping = {
      venues: sortedVenuesForGrid,
      eventsByVenue: eventsByVenueForGrid,
    };
    
    return { 
      dailyGroupings, 
      venueGroupings,
      totalEvents: filteredEvents.length, 
      unfilteredTotal,
      totalVenues: uniqueVenuesForGrid.size 
    };
  }, [allEvents, filters, userLocation, timeView, showDrafts, sortBy, nowOverride]);
};