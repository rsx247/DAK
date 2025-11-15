import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { TimelineGrid } from './components/Timeline/TimelineGrid';
import { GridView } from './components/Timeline/GridView';
import { ChronologicalGridView } from './components/Timeline/ChronologicalGridView';
import { EventDetail } from './components/Events/EventDetail';
import { AddEventForm } from './components/Events/AddEventForm';
import { EmptyState } from './components/Timeline/EmptyState';
import { EventList } from './components/Events/EventList';
import { AddVenueForm } from './components/Venues/AddVenueForm';
import { AdminPage } from './components/Admin/AdminPage';
import { useGeolocation } from './hooks/useGeolocation';
import { useFilteredEvents } from './hooks/useFilteredEvents';
import { allEvents as initialEventData, allVenues as initialVenues } from './data/events';
import type { FilterState, TimeViewMode, FoodEvent, Venue, VenueSubmissionData, EventSubmissionData, EventData, UserLocation, SortByType, ViewMode } from './types';


// Helper to revive date strings from JSON into Date objects
const dateReviver = (key: string, value: any) => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof value === 'string' && isoDateRegex.test(value)) {
        return new Date(value);
    }
    return value;
};

// Helper to link venue data to event data
const linkVenuesToEvents = (eventsToLink: EventData[], venuesToLink: Venue[]): FoodEvent[] => {
    return eventsToLink.map(event => ({
        ...event,
        venue: venuesToLink.find(v => v.id === event.venueId)!,
    })).filter(e => e.venue); // Filter out events with no matching venue
};

const App: React.FC = () => {
    const [allVenues, setAllVenues] = useState<Venue[]>(() => {
        try {
            const storedVenues = localStorage.getItem('allVenues');
            if (storedVenues) {
                const parsedVenues = JSON.parse(storedVenues);
                if (Array.isArray(parsedVenues)) {
                    return parsedVenues;
                }
            }
        } catch (error) {
            console.error("Error loading venues from localStorage, falling back to initial data:", error);
        }
        return initialVenues;
    });

    const [allEvents, setAllEvents] = useState<FoodEvent[]>(() => {
        let venuesForLinking: Venue[];
        try {
            const storedVenues = localStorage.getItem('allVenues');
            const parsedVenues = storedVenues ? JSON.parse(storedVenues) : initialVenues;
            venuesForLinking = Array.isArray(parsedVenues) ? parsedVenues : initialVenues;
        } catch {
            venuesForLinking = initialVenues;
        }

        try {
            const storedEvents = localStorage.getItem('allEvents');
            if (storedEvents) {
                const parsedEvents: EventData[] = JSON.parse(storedEvents, dateReviver);
                if (Array.isArray(parsedEvents)) {
                    return linkVenuesToEvents(parsedEvents, venuesForLinking);
                }
            }
        } catch (error) {
            console.error("Error loading events from localStorage, falling back to initial data:", error);
        }
        return linkVenuesToEvents(initialEventData, venuesForLinking);
    });

    const [filters, setFilters] = useState<FilterState>({ distance: Infinity, maxCost: Infinity, accessLevels: [], eventTypes: [], dietaryNeeds: [] });
    const { location, loading: geoLoading, error: geoError, getLocation, setManualLocation, locationType } = useGeolocation();
    const [sortBy, setSortBy] = useState<SortByType>('distance');
    const [sortInteracted, setSortInteracted] = useState(false);
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [simulatedTime, setSimulatedTime] = useState<Date | null>(null);
    const [timeView, setTimeView] = useState<TimeViewMode>('TODAY');
    const [viewMode, setViewMode] = useState<ViewMode>('TIMELINE');
    const [previousViewMode, setPreviousViewMode] = useState<ViewMode>('TIMELINE');
    const [selectedEvent, setSelectedEvent] = useState<FoodEvent | null>(null);
    const [eventDetailMode, setEventDetailMode] = useState<'panel' | 'modal'>('panel');


    const [isAdmin, setIsAdmin] = useState(true);
    const [showDrafts, setShowDrafts] = useState(false);

    const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<FoodEvent | null>(null);

    const [isAddVenueFormOpen, setIsAddVenueFormOpen] = useState(false);
    const [venueToEdit, setVenueToEdit] = useState<Venue | null>(null);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isInlineFilterVisible, setIsInlineFilterVisible] = useState(false);

    const DEFAULT_LOCATION: UserLocation = { lat: 51.9225, lng: 4.47917, accuracy: 10000 };
    const locationForFiltering = location || DEFAULT_LOCATION;

    // Save venues to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('allVenues', JSON.stringify(allVenues));
        } catch (error) {
            console.error("Error saving venues to localStorage:", error);
        }
    }, [allVenues]);

    // Save events to localStorage whenever they change
    useEffect(() => {
        try {
            // Strip the `venue` object before saving to avoid data duplication
            const eventsToStore = allEvents.map(({ venue, ...rest }) => rest);
            localStorage.setItem('allEvents', JSON.stringify(eventsToStore));
        } catch (error) {
            console.error("Error saving events to localStorage:", error);
        }
    }, [allEvents]);

    useEffect(() => {
        if (simulatedTime) {
            // If simulation is active, stop the real-time clock.
            // The `effectiveCurrentTime` will be derived from `simulatedTime`.
            return; 
        }
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [simulatedTime]);
    
    const effectiveCurrentTime = simulatedTime || currentTime;

    const { dailyGroupings, venueGroupings, totalEvents, totalVenues } = useFilteredEvents(
        allEvents, 
        filters, 
        locationForFiltering, 
        timeView, 
        showDrafts, 
        sortBy,
        effectiveCurrentTime
    );
    
    const handleManualLocationSelect = (selectedLocation: { name: string, lat: number, lng: number }) => {
        // Use an accuracy of 50m for manually entered locations
        setManualLocation({ ...selectedLocation, accuracy: 50 });
    };

    const handleAddEventClick = () => {
        setEventToEdit(null);
        setIsAddEventFormOpen(true);
    };

    const handleEditEvent = (event: FoodEvent) => {
        setEventToEdit(event);
        setIsAddEventFormOpen(true);
    };

    const handleDeleteEvent = (eventId: string) => {
        if (window.confirm('Weet je zeker dat je dit evenement wilt verwijderen?')) {
            setAllEvents(prev => prev.filter(e => e.id !== eventId));
            if (selectedEvent?.id === eventId) {
                setSelectedEvent(null);
            }
        }
    };
    
    const handleEventSubmit = (data: EventSubmissionData) => {
        const finalData = { ...data };
        if (finalData.cost.trim() === '0') {
            finalData.cost = 'Gratis';
        }

        if (finalData.id) { // Editing existing event
            setAllEvents(prevEvents => prevEvents.map(event => {
                if (event.id === finalData.id) {
                    const venue = allVenues.find(v => v.id === finalData.venueId)!;
                    return { ...event, ...finalData, venue, recurrence: finalData.recurrence || event.recurrence };
                }
                return event;
            }));
        } else { // Adding new event
            let newVenueId = finalData.venueId;
            let newVenues = allVenues;
            if (finalData.newVenue) {
                const newVenue: Venue = {
                    ...finalData.newVenue,
                    id: `venue-${crypto.randomUUID()}`,
                    city: 'Rotterdam',
                    lat: 51.9225, // Placeholder coords, real app would geocode
                    lng: 4.47917,
                    about: '',
                    verificationStatus: 'NEEDS_VERIFICATION'
                };
                newVenues = [...allVenues, newVenue];
                setAllVenues(newVenues);
                newVenueId = newVenue.id;
            }
            const newEvent: FoodEvent = {
                ...finalData,
                id: `event-${crypto.randomUUID()}`,
                venueId: newVenueId!,
                venue: newVenues.find(v => v.id === newVenueId)!,
                recurrence: finalData.recurrence,
            };
            setAllEvents(prev => [...prev, newEvent]);
        }
        setIsAddEventFormOpen(false);
        setEventToEdit(null);
    };

    const handleAddVenueClick = () => {
        setVenueToEdit(null);
        setIsAddVenueFormOpen(true);
    };

    const handleEditVenue = (venue: Venue) => {
        setVenueToEdit(venue);
        setIsAddVenueFormOpen(true);
    };

    const handleDeleteVenue = (venueId: string) => {
        const isVenueInUse = allEvents.some(event => event.venueId === venueId);
        if (isVenueInUse) {
            alert('Deze locatie kan niet worden verwijderd omdat er nog evenementen aan gekoppeld zijn. Verwijder of verplaats eerst de evenementen.');
            return;
        }
        if (window.confirm('Weet je zeker dat je deze locatie wilt verwijderen?')) {
            setAllVenues(prev => prev.filter(v => v.id !== venueId));
        }
    };
    
    const handleVenueSubmit = (data: VenueSubmissionData) => {
        if (data.id) { // Editing
            const updatedVenue = { ...allVenues.find(v => v.id === data.id)!, ...data } as Venue;
            setAllVenues(prev => prev.map(v => v.id === data.id ? updatedVenue : v));
            // Also update venues inside events to keep data in sync
            setAllEvents(prevEvents => prevEvents.map(e => e.venueId === data.id ? {...e, venue: updatedVenue} : e));
        } else { // Adding
            const newVenue: Venue = {
                ...data,
                id: `venue-${crypto.randomUUID()}`,
                city: 'Rotterdam',
                lat: 51.9225,
                lng: 4.47917,
                about: '',
                verificationStatus: 'NEEDS_VERIFICATION'
            };
            setAllVenues(prev => [...prev, newVenue]);
        }
        setIsAddVenueFormOpen(false);
        setVenueToEdit(null);
    };

    const handleExportData = () => {
        const eventsToExport = allEvents.map(({ venue, ...rest }) => rest);
        const dataToExport = {
            venues: allVenues,
            events: eventsToExport,
        };
    
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = `gratis-eten-rotterdam-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = (jsonString: string) => {
        if (!window.confirm('Weet je zeker dat je data wilt importeren? Bestaande items met dezelfde ID worden overschreven.')) {
            return;
        }

        try {
            const importedData: any = JSON.parse(jsonString, dateReviver);

            if (!importedData || !Array.isArray(importedData.venues) || !Array.isArray(importedData.events)) {
                throw new Error('Ongeldig bestandsformaat. Het bestand moet een JSON-object zijn met "venues" en "events" arrays.');
            }

            const importedVenues: any[] = importedData.venues;
            const importedEventsRaw: any[] = importedData.events;

            const venuesMap = new Map<string, Venue>(allVenues.map(v => [v.id, v]));
            importedVenues.forEach(v => {
                 if (v && typeof v === 'object' && 'id' in v && typeof (v as any).id === 'string') {
                    venuesMap.set((v as any).id, v as Venue);
                }
            });
            const newAllVenues = Array.from(venuesMap.values());

            const eventsMap = new Map<string, EventData>();
            for (const event of allEvents) {
                const { venue, ...rest } = event;
                eventsMap.set(event.id, rest);
            }
            for (const event of importedEventsRaw) {
                 if (event && typeof event === 'object' && 'id' in event && typeof (event as any).id === 'string') {
                    eventsMap.set((event as any).id, event as EventData);
                }
            }
            
            const newAllEventsLinked = linkVenuesToEvents(Array.from(eventsMap.values()), newAllVenues);

            setAllVenues(newAllVenues);
            setAllEvents(newAllEventsLinked);

            alert('Data succesvol geïmporteerd!');

        } catch (error) {
            console.error("Import failed:", error);
            alert(`Fout bij importeren: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
        }
    };
    
    const getBaseEventById = useCallback((id: string): FoodEvent | undefined => {
        return allEvents.find(e => e.id === id);
    }, [allEvents]);

    const handleSuperadminViewToggle = () => {
        if (viewMode === 'SUPERADMIN') {
            setViewMode(previousViewMode);
        } else {
            setPreviousViewMode(viewMode);
            setViewMode('SUPERADMIN');
        }
    };

    const renderContent = () => {
        if (viewMode === 'ADMIN' || viewMode === 'SUPERADMIN') {
            return (
                <AdminPage 
                    mode={viewMode === 'ADMIN' ? 'admin' : 'superadmin'}
                    events={allEvents}
                    venues={allVenues}
                    onAddEventClick={handleAddEventClick}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onAddVenueClick={handleAddEventClick}
                    onEditVenue={handleEditVenue}
                    onDeleteVenue={handleDeleteVenue}
                    onExport={handleExportData}
                    onImport={handleImportData}
                    simulatedTime={simulatedTime}
                    onSetSimulatedTime={setSimulatedTime}
                />
            );
        }
        
        if (totalEvents === 0 && !showDrafts) {
            return <EmptyState isDraftView={showDrafts} />;
        }

        return (
            <div className="relative flex-grow">
                <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ease-in-out ${viewMode === 'TIMELINE' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                     <TimelineGrid 
                        dailyGroupings={dailyGroupings} 
                        currentTime={effectiveCurrentTime} 
                        onEventClick={setSelectedEvent} 
                        totalVenues={totalVenues} 
                        isCollapsed={isCollapsed}
                        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
                <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ease-in-out ${viewMode === 'LIST' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <EventList dailyGroupings={dailyGroupings} onEventClick={setSelectedEvent} currentTime={effectiveCurrentTime} />
                </div>
                <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ease-in-out ${viewMode === 'GRID' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <GridView
                        venueGroupings={venueGroupings}
                        currentTime={effectiveCurrentTime}
                        onEventClick={setSelectedEvent}
                        timeView={timeView}
                    />
                </div>
                <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ease-in-out ${viewMode === 'CHRONO_GRID' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <ChronologicalGridView
                        dailyGroupings={dailyGroupings}
                        currentTime={effectiveCurrentTime}
                        onEventClick={setSelectedEvent}
                        timeView={timeView}
                    />
                </div>
            </div>
        );
    };
    
    return (
        <div className="flex flex-col h-screen font-sans bg-white dark:bg-gray-900">
            <Header
                timeView={timeView}
                setTimeView={setTimeView}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onSuperadminViewToggle={handleSuperadminViewToggle}
                onAddEventClick={handleAddEventClick}
                isAdmin={isAdmin}
                geoLoading={geoLoading}
                geoError={geoError}
                location={location}
                locationType={locationType}
                onRetry={getLocation}
                onManualLocationSelect={handleManualLocationSelect}
                filters={filters}
                setFilters={setFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortInteracted={sortInteracted}
                setSortInteracted={setSortInteracted}
                totalResults={totalEvents}
                venueCount={totalVenues}
                isInlineFilterVisible={isInlineFilterVisible}
                setIsInlineFilterVisible={setIsInlineFilterVisible}
            />
            
            <main className="flex-grow flex flex-col">
                {renderContent()}
            </main>

            {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} isAdmin={isAdmin} onEdit={handleEditEvent} onDelete={handleDeleteEvent} getBaseEventById={getBaseEventById} mode={eventDetailMode} setMode={setEventDetailMode} currentTime={effectiveCurrentTime} />}
            <AddEventForm isOpen={isAddEventFormOpen} onClose={() => { setIsAddEventFormOpen(false); setEventToEdit(null); }} onSubmit={handleEventSubmit} venues={allVenues} eventToEdit={eventToEdit} />
            <AddVenueForm isOpen={isAddVenueFormOpen} onClose={() => { setIsAddVenueFormOpen(false); setVenueToEdit(null); }} onSubmit={handleVenueSubmit} venueToEdit={venueToEdit} />
        </div>
    );
};

export default App;