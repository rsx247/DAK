import React, { useState, useRef } from 'react';
import type { FoodEvent, Venue } from '../../types';
import { AdminEventList } from './AdminEventList';
import { AdminVenueList } from './AdminVenueList';

interface AdminPageProps {
    events: FoodEvent[];
    venues: Venue[];
    onAddEventClick: () => void;
    onEditEvent: (event: FoodEvent) => void;
    onDeleteEvent: (eventId: string) => void;
    onAddVenueClick: () => void;
    onEditVenue: (venue: Venue) => void;
    onDeleteVenue: (venueId: string) => void;
    onExport: () => void;
    onImport: (jsonString: string) => void;
}

type AdminTab = 'events' | 'venues';

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            isActive 
            ? 'border-accent text-accent' 
            : 'border-transparent text-text-secondary hover:text-text-primary'
        }`}
    >
        {label}
    </button>
);


export const AdminPage: React.FC<AdminPageProps> = ({
    events,
    venues,
    onAddEventClick,
    onEditEvent,
    onDeleteEvent,
    onAddVenueClick,
    onEditVenue,
    onDeleteVenue,
    onExport,
    onImport,
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('events');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddNew = () => {
        if (activeTab === 'events') {
            onAddEventClick();
        } else {
            onAddVenueClick();
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                onImport(text);
            }
            if (event.target) {
                event.target.value = '';
            }
        };
        reader.onerror = () => {
            alert('Fout bij het lezen van het bestand.');
             if (event.target) {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex-grow p-4 md:p-6 bg-surface overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {/* Header with Tabs and New Button */}
                <div className="flex justify-between items-center border-b border-border-color mb-6">
                    <div className="flex items-center space-x-2">
                        <TabButton label="Evenementen" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                        <TabButton label="Locaties" isActive={activeTab === 'venues'} onClick={() => setActiveTab('venues')} />
                    </div>
                     <div className="flex items-center space-x-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="application/json"
                            className="hidden"
                        />
                        <button 
                            onClick={handleImportClick} 
                            aria-label="Importeren"
                            className="flex items-center justify-center h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden md:inline ml-2">Importeren</span>
                        </button>
                        <button 
                            onClick={onExport} 
                            aria-label="Exporteren"
                            className="flex items-center justify-center h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="hidden md:inline ml-2">Exporteren</span>
                        </button>
                        <button 
                            onClick={handleAddNew} 
                            aria-label={activeTab === 'events' ? 'Nieuw Event toevoegen' : 'Nieuwe Locatie toevoegen'}
                            className="flex items-center justify-center h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            <span className="hidden md:inline ml-2">{activeTab === 'events' ? 'Nieuw Event' : 'Nieuwe Locatie'}</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div>
                    {activeTab === 'events' && (
                        <AdminEventList events={events} onEdit={onEditEvent} onDelete={onDeleteEvent} />
                    )}
                    {activeTab === 'venues' && (
                        <AdminVenueList venues={venues} onEdit={onEditVenue} onDelete={onDeleteVenue} />
                    )}
                </div>
            </div>
        </div>
    );
};