
import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { FilterBar } from './components/Layout/FilterBar';
import { TimelineGrid } from './components/Timeline/TimelineGrid';
import { EventDetail } from './components/Events/EventDetail';
import { AddEventForm } from './components/Events/AddEventForm';
import { LoadingSkeleton } from './components/Layout/LoadingSkeleton';
import { EmptyState } from './components/Timeline/EmptyState';
import { EventList } from './components/Events/EventList';
import { AddVenueForm } from './components/Venues/AddVenueForm';
import { AdminPage } from './components/Admin/AdminPage';
import { useGeolocation } from './hooks/useGeolocation';
import { useFilteredEvents } from './hooks/useFilteredEvents';
import { allEvents as initialEventData, allVenues as initialVenues } from './data/events';
import type { FilterState, TimeViewMode, FoodEvent, Venue, VenueSubmissionData, VenueCategory, VerificationStatus, AccessLevel, EventSubmissionData, EventData } from './types';

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
                return JSON.parse(storedVenues);
            }
        } catch (error) {
            console.error("Error loading venues from localStorage:", error);
        }
        return initialVenues;
    });

    const [allEvents, setAllEvents] = useState<FoodEvent[]>(() => {
        let venuesForLinking: Venue[];
        try {
            const storedVenues = localStorage.getItem('allVenues');
            venuesForLinking = storedVenues ? JSON.parse(storedVenues) : initialVenues;
        } catch {
            venuesForLinking = initialVenues;
        }

        try {
            const storedEvents = localStorage.getItem('allEvents');
            if (storedEvents) {
                const parsedEvents: EventData[] = JSON.parse(storedEvents, dateReviver);
                return linkVenuesToEvents(parsedEvents, venuesForLinking);
            }
        } catch (error) {
            console.error("Error loading events from localStorage:", error);
        }
        return linkVenuesToEvents(initialEventData, venuesForLinking);
    });

    const [filters, setFilters] = useState<FilterState>({ distance: Infinity, accessLevel: 'ALL', eventType: 'ALL', dietary: 'ALL', cost: 'ALL' });
    const { location, loading: geoLoading, error: geoError } = useGeolocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [timeView, setTimeView] = useState<TimeViewMode>('TODAY');
    const [viewMode, setViewMode] = useState<'TIMELINE' | 'LIST' | 'ADMIN'>('TIMELINE');
    const [selectedEvent, setSelectedEvent] = useState<FoodEvent | null>(null);

    const [isAdmin, setIsAdmin] = useState(true);
    const [showDrafts, setShowDrafts] = useState(false);

    const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<FoodEvent | null>(null);

    const [isAddVenueFormOpen, setIsAddVenueFormOpen] = useState(false);
    const [venueToEdit, setVenueToEdit] = useState<Venue | null>(null);

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
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const { venues, eventsByVenue, totalEvents } = useFilteredEvents(allEvents, filters, location, timeView, showDrafts);

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

            // FIX: Add a type guard to safely handle untyped data from JSON.parse.
            // This is done by changing the type to any[] and adding a guard before using the data.
            const importedVenues: any[] = importedData.venues;
            const importedEventsRaw: any[] = importedData.events;

            // Fix: Explicitly type `venuesMap` to prevent its value type from being widened to `any`
            // when untyped data from the imported JSON is added. This ensures `newAllVenues`
            // is correctly inferred as `Venue[]`, resolving the type error.
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

            // FIX: Add a type guard to safely handle untyped data from JSON.parse.
            // This ensures that `event` is an object with a string `id` before we use it.
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


    const renderContent = () => {
        if (geoLoading) {
            return <LoadingSkeleton />;
        }
        if (geoError || !location) {
            return <div className="flex-grow flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">Locatie niet gevonden</h2>
                    <p className="text-text-secondary mt-2">We konden je locatie niet ophalen. Controleer je browserinstellingen en geef toestemming om je locatie te delen.</p>
                    {geoError && <p className="text-red-500 text-sm mt-2">{geoError}</p>}
                </div>
            </div>;
        }

        if (totalEvents === 0 && viewMode !== 'ADMIN' && !showDrafts) {
            return <EmptyState isDraftView={showDrafts} />;
        }
        
        switch (viewMode) {
            case 'TIMELINE':
                return <TimelineGrid venues={venues} eventsByVenue={eventsByVenue} currentTime={currentTime} onEventClick={setSelectedEvent} />;
            case 'LIST':
                const flatEvents = venues.flatMap(v => eventsByVenue.get(v.id) || []).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
                return <EventList events={flatEvents} onEventClick={setSelectedEvent} />;
            case 'ADMIN':
                 return (
                    <AdminPage 
                        events={allEvents}
                        venues={allVenues}
                        onAddEventClick={handleAddEventClick}
                        onEditEvent={handleEditEvent}
                        onDeleteEvent={handleDeleteEvent}
                        onAddVenueClick={handleAddVenueClick}
                        onEditVenue={handleEditVenue}
                        onDeleteVenue={handleDeleteVenue}
                        onExport={handleExportData}
                        onImport={handleImportData}
                    />
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex flex-col h-screen font-sans bg-white">
            <Header timeView={timeView} setTimeView={setTimeView} viewMode={viewMode} setViewMode={setViewMode} onAddEventClick={handleAddEventClick} isAdmin={isAdmin} />
            {viewMode !== 'ADMIN' && <FilterBar filters={filters} setFilters={setFilters} isAdmin={isAdmin} showDrafts={showDrafts} setShowDrafts={setShowDrafts} />}
            <main className="flex-grow flex flex-col overflow-hidden">
                {renderContent()}
            </main>
            {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} isAdmin={isAdmin} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />}
            <AddEventForm isOpen={isAddEventFormOpen} onClose={() => { setIsAddEventFormOpen(false); setEventToEdit(null); }} onSubmit={handleEventSubmit} venues={allVenues} eventToEdit={eventToEdit} />
            <AddVenueForm isOpen={isAddVenueFormOpen} onClose={() => { setIsAddVenueFormOpen(false); setVenueToEdit(null); }} onSubmit={handleVenueSubmit} venueToEdit={venueToEdit} />
        </div>
    );
};

export default App;
