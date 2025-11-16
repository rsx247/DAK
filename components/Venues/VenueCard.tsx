import React, { useState, useEffect } from 'react';
import type { VenueWithDistance, VenueCategory } from '../../types';

const translateVenueCategory = (category: VenueCategory): string => {
    switch (category) {
        case 'COMMUNITY': return 'Sociaal';
        case 'RELIGIOUS': return 'Religieus';
        case 'FOOD_BANK': return 'Voedselbank';
        case 'COMMERCIAL': return 'Commercieel';
        default: return category;
    }
};

interface VenueCardProps {
  venue: VenueWithDistance;
  isCollapsed: boolean;
}

const categoryStyles: Record<VenueCategory, { bg: string, text: string }> = {
  RELIGIOUS: { bg: 'bg-red-100', text: 'text-red-800' },
  COMMUNITY: { bg: 'bg-green-100', text: 'text-green-800' },
  FOOD_BANK: { bg: 'bg-blue-100', text: 'text-blue-800' },
  COMMERCIAL: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const InitialsFallback: React.FC<{ name: string; category: VenueCategory }> = ({ name, category }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const { bg, text } = categoryStyles[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return (
        <div className={`w-full h-full rounded-lg flex items-center justify-center ${bg} ${text} font-bold text-lg`}>
            {initials}
        </div>
    );
};

const VenueLogo: React.FC<{ venue: VenueWithDistance; className: string; }> = ({ venue, className }) => {
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
    
    // The wrapper div takes the className for sizing and borders/shadows.
    // InitialsFallback will fill this div.
    return (
        <div className={className}> 
            <InitialsFallback name={venue.name} category={venue.category} />
        </div>
    );
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue, isCollapsed }) => {
  if (isCollapsed) {
    return (
      <div className="w-14 h-14 transition-all duration-300 ease-in-out" title={venue.name}>
        <VenueLogo 
            venue={venue} 
            className="w-full h-full object-cover rounded-lg shadow-sm"
        />
      </div>
    );
  }
  
  const { text } = categoryStyles[venue.category] || { text: 'text-gray-800' };
  
  return (
    <div className="bg-white p-2 rounded-lg w-full transition-all duration-300 ease-in-out flex items-center gap-3">
      <div className="flex-shrink-0 w-12 h-12">
        <VenueLogo 
            venue={venue} 
            className="w-full h-full object-cover rounded-lg shadow-sm"
        />
      </div>
      <div className="flex-grow overflow-hidden">
        <h3 className="font-semibold text-text-primary text-sm leading-tight truncate pr-2">{venue.name}</h3>
         <div className="flex items-center justify-between text-text-secondary text-xs mt-2">
          <div className="flex items-center">
              <PinIcon />
              <span className="ml-1">{venue.distance.toFixed(1)} km</span>
          </div>
          <span className={`font-medium ${text}`}>{translateVenueCategory(venue.category)}</span>
        </div>
      </div>
    </div>
  );
};
