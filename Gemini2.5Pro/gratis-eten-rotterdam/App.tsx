
import React, { useState, useEffect, useMemo } from 'react';
import { FilterBar } from './components/Layout/FilterBar';
import { Header } from './components/Layout/Header';
import { TimelineGrid } from './components/Timeline/TimelineGrid';
import { EventDetail } from './components/Events/EventDetail';
import { LoadingSkeleton } from './components/Layout/LoadingSkeleton';
import { useGeolocation } from './hooks/useGeolocation';
import { useFilteredEvents } from './hooks/useFilteredEvents';
import type { FilterState, FoodEvent, TimeViewMode, VenueWithDistance } from './types';
import { sampleEvents } from './data/events';
import { EmptyState } from './components/Timeline/EmptyState';
import { VenueCard } from './components/Venues/VenueCard';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    distance: Infinity,
    accessLevel: 'ALL',
    eventType: 'ALL',
    dietary: 'ALL',
  });
  const [timeView, setTimeView] = useState<TimeViewMode>('TODAY');
  const [selectedEvent, setSelectedEvent] = useState<FoodEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  const defaultLocation = { lat: 51.9225, lng: 4.4792 }; // Rotterdam Centraal

  const userLocation = location || defaultLocation;

  const { venues, eventsByVenue, totalEvents } = useFilteredEvents(sampleEvents, filters, userLocation, timeView);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleEventClick = (event: FoodEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };
  
  const sortedVenues = useMemo(() => {
    return [...venues].sort((a, b) => a.distance - b.distance);
  }, [venues]);

  return (
    <div className="bg-white text-text-primary font-sans min-h-screen flex flex-col">
      <Header timeView={timeView} setTimeView={setTimeView} />
      <FilterBar filters={filters} setFilters={setFilters} />

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {geoLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Desktop Venue Sidebar */}
            <aside className="hidden md:block w-64 border-r border-border-color bg-surface overflow-y-auto p-4 flex-shrink-0">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                LOCATIES ({sortedVenues.length})
              </h2>
              <div className="space-y-3">
                {sortedVenues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} />
                ))}
              </div>
            </aside>

            <div className="flex-grow flex flex-col overflow-hidden">
                {totalEvents > 0 ? (
                    <TimelineGrid
                        venues={sortedVenues}
                        eventsByVenue={eventsByVenue}
                        currentTime={currentTime}
                        onEventClick={handleEventClick}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
          </>
        )}
      </main>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default App;
