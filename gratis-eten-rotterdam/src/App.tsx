import { useState, useEffect } from 'react';
import { FilterState, TimeViewMode, FoodEventWithDistance } from './types';
import { Header } from './components/Layout/Header';
import { TimelineGrid } from './components/Timeline/TimelineGrid';
import { ListView } from './components/Layout/MobileEventList';
import { LoadingSkeleton } from './components/Layout/LoadingSkeleton';
import { useGeolocation } from './hooks/useGeolocation';
import { useFilteredEvents } from './hooks/useFilteredEvents';
import { foodEvents } from './data/events';
import { EventDetail } from './components/Events/EventDetail';

function App() {
  // Geolocation
  const { location } = useGeolocation();

  // Mobile detection - FORCE DESKTOP FOR TESTING
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(false); // FORCE DESKTOP VIEW
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    distance: 5,  // 5km default
    accessLevel: 'ALL',
    eventType: 'ALL',
    dietary: 'ALL',
    openNow: false,
    noRegistration: false,
  });

  // Time view mode - use TODAY to show 14:00-22:00 like prototype
  const [timeViewMode] = useState<TimeViewMode>('TODAY');

  // Selected event for mobile detail view
  const [selectedEvent, setSelectedEvent] = useState<FoodEventWithDistance | null>(null);

  // Get filtered events and venues
  const { events, venues } = useFilteredEvents(foodEvents, location, filters, timeViewMode);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header filters={filters} onFilterChange={setFilters} />

      {location ? (
        <>
          {isMobile ? (
            <ListView 
              events={events} 
              onEventClick={setSelectedEvent}
            />
          ) : (
            <TimelineGrid events={events} venues={venues} timeViewMode={timeViewMode} />
          )}
          
          {/* Mobile Event Detail Modal */}
          {isMobile && selectedEvent && (
            <EventDetail 
              event={selectedEvent} 
              onClose={() => setSelectedEvent(null)} 
            />
          )}
        </>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
}

export default App;
