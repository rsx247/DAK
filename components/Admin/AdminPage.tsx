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
                            className="px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface"
                        >
                            Importeren
                        </button>
                        <button 
                            onClick={onExport} 
                            className="px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface"
                        >
                            Exporteren
                        </button>
                        <button 
                            onClick={handleAddNew} 
                            className="px-4 py-2 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600"
                        >
                            {activeTab === 'events' ? 'Nieuw Event' : 'Nieuwe Locatie'}
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