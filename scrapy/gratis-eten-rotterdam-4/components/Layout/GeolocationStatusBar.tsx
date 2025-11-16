import React, { useState, useEffect, useRef } from 'react';
import type { UserLocation } from '../../types';

interface LocationSuggestion {
    name: string;
    description: string;
    lat: number;
    lng: number;
}

// Mocked geocoding suggestions for a "smart" input feel
const MOCK_SUGGESTIONS: LocationSuggestion[] = [
    { name: 'Rotterdam Centraal', description: 'Stationsplein, Rotterdam', lat: 51.9244, lng: 4.4777 },
    { name: 'Markthal', description: 'Dominee Jan Scharpstraat, Rotterdam', lat: 51.9198, lng: 4.4844 },
    { name: 'Erasmusbrug', description: 'Erasmusbrug, Rotterdam', lat: 51.9088, lng: 4.4866 },
    { name: 'Euromast', description: 'Parkhaven, Rotterdam', lat: 51.9054, lng: 4.4669 },
    { name: 'Diergaarde Blijdorp', description: 'Blijdorplaan, Rotterdam', lat: 51.9285, lng: 4.4445 },
    { name: 'Zuidplein', description: 'Zuidplein, Rotterdam', lat: 51.8883, lng: 4.5042 },
];

interface GeolocationStatusBarProps {
  loading: boolean;
  error: string | null;
  location: UserLocation | null;
  locationType: 'gps' | 'manual' | null;
  onRetry: () => void;
  onManualLocationSelect: (suggestion: LocationSuggestion) => void;
}

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const GpsTrackingIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle mx-1 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="22" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="12" x2="2" y2="12"></line>
        <line x1="12" y1="6" x2="12" y2="2"></line>
        <line x1="12" y1="22" x2="12" y2="18"></line>
    </svg>
);


export const GeolocationStatusBar: React.FC<GeolocationStatusBarProps> = ({ loading, error, location, locationType, onRetry, onManualLocationSelect }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        } else {
            setInputValue('');
            setSuggestions([]);
        }
    }, [isEditing]);
    
    useEffect(() => {
        if (inputValue.length > 1) {
            const filtered = MOCK_SUGGESTIONS.filter(s => 
                s.name.toLowerCase().includes(inputValue.toLowerCase()) || 
                s.description.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    const handleSuggestionClick = (suggestion: LocationSuggestion) => {
        onManualLocationSelect(suggestion);
        setIsEditing(false);
    };
    
    const renderContent = () => {
        if (isEditing) {
             return (
                 <div className="relative w-full h-full flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Typ een straat, postcode of herkenningspunt..."
                        className="w-full h-full bg-transparent text-text-primary dark:text-gray-300 focus:outline-none text-xs"
                    />
                    <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 top-full left-0 right-0 mt-0.5 bg-white dark:bg-gray-800 border border-border-color dark:border-gray-700 rounded-b-md shadow-lg max-h-60 overflow-auto">
                            {suggestions.map(suggestion => (
                                <li
                                    key={suggestion.name}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="cursor-pointer hover:bg-surface dark:hover:bg-gray-700 px-3 py-2"
                                >
                                    <p className="font-semibold text-sm text-text-primary dark:text-gray-200">{suggestion.name}</p>
                                    <p className="text-xs text-text-secondary dark:text-gray-400">{suggestion.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                 </div>
             );
        }

        if (loading) {
            return (
                <div className="flex items-center">
                    <SpinnerIcon />
                    <span>Locatie ophalen, resultaten worden live gesorteerd...</span>
                </div>
            );
        }

        if (locationType === 'manual' && location?.name) {
             return (
                <div className="flex items-center justify-between w-full">
                    <span>
                        <GpsTrackingIcon />
                        Resultaten voor: <button type="button" onClick={() => setIsEditing(true)} className="underline hover:no-underline font-semibold text-text-primary dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-sm">{location.name}</button>.
                    </span>
                    <button onClick={onRetry} className="whitespace-nowrap hover:underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-sm px-2 ml-4">
                        Gebruik GPS
                    </button>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.242-1.21 2.878 0l5.394 10.273c.636 1.21-.213 2.628-1.439 2.628H4.302c-1.226 0-2.075-1.418-1.439-2.628L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <span>
                            Locatie niet gevonden.
                            <GpsTrackingIcon />
                            <button type="button" onClick={() => setIsEditing(true)} className="underline hover:no-underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-sm">Rotterdam centrum</button>.
                        </span>
                    </div>
                    <button onClick={onRetry} className="whitespace-nowrap hover:underline focus:outline-none focus:ring-1 focus:ring-gray-400 rounded-sm px-2 ml-4">
                        Opnieuw
                    </button>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="relative text-xs text-text-secondary dark:text-gray-400 h-10 flex items-center" role="status" aria-live="polite">
           {renderContent()}
        </div>
    );
};
