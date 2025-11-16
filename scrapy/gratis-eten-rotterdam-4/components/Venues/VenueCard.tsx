import React, { useState, useEffect } from 'react';
import type { VenueWithDistance, VenueCategory, FoodEvent } from '../../types';
import { formatTime } from '../../utils/time';

// New ActivePing component
const ActivePing: React.FC = () => (
    <div className="absolute top-0 right-0 -mr-1 -mt-1 z-10">
        <span className="flex h-3 w-3 relative" title="Nu actief">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
        </span>
    </div>
);

// New Icon components
const ReligiousIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 4a1 1 0 011-1h.01a1 1 0 011 1v4h3a1 1 0 110 2h-3v7a1 1 0 11-2 0V9H6a1 1 0 110-2h3V4z" clipRule="evenodd" />
    </svg>
);

const CommunityIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
);

const FoodBankIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2-2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
    </svg>
);

const categoryStyles: Record<VenueCategory, { bg: string, text: string }> = {
  RELIGIOUS: { bg: 'bg-red-100', text: 'text-red-800' },
  COMMUNITY: { bg: 'bg-green-100', text: 'text-green-800' },
  FOOD_BANK: { bg: 'bg-blue-100', text: 'text-blue-800' },
  COMMERCIAL: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

const VenueCategoryDisplay: React.FC<{ category: VenueCategory }> = ({ category }) => {
    const { text } = categoryStyles[category] || { text: 'text-gray-800' };

    const getCategoryInfo = () => {
        switch (category) {
            case 'RELIGIOUS':
                return { title: 'Religieus', icon: <ReligiousIcon className="h-4 w-4" /> };
            case 'COMMUNITY':
                return { title: 'Sociaal', icon: <CommunityIcon className="h-4 w-4" /> };
            case 'FOOD_BANK':
                return { title: 'Voedselbank', icon: <FoodBankIcon className="h-4 w-4" /> };
            case 'COMMERCIAL':
                return { title: 'Commercieel', icon: <span className="font-medium text-xs">Commercieel</span> };
            default:
                return { title: category, icon: <span className="font-medium text-xs">{category}</span> };
        }
    };
    
    const { title, icon } = getCategoryInfo();

    return (
        <div title={title} className={`flex items-center ${text}`}>
            {icon}
        </div>
    );
};


interface VenueCardProps {
  venue: VenueWithDistance;
  isCollapsed: boolean;
  zoomLevel: number;
  isActive?: boolean;
  displayMode?: 'timeline' | 'grid';
  events?: FoodEvent[];
  onEventClick?: (event: FoodEvent) => void;
  currentTime?: Date;
  hasOnlyPastEvents?: boolean;
}

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const InitialsFallback: React.FC<{ name: string; category: VenueCategory; className?: string }> = ({ name, category, className = '' }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const { bg, text } = categoryStyles[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
        <div className={`w-full h-full rounded-lg flex items-center justify-center ${bg} ${text} font-bold ${className}`}>
            {initials}
        </div>
    );
};

const VenueLogo: React.FC<{ venue: VenueWithDistance; className: string; textClassName?: string; }> = ({ venue, className, textClassName }) => {
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        setLogoError(false); // Reset error state when venue.logoUrl changes
    }, [venue.logoUrl]);

    if (venue.logoUrl && !logoError) {
        return (
            <img
                src={venue.logoUrl}
                alt={`${venue.name} logo`}
                className={className}
                onError={() => setLogoError(true)}
            />
        );
    }
    
    return (
        <div className={className}> 
            <InitialsFallback name={venue.name} category={venue.category} className={textClassName}/>
        </div>
    );
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue, isCollapsed, zoomLevel, isActive, displayMode = 'timeline', events = [], onEventClick, currentTime, hasOnlyPastEvents }) => {
  if (displayMode === 'grid') {
    return (
        <div className="bg-white rounded-lg border border-border-color shadow-sm flex flex-col h-full transition-all duration-200 hover:shadow-md hover:border-accent/50">
            {/* Header */}
            <div className="p-3 flex items-center gap-3 border-b border-border-color">
                <div className="relative flex-shrink-0 w-12 h-12">
                    {isActive && <ActivePing />}
                    <VenueLogo venue={venue} className="w-full h-full object-cover rounded-md" textClassName="text-lg" />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 title={venue.name} className="font-semibold text-text-primary truncate">{venue.name}</h3>
                    <div className="flex items-center text-xs text-text-secondary mt-1">
                        <PinIcon />
                        <span className="ml-1">{venue.distance.toFixed(1)} km</span>
                    </div>
                </div>
            </div>

            {/* Event List */}
            <div className="flex-grow overflow-y-auto p-1">
                {events.length > 0 ? (
                    <ul className="space-y-1">
                        {events.map(event => {
                            const isPast = !!currentTime && event.endTime < currentTime;
                            return (
                                <li key={event.id}>
                                    <button onClick={() => onEventClick?.(event)} className={`w-full text-left p-2 rounded-md hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 ${isPast ? 'opacity-60' : ''}`}>
                                        <p className={`text-sm font-medium truncate ${isPast ? 'text-text-secondary' : 'text-text-primary'}`}>{event.title}</p>
                                        <p className={`text-xs ${isPast ? 'text-gray-400' : 'text-text-secondary'}`}>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full">
                       <p className="text-xs text-text-secondary p-4 text-center">Geen events voor dit tijdsvak.</p>
                    </div>
                )}
            </div>
        </div>
    );
  }

  const pastLaneClass = (displayMode === 'timeline' && hasOnlyPastEvents) ? 'opacity-75' : '';

  // Minimal View (zoomLevel 0)
  if (zoomLevel === 0) {
    if (isCollapsed) {
      // Small square logo. Parent row is 32px high, with p-2, inner is 24px.
      // So this should be a ~24x24 square (w-6, h-6).
      return (
        <div className={`w-6 h-6 transition-all duration-300 ease-in-out relative ${pastLaneClass}`} title={venue.name}>
          {isActive && <ActivePing />}
          <VenueLogo
            venue={venue}
            className="w-full h-full object-cover rounded-md shadow-sm"
            textClassName="text-xs"
          />
        </div>
      );
    }
    // Minimal, not collapsed. A simple text bar.
    return (
      <div className={`bg-white p-2 rounded-lg w-full h-full flex items-center ${pastLaneClass}`} title={venue.name}>
        {isActive && (
            <span className="flex h-2 w-2 mr-2 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
        )}
        <h3 className="font-semibold text-text-primary text-xs leading-tight truncate">{venue.name}</h3>
      </div>
    );
  }

  // Default View (zoomLevel 1)
  if (isCollapsed) {
    const size = "w-20 h-20"; // 80x80px
    return (
      <div className={`${size} transition-all duration-300 ease-in-out relative ${pastLaneClass}`} title={venue.name}>
        {isActive && <ActivePing />}
        <VenueLogo 
            venue={venue} 
            className="w-full h-full object-cover rounded-lg shadow-sm"
            textClassName="text-2xl"
        />
      </div>
    );
  }
  
  const logoSize = "w-16 h-16";
  const titleSize = "text-sm";
  
  return (
    <div className={`bg-white p-2 rounded-lg w-full h-full transition-all duration-300 ease-in-out flex items-center gap-3 ${pastLaneClass}`}>
      <div className={`flex-shrink-0 relative ${logoSize}`}>
        {isActive && <ActivePing />}
        <VenueLogo 
            venue={venue} 
            className="w-full h-full object-cover rounded-lg shadow-sm"
            textClassName="text-xl"
        />
      </div>
      <div className="flex-grow overflow-hidden min-h-0">
        <h3 title={venue.name} className={`font-semibold text-text-primary leading-tight pr-2 ${titleSize} line-clamp-2`}>{venue.name}</h3>
         <div className="flex items-center justify-between text-text-secondary text-xs mt-2">
          <div className="flex items-center">
              <PinIcon />
              <span className="ml-1">{venue.distance.toFixed(1)} km</span>
          </div>
          <VenueCategoryDisplay category={venue.category} />
        </div>
      </div>
    </div>
  );
};