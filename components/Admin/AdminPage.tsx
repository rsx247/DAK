import React, { useState, useRef, useEffect } from 'react';
import type { FoodEvent, Venue } from '../../types';
import { AdminEventList } from './AdminEventList';
import { AdminVenueList } from './AdminVenueList';
import { IconLibrary } from './IconLibrary';
import { FutureFeaturesLog } from './FutureFeaturesLog';
import { ImportIcon, ExportIcon, AddIcon, TimeIcon, SearchIcon } from '../Layout/Icons';

interface AdminPageProps {
    mode: 'admin' | 'superadmin';
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
    simulatedTime: Date | null;
    onSetSimulatedTime: (time: Date | null) => void;
}

type AdminTab = 'events' | 'venues';
type SuperadminTab = 'icons' | 'roadmap';

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

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
            checked ? 'bg-accent' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2`}
    >
        <span
            aria-hidden="true"
            className={`${
                checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);


export const AdminPage: React.FC<AdminPageProps> = ({
    mode,
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
    simulatedTime,
    onSetSimulatedTime,
}) => {
    const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('events');
    const [activeSuperadminTab, setActiveSuperadminTab] = useState<SuperadminTab>('roadmap');
    const [superadminSearchQuery, setSuperadminSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [simDate, setSimDate] = useState('');
    const [simTime, setSimTime] = useState('');
    const isSimulationOn = simulatedTime !== null;

    useEffect(() => {
        if (simulatedTime) {
            const yyyy = simulatedTime.getFullYear();
            const mm = String(simulatedTime.getMonth() + 1).padStart(2, '0');
            const dd = String(simulatedTime.getDate()).padStart(2, '0');
            const hh = String(simulatedTime.getHours()).padStart(2, '0');
            const mi = String(simulatedTime.getMinutes()).padStart(2, '0');
            setSimDate(`${yyyy}-${mm}-${dd}`);
            setSimTime(`${hh}:${mi}`);
        }
    }, [simulatedTime]);
    
    useEffect(() => {
        if (isSimulationOn && simDate && simTime) {
            const newSimulatedDate = new Date(`${simDate}T${simTime}`);
            if (!isNaN(newSimulatedDate.getTime()) && newSimulatedDate.getTime() !== simulatedTime?.getTime()) {
                onSetSimulatedTime(newSimulatedDate);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [simDate, simTime, isSimulationOn]);

    const handleToggleSimulation = (isChecked: boolean) => {
        if (isChecked) {
            onSetSimulatedTime(new Date());
        } else {
            onSetSimulatedTime(null);
        }
    };

    const handleAddNew = () => {
        if (activeAdminTab === 'events') {
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
    
    const inputClasses = "block w-full px-3 py-2 bg-white text-text-primary border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-colors";

    const showAdminContent = mode === 'admin';
    const showSuperadminContent = mode === 'superadmin';

    return (
        <div className="flex-grow p-4 md:p-6 bg-surface overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                 {/* Header with Title (Superadmin only) */}
                {showSuperadminContent && (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <h1 className="text-2xl font-bold text-text-primary">Superadmin</h1>
                         <div className="relative w-full sm:max-w-xs">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="h-5 w-5 text-text-secondary" />
                            </div>
                            <input
                                type="search"
                                placeholder="Zoek roadmap of iconen..."
                                value={superadminSearchQuery}
                                onChange={(e) => setSuperadminSearchQuery(e.target.value)}
                                className={`${inputClasses} pl-10 !py-2.5`}
                            />
                        </div>
                    </div>
                )}
                
                {/* Time Simulation */}
                {showSuperadminContent && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-border-color mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TimeIcon className="w-5 h-5 text-text-secondary" />
                                <div>
                                    <h2 className="font-semibold text-text-primary">Time Simulation</h2>
                                    <p className="text-xs text-text-secondary">Bekijk de app op een ander moment in de tijd.</p>
                                </div>
                            </div>
                            <ToggleSwitch checked={isSimulationOn} onChange={handleToggleSimulation} />
                        </div>
                        {isSimulationOn && (
                            <div className="mt-4 pt-4 border-t border-border-color flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-full sm:w-auto">
                                    <label htmlFor="simDate" className="sr-only">Simulatie Datum</label>
                                    <input type="date" id="simDate" value={simDate} onChange={e => setSimDate(e.target.value)} className={inputClasses} />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <label htmlFor="simTime" className="sr-only">Simulatie Tijd</label>
                                    <input type="time" id="simTime" value={simTime} onChange={e => setSimTime(e.target.value)} className={inputClasses} />
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* Tabs & Actions */}
                <div className="border-b border-border-color mb-6">
                    {showAdminContent && (
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <TabButton label="Evenementen" isActive={activeAdminTab === 'events'} onClick={() => setActiveAdminTab('events')} />
                                <TabButton label="Locaties" isActive={activeAdminTab === 'venues'} onClick={() => setActiveAdminTab('venues')} />
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
                                    <ImportIcon className="h-5 w-5" />
                                    <span className="hidden md:inline ml-2">Importeren</span>
                                </button>
                                <button 
                                    onClick={onExport} 
                                    aria-label="Exporteren"
                                    className="flex items-center justify-center h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-all"
                                >
                                    <ExportIcon className="h-5 w-5" />
                                    <span className="hidden md:inline ml-2">Exporteren</span>
                                </button>
                                <button 
                                    onClick={handleAddNew} 
                                    aria-label={activeAdminTab === 'events' ? 'Nieuw Event toevoegen' : 'Nieuwe Locatie toevoegen'}
                                    className="flex items-center justify-center h-9 w-9 md:h-auto md:w-auto md:px-4 md:py-2 text-sm font-medium rounded-md border border-transparent text-white bg-accent hover:bg-red-600 transition-all"
                                >
                                    <AddIcon className="h-5 w-5" />
                                    <span className="hidden md:inline ml-2">{activeAdminTab === 'events' ? 'Nieuw Event' : 'Nieuwe Locatie'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {showSuperadminContent && (
                        <div className="flex items-center space-x-2">
                            <TabButton label="Iconen" isActive={activeSuperadminTab === 'icons'} onClick={() => setActiveSuperadminTab('icons')} />
                            <TabButton label="Roadmap" isActive={activeSuperadminTab === 'roadmap'} onClick={() => setActiveSuperadminTab('roadmap')} />
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div>
                    {showAdminContent && activeAdminTab === 'events' && (
                        <AdminEventList events={events} onEdit={onEditEvent} onDelete={onDeleteEvent} />
                    )}
                    {showAdminContent && activeAdminTab === 'venues' && (
                        <AdminVenueList 
                            venues={venues} 
                            onEdit={onEditVenue} 
                            onDelete={onDeleteVenue}
                            events={events}
                            onEditEvent={onEditEvent}
                            onDeleteEvent={onDeleteEvent}
                        />
                    )}

                    {showSuperadminContent && activeSuperadminTab === 'icons' && (
                        <IconLibrary searchQuery={superadminSearchQuery} />
                    )}
                    {showSuperadminContent && activeSuperadminTab === 'roadmap' && (
                        <FutureFeaturesLog searchQuery={superadminSearchQuery} />
                    )}
                </div>
            </div>
        </div>
    );
};